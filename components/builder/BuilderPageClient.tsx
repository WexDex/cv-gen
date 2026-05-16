"use client";

import { useEffect, useRef, useState } from "react";

import { JsonEditor } from "@/components/builder/JsonEditor";
import { BlockSettings } from "@/components/builder/BlockSettings";
import { BuilderErrorBoundary } from "@/components/builder/BuilderErrorBoundary";
import { LayoutSandbox } from "@/components/builder/LayoutSandbox";
import { SectionForms } from "@/components/builder/SectionForms";
import { Toolbar } from "@/components/builder/Toolbar";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type LeftTab = "form" | "json";
type RightTab = "layout" | "block";

export default function BuilderPageClient() {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const toggleSectionVisibility = useResumeStore((state) => state.toggleSectionVisibility);
  const removeBlock = useResumeStore((state) => state.removeBlock);
  const moveSection = useResumeStore((state) => state.moveSection);
  const reorderSection = useResumeStore((state) => state.reorderSection);
  const [leftTab, setLeftTab] = useState<LeftTab>("form");
  const [rightTab, setRightTab] = useState<RightTab>("layout");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [uiTheme, setUiTheme] = useState<"light" | "dark">("light");
  const [showSpacing, setShowSpacing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = window.localStorage.getItem("cv-gen:ui-theme");
      if (saved === "dark" || saved === "light") {
        setUiTheme(saved);
      }
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cv-gen:ui-theme", uiTheme);
  }, [uiTheme]);

  const effectiveSelectedBlockId =
    selectedBlockId && activeResume?.layout?.sections?.some((section) => section.id === selectedBlockId)
      ? selectedBlockId
      : null;

  const selectedSectionType = effectiveSelectedBlockId
    ? activeResume?.layout?.sections?.find((s) => s.id === effectiveSelectedBlockId)?.type ?? null
    : null;

  const errorResetKey = activeResume ? `${activeResume.id}:${activeResume.meta.updatedAt}` : "";

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
      <div className="cv-print-hide">
        <Toolbar
          previewRef={previewRef}
          uiTheme={uiTheme}
          onToggleTheme={() => setUiTheme((prev) => (prev === "light" ? "dark" : "light"))}
          showSpacing={showSpacing}
          onToggleSpacing={() => setShowSpacing((prev) => !prev)}
        />
      </div>
      <div className="cv-builder-grid grid min-h-0 flex-1 gap-0 overflow-hidden xl:grid-cols-[25%_50%_25%]">
        <div
          data-keep-selection="true"
          className={cn(
            "cv-print-hide flex h-full min-h-0 flex-col overflow-hidden border-r",
            uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-zinc-50",
          )}
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
            {leftTab === "form" ? (
              <BuilderErrorBoundary isDark={uiTheme === "dark"} title="Form editor" resetKey={errorResetKey}>
<<<<<<< Updated upstream
                <SectionForms isDark={uiTheme === "dark"} selectedSectionType={selectedSectionType} />
=======
                <SectionForms isDark={uiTheme === "dark"} selectedSectionId={effectiveSelectedBlockId} />
>>>>>>> Stashed changes
              </BuilderErrorBoundary>
            ) : (
              <JsonEditor isDark={uiTheme === "dark"} leftTab={leftTab} />
            )}
          </div>
        </div>
        {activeResume ? (
          <div
            className={cn(
              "cv-print-preview-host h-full min-h-0 overflow-auto cv-scrollbar",
              uiTheme === "dark" && "cv-scrollbar-dark",
            )}
          >
            <BuilderErrorBoundary isDark={uiTheme === "dark"} title="Preview" resetKey={errorResetKey}>
              <ResumePreview
                resume={activeResume}
                previewRef={previewRef}
                uiTheme={uiTheme}
                showSpacing={showSpacing}
                selectedBlockId={effectiveSelectedBlockId}
                onSelectBlock={(id) => {
                  setSelectedBlockId(id);
                  setRightTab("block");
                  setLeftTab("form");
                }}
                onToggleVisibility={toggleSectionVisibility}
                onRemoveBlock={removeBlock}
                onMoveBlock={moveSection}
                onReorderBlock={(id, dir) => {
                  const section = activeResume.layout.sections.find((s) => s.id === id);
                  if (!section) return;
                  reorderSection(id, section.order + (dir === "up" ? -1 : 1));
                }}
              />
            </BuilderErrorBoundary>
          </div>
        ) : null}
        <div
          data-keep-selection="true"
          className={cn(
            "cv-print-hide flex h-full min-h-0 flex-col overflow-hidden border-l",
            uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-zinc-50",
          )}
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
              <BuilderErrorBoundary isDark={uiTheme === "dark"} title="Layout" resetKey={errorResetKey}>
                <LayoutSandbox
                  isDark={uiTheme === "dark"}
                  selectedBlockId={effectiveSelectedBlockId}
                  onSelectBlock={(id) => {
                    setSelectedBlockId(id);
                    setRightTab("block");
                  }}
                />
              </BuilderErrorBoundary>
            ) : (
              <BuilderErrorBoundary isDark={uiTheme === "dark"} title="Block settings" resetKey={errorResetKey}>
                <BlockSettings selectedBlockId={effectiveSelectedBlockId} isDark={uiTheme === "dark"} />
              </BuilderErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
