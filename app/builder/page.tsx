"use client";

import { useEffect, useRef, useState } from "react";

import { JsonEditor } from "@/components/builder/JsonEditor";
import { BlockSettings } from "@/components/builder/BlockSettings";
import { LayoutSandbox } from "@/components/builder/LayoutSandbox";
import { SectionForms } from "@/components/builder/SectionForms";
import { Toolbar } from "@/components/builder/Toolbar";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type LeftTab = "form" | "json";
type RightTab = "layout" | "block";

export default function BuilderPage() {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const toggleSectionVisibility = useResumeStore((state) => state.toggleSectionVisibility);
  const removeBlock = useResumeStore((state) => state.removeBlock);
  const moveSection = useResumeStore((state) => state.moveSection);
  const [leftTab, setLeftTab] = useState<LeftTab>("form");
  const [rightTab, setRightTab] = useState<RightTab>("layout");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [uiTheme, setUiTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("cv-gen:ui-theme");
    return saved === "dark" ? "dark" : "light";
  });
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.localStorage.setItem("cv-gen:ui-theme", uiTheme);
  }, [uiTheme]);

  const effectiveSelectedBlockId =
    selectedBlockId && activeResume?.layout.sections.some((section) => section.id === selectedBlockId)
      ? selectedBlockId
      : null;

  return (
    <main
      className={cn(
        "flex h-screen flex-col overflow-hidden",
        uiTheme === "dark" ? "bg-zinc-950 text-zinc-100" : "bg-zinc-100 text-zinc-900",
      )}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("[data-keep-selection='true']")) return;
        setSelectedBlockId(null);
      }}
    >
      <Toolbar
        previewRef={previewRef}
        uiTheme={uiTheme}
        onToggleTheme={() => setUiTheme((prev) => (prev === "light" ? "dark" : "light"))}
      />
      <div className="grid min-h-0 flex-1 gap-0 overflow-hidden xl:grid-cols-[25%_50%_25%]">
        <div
          data-keep-selection="true"
          className={cn("flex h-full min-h-0 flex-col overflow-hidden border-r", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-zinc-50")}
        >
          <div className={cn("flex gap-1 border-b p-2", uiTheme === "dark" ? "border-zinc-700" : "")}>
            <button
              type="button"
              className={cn(
                "rounded px-2 py-1 text-xs",
                leftTab === "form"
                  ? uiTheme === "dark"
                    ? "bg-cyan-700 text-white"
                    : "bg-zinc-900 text-white"
                  : uiTheme === "dark"
                    ? "bg-zinc-800 text-zinc-200"
                    : "bg-zinc-200",
              )}
              onClick={() => setLeftTab("form")}
            >
              Form
            </button>
            <button
              type="button"
              className={cn(
                "rounded px-2 py-1 text-xs",
                leftTab === "json"
                  ? uiTheme === "dark"
                    ? "bg-cyan-700 text-white"
                    : "bg-zinc-900 text-white"
                  : uiTheme === "dark"
                    ? "bg-zinc-800 text-zinc-200"
                    : "bg-zinc-200",
              )}
              onClick={() => setLeftTab("json")}
            >
              JSON
            </button>
          </div>
          <div className={cn("min-h-0 flex-1 overflow-auto cv-scrollbar", uiTheme === "dark" && "cv-scrollbar-dark")}>
            {leftTab === "form" ? <SectionForms isDark={uiTheme === "dark"} /> : <JsonEditor isDark={uiTheme === "dark"} />}
          </div>
        </div>
        {activeResume ? (
          <div className={cn("h-full min-h-0 overflow-auto cv-scrollbar", uiTheme === "dark" && "cv-scrollbar-dark")}>
            <ResumePreview
              resume={activeResume}
              previewRef={previewRef}
              uiTheme={uiTheme}
              selectedBlockId={effectiveSelectedBlockId}
              onSelectBlock={(id) => {
                setSelectedBlockId(id);
                setRightTab("block");
              }}
              onToggleVisibility={toggleSectionVisibility}
              onRemoveBlock={removeBlock}
              onMoveBlock={moveSection}
            />
          </div>
        ) : null}
        <div
          data-keep-selection="true"
          className={cn("flex h-full min-h-0 flex-col overflow-hidden border-l", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-zinc-50")}
        >
          <div className={cn("flex gap-1 border-b p-2", uiTheme === "dark" ? "border-zinc-700" : "")}>
            <button
              type="button"
              onClick={() => setRightTab("layout")}
              className={cn(
                "rounded px-2 py-1 text-xs",
                rightTab === "layout"
                  ? uiTheme === "dark"
                    ? "bg-cyan-700 text-white"
                    : "bg-zinc-900 text-white"
                  : uiTheme === "dark"
                    ? "bg-zinc-800 text-zinc-200"
                    : "bg-zinc-200",
              )}
            >
              Layout
            </button>
            <button
              type="button"
              onClick={() => setRightTab("block")}
              className={cn(
                "rounded px-2 py-1 text-xs",
                rightTab === "block"
                  ? uiTheme === "dark"
                    ? "bg-cyan-700 text-white"
                    : "bg-zinc-900 text-white"
                  : uiTheme === "dark"
                    ? "bg-zinc-800 text-zinc-200"
                    : "bg-zinc-200",
              )}
            >
              Block
            </button>
          </div>
          <div className={cn("min-h-0 flex-1 overflow-auto cv-scrollbar", uiTheme === "dark" && "cv-scrollbar-dark")}>
            {rightTab === "layout" ? (
              <LayoutSandbox
                isDark={uiTheme === "dark"}
                selectedBlockId={effectiveSelectedBlockId}
                onSelectBlock={(id) => {
                  setSelectedBlockId(id);
                  setRightTab("block");
                }}
              />
            ) : (
              <BlockSettings selectedBlockId={effectiveSelectedBlockId} isDark={uiTheme === "dark"} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
