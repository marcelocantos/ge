import { useCallback, useRef, useState } from "react";

interface SessionInfo {
  id: string;
  serverID: string;
  name: string;
}

interface Server {
  id: string;
  name: string;
  pid: number;
  active: boolean;
}

interface Props {
  sessions: SessionInfo[];
  servers: Server[];
  selectedSession: string | null;
  onSelectSession: (session: string | null) => void;
  onSwitchAll: (serverID: string) => void;
  onSwitchSession: (sessionID: string, serverID: string) => void;
}

function PlayerList({
  sessions,
  servers,
  selectedSession,
  onSelectSession,
  onSwitchAll,
  onSwitchSession,
}: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const serverName = useCallback(
    (serverID: string) => {
      const s = servers.find((s) => s.id === serverID);
      return s ? s.name : "(none)";
    },
    [servers]
  );

  // Compute what the "All" row should display
  const allServerID = (() => {
    if (sessions.length === 0) return "";
    const first = sessions[0].serverID;
    return sessions.every((s) => s.serverID === first) ? first : "";
  })();
  const allServerLabel = allServerID ? serverName(allServerID) : "(mixed)";

  const handleMouseEnter = useCallback(
    (rowID: string) => {
      if (servers.length < 2) return;
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
      openTimer.current = setTimeout(() => setOpenDropdown(rowID), 50);
    },
    [servers.length]
  );

  const handleMouseLeave = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 200);
  }, []);

  const handleDropdownEnter = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Position dropdown so the .current item overlaps the trigger text exactly.
  const positionDropdown = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    requestAnimationFrame(() => {
      const trigger = node.parentElement;
      if (!trigger) { node.style.opacity = "1"; return; }
      const item = node.querySelector(".server-dropdown-item.current") as HTMLElement | null;
      if (!item) { node.style.opacity = "1"; return; }

      const tRect = trigger.getBoundingClientRect();
      const iRect = item.getBoundingClientRect();
      const tStyle = getComputedStyle(trigger);
      const iStyle = getComputedStyle(item);

      // Align text origins (top-left of text content area)
      const dx = (tRect.left + parseFloat(tStyle.paddingLeft))
               - (iRect.left + parseFloat(iStyle.paddingLeft));
      const dy = (tRect.top + parseFloat(tStyle.paddingTop))
               - (iRect.top + parseFloat(iStyle.paddingTop));

      node.style.transform = `translate(${dx}px, ${dy}px)`;
      node.style.opacity = "1";
    });
  }, []);

  if (sessions.length === 0) return null;

  return (
    <div className="player-list">
      <h2 className="player-title">Players</h2>
      <div className="player-items">
        {/* All row */}
        <div
          className={`player-row ${selectedSession === null ? "selected" : ""}`}
        >
          <button
            className="player-label"
            onClick={() => onSelectSession(null)}
          >
            <span className="player-dot all" />
            <span>All</span>
          </button>
          <span className="player-arrow">&rarr;</span>
          <div
            className="player-server"
            onMouseEnter={() => handleMouseEnter("all")}
            onMouseLeave={handleMouseLeave}
          >
            {allServerLabel}
            {openDropdown === "all" && (
              <div
                className="server-dropdown"
                ref={positionDropdown}
                style={{ opacity: 0 }}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleMouseLeave}
              >
                {servers.map((s) => (
                  <button
                    key={s.id}
                    className={`server-dropdown-item ${s.id === allServerID ? "current" : ""}`}
                    onClick={() => {
                      onSwitchAll(s.id);
                      setOpenDropdown(null);
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Session rows */}
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className={`player-row ${selectedSession === sess.id ? "selected" : ""}`}
          >
            <button
              className="player-label"
              onClick={() => onSelectSession(sess.id)}
            >
              <span className="player-dot active" />
              <span>{sess.name || sess.id}</span>
            </button>
            <span className="player-arrow">&rarr;</span>
            <div
              className="player-server"
              onMouseEnter={() => handleMouseEnter(sess.id)}
              onMouseLeave={handleMouseLeave}
            >
              {serverName(sess.serverID)}
              {openDropdown === sess.id && (
                <div
                  className="server-dropdown"
                  ref={positionDropdown}
                  style={{ opacity: 0 }}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {servers.map((s) => (
                    <button
                      key={s.id}
                      className={`server-dropdown-item ${s.id === sess.serverID ? "current" : ""}`}
                      onClick={() => {
                        onSwitchSession(sess.id, s.id);
                        setOpenDropdown(null);
                      }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;
export type { Server, SessionInfo };
