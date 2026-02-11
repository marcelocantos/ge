import { useEffect, useRef, useState, useCallback } from "react";

const MAX_MESSAGES = 1000;
const RECONNECT_DELAY_MS = 2000;

interface LogMessage {
  ts: string;
  level: string;
  msg: string;
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

interface Props {
  onConnectionChange: (connected: boolean) => void;
}

let nextId = 0;

function LogViewer({ onConnectionChange }: Props) {
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

  useEffect(() => {
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

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
        if (!disposed) onConnectionChange(true);
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
          const data: LogMessage = JSON.parse(event.data);
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
  }, [onConnectionChange]);

  return (
    <div className="log-viewer" ref={containerRef} onScroll={handleScroll}>
      {logs.length === 0 && (
        <div className="log-empty">Waiting for log messages...</div>
      )}
      {logs.map((entry) => {
        const style = levelStyle(entry.level);
        return (
          <div key={entry.id} className="log-line">
            <span className="log-ts">{formatTimestamp(entry.ts)}</span>
            <span className="log-level" style={style}>
              {entry.level.toUpperCase().padEnd(8)}
            </span>
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
