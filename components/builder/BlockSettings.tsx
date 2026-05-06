"use client";

import { displayOptionsByType } from "@/lib/blockOptions";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { OptionChips } from "@/components/builder/OptionChips";

interface BlockSettingsProps {
  selectedBlockId: string | null;
  isDark?: boolean;
}

const blockContainer = (isDark: boolean) =>
  cn("space-y-3 rounded border p-3", isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "bg-white");

const makeItemLabel = (item: unknown, index: number) => {
  if (typeof item === "string") return `${index + 1}. ${item}`;
  if (typeof item === "object" && item !== null) {
    const obj = item as Record<string, unknown>;
    return (
      (typeof obj.name === "string" && obj.name) ||
      (typeof obj.title === "string" && obj.title) ||
      (typeof obj.company === "string" && obj.company) ||
      (typeof obj.institution === "string" && obj.institution) ||
      `Item ${index + 1}`
    );
  }
  return `Item ${index + 1}`;
};

export function BlockSettings({ selectedBlockId, isDark = false }: BlockSettingsProps) {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const updateBlock = useResumeStore((state) => state.updateBlock);
  const updateData = useResumeStore((state) => state.updateData);

  if (!activeResume || !selectedBlockId) {
    return (
      <div className={blockContainer(isDark)}>
        <p className="text-sm text-zinc-500">Select a block in Layout to edit its settings.</p>
      </div>
    );
  }

  const block = activeResume.layout.sections.find((section) => section.id === selectedBlockId);
  if (!block) {
    return (
      <div className={blockContainer(isDark)}>
        <p className="text-sm text-zinc-500">Selected block was not found.</p>
      </div>
    );
  }

  const dataKey = block.type as keyof typeof activeResume.data;
  const dataValue = activeResume.data[dataKey];
  const canSlice = Array.isArray(dataValue);
  const displayOptions = displayOptionsByType[block.type] ?? [];
  const selectedIndexes = block.dataSlice?.indexes ?? [];

  return (
    <div className="space-y-3 p-3">
      <div className={blockContainer(isDark)}>
        <h3 className="text-sm font-semibold">Basic</h3>
        <input
          className={cn("w-full rounded border px-2 py-1 text-sm", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "")}
          value={block.title ?? ""}
          onChange={(event) => updateBlock(block.id, { title: event.target.value || undefined })}
          placeholder="Title override"
        />
        <label className="inline-flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={block.visible}
            onChange={() => updateBlock(block.id, { visible: !block.visible })}
          />
          Visible
        </label>
      </div>

      {displayOptions.length > 0 ? (
        <div className={blockContainer(isDark)}>
          <h3 className="text-sm font-semibold">Display Variant</h3>
          <OptionChips
            options={displayOptions.map((option) => ({ value: option, label: option }))}
            value={block.display ?? displayOptions[0]}
            onChange={(value) => updateBlock(block.id, { display: value })}
            isDark={isDark}
          />
        </div>
      ) : null}

      <div className={blockContainer(isDark)}>
        <h3 className="text-sm font-semibold">Style</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="space-y-1">
            <span>Background</span>
            <input
              className={cn("w-full rounded border px-2 py-1", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "")}
              value={block.style?.background ?? ""}
              onChange={(event) => updateBlock(block.id, { style: { ...block.style, background: event.target.value || undefined } })}
              placeholder="#ffffff"
            />
          </label>
          <label className="space-y-1">
            <span>Text Color</span>
            <input
              className={cn("w-full rounded border px-2 py-1", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "")}
              value={block.style?.textColor ?? ""}
              onChange={(event) => updateBlock(block.id, { style: { ...block.style, textColor: event.target.value || undefined } })}
              placeholder="#111827"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="space-y-1">
            <span>Font</span>
            <OptionChips
              options={[
                { value: "default", label: "default" },
                { value: "mono", label: "mono" },
                { value: "serif", label: "serif" },
              ]}
              value={block.style?.fontStyle ?? "default"}
              onChange={(value) =>
                updateBlock(block.id, { style: { ...block.style, fontStyle: value as "default" | "mono" | "serif" } })
              }
              isDark={isDark}
            />
          </label>
          <label className="space-y-1">
            <span>Density</span>
            <OptionChips
              options={[
                { value: "compact", label: "compact" },
                { value: "normal", label: "normal" },
                { value: "spacious", label: "spacious" },
              ]}
              value={block.style?.density ?? "normal"}
              onChange={(value) =>
                updateBlock(block.id, { style: { ...block.style, density: value as "compact" | "normal" | "spacious" } })
              }
              isDark={isDark}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          <label className="inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={Boolean(block.style?.border)}
              onChange={(event) => updateBlock(block.id, { style: { ...block.style, border: event.target.checked } })}
            />
            Border
          </label>
          <label className="inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={Boolean(block.style?.rounded)}
              onChange={(event) => updateBlock(block.id, { style: { ...block.style, rounded: event.target.checked } })}
            />
            Rounded
          </label>
        </div>
      </div>

      {canSlice ? (
        <div className={blockContainer(isDark)}>
          <h3 className="text-sm font-semibold">Data Slice</h3>
          <div className="flex gap-3 text-xs">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                checked={(block.dataSlice?.kind ?? "all") === "all"}
                onChange={() => updateBlock(block.id, { dataSlice: { kind: "all" } })}
              />
              All items
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                checked={block.dataSlice?.kind === "indexes"}
                onChange={() => updateBlock(block.id, { dataSlice: { kind: "indexes", indexes: [] } })}
              />
              Pick items
            </label>
          </div>
          {block.dataSlice?.kind === "indexes" ? (
            <div className="max-h-40 space-y-1 overflow-auto border rounded p-2">
              {(dataValue as unknown[]).map((item, index) => (
                <label key={index} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedIndexes.includes(index)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selectedIndexes, index]
                        : selectedIndexes.filter((current) => current !== index);
                      updateBlock(block.id, { dataSlice: { kind: "indexes", indexes: next } });
                    }}
                  />
                  {makeItemLabel(item, index)}
                </label>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {block.type === "personalInfo" ? (
        <div className={blockContainer(isDark)}>
          <h3 className="text-sm font-semibold">Photo</h3>
          <label className="inline-flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={Boolean(block.params?.showPhoto)}
              onChange={(event) => updateBlock(block.id, { params: { ...block.params, showPhoto: event.target.checked } })}
            />
            Show photo
          </label>
          <label className="block text-xs space-y-1">
            <span>Photo URL</span>
            <input
              className={cn("w-full rounded border px-2 py-1", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "")}
              value={activeResume.data.personalInfo.photoUrl ?? ""}
              onChange={(event) =>
                updateData({
                  ...activeResume.data,
                  personalInfo: { ...activeResume.data.personalInfo, photoUrl: event.target.value || undefined },
                })
              }
              placeholder="https://..."
            />
          </label>
          <label className="block text-xs space-y-1">
            <span>Photo Size ({Number(block.params?.photoSize ?? 96)}px)</span>
            <input
              type="range"
              min={48}
              max={160}
              value={Number(block.params?.photoSize ?? 96)}
              onChange={(event) => updateBlock(block.id, { params: { ...block.params, photoSize: Number(event.target.value) } })}
              className="w-full"
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
