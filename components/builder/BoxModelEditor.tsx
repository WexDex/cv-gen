"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BlockEdgeInsets } from "@/lib/types";

interface BoxModelEditorProps {
  label: string;
  value: BlockEdgeInsets | undefined;
  onChange: (next: BlockEdgeInsets | undefined) => void;
  isDark?: boolean;
}

type Side = "top" | "right" | "bottom" | "left";

function patch(current: BlockEdgeInsets | undefined, side: Side, delta: number): BlockEdgeInsets | undefined {
  const next = { ...current };
  next[side] = Math.max(0, (next[side] ?? 0) + delta);
  return next;
}

function clear(current: BlockEdgeInsets | undefined, side: Side): BlockEdgeInsets | undefined {
  if (!current) return undefined;
  const next = { ...current };
  delete next[side];
  if (next.top === undefined && next.right === undefined && next.bottom === undefined && next.left === undefined) {
    return undefined;
  }
  return next;
}

function ZoneButton({ onClick, children, isDark }: { onClick: () => void; children: React.ReactNode; isDark: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-5 w-5 rounded border text-[10px] leading-none",
        isDark ? "border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "border-zinc-300 bg-zinc-100 hover:bg-zinc-200",
      )}
    >
      {children}
    </button>
  );
}

interface ZoneProps {
  side: Side;
  value: number | undefined;
  onChange: (side: Side, val: number | undefined) => void;
  isDark: boolean;
}

function Zone({ side, value, onChange, isDark }: ZoneProps) {
  const [editing, setEditing] = useState(false);
  const display = value === undefined ? "—" : String(value);

  return (
    <div className="flex flex-col items-center gap-0.5">
      <ZoneButton isDark={isDark} onClick={() => onChange(side, (value ?? 0) + 1)}>+</ZoneButton>
      {editing ? (
        <input
          autoFocus
          type="number"
          className={cn(
            "w-8 rounded border px-0.5 py-0 text-center text-[10px]",
            isDark ? "border-zinc-600 bg-zinc-800 text-zinc-100" : "border-zinc-300",
          )}
          defaultValue={value ?? 0}
          onBlur={(e) => {
            const n = Number(e.target.value);
            onChange(side, isNaN(n) ? undefined : Math.max(0, n));
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") setEditing(false);
          }}
        />
      ) : (
        <button
          type="button"
          title="Click to edit"
          onClick={() => setEditing(true)}
          className={cn(
            "w-8 rounded border px-0.5 py-0 text-center text-[10px]",
            isDark ? "border-zinc-700 bg-zinc-900 text-zinc-300" : "border-zinc-200 bg-zinc-50 text-zinc-700",
          )}
        >
          {display}
        </button>
      )}
      <ZoneButton isDark={isDark} onClick={() => onChange(side, value !== undefined && value > 0 ? value - 1 : undefined)}>−</ZoneButton>
    </div>
  );
}

export function BoxModelEditor({ label, value, onChange, isDark = false }: BoxModelEditorProps) {
  const handleChange = (side: Side, val: number | undefined) => {
    if (val === undefined) {
      onChange(clear(value, side));
    } else {
      onChange({ ...value, [side]: val });
    }
  };

  return (
    <div className="space-y-1">
      <span className={cn("text-xs", isDark ? "text-zinc-400" : "text-zinc-600")}>{label}</span>
      <div className="grid grid-cols-3 grid-rows-3 place-items-center gap-1">
        {/* Row 1: top */}
        <div />
        <Zone side="top" value={value?.top} onChange={handleChange} isDark={isDark} />
        <div />
        {/* Row 2: left, center, right */}
        <Zone side="left" value={value?.left} onChange={handleChange} isDark={isDark} />
        <div className={cn("h-8 w-8 rounded border", isDark ? "border-zinc-600 bg-zinc-800" : "border-zinc-300 bg-zinc-100")} />
        <Zone side="right" value={value?.right} onChange={handleChange} isDark={isDark} />
        {/* Row 3: bottom */}
        <div />
        <Zone side="bottom" value={value?.bottom} onChange={handleChange} isDark={isDark} />
        <div />
      </div>
    </div>
  );
}
