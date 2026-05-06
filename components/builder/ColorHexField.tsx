"use client";

import { cn } from "@/lib/utils";

function normalizeHex6(raw: string): string | null {
  const t = raw.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(t)) return t.toLowerCase();
  if (/^#[0-9A-Fa-f]{3}$/.test(t)) {
    const r = t[1]!;
    const g = t[2]!;
    const b = t[3]!;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

interface ColorHexFieldProps {
  value: string;
  onChange: (next: string | undefined) => void;
  /** Shown in the text box when empty */
  placeholder?: string;
  /** Used for `type="color"` when the stored value is empty or not a parseable hex */
  fallbackHex: string;
  isDark?: boolean;
  "aria-label"?: string;
}

export function ColorHexField({
  value,
  onChange,
  placeholder,
  fallbackHex,
  isDark = false,
  "aria-label": ariaLabel,
}: ColorHexFieldProps) {
  const pickerValue = normalizeHex6(value) ?? normalizeHex6(fallbackHex) ?? "#000000";
  const inputClass = cn(
    "min-w-0 flex-1 rounded border px-2 py-1 text-xs",
    isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "border-zinc-300 bg-white text-zinc-900",
  );
  const swatchClass = cn(
    "h-8 w-10 shrink-0 cursor-pointer rounded border p-0.5",
    isDark ? "border-zinc-600 bg-zinc-900" : "border-zinc-300 bg-white",
  );

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        className={swatchClass}
        value={pickerValue}
        onChange={(event) => onChange(event.target.value.toLowerCase())}
        title="Color picker"
        aria-label={ariaLabel ?? placeholder ?? "Color picker"}
      />
      <input
        type="text"
        className={inputClass}
        value={value}
        onChange={(event) => onChange(event.target.value.trim() || undefined)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        aria-label={placeholder ? `${placeholder} (hex or CSS color)` : "Color hex"}
      />
    </div>
  );
}
