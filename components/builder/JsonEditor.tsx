"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import { useResumeStore } from "@/lib/store";

interface JsonEditorProps {
  isDark?: boolean;
}

export function JsonEditor({ isDark = false }: JsonEditorProps) {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const updateData = useResumeStore((state) => state.updateData);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(() => JSON.stringify(activeResume?.data ?? {}, null, 2), [activeResume]);

  if (!activeResume) {
    return <div className="p-4 text-sm text-zinc-500">No active resume selected.</div>;
  }

  const handleChange = (nextValue: string) => {
    try {
      const parsed = JSON.parse(nextValue);
      updateData(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center justify-between border-b px-3 py-2",
          isDark ? "border-zinc-700 bg-zinc-950 text-zinc-100" : "bg-zinc-900 text-zinc-100",
        )}
      >
        <span className="text-sm font-semibold">JSON Data Editor</span>
        {error ? (
          <span className="inline-flex items-center gap-1 text-xs text-red-300">
            <AlertCircle size={14} />
            Invalid JSON
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
            <CheckCircle size={14} />
            Valid JSON
          </span>
        )}
      </div>
      <textarea
        className={cn(
          "h-full flex-1 resize-none p-3 font-mono text-xs outline-none",
          isDark ? "bg-zinc-950 text-zinc-100" : "bg-zinc-950 text-zinc-100",
        )}
        defaultValue={value}
        spellCheck={false}
        onChange={(event) => handleChange(event.target.value)}
      />
      {error ? <p className="border-t border-red-500 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
