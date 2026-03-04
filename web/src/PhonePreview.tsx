import { useEffect, useRef } from "react";
import * as THREE from "three";

const RECONNECT_DELAY_MS = 2000;

// Phone body dimensions (arbitrary units; aspect ratio updated from device info)
const DEFAULT_W = 2.4;
const DEFAULT_H = 5.0;
const PHONE_D = 0.25;
const CORNER_R = 0.3;
const BEZEL = 0.15;

function createRoundedRectShape(
  w: number,
  h: number,
  r: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = w / 2,
    hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return shape;
}

interface PhonePreviewProps {
  selectedSession: string | null;
}

function PhonePreview({ selectedSession }: PhonePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const connectStreamRef = useRef<((sid: string | null) => void) | null>(null);

  // Send session selection whenever it changes
  useEffect(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "select", session: selectedSession }));
    }
    // Update stream connection for new session
    connectStreamRef.current?.(selectedSession);
  }, [selectedSession]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Three.js scene setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, 3 / 4, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 8);
    scene.add(dirLight);

    // --- Phone model ---
    const orientGroup = new THREE.Group();
    scene.add(orientGroup);
    const tiltGroup = new THREE.Group();
    orientGroup.add(tiltGroup);

    // --- Video element for H.264 stream (MSE) ---
    const video = document.createElement("video");
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.display = "none";
    document.body.appendChild(video);

    const screenTexture = new THREE.VideoTexture(video);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    // Fallback canvas for when no video is playing
    const fallbackCanvas = document.createElement("canvas");
    fallbackCanvas.width = 540;
    fallbackCanvas.height = 1170;
    const fallbackCtx = fallbackCanvas.getContext("2d")!;
    fallbackCtx.fillStyle = "#111";
    fallbackCtx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);

    const fallbackTexture = new THREE.CanvasTexture(fallbackCanvas);
    fallbackTexture.colorSpace = THREE.SRGBColorSpace;

    // Materials (reused)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.7,
    });
    const screenMat = new THREE.MeshBasicMaterial({ map: fallbackTexture });

    let videoPlaying = false;

    // Track current meshes/geometries for disposal on rebuild
    let bodyMesh: THREE.Mesh | null = null;
    let screenMesh: THREE.Mesh | null = null;
    let bodyGeo: THREE.ExtrudeGeometry | null = null;
    let screenGeo: THREE.PlaneGeometry | null = null;
    let phoneW = DEFAULT_W;
    let phoneH = DEFAULT_H;

    function buildPhone(w: number, h: number) {
      if (bodyMesh) { tiltGroup.remove(bodyMesh); bodyGeo!.dispose(); }
      if (screenMesh) { tiltGroup.remove(screenMesh); screenGeo!.dispose(); }

      phoneW = w;
      phoneH = h;

      const bodyShape = createRoundedRectShape(w, h, CORNER_R);
      bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
        depth: PHONE_D,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 3,
      });
      bodyGeo.center();
      bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      tiltGroup.add(bodyMesh);

      const screenW = w - BEZEL * 2;
      const screenH = h - BEZEL * 2;
      screenGeo = new THREE.PlaneGeometry(screenW, screenH);
      screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.z = (PHONE_D + 0.08) / 2 + 0.01;
      tiltGroup.add(screenMesh);

      fitCamera();
    }

    // --- Orientation & camera state ---
    const SCALE = 0.85;
    let orientation = 0;
    let targetZRot = 0;
    let currentZRot = 0;
    const Z_ROT = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
    let targetCamZ = 10;

    function fitCamera() {
      const isLandscape = orientation === 1 || orientation === 3;
      const hw = (isLandscape ? phoneH : phoneW) * SCALE;
      const hFov = Math.atan(Math.tan((camera.fov / 2) * Math.PI / 180) * camera.aspect);
      targetCamZ = (hw / 2) / Math.tan(hFov);
    }

    buildPhone(DEFAULT_W, DEFAULT_H);
    tiltGroup.scale.setScalar(SCALE);

    // --- Resize handler ---
    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      fitCamera();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // --- Animation loop ---
    let lastTime = performance.now();
    let animFrame = 0;

    function animate() {
      animFrame = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const factor = 1 - Math.exp(-8 * dt);

      let zDiff = targetZRot - currentZRot;
      if (zDiff > Math.PI) zDiff -= 2 * Math.PI;
      if (zDiff < -Math.PI) zDiff += 2 * Math.PI;
      currentZRot += zDiff * factor;

      orientGroup.rotation.z = currentZRot;
      camera.position.z += (targetCamZ - camera.position.z) * factor;

      renderer.render(scene, camera);
    }
    animate();

    // --- MSE state for H.264 video ---
    let mediaSource: MediaSource | null = null;
    let sourceBuffer: SourceBuffer | null = null;
    let pendingBuffers: ArrayBuffer[] = [];

    function resetMSE() {
      pendingBuffers = [];
      sourceBuffer = null;
      if (mediaSource && mediaSource.readyState === "open") {
        try { mediaSource.endOfStream(); } catch { /* ignore */ }
      }
      mediaSource = new MediaSource();
      video.src = URL.createObjectURL(mediaSource);

      mediaSource.addEventListener("sourceopen", () => {
        try {
          sourceBuffer = mediaSource!.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
          sourceBuffer.mode = "segments";

          sourceBuffer.addEventListener("updateend", () => {
            // Trim buffer to last 3 seconds
            if (sourceBuffer!.buffered.length > 0) {
              const end = sourceBuffer!.buffered.end(sourceBuffer!.buffered.length - 1);
              if (end > 3 && !sourceBuffer!.updating) {
                sourceBuffer!.remove(0, end - 3);
                return;
              }
            }
            // Flush pending buffers
            if (pendingBuffers.length > 0 && !sourceBuffer!.updating) {
              sourceBuffer!.appendBuffer(pendingBuffers.shift()!);
            }
          });

          // Flush any segments that arrived before sourceopen
          if (pendingBuffers.length > 0) {
            sourceBuffer.appendBuffer(pendingBuffers.shift()!);
          }
        } catch (e) {
          console.error("MSE addSourceBuffer failed:", e);
        }
      });
    }

    function appendSegment(data: ArrayBuffer) {
      if (sourceBuffer && !sourceBuffer.updating) {
        try {
          sourceBuffer.appendBuffer(data);
        } catch {
          pendingBuffers.push(data);
        }
      } else {
        pendingBuffers.push(data);
      }

      // Switch to video texture once we start receiving data
      if (!videoPlaying) {
        videoPlaying = true;
        screenMat.map = screenTexture;
        screenMat.needsUpdate = true;
      }
    }

    // --- Stream WebSocket (H.264 video per session) ---
    let streamWs: WebSocket | null = null;
    let streamReconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let currentStreamSession: string | null = null;
    let disposed = false;

    function connectStream(sessionId: string | null) {
      // Clean up previous
      if (streamReconnectTimer) { clearTimeout(streamReconnectTimer); streamReconnectTimer = null; }
      if (streamWs) { streamWs.onclose = null; streamWs.close(); streamWs = null; }
      currentStreamSession = sessionId;

      if (!sessionId || disposed) {
        // Revert to fallback texture
        videoPlaying = false;
        screenMat.map = fallbackTexture;
        screenMat.needsUpdate = true;
        return;
      }

      resetMSE();

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/stream/${sessionId}`;
      streamWs = new WebSocket(wsUrl);
      streamWs.binaryType = "arraybuffer";

      streamWs.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          appendSegment(event.data);
        }
      };

      streamWs.onclose = () => {
        if (!disposed && sessionId === currentStreamSession) {
          streamReconnectTimer = setTimeout(() => connectStream(sessionId), RECONNECT_DELAY_MS);
        }
      };

      streamWs.onerror = () => {};
    }

    connectStreamRef.current = connectStream;

    // --- Preview WebSocket (text messages: device info, orientation) ---
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      if (disposed) return;

      const protocol =
        window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/preview`;
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        ws!.send(JSON.stringify({ type: "select", session: selectedSession }));
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (!disposed) {
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {};

      ws.onmessage = (event) => {
        if (typeof event.data === "string") {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "device") {
              const pw = Math.min(msg.w, msg.h);
              const ph = Math.max(msg.w, msg.h);
              const aspect = pw / ph;
              buildPhone(DEFAULT_H * aspect, DEFAULT_H);
            }
            if (msg.type === "orient" && msg.o !== undefined) {
              const newOri = msg.o as number;
              if (newOri !== orientation) {
                orientation = newOri;
                targetZRot = Z_ROT[orientation];
                fitCamera();
                const isLandscape = orientation === 1 || orientation === 3;
                const column = container?.closest(".preview-column") as HTMLElement | null;
                if (column) {
                  column.style.width = isLandscape
                    ? `${Math.round(400 * phoneH / phoneW)}px`
                    : "400px";
                }
              }
            }
          } catch {
            // ignore
          }
        }
        // Binary messages no longer expected on /ws/preview
      };
    }

    connect();

    // Connect stream if session already selected
    if (selectedSession) {
      connectStream(selectedSession);
    }

    // --- Cleanup ---
    return () => {
      disposed = true;
      connectStreamRef.current = null;
      if (streamReconnectTimer) clearTimeout(streamReconnectTimer);
      if (streamWs) { streamWs.onclose = null; streamWs.close(); }
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
        wsRef.current = null;
      }
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
      renderer.dispose();
      if (bodyGeo) bodyGeo.dispose();
      bodyMat.dispose();
      if (screenGeo) screenGeo.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      fallbackTexture.dispose();
      if (document.body.contains(video)) document.body.removeChild(video);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="phone-preview" ref={containerRef} />;
}

export default PhonePreview;
