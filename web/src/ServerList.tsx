interface Server {
  id: string;
  name: string;
  pid: number;
  active: boolean;
}

interface Props {
  servers: Server[];
  onSelect: (id: string) => void;
}

function ServerList({ servers, onSelect }: Props) {
  if (servers.length === 0) return null;

  return (
    <div className="server-list">
      <h2 className="server-title">Servers</h2>
      <div className="server-items">
        {servers.map((s) => (
          <button
            key={s.id}
            className={`server-item ${s.active ? "active" : ""}`}
            onClick={() => {
              if (!s.active) onSelect(s.id);
            }}
          >
            <span className={`server-dot ${s.active ? "active" : "inactive"}`} />
            <span className="server-name">{s.name}</span>
            <span className="server-pid">:{s.pid}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ServerList;
export type { Server };
