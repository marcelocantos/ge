import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "./QRCode";
import LogViewer from "./LogViewer";
import type { StateMessage } from "./LogViewer";

declare const __GE_BUILD_ID__: string;
import TweakPanel from "./TweakPanel";
import PhonePreview from "./PhonePreview";
import PlayerList from "./PlayerList";
import type { Server, SessionInfo } from "./PlayerList";

function App() {
  const [connected, setConnected] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [stopped, setStopped] = useState(false);
  const ctrlCTriggered = useRef(false);

  const [appName, setAppName] = useState("ge");
  const stoppedRef = useRef(false);

  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const [servers, setServers] = useState<Server[]>([]);

  const handleState = useCallback((state: StateMessage) => {
    // Reload if ged is serving a newer dashboard build
    if (state.buildId && state.buildId !== __GE_BUILD_ID__) {
      location.reload();
      return;
    }

    const newServers: Server[] = state.servers.map((s) => ({
      id: s.id,
      name: s.name,
      pid: s.pid,
    }));
    setServers(newServers);

    const sessionSet = new Set(state.sessions.map((s) => s.id));
    setSessions(state.sessions.map((s) => ({ id: s.id, serverID: s.serverID, name: s.name })));
    setSelectedSession((prev) => (prev !== null && !sessionSet.has(prev) ? null : prev));

    const first = state.servers[0];
    if (first) {
      setAppName(first.name);
      const port = window.location.port;
      document.title = port ? `${first.name} :${port}` : first.name;
    } else {
      setAppName("ge");
    }
  }, []);

  const handleSwitchAll = useCallback((serverID: string) => {
    fetch(`/api/servers/${serverID}/select`, { method: "POST" }).catch(() => {});
  }, []);

  const handleSwitchSession = useCallback((sessionID: string, serverID: string) => {
    fetch(`/api/sessions/${sessionID}/server/${serverID}`, { method: "POST" }).catch(() => {});
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
      if (e.key === "c" && e.ctrlKey && !e.metaKey) {
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
          {servers.length > 0 && (
            <div className="player-list">
              <h2 className="player-title">Servers</h2>
              <div className="player-items">
                {servers.map((s) => (
                  <div key={s.id} className="player-row">
                    <span className="player-label" style={{ cursor: "default" }}>
                      <span className="player-dot" />
                      <span>{s.name}</span>
                    </span>
                    <span className="server-pid">pid {s.pid}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <PlayerList
            sessions={sessions}
            servers={servers}
            selectedSession={selectedSession}
            onSelectSession={setSelectedSession}
            onSwitchAll={handleSwitchAll}
            onSwitchSession={handleSwitchSession}
          />
          <TweakPanel />
        </aside>
        <main className="main">
          <LogViewer
            onConnectionChange={setConnected}
            sessionFilter={selectedSession}
            onState={handleState}
          />
        </main>
        <aside className="preview-column">
          <PhonePreview selectedSession={selectedSession} />
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
