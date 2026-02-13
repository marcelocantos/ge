import { useCallback, useEffect, useRef, useState } from "react";

interface Tweak {
  name: string;
  value: number;
  default: number;
  scale: "log" | "linear";
  speed: number;
}

// Group tweaks by prefix (e.g. "Ball", "Wall", "Bond")
function groupTweaks(tweaks: Tweak[]): Map<string, Tweak[]> {
  const groups = new Map<string, Tweak[]>();
  for (const tw of tweaks) {
    // Split on transition from lowercase to uppercase
    const match = tw.name.match(/^[A-Z][a-z]*/);
    const prefix = match ? match[0] : "Other";
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix)!.push(tw);
  }
  return groups;
}

// Format a float nicely (avoid excessive decimals)
function fmt(v: number): string {
  if (v === 0) return "0";
  const abs = Math.abs(v);
  if (abs >= 100) return v.toFixed(1);
  if (abs >= 10) return v.toFixed(2);
  if (abs >= 1) return v.toFixed(3);
  if (abs >= 0.1) return v.toFixed(4);
  return v.toPrecision(3);
}

function TweakField({
  tweak,
  onChange,
  onReset,
}: {
  tweak: Tweak;
  onChange: (name: string, value: number) => void;
  onReset: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartValue = useRef(0);
  const hasDragged = useRef(false);

  const isModified = tweak.value !== tweak.default;

  // Strip the group prefix from the display name for compactness
  const match = tweak.name.match(/^[A-Z][a-z]*(.*)/);
  const shortName = match && match[1] ? match[1] : tweak.name;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || editing) return;
      e.preventDefault();
      dragging.current = true;
      hasDragged.current = false;
      dragStartX.current = e.clientX;
      dragStartValue.current = tweak.value;
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - dragStartX.current;
        if (Math.abs(dx) > 2) hasDragged.current = true;
        if (!hasDragged.current) return;

        const fine = ev.shiftKey ? 0.1 : 1.0;
        const s = tweak.speed * fine;
        let newVal: number;

        if (tweak.scale === "log") {
          // Multiplicative: value * base^(speed * dx / 100)
          const base = 2.0;
          newVal = dragStartValue.current * Math.pow(base, (s * dx) / 100);
          // Clamp to avoid zero/negative for log-scale values
          if (newVal < 1e-6) newVal = 1e-6;
        } else {
          // Additive: value + speed * magnitude * dx / 100
          const magnitude = Math.max(Math.abs(dragStartValue.current), 0.01);
          newVal = dragStartValue.current + s * magnitude * dx / 100;
        }

        onChange(tweak.name, newVal);
      };

      const handleMouseUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        // If we didn't drag, enter edit mode
        if (!hasDragged.current) {
          setEditText(fmt(tweak.value));
          setEditing(true);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [tweak, editing, onChange],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onReset(tweak.name);
    },
    [tweak.name, onReset],
  );

  const commitEdit = useCallback(() => {
    setEditing(false);
    const val = parseFloat(editText);
    if (!isNaN(val)) {
      onChange(tweak.name, val);
    }
  }, [editText, tweak.name, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        commitEdit();
      } else if (e.key === "Escape") {
        setEditing(false);
      }
    },
    [commitEdit],
  );

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Fill bar: ratio of current value to default (clamped for display)
  const ratio = tweak.default !== 0 ? tweak.value / tweak.default : 1;
  const fillPct = Math.min(Math.max(ratio * 50, 0), 100); // 50% = at default

  return (
    <div className="tweak-row">
      <span className={`tweak-name ${isModified ? "tweak-modified" : ""}`}>
        {shortName}
      </span>
      <div
        className="tweak-field"
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        title="Drag to adjust, click to edit, right-click to reset"
      >
        <div
          className="tweak-fill"
          style={{ width: `${fillPct}%` }}
        />
        {editing ? (
          <input
            ref={inputRef}
            className="tweak-input"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={commitEdit}
          />
        ) : (
          <span className="tweak-value">{fmt(tweak.value)}</span>
        )}
      </div>
    </div>
  );
}

function TweakPanel() {
  const [tweaks, setTweaks] = useState<Tweak[]>([]);
  const [showResetAll, setShowResetAll] = useState(false);
  const pendingRef = useRef<Map<string, number>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTweaks = useCallback(() => {
    fetch("/api/tweaks")
      .then((r) => r.json())
      .then((data: Tweak[]) => setTweaks(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchTweaks();
  }, [fetchTweaks]);

  // Debounced POST for value changes
  const flushUpdates = useCallback(() => {
    const entries = pendingRef.current;
    if (entries.size === 0) return;

    for (const [name, value] of entries) {
      fetch("/api/tweaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, value }),
      }).catch(() => {});
    }
    entries.clear();
  }, []);

  const handleChange = useCallback(
    (name: string, value: number) => {
      // Update local state immediately
      setTweaks((prev) =>
        prev.map((tw) => (tw.name === name ? { ...tw, value } : tw)),
      );

      // Queue the POST
      pendingRef.current.set(name, value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flushUpdates, 50);
    },
    [flushUpdates],
  );

  const handleReset = useCallback(
    (name: string) => {
      fetch("/api/tweaks/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
        .then((r) => r.json())
        .then((data: Tweak[]) => setTweaks(data))
        .catch(() => {});
    },
    [],
  );

  const handleResetAll = useCallback(() => {
    setShowResetAll(false);
    fetch("/api/tweaks/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    })
      .then((r) => r.json())
      .then((data: Tweak[]) => setTweaks(data))
      .catch(() => {});
  }, []);

  if (tweaks.length === 0) return null;

  const groups = groupTweaks(tweaks);
  const anyModified = tweaks.some((tw) => tw.value !== tw.default);

  return (
    <div className="tweak-panel">
      <div className="tweak-header">
        <span className="tweak-title">Tweaks</span>
        {anyModified && (
          <button
            className="tweak-reset-all"
            onClick={() => setShowResetAll(true)}
          >
            Reset All
          </button>
        )}
      </div>
      {Array.from(groups.entries()).map(([group, items]) => (
        <div key={group} className="tweak-group">
          <div className="tweak-group-name">{group}</div>
          {items.map((tw) => (
            <TweakField
              key={tw.name}
              tweak={tw}
              onChange={handleChange}
              onReset={handleReset}
            />
          ))}
        </div>
      ))}

      {showResetAll && (
        <div className="confirm-overlay" onClick={() => setShowResetAll(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-text">Reset all tweaks to defaults?</p>
            <div className="confirm-actions">
              <button
                className="confirm-btn confirm-btn-stop"
                onClick={handleResetAll}
              >
                Reset All
              </button>
              <button
                className="confirm-btn confirm-btn-cancel"
                onClick={() => setShowResetAll(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TweakPanel;
