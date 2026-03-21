import { useCallback, useEffect, useRef, useState } from "react";

interface NumericTweak {
  type: "number";
  name: string;
  value: number;
  default: number;
  scale: "log" | "linear";
  speed: number;
}

interface EnumTweak {
  type: "enum";
  name: string;
  value: number;
  default: number;
  labels: string[];
}

type Dir = "right" | "left" | "up" | "down";

interface Vec2Tweak {
  type: "vec2";
  name: string;
  value: [number, number];
  default: [number, number];
  speed: number;
  xDir: Dir;
  yDir: Dir;
}

interface AxisTweak {
  type: "axis";
  name: string;
  value: number;
  default: number;
  scale: "log" | "linear";
  axis: [number, number];  // screen-space direction+sensitivity
}

interface ColorTweak {
  type: "color";
  name: string;
  value: [number, number, number, number];
  default: [number, number, number, number];
}

type Tweak = NumericTweak | EnumTweak | Vec2Tweak | AxisTweak | ColorTweak;

// Raw tweak from API — value may be any type
interface RawTweak {
  name: string;
  value: unknown;
  default: unknown;
  type?: string;
  scale?: "log" | "linear";
  speed?: number;
  labels?: string[];
  xDir?: Dir;
  yDir?: Dir;
  axis?: [number, number];
}

function classifyTweak(raw: RawTweak): Tweak | null {
  if (raw.type === "enum" && typeof raw.value === "number" && Array.isArray(raw.labels)) {
    return {
      type: "enum",
      name: raw.name,
      value: raw.value,
      default: (raw.default as number) ?? 0,
      labels: raw.labels,
    };
  }
  if (raw.type === "vec2" && Array.isArray(raw.value) && raw.value.length === 2) {
    return {
      type: "vec2",
      name: raw.name,
      value: raw.value as [number, number],
      default: (raw.default as [number, number]) ?? [0, 0],
      speed: raw.speed ?? 1.0,
      xDir: raw.xDir ?? "right",
      yDir: raw.yDir ?? "down",
    };
  }
  if (raw.type === "axis" && typeof raw.value === "number" && Array.isArray(raw.axis)) {
    return {
      type: "axis",
      name: raw.name,
      value: raw.value,
      default: (raw.default as number) ?? 0,
      scale: raw.scale ?? "linear",
      axis: raw.axis as [number, number],
    };
  }
  if (Array.isArray(raw.value) && (raw.value.length === 3 || raw.value.length === 4) && raw.value.every((v) => typeof v === "number")) {
    const v = raw.value as number[];
    const d = (raw.default as number[]) ?? [0, 0, 0, 1];
    return {
      type: "color",
      name: raw.name,
      value: [v[0], v[1], v[2], v[3] ?? 1],
      default: [d[0], d[1], d[2], d[3] ?? 1],
    };
  }
  if (typeof raw.value === "number") {
    return {
      type: "number",
      name: raw.name,
      value: raw.value,
      default: (raw.default as number) ?? 0,
      scale: raw.scale ?? "linear",
      speed: raw.speed ?? 1.0,
    };
  }
  return null;
}

// Group tweaks by dot-prefix (e.g., "parity.view" → "parity")
function groupTweaks(tweaks: Tweak[]): Map<string, Tweak[]> {
  const groups = new Map<string, Tweak[]>();
  for (const tw of tweaks) {
    const dotIdx = tw.name.indexOf(".");
    const prefix = dotIdx > 0 ? tw.name.substring(0, dotIdx) : "other";
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix)!.push(tw);
  }
  return groups;
}

// Strip group prefix from display name
function shortName(tw: Tweak): string {
  const dotIdx = tw.name.indexOf(".");
  return dotIdx > 0 ? tw.name.substring(dotIdx + 1) : tw.name;
}

// Derive a display/rounding quantum from a reference value (typically the default).
// Returns a power-of-10 step that gives ~3 significant digits.
function deriveQuantum(ref: number): number {
  const abs = Math.abs(ref);
  if (abs < 1e-9) return 1e-6;  // near-zero default: fine quantum
  return Math.pow(10, Math.floor(Math.log10(abs)) - 2);
}

// Round a value to the nearest quantum.
function quantize(v: number, q: number): number {
  return Math.round(v / q) * q;
}

