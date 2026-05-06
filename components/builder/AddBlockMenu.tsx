"use client";

import type { ColumnId, SectionType } from "@/lib/types";
import { sectionTypeLabels } from "@/lib/blockOptions";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { OptionChips } from "@/components/builder/OptionChips";
import { useState } from "react";
import { createId } from "@/lib/uuid";

interface AddBlockMenuProps {
  column: ColumnId;
  isDark?: boolean;
  onBlockAdded?: (id: string) => void;
}

const sectionTypes: SectionType[] = [
  "personalInfo",
  "summary",
  "experience",
  "education",
  "programmingLanguages",
  "frameworks",
  "toolsDevOps",
  "databases",
  "projects",
  "openSource",
  "skills",
  "certifications",
  "languages",
  "awards",
  "volunteer",
  "custom",
];

export function AddBlockMenu({ column, isDark = false, onBlockAdded }: AddBlockMenuProps) {
  const addBlock = useResumeStore((state) => state.addBlock);
  const [selectedType, setSelectedType] = useState<SectionType>("summary");

  return (
    <div className={cn("space-y-2 rounded border p-2", isDark ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-white/70")}>
      <p className={cn("text-[11px] font-semibold uppercase tracking-wide", isDark ? "text-zinc-300" : "text-zinc-600")}>
        Add block
      </p>
      <OptionChips
        options={sectionTypes.map((type) => ({ value: type, label: sectionTypeLabels[type] }))}
        value={selectedType}
        onChange={(value) => setSelectedType(value as SectionType)}
        isDark={isDark}
      />
      <button
        type="button"
        className={cn(
          "w-full rounded border px-2 py-1 text-xs font-medium",
          isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-zinc-300 bg-zinc-100 text-zinc-700",
        )}
        onClick={() => {
          const newId = createId();
          addBlock(column, selectedType, newId);
          onBlockAdded?.(newId);
        }}
      >
        + Add {sectionTypeLabels[selectedType]}
      </button>
    </div>
  );
}
