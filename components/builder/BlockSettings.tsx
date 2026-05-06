"use client";

import { displayOptionsByType } from "@/lib/blockOptions";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { BlockEdgeInsets, BlockStyle } from "@/lib/types";
import { OptionChips } from "@/components/builder/OptionChips";
import { ColorHexField } from "@/components/builder/ColorHexField";

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

const formatDisplayLabel = (value: string) =>
  value === "inline-between" ? "Row (space-between)" : value;

function patchEdgeInsets(
  current: BlockEdgeInsets | undefined,
  side: keyof BlockEdgeInsets,
  raw: string,
): BlockEdgeInsets | undefined {
  if (raw.trim() === "") {
    if (!current) return undefined;
    const next = { ...current };
    delete next[side];
    if (next.top === undefined && next.right === undefined && next.bottom === undefined && next.left === undefined) {
      return undefined;
    }
    return next;
  }
  const n = Number(raw);
  if (Number.isNaN(n)) return current;
  return { ...current, [side]: n };
}

function hasSpacingOverrides(style?: BlockStyle): boolean {
  if (!style) return false;
  if (style.lineHeight !== undefined) return true;
  const m = style.margin;
  if (m && (m.top !== undefined || m.right !== undefined || m.bottom !== undefined || m.left !== undefined)) {
    return true;
  }
  const p = style.paddingInset;
  if (p && (p.top !== undefined || p.right !== undefined || p.bottom !== undefined || p.left !== undefined)) {
    return true;
  }
  return false;
}

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
            options={displayOptions.map((option) => ({ value: option, label: formatDisplayLabel(option) }))}
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
            <ColorHexField
              value={block.style?.background ?? ""}
              onChange={(next) => updateBlock(block.id, { style: { ...block.style, background: next } })}
              placeholder="#ffffff"
              fallbackHex="#ffffff"
              isDark={isDark}
              aria-label="Background color"
            />
          </label>
          <label className="space-y-1">
            <span>Text Color</span>
            <ColorHexField
              value={block.style?.textColor ?? ""}
              onChange={(next) => updateBlock(block.id, { style: { ...block.style, textColor: next } })}
              placeholder="#111827"
              fallbackHex="#111827"
              isDark={isDark}
              aria-label="Text color"
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
        <div className="mt-4 border-t border-zinc-200 pt-3 dark:border-zinc-600">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Spacing</h4>
            <button
              type="button"
              disabled={!hasSpacingOverrides(block.style)}
              className={cn(
                "rounded border px-2 py-0.5 text-xs",
                isDark ? "border-zinc-600 enabled:hover:bg-zinc-800 disabled:opacity-40" : "border-zinc-300 enabled:hover:bg-zinc-50 disabled:opacity-40",
              )}
              onClick={() => {
                const s = block.style;
                if (!s) return;
                const rest = { ...s };
                delete rest.margin;
                delete rest.paddingInset;
                delete rest.lineHeight;
                updateBlock(block.id, { style: Object.keys(rest).length > 0 ? rest : undefined });
              }}
            >
              Restore defaults
            </button>
          </div>
          <p className="mb-2 text-[11px] text-zinc-500">
            Margin and padding are in pixels. Leave a field empty to use the default for that side. Padding preset (sm / md / lg) still applies for any side you leave blank.
          </p>
          <div className="grid gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-zinc-600 dark:text-zinc-400">Margin</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(["top", "right", "bottom", "left"] as const).map((side) => (
                  <label key={side} className="space-y-0.5">
                    <span className="text-[10px] uppercase text-zinc-500">{side[0]}</span>
                    <input
                      type="number"
                      className={cn(
                        "w-full min-w-0 rounded border px-1 py-0.5 text-xs",
                        isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "",
                      )}
                      placeholder="—"
                      value={block.style?.margin?.[side] ?? ""}
                      onChange={(event) => {
                        const nextMargin = patchEdgeInsets(block.style?.margin, side, event.target.value);
                        const style = { ...block.style };
                        if (nextMargin === undefined) delete style.margin;
                        else style.margin = nextMargin;
                        updateBlock(block.id, { style: Object.keys(style).length > 0 ? style : undefined });
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-600 dark:text-zinc-400">Padding</span>
              <div className="grid grid-cols-4 gap-1.5">
                {(["top", "right", "bottom", "left"] as const).map((side) => (
                  <label key={side} className="space-y-0.5">
                    <span className="text-[10px] uppercase text-zinc-500">{side[0]}</span>
                    <input
                      type="number"
                      className={cn(
                        "w-full min-w-0 rounded border px-1 py-0.5 text-xs",
                        isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "",
                      )}
                      placeholder="—"
                      value={block.style?.paddingInset?.[side] ?? ""}
                      onChange={(event) => {
                        const nextPad = patchEdgeInsets(block.style?.paddingInset, side, event.target.value);
                        const style = { ...block.style };
                        if (nextPad === undefined) delete style.paddingInset;
                        else style.paddingInset = nextPad;
                        updateBlock(block.id, { style: Object.keys(style).length > 0 ? style : undefined });
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>
            <label className="block space-y-1">
              <span className="text-zinc-600 dark:text-zinc-400">Line height (unitless)</span>
              <input
                type="number"
                step={0.05}
                min={1}
                max={3}
                className={cn("w-full rounded border px-2 py-1 text-xs", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "")}
                placeholder="e.g. 1.5"
                value={block.style?.lineHeight ?? ""}
                onChange={(event) => {
                  const v = event.target.value.trim();
                  const style = { ...block.style };
                  if (v === "") {
                    delete style.lineHeight;
                  } else {
                    const n = Number(v);
                    if (!Number.isNaN(n)) style.lineHeight = n;
                  }
                  updateBlock(block.id, { style: Object.keys(style).length > 0 ? style : undefined });
                }}
              />
            </label>
          </div>
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
