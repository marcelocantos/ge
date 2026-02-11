import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "./QRCode";
import LogViewer from "./LogViewer";

function App() {
  const [connected, setConnected] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stopped, setStopped] = useState(false);
  const ctrlCTriggered = useRef(false);

  useEffect(() => {
    const port = window.location.port;
    document.title = port ? `yourworld2 :${port}` : "yourworld2";
  }, []);

  const doStop = useCallback(() => {
    setStopped(true);
    setShowConfirm(false);
    fetch("/api/stop").catch(() => {});
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
        <h1 className="title">yourworld2</h1>
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
        </aside>
        <main className="main">
          <LogViewer onConnectionChange={setConnected} />
        </main>
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
