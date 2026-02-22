interface Session {
  id: string;
  active: boolean;
}

interface Props {
  sessions: Session[];
  selected: string | null;
  onSelect: (session: string | null) => void;
}

function SessionList({ sessions, selected, onSelect }: Props) {
  if (sessions.length === 0) return null;

  return (
    <div className="session-list">
      <h2 className="session-title">Sessions</h2>
      <div className="session-items">
        <button
          className={`session-item ${selected === null ? "selected" : ""}`}
          onClick={() => onSelect(null)}
        >
          <span className="session-dot all" />
          <span className="session-name">All</span>
        </button>
        {sessions.map((s) => (
          <button
            key={s.id}
            className={`session-item ${selected === s.id ? "selected" : ""} ${!s.active ? "inactive" : ""}`}
            onClick={() => onSelect(s.id)}
          >
            <span className={`session-dot ${s.active ? "active" : "dead"}`} />
            <span className="session-name">{s.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SessionList;
