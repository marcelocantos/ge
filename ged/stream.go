package main

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"log/slog"
	"sync"

	"github.com/Eyevinn/mp4ff/avc"
	"github.com/Eyevinn/mp4ff/mp4"
)

// StreamMuxer converts H.264 NALs into fMP4 init + media segments for MSE.
type StreamMuxer struct {
	mu          sync.Mutex
	sps         []byte
	pps         []byte
	initSeg     []byte // cached ftyp+moov
	seqNum      uint32
	width       uint32
	height      uint32
	timeScale   uint32
	sampleDur   uint32
	initialized bool
}

// NewStreamMuxer creates a new muxer. fps determines the time scale.
func NewStreamMuxer(fps int) *StreamMuxer {
	return &StreamMuxer{
		timeScale: uint32(fps * 1000),
		sampleDur: 1000,
	}
}

// SetParameterSets parses SPS/PPS and builds the fMP4 init segment (ftyp+moov).
func (m *StreamMuxer) SetParameterSets(sps, pps []byte) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.sps = append([]byte{}, sps...)
	m.pps = append([]byte{}, pps...)

	// Parse SPS for dimensions.
	spsInfo, err := avc.ParseSPSNALUnit(sps, false)
	if err != nil {
		return fmt.Errorf("parse SPS: %w", err)
	}
	m.width = uint32(spsInfo.Width)
	m.height = uint32(spsInfo.Height)

	slog.Info("Stream: SPS parsed", "width", m.width, "height", m.height)

	// Build init segment (ftyp + moov with avc1 sample entry).
	init := mp4.CreateEmptyInit()
	trak := init.AddEmptyTrack(m.timeScale, "video", "en")

	spsNALUs := [][]byte{sps}
	ppsNALUs := [][]byte{pps}
	if err := trak.SetAVCDescriptor("avc1", spsNALUs, ppsNALUs, true); err != nil {
		return fmt.Errorf("set AVC descriptor: %w", err)
	}

	var buf bytes.Buffer
	if err := init.Encode(&buf); err != nil {
		return fmt.Errorf("encode init segment: %w", err)
	}

	m.initSeg = buf.Bytes()
	m.initialized = true
	m.seqNum = 0

	return nil
}

// MediaSegment creates an fMP4 media segment (styp+moof+mdat) from a single NAL unit.
// nalData should be in Annex B format (with 0x00000001 or 0x000001 start code).
func (m *StreamMuxer) MediaSegment(nalData []byte, isKeyframe bool) []byte {
	m.mu.Lock()
	defer m.mu.Unlock()

	if !m.initialized {
		return nil
	}

	m.seqNum++

	// Convert Annex B NAL to AVCC format (4-byte length prefix).
	nalPayload := nalData
	if len(nalPayload) >= 4 && nalPayload[0] == 0 && nalPayload[1] == 0 && nalPayload[2] == 0 && nalPayload[3] == 1 {
		nalPayload = nalPayload[4:]
	} else if len(nalPayload) >= 3 && nalPayload[0] == 0 && nalPayload[1] == 0 && nalPayload[2] == 1 {
		nalPayload = nalPayload[3:]
	}

	avcc := make([]byte, 4+len(nalPayload))
	binary.BigEndian.PutUint32(avcc[:4], uint32(len(nalPayload)))
	copy(avcc[4:], nalPayload)

	// Create fragment.
	const trackID = 1
	frag, err := mp4.CreateFragment(m.seqNum, trackID)
	if err != nil {
		slog.Error("Stream: create fragment failed", "err", err)
		return nil
	}

	var flags uint32
	if isKeyframe {
		flags = mp4.SyncSampleFlags
	} else {
		flags = mp4.NonSyncSampleFlags
	}

	frag.AddFullSample(mp4.FullSample{
		Sample: mp4.Sample{
			Flags:                 flags,
			Dur:                   m.sampleDur,
			Size:                  uint32(len(avcc)),
			CompositionTimeOffset: 0,
		},
		DecodeTime: uint64(m.seqNum-1) * uint64(m.sampleDur),
		Data:       avcc,
	})

	// Encode as media segment (styp + moof + mdat).
	seg := mp4.NewMediaSegment()
	seg.AddFragment(frag)

	var buf bytes.Buffer
	if err := seg.Encode(&buf); err != nil {
		slog.Error("Stream: encode media segment failed", "err", err)
		return nil
	}
	return buf.Bytes()
}

// InitSegment returns the cached init segment, or nil if not yet initialized.
func (m *StreamMuxer) InitSegment() []byte {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.initSeg
}

// IsInitialized returns whether parameter sets have been received.
func (m *StreamMuxer) IsInitialized() bool {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.initialized
}