// Format a float to the number of decimals implied by the quantum.
// Strips trailing zeros after the decimal point.
function fmt(v: number, q?: number): string {
  if (q !== undefined) {
    v = quantize(v, q);
    if (Math.abs(v) < q * 0.5) return "0";
    const decimals = Math.max(0, -Math.floor(Math.log10(q) - 0.5));
    return stripTrailingZeros(v.toFixed(decimals));
  }
  if (v === 0) return "0";
  const abs = Math.abs(v);
  if (abs >= 100) return stripTrailingZeros(v.toFixed(1));
  if (abs >= 10) return stripTrailingZeros(v.toFixed(2));
  if (abs >= 1) return stripTrailingZeros(v.toFixed(3));
  if (abs >= 0.1) return stripTrailingZeros(v.toFixed(4));
  return v.toPrecision(3);
}

function stripTrailingZeros(s: string): string {
  if (!s.includes(".")) return s;
  return s.replace(/\.?0+$/, "");
}

// Convert [r,g,b,a] (0-1 floats) to #rrggbb hex
function colorToHex(c: [number, number, number, number]): string {
  const r = Math.round(Math.max(0, Math.min(1, c[0])) * 255);
  const g = Math.round(Math.max(0, Math.min(1, c[1])) * 255);
  const b = Math.round(Math.max(0, Math.min(1, c[2])) * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Parse #rrggbb hex to [r,g,b] floats
function hexToColor(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

// ─── Field components ─────────────────────────────────────────────────

function NumericField({
  tweak,
  onChange,
  onChangeStart,
  onChangeEnd,
  onReset,
}: {
  tweak: NumericTweak;
  onChange: (name: string, value: unknown) => void;
  onChangeStart: (name: string) => void;
  onChangeEnd: (name: string, value: unknown) => void;
  onReset: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartValue = useRef(0);
  const hasDragged = useRef(false);

  const q = deriveQuantum(tweak.default);
  const isModified = tweak.default !== undefined && tweak.value !== tweak.default;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || editing) return;
      e.preventDefault();
      dragging.current = true;
      hasDragged.current = false;
      dragStartX.current = e.clientX;
      dragStartValue.current = tweak.value;
      onChangeStart(tweak.name);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - dragStartX.current;
        if (Math.abs(dx) > 2) hasDragged.current = true;
        if (!hasDragged.current) return;

        const fine = ev.shiftKey ? 0.1 : 1.0;
        const s = (tweak.speed || 1.0) * fine;
        let newVal: number;

        if (tweak.scale === "log") {
          const base = 2.0;
          newVal = dragStartValue.current * Math.pow(base, (s * dx) / 100);
          if (newVal < 1e-6) newVal = 1e-6;
        } else {
          const magnitude = Math.max(Math.abs(dragStartValue.current), 0.01);
          newVal = dragStartValue.current + s * magnitude * dx / 100;
        }

        onChange(tweak.name, quantize(newVal, q));
      };

      const handleMouseUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        if (hasDragged.current) {
          onChangeEnd(tweak.name, tweak.value);
        } else {
          setEditText(fmt(tweak.value, q));
          setEditing(true);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [tweak, editing, onChange, onChangeStart, onChangeEnd, q],
  );

  const commitEdit = useCallback(() => {
    setEditing(false);
    const val = parseFloat(editText);
    if (!isNaN(val)) {
      onChangeStart(tweak.name);
      onChange(tweak.name, val);
      onChangeEnd(tweak.name, val);
    }
  }, [editText, tweak.name, onChange, onChangeStart, onChangeEnd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") commitEdit();
      else if (e.key === "Escape") setEditing(false);
    },
    [commitEdit],
  );

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const ratio = tweak.default && tweak.default !== 0 ? tweak.value / tweak.default : 1;
  const fillPct = Math.min(Math.max(ratio * 50, 0), 100);

  return (
    <div className="tweak-row">
      <span className={`tweak-name ${isModified ? "tweak-modified" : ""}`}>
        {shortName(tweak)}
      </span>
      <div
        className="tweak-field"
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => { e.preventDefault(); onReset(tweak.name); }}
        title="Drag to adjust, click to edit, right-click to reset"
      >
        <div className="tweak-fill" style={{ width: `${fillPct}%` }} />
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
          <span className="tweak-value">{fmt(tweak.value, q)}</span>
        )}
      </div>
      <button
        className="tweak-reset-btn"
        onClick={(e) => { e.stopPropagation(); onReset(tweak.name); }}
        title="Reset to default"
      >↺</button>
    </div>
  );
}

