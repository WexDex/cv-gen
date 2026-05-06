"use client";

import { cn } from "@/lib/utils";

interface OptionItem {
  value: string;
  label: string;
}

interface OptionChipsProps {
  options: OptionItem[];
  value: string;
  onChange: (value: string) => void;
  isDark?: boolean;
  size?: "xs" | "sm";
}

export function OptionChips({
  options,
  value,
  onChange,
  isDark = false,
  size = "xs",
}: OptionChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded border transition-colors",
            size === "xs" ? "px-2 py-1 text-xs" : "px-2.5 py-1.5 text-sm",
            value === option.value
              ? isDark
                ? "border-cyan-500 bg-cyan-700 text-white"
                : "border-blue-500 bg-blue-600 text-white"
              : isDark
                ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                : "border-zinc-300 bg-white text-zinc-700",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
