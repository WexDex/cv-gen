"use client";

import { CopyPlus, Plus, Trash2 } from "lucide-react";

import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { OptionChips } from "@/components/builder/OptionChips";

interface ResumeManagerProps {
  uiTheme: "light" | "dark";
}

export function ResumeManager({ uiTheme }: ResumeManagerProps) {
  const resumes = useResumeStore((state) => state.resumes);
  const activeId = useResumeStore((state) => state.activeId);
  const setActiveResume = useResumeStore((state) => state.setActiveResume);
  const addResume = useResumeStore((state) => state.addResume);
  const duplicateActiveResume = useResumeStore((state) => state.duplicateActiveResume);
  const deleteResume = useResumeStore((state) => state.deleteResume);

  return (
    <div className="flex items-center gap-2">
      <OptionChips
        options={resumes.map((resume) => ({ value: resume.id, label: resume.meta.name }))}
        value={activeId}
        onChange={setActiveResume}
        isDark={uiTheme === "dark"}
      />
      <div className={cn("flex items-center gap-1 rounded border px-1 py-1", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800" : "bg-zinc-50")}>
        <span className={cn("px-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
          New from template
        </span>
        <button
          type="button"
          className={cn("rounded border px-2 py-1 text-xs", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "bg-white")}
          onClick={() => addResume("sample", "Sample Project")}
        >
          Sample data
        </button>
        <button
          type="button"
          className={cn("rounded border px-2 py-1 text-xs", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "bg-white")}
          onClick={() => addResume("blank", "Blank Project")}
        >
          Blank data
        </button>
      </div>
      <button
        type="button"
        className={cn("rounded border p-1.5", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "")}
        onClick={() => addResume("sample")}
      >
        <Plus size={16} />
      </button>
      <button
        type="button"
        className={cn("rounded border p-1.5", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "")}
        onClick={duplicateActiveResume}
      >
        <CopyPlus size={16} />
      </button>
      <button
        type="button"
        className={cn(
          "rounded border p-1.5 text-red-600 disabled:opacity-50",
          uiTheme === "dark" ? "border-zinc-700 bg-zinc-800" : "",
        )}
        onClick={() => deleteResume(activeId)}
        disabled={resumes.length <= 1}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
