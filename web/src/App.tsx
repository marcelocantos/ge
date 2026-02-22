import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "./QRCode";
import LogViewer from "./LogViewer";
import TweakPanel from "./TweakPanel";
import PhonePreview from "./PhonePreview";
import SessionList from "./SessionList";

interface SessionInfo {
  id: string;
  active: boolean;
}

function App() {
  const [connected, setConnected] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stopped, setStopped] = useState(false);
  const ctrlCTriggered = useRef(false);

  const [appName, setAppName] = useState("ge");
  const stoppedRef = useRef(false);

  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const handleSessionAdd = useCallback((sessionId: string) => {
    setSessions((prev) => {
      const existing = prev.find((s) => s.id === sessionId);
      if (existing) {
        return prev.map((s) => (s.id === sessionId ? { ...s, active: true } : s));
      }
      return [...prev, { id: sessionId, active: true }];
    });
  }, []);

  const handleSessionRemove = useCallback((sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, active: false } : s))
    );
  }, []);

  useEffect(() => {
    fetch("/api/info").then(r => r.json()).then(d => {
      if (d.name) {
        setAppName(d.name);
        const port = window.location.port;
        document.title = port ? `${d.name} :${port}` : d.name;
      }
    }).catch(() => {});
  }, []);

  const doStop = useCallback(() => {
    setStopped(true);
    stoppedRef.current = true;
    setShowConfirm(false);
    fetch("/api/stop", { method: "POST" }).catch(() => {});
  }, []);

  // Stop the server when the tab is closed. The server also detects the
  // WebSocket disconnect, but sendBeacon provides a faster signal.
  useEffect(() => {
    const onPageHide = () => {
      if (!stoppedRef.current) navigator.sendBeacon("/api/stop");
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  const openConfirm = useCallback((viaCtrlC: boolean) => {
    ctrlCTriggered.current = viaCtrlC;
    setShowConfirm(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (stopped) return;
        if (showConfirm && ctrlCTriggered.current) {
          doStop();
        } else if (!showConfirm) {
          openConfirm(true);
        }
      } else if (e.key === "Escape" && showConfirm) {
        setShowConfirm(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirm, stopped, doStop, openConfirm]);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">{appName}</h1>
        <button
          className="stop-btn"
          onClick={() => openConfirm(false)}
          disabled={stopped}
          title="Stop server (Ctrl-C)"
        >
          {stopped ? "Stopped" : "Stop"}
        </button>
        <span className={`status-dot ${connected ? "connected" : "disconnected"}`} />
        <span className="status-text">{connected ? "connected" : "disconnected"}</span>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <QRCode />
          <SessionList
            sessions={sessions}
            selected={selectedSession}
            onSelect={setSelectedSession}
          />
          <TweakPanel />
        </aside>
        <main className="main">
          <LogViewer
            onConnectionChange={setConnected}
            sessionFilter={selectedSession}
            onSessionAdd={handleSessionAdd}
            onSessionRemove={handleSessionRemove}
          />
        </main>
        <aside className="preview-column">
          <PhonePreview />
        </aside>
      </div>

      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-text">Stop the game server?</p>
            {ctrlCTriggered.current && (
              <p className="confirm-hint">Ctrl-C again to confirm</p>
            )}
            <div className="confirm-actions">
              <button className="confirm-btn confirm-btn-stop" onClick={doStop}>
                Stop Server
              </button>
              <button className="confirm-btn confirm-btn-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