// Axis arrow glyph from the axis vector.
function axisArrow(axis: [number, number]): string {
  const [ax, ay] = axis;
  const absX = Math.abs(ax), absY = Math.abs(ay);
  if (absX > absY * 2) return ax > 0 ? "→" : "←";
  if (absY > absX * 2) return ay > 0 ? "↓" : "↑";
  if (ax > 0) return ay > 0 ? "↘" : "↗";
  return ay > 0 ? "↙" : "↖";
}

function AxisField({
  tweak,
  onChange,
  onChangeStart,
  onChangeEnd,
  onReset,
}: {
  tweak: AxisTweak;
  onChange: (name: string, value: unknown) => void;
  onChangeStart: (name: string) => void;
  onChangeEnd: (name: string, value: unknown) => void;
  onReset: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const dragStart = useRef<[number, number]>([0, 0]);
  const dragStartValue = useRef(0);
  const hasDragged = useRef(false);

  const q = deriveQuantum(tweak.default);
  const isModified = tweak.value !== tweak.default;
  const arrow = axisArrow(tweak.axis);

  // Axis vector properties
  const axLen = Math.sqrt(tweak.axis[0] ** 2 + tweak.axis[1] ** 2);
  const axNorm: [number, number] = axLen > 0 ? [tweak.axis[0] / axLen, tweak.axis[1] / axLen] : [1, 0];

  // Cursor style based on dominant axis
  const absX = Math.abs(tweak.axis[0]), absY = Math.abs(tweak.axis[1]);
  const cursor = absY > absX * 2 ? "ns-resize" : absX > absY * 2 ? "ew-resize" : "move";

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || editing) return;
      e.preventDefault();
      dragging.current = true;
      hasDragged.current = false;
      dragStart.current = [e.clientX, e.clientY];
      dragStartValue.current = tweak.value;
      onChangeStart(tweak.name);
      document.body.style.cursor = cursor;
      document.body.style.userSelect = "none";

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - dragStart.current[0];
        const dy = ev.clientY - dragStart.current[1];
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasDragged.current = true;
        if (!hasDragged.current) return;

        const fine = ev.shiftKey ? 0.1 : 1.0;
        const proj = (dx * axNorm[0] + dy * axNorm[1]) / axLen;
        const magnitude = Math.max(Math.abs(dragStartValue.current), 0.01);
        const newVal = dragStartValue.current + fine * magnitude * proj / 100;

        onChange(tweak.name, quantize(newVal, q));
      };

      const handleMouseUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        if (hasDragged.current) {
          onChangeEnd(tweak.name, tweak.value);
        } else {
          setEditText(fmt(tweak.value, q));
          setEditing(true);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [tweak, editing, onChange, onChangeStart, onChangeEnd, axNorm, axLen, cursor, q],
  );

  const commitEdit = useCallback(() => {
    setEditing(false);
    const val = parseFloat(editText);
    if (!isNaN(val)) {
      onChangeStart(tweak.name);
      onChange(tweak.name, val);
      onChangeEnd(tweak.name, val);
    }
  }, [editText, tweak.name, onChange, onChangeStart, onChangeEnd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") commitEdit();
      else if (e.key === "Escape") setEditing(false);
    },
    [commitEdit],
  );

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  return (
    <div className="tweak-row">
      <span className={`tweak-name ${isModified ? "tweak-modified" : ""}`}>
        {shortName(tweak)}
      </span>
      <div
        className="tweak-field"
        style={{ cursor }}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => { e.preventDefault(); onReset(tweak.name); }}
        title={`Drag ${arrow} to adjust, click to edit, right-click to reset`}
      >
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
          <span className="tweak-value">{arrow} {fmt(tweak.value, q)}</span>
        )}
      </div>
      <button
        className="tweak-reset-btn"
        onClick={(e) => { e.stopPropagation(); onReset(tweak.name); }}
        title="Reset to default"
      >↺</button>
    </div>
  );
}

