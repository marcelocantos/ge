package main

const maxFrameSize = 512 * 1024 * 1024 // 512 MB, matching kMaxMessageSize

// Bridge represents an active connection between a server and a player.
// Frame forwarding is handled by the server wire and player read loops.
type Bridge struct {
	server *ServerConn
	player *PlayerConn
}

// NewBridge creates a bridge marker.
func NewBridge(d *Daemon, s *ServerConn, p *PlayerConn) *Bridge {
	return &Bridge{server: s, player: p}
}

// Close is a no-op — cleanup is handled by the daemon's Set/Unset methods.
func (b *Bridge) Close() {}
