import { useEffect, useRef, useState, useCallback, useMemo } from "react";

const MAX_MESSAGES = 1000;
const RECONNECT_DELAY_MS = 2000;

interface LogMessage {
  ts: string;
  level: string;
  msg: string;
  session?: string;
}

interface LogEntry extends LogMessage {
  id: number;
}

const LEVEL_COLORS: Record<string, { color: string; bold?: boolean }> = {
  debug:    { color: "#888" },
  info:     { color: "#4FC3F7" },
  warn:     { color: "#FFB74D" },
  warning:  { color: "#FFB74D" },
  error:    { color: "#EF5350" },
  critical: { color: "#EF5350", bold: true },
};

function levelStyle(level: string): React.CSSProperties {
  const entry = LEVEL_COLORS[level.toLowerCase()] ?? { color: "#e0e0e0" };
  return {
    color: entry.color,
    fontWeight: entry.bold ? "bold" : "normal",
  };
}

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      const s = String(d.getSeconds()).padStart(2, "0");
      const ms = String(d.getMilliseconds()).padStart(3, "0");
      return `${h}:${m}:${s}.${ms}`;
    }
  } catch {
    // fall through
  }
  return ts;
}

interface StateServer {
  id: string;
  name: string;
  pid: number;
  active: boolean;
}

interface StateMessage {
  type: "state";
  buildId?: string;
  servers: StateServer[];
  sessions: string[];
}

interface Props {
  onConnectionChange: (connected: boolean) => void;
  sessionFilter: string | null;
  onState: (state: StateMessage) => void;
}

let nextId = 0;

function LogViewer({ onConnectionChange, sessionFilter, onState }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 40;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    userScrolledUp.current = !atBottom;
  }, []);

  const filteredLogs = useMemo(() => {
    if (sessionFilter === null) return logs;
    return logs.filter(
      (entry) => !entry.session || entry.session === sessionFilter
    );
  }, [logs, sessionFilter]);

  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [filteredLogs]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let disposed = false;

    function connect() {
      if (disposed) return;

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/logs`;
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!disposed) {
          onConnectionChange(true);
        }
      };

      ws.onclose = () => {
        if (!disposed) {
          onConnectionChange(false);
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {
        // onclose will fire after onerror
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "state") {
            onState(data as StateMessage);
            return;
          }

          // Regular log message
          const entry: LogEntry = { ...data, id: nextId++ };
          setLogs((prev) => {
            const next = [...prev, entry];
            if (next.length > MAX_MESSAGES) {
              return next.slice(next.length - MAX_MESSAGES);
            }
            return next;
          });
        } catch {
          // Ignore malformed messages
        }
      };
    }

    connect();

    return () => {
      disposed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      onConnectionChange(false);
    };
  }, [onConnectionChange, onState]);

  return (
    <div className="log-viewer" ref={containerRef} onScroll={handleScroll}>
      {logs.length > 0 && (
        <button
          className="log-clear-btn"
          onClick={() => setLogs([])}
          title="Clear log"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      )}
      {filteredLogs.length === 0 && (
        <div className="log-empty">Waiting for log messages...</div>
      )}
      {filteredLogs.map((entry) => {
        const style = levelStyle(entry.level);
        return (
          <div key={entry.id} className="log-line">
            <span className="log-ts">{formatTimestamp(entry.ts)}</span>
            <span className="log-level" style={style}>
              {entry.level.toUpperCase().padEnd(8)}
            </span>
            {entry.session && sessionFilter === null && (
              <span className="log-session">{entry.session}</span>
            )}
            <span className="log-msg" style={{ fontWeight: style.fontWeight }}>
              {entry.msg}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}

export default LogViewer;
export type { StateMessage };