function EnumField({
  tweak,
  onChange,
  onChangeStart,
  onChangeEnd,
  onReset,
}: {
  tweak: EnumTweak;
  onChange: (name: string, value: unknown) => void;
  onChangeStart: (name: string) => void;
  onChangeEnd: (name: string, value: unknown) => void;
  onReset: (name: string) => void;
}) {
  const isModified = tweak.value !== tweak.default;

  return (
    <div className="tweak-row">
      <span className={`tweak-name ${isModified ? "tweak-modified" : ""}`}>
        {shortName(tweak)}
      </span>
      <select
        className="tweak-select"
        value={tweak.value}
        onChange={(e) => { const v = parseInt(e.target.value, 10); onChangeStart(tweak.name); onChange(tweak.name, v); onChangeEnd(tweak.name, v); }}
      >
        {tweak.labels.map((label, idx) => (
          <option key={idx} value={idx}>{label}</option>
        ))}
      </select>
      <button
        className="tweak-reset-btn"
        onClick={(e) => { e.stopPropagation(); onReset(tweak.name); }}
        title="Reset to default"
      >↺</button>
    </div>
  );
}

// Arrow glyph for the screen direction that increases the value.
function dirArrow(d: Dir): string {
  switch (d) {
    case "right": return "→";
    case "left":  return "←";
    case "up":    return "↑";
    case "down":  return "↓";
  }
}

// Map a Dir to which mouse axis (dx or dy) and sign it affects.
// Returns [axis, sign]: axis 0 = dx, 1 = dy. sign ±1.
function dirMapping(d: Dir): [number, number] {
  switch (d) {
    case "right": return [0, +1];
    case "left":  return [0, -1];
    case "down":  return [1, +1];
    case "up":    return [1, -1];
  }
}

function Vec2Field({
  tweak,
  onChange,
  onChangeStart,
  onChangeEnd,
  onReset,
}: {
  tweak: Vec2Tweak;
  onChange: (name: string, value: unknown) => void;
  onChangeStart: (name: string) => void;
  onChangeEnd: (name: string, value: unknown) => void;
  onReset: (name: string) => void;
}) {
  const qx = deriveQuantum(tweak.default[0]);
  const qy = deriveQuantum(tweak.default[1]);
  const dragging = useRef(false);
  const dragStart = useRef<[number, number]>([0, 0]);
  const dragStartValue = useRef<[number, number]>([0, 0]);
  const hasDragged = useRef(false);
  const clickTarget = useRef<0 | 1 | null>(null);
  const [editing, setEditing] = useState<0 | 1 | null>(null);
  const [editText, setEditText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isModified = tweak.value[0] !== tweak.default[0] || tweak.value[1] !== tweak.default[1];

  const xMap = dirMapping(tweak.xDir);
  const yMap = dirMapping(tweak.yDir);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0 || editing !== null) return;
      e.preventDefault();
      dragging.current = true;
      hasDragged.current = false;
      dragStart.current = [e.clientX, e.clientY];
      dragStartValue.current = [...tweak.value] as [number, number];
      onChangeStart(tweak.name);
      document.body.style.cursor = "move";
      document.body.style.userSelect = "none";

      // Determine which half was clicked (for edit-on-release)
      const target = e.target as HTMLElement;
      const half = target.closest(".tweak-vec2-half");
      if (half) {
        const parent = half.parentElement;
        if (parent) {
          const halves = Array.from(parent.querySelectorAll(".tweak-vec2-half"));
          clickTarget.current = halves.indexOf(half) as 0 | 1;
        }
      } else {
        clickTarget.current = null;
      }

      // Cmd-drag locks to one axis. The lock is determined by the
      // dominant mouse direction on the first move past threshold.
      let lockedAxis: "x" | "y" | null = null;

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        const dx = ev.clientX - dragStart.current[0];
        const dy = ev.clientY - dragStart.current[1];
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasDragged.current = true;
        if (!hasDragged.current) return;

        // Lock axis on first significant move while cmd is held
        if (ev.metaKey && lockedAxis === null) {
          lockedAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
        }
        if (!ev.metaKey) lockedAxis = null;

        const fine = ev.shiftKey ? 0.1 : 1.0;
        const s = (tweak.speed || 1.0) * fine;
        const mouse = [dx, dy];

        const magX = Math.max(Math.abs(dragStartValue.current[0]), 0.01);
        const magY = Math.max(Math.abs(dragStartValue.current[1]), 0.01);

        const newX = lockedAxis === "y" ? dragStartValue.current[0]
          : dragStartValue.current[0] + s * magX * mouse[xMap[0]] * xMap[1] / 100;
        const newY = lockedAxis === "x" ? dragStartValue.current[1]
          : dragStartValue.current[1] + s * magY * mouse[yMap[0]] * yMap[1] / 100;

        onChange(tweak.name, [quantize(newX, qx), quantize(newY, qy)]);
      };

      const handleMouseUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        if (hasDragged.current) {
          onChangeEnd(tweak.name, tweak.value);
        } else if (clickTarget.current !== null) {
          const idx = clickTarget.current;
          setEditText(fmt(tweak.value[idx], [qx, qy][idx]));
          setEditing(idx);
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    },
    [tweak, editing, onChange, onChangeStart, onChangeEnd, xMap, yMap, qx, qy],
  );

  const commitEdit = useCallback(() => {
    if (editing === null) return;
    const val = parseFloat(editText);
    if (!isNaN(val)) {
      onChangeStart(tweak.name);
      const newVal = [...tweak.value] as [number, number];
      newVal[editing] = val;
      onChange(tweak.name, newVal);
      onChangeEnd(tweak.name, newVal);
    }
    setEditing(null);
  }, [editText, editing, tweak, onChange, onChangeStart, onChangeEnd]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") commitEdit();
      else if (e.key === "Escape") setEditing(null);
    },
    [commitEdit],
  );

  useEffect(() => {
    if (editing !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  return (
    <div className="tweak-row">
      <span className={`tweak-name ${isModified ? "tweak-modified" : ""}`}>
        {shortName(tweak)}
      </span>
      <div
        className="tweak-field tweak-vec2-field"
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => { e.preventDefault(); onReset(tweak.name); }}
        title="Drag arrows to adjust, click values to edit, right-click to reset"
      >
        <div className="tweak-vec2-half">
          <span className="tweak-vec2-arrow">{dirArrow(tweak.xDir)}</span>
          {editing === 0 ? (
            <input ref={inputRef} className="tweak-input tweak-vec2-edit" type="text"
              value={editText} onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown} onBlur={commitEdit} />
          ) : (
            <span className="tweak-vec2-num">
              {fmt(tweak.value[0], qx)}
            </span>
          )}
        </div>
        <div className="tweak-vec2-half">
          <span className="tweak-vec2-arrow">{dirArrow(tweak.yDir)}</span>
          {editing === 1 ? (
            <input ref={inputRef} className="tweak-input tweak-vec2-edit" type="text"
              value={editText} onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown} onBlur={commitEdit} />
          ) : (
            <span className="tweak-vec2-num">
              {fmt(tweak.value[1], qy)}
            </span>
          )}
        </div>
      </div>
      <button
        className="tweak-reset-btn"
        onClick={(e) => { e.stopPropagation(); onReset(tweak.name); }}
        title="Reset to default"
      >↺</button>
    </div>
  );
}

