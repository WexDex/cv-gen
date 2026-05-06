"use client";

import { useMemo } from "react";
import { Eye, EyeOff, GripVertical, Pencil, Trash2 } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useResumeStore } from "@/lib/store";
import type { ColumnId, SectionPlacement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AddBlockMenu } from "@/components/builder/AddBlockMenu";
import { sectionTypeLabels } from "@/lib/blockOptions";

const labelFromSectionType = (value: string) =>
  value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());

interface SortableItemProps {
  section: SectionPlacement;
  isDark: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function SortableItem({ section, isDark, selectedId, onSelect }: SortableItemProps) {
  const toggle = useResumeStore((state) => state.toggleSectionVisibility);
  const removeBlock = useResumeStore((state) => state.removeBlock);
  const allCount = useResumeStore((state) => state.getActiveResume()?.layout.sections.length ?? 0);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded border p-2 text-xs transition-all",
        selectedId === section.id
          ? isDark
            ? "border-yellow-400 bg-zinc-800 text-zinc-100 ring-2 ring-yellow-400/70 animate-pulse"
            : "border-yellow-500 bg-white text-zinc-900 ring-2 ring-yellow-500/60 animate-pulse"
          : isDark
            ? "border-zinc-700 bg-zinc-800 text-zinc-100"
            : "bg-white text-zinc-900",
        isDark
          ? "hover:border-yellow-400 hover:ring-2 hover:ring-yellow-400/60 hover:animate-pulse"
          : "hover:border-yellow-500 hover:ring-2 hover:ring-yellow-500/50 hover:animate-pulse",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          className={cn("inline-flex items-center gap-1", isDark ? "text-zinc-100" : "text-zinc-700")}
          {...attributes}
          {...listeners}
          type="button"
        >
          <GripVertical size={13} />
          {labelFromSectionType(section.type)}
        </button>
        <button type="button" className={cn(isDark ? "text-zinc-300" : "text-zinc-500")} onClick={() => toggle(section.id)}>
          {section.visible ? <Eye size={13} /> : <EyeOff size={13} />}
        </button>
        <button
          type="button"
          className={cn(isDark ? "text-yellow-300" : "text-yellow-700")}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(section.id);
          }}
          title="Edit block"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          className={cn("text-red-500", allCount <= 1 && "opacity-40")}
          disabled={allCount <= 1}
          onClick={(event) => {
            event.stopPropagation();
            removeBlock(section.id);
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
      <p className={cn("mt-1 text-[10px]", isDark ? "text-zinc-400" : "text-zinc-500")}>
        {sectionTypeLabels[section.type]}
      </p>
    </li>
  );
}

interface ColumnProps {
  column: ColumnId;
  items: SectionPlacement[];
  isDark: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onBlockAdded: (id: string) => void;
}

function Column({ column, items, isDark, selectedId, onSelect, onBlockAdded }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-2 rounded border p-2 transition-colors",
        isDark ? "border-zinc-700 bg-zinc-900" : "border-zinc-200 bg-zinc-50",
        isOver && (isDark ? "ring-2 ring-cyan-500/40" : "ring-2 ring-blue-500/40"),
      )}
    >
      <h4 className={cn("text-xs font-semibold uppercase tracking-wide", isDark ? "text-zinc-300" : "text-zinc-600")}>
        {column}
      </h4>
      <AddBlockMenu column={column} isDark={isDark} onBlockAdded={onBlockAdded} />
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {items.map((section) => (
            <SortableItem key={section.id} section={section} isDark={isDark} selectedId={selectedId} onSelect={onSelect} />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
}

interface LayoutSandboxProps {
  isDark?: boolean;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

export function LayoutSandbox({ isDark = false, selectedBlockId, onSelectBlock }: LayoutSandboxProps) {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const setLayoutMode = useResumeStore((state) => state.setLayoutMode);
  const setSidebarWidth = useResumeStore((state) => state.setSidebarWidth);
  const moveSection = useResumeStore((state) => state.moveSection);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const columns = useMemo(() => {
    const sections = activeResume?.layout.sections ?? [];
    return {
      left: sections.filter((section) => section.column === "left").sort((a, b) => a.order - b.order),
      right: sections.filter((section) => section.column === "right").sort((a, b) => a.order - b.order),
      full: sections.filter((section) => section.column === "full").sort((a, b) => a.order - b.order),
    };
  }, [activeResume]);

  if (!activeResume) return null;

  const columnOrder: ColumnId[] =
    activeResume.layout.columns === "1col"
      ? ["full"]
      : activeResume.layout.columns === "2col-left-sidebar"
        ? ["left", "right"]
        : ["right", "left"];

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const all = [...columns.left, ...columns.right, ...columns.full];
    const activeSection = all.find((section) => section.id === active.id);
    if (!activeSection) return;

    const overId = String(over.id);
    if (overId.startsWith("column-")) {
      const targetColumn = overId.replace("column-", "") as ColumnId;
      moveSection(activeSection.id, targetColumn, columns[targetColumn].length);
      return;
    }

    const overSection = all.find((section) => section.id === over.id);
    if (!overSection) return;

    if (activeSection.column === overSection.column) {
      const inColumn = [...columns[activeSection.column]];
      const oldIndex = inColumn.findIndex((item) => item.id === activeSection.id);
      const newIndex = inColumn.findIndex((item) => item.id === overSection.id);
      const reordered = arrayMove(inColumn, oldIndex, newIndex);
      const targetIndex = reordered.findIndex((item) => item.id === activeSection.id);
      moveSection(activeSection.id, activeSection.column, targetIndex);
      return;
    }

    moveSection(activeSection.id, overSection.column, overSection.order);
  };

  return (
    <div className="h-full space-y-3 overflow-auto p-3">
      <div className={cn("space-y-2 rounded border p-3", isDark ? "border-zinc-700 bg-zinc-900" : "bg-white")}>
        <label className={cn("text-xs font-semibold", isDark ? "text-zinc-300" : "text-zinc-600")}>Layout Mode</label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {(["1col", "2col-left-sidebar", "2col-right-sidebar"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLayoutMode(mode)}
              className={cn(
                "rounded border px-2 py-1",
                activeResume.layout.columns === mode
                  ? isDark
                    ? "border-cyan-600 bg-cyan-700 text-white"
                    : "bg-zinc-900 text-white"
                  : isDark
                    ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                    : "bg-zinc-100",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <label className={cn("mt-2 block text-xs font-semibold", isDark ? "text-zinc-300" : "text-zinc-600")}>
          Sidebar Width ({activeResume.layout.sidebarWidthPct}%)
        </label>
        <input
          type="range"
          min={25}
          max={40}
          value={activeResume.layout.sidebarWidthPct}
          onChange={(event) => setSidebarWidth(Number(event.target.value))}
          className="w-full"
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className={cn("grid gap-3", columnOrder.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
          {columnOrder.map((column) => (
            <Column
              key={column}
              column={column}
              items={columns[column]}
              isDark={isDark}
              selectedId={selectedBlockId}
              onSelect={onSelectBlock}
              onBlockAdded={onSelectBlock}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
