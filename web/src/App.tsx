import { useEffect, useState } from "react";
import QRCode from "./QRCode";
import LogViewer from "./LogViewer";

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const port = window.location.port;
    document.title = port ? `yourworld2 :${port}` : "yourworld2";
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">yourworld2</h1>
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
    </div>
  );
}

export default App;