function ColorField({
  tweak,
  onChange,
  onChangeStart,
  onChangeEnd,
  onReset,
}: {
  tweak: ColorTweak;
  onChange: (name: string, value: unknown) => void;
  onChangeStart: (name: string) => void;
  onChangeEnd: (name: string, value: unknown) => void;
  onReset: (name: string) => void;
}) {
  const isModified = tweak.value.some((v, i) => v !== tweak.default[i]);
  const hex = colorToHex(tweak.value);

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [r, g, b] = hexToColor(e.target.value);
    const v = [r, g, b, tweak.value[3]];
    onChangeStart(tweak.name);
    onChange(tweak.name, v);
    onChangeEnd(tweak.name, v);
  };

  const handleAlpha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = parseFloat(e.target.value);
    if (!isNaN(a)) {
      const v = [tweak.value[0], tweak.value[1], tweak.value[2], a];
      onChangeStart(tweak.name);
      onChange(tweak.name, v);
      onChangeEnd(tweak.name, v);
    }
  };

  return (
    <div className="tweak-row">
      <span className={`tweak-name ${isModified ? "tweak-modified" : ""}`}>
        {shortName(tweak)}
      </span>
      <div className="tweak-color">
        <input
          className="tweak-color-input"
          type="color"
          value={hex}
          onChange={handleColor}
        />
        <input
          className="tweak-color-alpha"
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={fmt(tweak.value[3])}
          onChange={handleAlpha}
          title="alpha"
        />
      </div>
      <button
        className="tweak-reset-btn"
        onClick={(e) => { e.stopPropagation(); onReset(tweak.name); }}
        title="Reset to default"
      >↺</button>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────

function TweakPanel() {
  const [tweaks, setTweaks] = useState<Tweak[]>([]);
  const [showResetAll, setShowResetAll] = useState(false);
  const pendingRef = useRef<Map<string, unknown>>(new Map());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Undo/redo history
  type UndoEntry = { name: string; oldValue: unknown; newValue: unknown };
  const undoStack = useRef<UndoEntry[]>([]);
  const redoStack = useRef<UndoEntry[]>([]);
  const gestureOld = useRef<Map<string, unknown>>(new Map());

  const parseTweaks = useCallback((data: RawTweak[]) => {
    const result: Tweak[] = [];
    for (const raw of data) {
      const tw = classifyTweak(raw);
      if (tw) result.push(tw);
    }
    setTweaks(result);
  }, []);

  const fetchTweaks = useCallback(() => {
    fetch("/api/tweaks")
      .then((r) => r.json())
      .then(parseTweaks)
      .catch(() => {});
  }, [parseTweaks]);

  useEffect(() => {
    fetchTweaks();
  }, [fetchTweaks]);

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

  const applyValue = useCallback(
    (name: string, value: unknown) => {
      setTweaks((prev) =>
        prev.map((tw) => (tw.name === name ? { ...tw, value } as Tweak : tw)),
      );
      pendingRef.current.set(name, value);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(flushUpdates, 10);
    },
    [flushUpdates],
  );

  // Called before a drag or edit begins — captures the old value.
  const handleChangeStart = useCallback(
    (name: string) => {
      if (!gestureOld.current.has(name)) {
        const current = tweaks.find((tw) => tw.name === name);
        if (current) gestureOld.current.set(name, current.value);
      }
    },
    [tweaks],
  );

  // Called on every intermediate value during drag.
  const handleChange = useCallback(
    (name: string, value: unknown) => {
      applyValue(name, value);
    },
    [applyValue],
  );

  // Called when a drag or edit completes — commits the undo entry.
  const handleChangeEnd = useCallback(
    (name: string, value: unknown) => {
      const oldValue = gestureOld.current.get(name);
      gestureOld.current.delete(name);
      if (oldValue !== undefined && oldValue !== value) {
        undoStack.current.push({ name, oldValue, newValue: value });
        redoStack.current = [];
      }
    },
    [],
  );

  const handleUndo = useCallback(() => {
    const entry = undoStack.current.pop();
    if (!entry) return;
    redoStack.current.push(entry);
    applyValue(entry.name, entry.oldValue);
  }, [applyValue]);

  const handleRedo = useCallback(() => {
    const entry = redoStack.current.pop();
    if (!entry) return;
    undoStack.current.push(entry);
    applyValue(entry.name, entry.newValue);
  }, [applyValue]);

  // Global keyboard handler for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo]);

  const handleReset = useCallback(
    (name: string) => {
      fetch("/api/tweaks/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
        .then((r) => r.json())
        .then(parseTweaks)
        .catch(() => {});
    },
    [parseTweaks],
  );

  const handleResetAll = useCallback(() => {
    setShowResetAll(false);
    fetch("/api/tweaks/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    })
      .then((r) => r.json())
      .then(parseTweaks)
      .catch(() => {});
  }, [parseTweaks]);

  if (tweaks.length === 0) return null;

  const groups = groupTweaks(tweaks);
  const anyModified = tweaks.some((tw) => {
    if (tw.type === "color" || tw.type === "vec2") {
      return (tw.value as number[]).some((v, i) => v !== (tw.default as number[])[i]);
    }
    return tw.value !== tw.default;
  });

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
          {items.map((tw) => {
            switch (tw.type) {
              case "enum":
                return <EnumField key={tw.name} tweak={tw} onChange={handleChange} onChangeStart={handleChangeStart} onChangeEnd={handleChangeEnd} onReset={handleReset} />;
              case "axis":
                return <AxisField key={tw.name} tweak={tw} onChange={handleChange} onChangeStart={handleChangeStart} onChangeEnd={handleChangeEnd} onReset={handleReset} />;
              case "vec2":
                return <Vec2Field key={tw.name} tweak={tw} onChange={handleChange} onChangeStart={handleChangeStart} onChangeEnd={handleChangeEnd} onReset={handleReset} />;
              case "color":
                return <ColorField key={tw.name} tweak={tw} onChange={handleChange} onChangeStart={handleChangeStart} onChangeEnd={handleChangeEnd} onReset={handleReset} />;
              default:
                return <NumericField key={tw.name} tweak={tw} onChange={handleChange} onChangeStart={handleChangeStart} onChangeEnd={handleChangeEnd} onReset={handleReset} />;
            }
          })}
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
