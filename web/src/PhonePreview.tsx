import { useEffect, useRef } from "react";
import * as THREE from "three";

const RECONNECT_DELAY_MS = 2000;

// Phone body dimensions (arbitrary units, proportioned like a real phone)
const PHONE_W = 2.4;
const PHONE_H = 5.0;
const PHONE_D = 0.25;
const CORNER_R = 0.3;
const BEZEL = 0.15;

// Screen inset on the front face
const SCREEN_W = PHONE_W - BEZEL * 2;
const SCREEN_H = PHONE_H - BEZEL * 2;

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

function PhonePreview() {
  const containerRef = useRef<HTMLDivElement>(null);

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
    // Outer group: orientation (Z rotation in world space)
    // Inner group: tilt (pitch/roll in phone-local space)
    // This prevents Euler angle coupling between tilt and orientation.
    const orientGroup = new THREE.Group();
    scene.add(orientGroup);
    const tiltGroup = new THREE.Group();
    orientGroup.add(tiltGroup);

    // Body: extruded rounded rectangle
    const bodyShape = createRoundedRectShape(PHONE_W, PHONE_H, CORNER_R);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
      depth: PHONE_D,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
    bodyGeo.center();
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.7,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    tiltGroup.add(bodyMesh);

    // Screen: plane inset on front face with a canvas texture
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 540;
    screenCanvas.height = 1170;
    const screenCtx = screenCanvas.getContext("2d")!;
    screenCtx.fillStyle = "#111";
    screenCtx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    const screenGeo = new THREE.PlaneGeometry(SCREEN_W, SCREEN_H);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    // Body total depth = PHONE_D + 2*bevelThickness (0.25 + 0.08 = 0.33)
    // After center(), front face is at +0.165. Place screen just in front.
    screenMesh.position.z = (PHONE_D + 0.08) / 2 + 0.01;
    tiltGroup.add(screenMesh);
    tiltGroup.scale.setScalar(0.85);

    // --- Resize handler ---
    function resize() {
      const w = container!.clientWidth;
      const h = container!.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // --- Orientation state ---
    // 0=portrait up, 1=landscape left, 2=portrait down, 3=landscape right
    let orientation = 0;
    let targetZRot = 0;
    let currentZRot = 0;

    // Z rotation for each orientation
    const Z_ROT = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

    // --- Animation loop ---
    let lastTime = performance.now();
    let animFrame = 0;

    function animate() {
      animFrame = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Exponential damping toward target orientation
      const factor = 1 - Math.exp(-8 * dt);

      // Shortest-arc interpolation for Z rotation
      let zDiff = targetZRot - currentZRot;
      if (zDiff > Math.PI) zDiff -= 2 * Math.PI;
      if (zDiff < -Math.PI) zDiff += 2 * Math.PI;
      currentZRot += zDiff * factor;

      orientGroup.rotation.z = currentZRot;

      renderer.render(scene, camera);
    }
    animate();

    // --- WebSocket for preview data ---
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function connect() {
      if (disposed) return;

      const protocol =
        window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/preview`;
      ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {};

      ws.onclose = () => {
        if (!disposed) {
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {};

      ws.onmessage = (event) => {
        if (typeof event.data === "string") {
          // JSON text message — orientation event
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "orient" && msg.o !== undefined) {
              const newOri = msg.o as number;
              if (newOri !== orientation) {
                orientation = newOri;
                targetZRot = Z_ROT[orientation];
                const isLandscape = orientation === 1 || orientation === 3;
                const column = container?.closest(".preview-column") as HTMLElement | null;
                if (column) {
                  column.style.width = isLandscape
                    ? `${Math.round(400 * PHONE_H / PHONE_W)}px`
                    : "400px";
                }
              }
            }
          } catch {
            // ignore
          }
        } else {
          // Binary message: JPEG frame
          const blob = new Blob([event.data], { type: "image/jpeg" });
          createImageBitmap(blob).then((bmp) => {
            const isLandscape = orientation === 1 || orientation === 3;
            screenCtx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
            if (isLandscape) {
              const angle = Z_ROT[orientation];
              screenCtx.save();
              screenCtx.translate(screenCanvas.width / 2, screenCanvas.height / 2);
              screenCtx.rotate(angle);
              screenCtx.drawImage(bmp,
                -screenCanvas.height / 2, -screenCanvas.width / 2,
                screenCanvas.height, screenCanvas.width);
              screenCtx.restore();
            } else if (orientation === 2) {
              screenCtx.save();
              screenCtx.translate(screenCanvas.width / 2, screenCanvas.height / 2);
              screenCtx.rotate(Z_ROT[2]);
              screenCtx.drawImage(bmp,
                -screenCanvas.width / 2, -screenCanvas.height / 2,
                screenCanvas.width, screenCanvas.height);
              screenCtx.restore();
            } else {
              screenCtx.drawImage(bmp, 0, 0, screenCanvas.width, screenCanvas.height);
            }
            screenTexture.needsUpdate = true;
            bmp.close();
          });
        }
      };
    }

    connect();

    // --- Cleanup ---
    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
      renderer.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="phone-preview" ref={containerRef} />;
}

export default PhonePreview;
