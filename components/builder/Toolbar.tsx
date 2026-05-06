"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CopyPlus,
  Download,
  Pencil,
  ExternalLink,
  FileJson,
  FileText,
  Image as ImageIcon,
  Moon,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OptionChips } from "@/components/builder/OptionChips";

import { templateList } from "@/components/templates";
import { templateThemes } from "@/components/templates";
import { useResumeStore } from "@/lib/store";
import { exportAsDocx } from "@/lib/export/docx";
import { exportAsPng } from "@/lib/export/png";
import { exportAsPrint, openA4Preview } from "@/lib/export/print";
import { exportResumeJson, parseResumeJson } from "@/lib/export/json";

interface ToolbarProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  uiTheme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Toolbar({ previewRef, uiTheme, onToggleTheme }: ToolbarProps) {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const resumes = useResumeStore((state) => state.resumes);
  const activeId = useResumeStore((state) => state.activeId);
  const setActiveResume = useResumeStore((state) => state.setActiveResume);
  const addResume = useResumeStore((state) => state.addResume);
  const duplicateActiveResume = useResumeStore((state) => state.duplicateActiveResume);
  const deleteResume = useResumeStore((state) => state.deleteResume);
  const renameActiveResume = useResumeStore((state) => state.renameActiveResume);
  const setResumeLanguage = useResumeStore((state) => state.setResumeLanguage);
  const setTemplate = useResumeStore((state) => state.setTemplate);
  const setTemplateVariant = useResumeStore((state) => state.setTemplateVariant);
  const setResumeFromJSON = useResumeStore((state) => state.setResumeFromJSON);

  if (!activeResume) return null;
  if (resumes.length === 0) return null;
  const activeIndex = resumes.findIndex((item) => item.id === activeId);
  const prevResume = resumes[(activeIndex - 1 + resumes.length) % resumes.length];
  const nextResume = resumes[(activeIndex + 1) % resumes.length];
  const sideItems = resumes.length >= 3 ? 2 : resumes.length - 1;
  const windowResumes =
    sideItems <= 0
      ? [activeResume]
      : [
          resumes[(activeIndex - 1 + resumes.length) % resumes.length],
          activeResume,
          ...(sideItems === 2 ? [resumes[(activeIndex + 1) % resumes.length]] : []),
        ];

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseResumeJson(file);
      setResumeFromJSON(parsed);
    } catch (error) {
      console.error(error);
      alert("Could not parse JSON file.");
    }
    event.target.value = "";
  };

  const panel = (extra?: string) =>
    cn(
      "min-w-0 shrink rounded border p-1.5",
      uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50",
      extra,
    );
  const tightBtn = cn(
    "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] leading-tight whitespace-nowrap",
    uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white",
  );

  return (
    <div
      className={cn(
        "flex min-h-10 min-w-0 flex-nowrap items-stretch gap-1.5 overflow-hidden border-b px-2 py-1.5",
        uiTheme === "dark" ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "bg-white text-zinc-900",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-nowrap items-stretch gap-1.5 overflow-hidden">
        <div className={panel()}>
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Project List
          </p>
            <div className="flex items-center gap-0.5">
            <button
              type="button"
              title="Previous project"
              className={cn("shrink-0 rounded border p-0.5", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}
              onClick={() => setActiveResume(prevResume.id)}
                disabled={resumes.length <= 1}
            >
              <ChevronLeft size={14} />
            </button>
              <div key={activeResume.id} className="cv-project-window flex items-center gap-1">
                {windowResumes.map((resume) => {
                  const isActive = resume.id === activeResume.id;
                  const lang = resume.meta.language?.trim();
                  return (
                    <button
                      key={resume.id}
                      type="button"
                      title={
                        isActive
                          ? "Current project"
                          : `Open project ${resume.meta.name}${lang ? ` (${lang})` : ""}`
                      }
                      onClick={isActive ? undefined : () => setActiveResume(resume.id)}
                      className={cn(
                        "max-w-[min(160px,22vw)] min-w-0 shrink rounded border px-1.5 py-0.5 text-[11px]",
                        isActive
                          ? uiTheme === "dark"
                            ? "border-cyan-600 bg-cyan-700 text-white"
                            : "border-blue-500 bg-blue-600 text-white"
                          : uiTheme === "dark"
                            ? "border-zinc-700 bg-zinc-900 text-zinc-300 opacity-75"
                            : "bg-white text-zinc-600 opacity-75",
                      )}
                    >
                      <span className="flex min-w-0 max-w-full items-center gap-1">
                        <span className="min-w-0 truncate">{resume.meta.name}</span>
                        {lang ? (
                          <span
                            className={cn(
                              "shrink-0 rounded-full border px-1 py-px text-[8px] font-semibold uppercase leading-none tracking-wide",
                              isActive
                                ? "border-white/35 bg-white/15 text-white"
                                : uiTheme === "dark"
                                  ? "border-zinc-600 bg-zinc-800 text-zinc-200"
                                  : "border-zinc-200 bg-zinc-100 text-zinc-700",
                            )}
                          >
                            {lang}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            <button
              type="button"
              title="Next project"
              className={cn("shrink-0 rounded border p-0.5", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}
              onClick={() => setActiveResume(nextResume.id)}
                disabled={resumes.length <= 1}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className={panel("max-w-20 shrink-0")}>
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Language
          </p>
          <input
            type="text"
            value={activeResume.meta.language ?? ""}
            onChange={(event) => setResumeLanguage(event.target.value)}
            placeholder="en"
            autoComplete="off"
            spellCheck={false}
            title="Saved on resume metadata (export, future use)"
            className={cn(
              "w-full max-w-full rounded border px-1 py-0.5 text-[11px] outline-none",
              uiTheme === "dark" ? "border-zinc-600 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500" : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400",
            )}
          />
        </div>

        <div className={panel()}>
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Add New
          </p>
          <div className="flex min-w-0 flex-nowrap items-center gap-0.5">
            <button title="Create sample project" type="button" className={cn("shrink-0 rounded border px-1.5 py-0.5 text-[11px]", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} onClick={() => addResume("sample", "Sample Project")}>Sample</button>
            <button title="Create blank project" type="button" className={cn("shrink-0 rounded border px-1.5 py-0.5 text-[11px]", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} onClick={() => addResume("blank", "Blank Project")}>Blank</button>
            <Link title="Browse template gallery" href="/templates" className={cn("shrink-0 rounded border px-1.5 py-0.5 text-[11px]", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}>Templates</Link>
          </div>
        </div>

        <div className={panel()}>
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Actions
          </p>
          <div className="flex min-w-0 flex-nowrap items-center gap-0.5">
            <button
              title="Edit current project name"
              type="button"
              className={cn("inline-flex shrink-0 items-center gap-0.5 rounded border px-1.5 py-0.5 text-[11px]", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}
              onClick={() => {
                const nextName = window.prompt("Project name", activeResume.meta.name);
                if (nextName === null) return;
                renameActiveResume(nextName);
              }}
            >
              <Pencil size={12} />
              Edit name
            </button>
            <button title="Duplicate current project" type="button" className={cn("inline-flex shrink-0 items-center gap-0.5 rounded border px-1.5 py-0.5 text-[11px]", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} onClick={duplicateActiveResume}>
              <CopyPlus size={12} />
              Duplicate
            </button>
            <button title="Delete current project" type="button" className={cn("inline-flex shrink-0 items-center gap-0.5 rounded border px-1.5 py-0.5 text-[11px] text-red-600 disabled:opacity-50", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} disabled={resumes.length <= 1} onClick={() => deleteResume(activeId)}>
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>

        <div className={panel("min-w-[120px] max-w-[min(100%,28rem)]")}>
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Template Selection
          </p>
          <OptionChips
            options={templateList.map((template) => ({ value: template.id, label: template.name }))}
            value={activeResume.templateId}
            onChange={(value) => setTemplate(value as typeof activeResume.templateId)}
            isDark={uiTheme === "dark"}
            size="sm"
            nowrap
            truncateLabels
          />
        </div>

        <div className={panel("shrink-0")}>
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Preview Theme
          </p>
          {templateThemes[activeResume.templateId].light && templateThemes[activeResume.templateId].dark ? (
            <div className={cn("inline-flex rounded border p-0.5", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-zinc-100")}>
              {(["light", "dark"] as const).map((variant) => (
                <button
                  key={variant}
                  title={`Set preview theme ${variant}`}
                  type="button"
                  onClick={() => setTemplateVariant(variant)}
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[11px] capitalize",
                    activeResume.templateVariant === variant
                      ? uiTheme === "dark"
                        ? "bg-cyan-700 text-white"
                        : "bg-zinc-900 text-white"
                      : uiTheme === "dark"
                        ? "text-zinc-200"
                        : "text-zinc-700",
                  )}
                >
                  {variant}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500">No variants</p>
          )}
        </div>

        <div className={panel("shrink-0")}>
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            UI Theme
          </p>
          <button
            title="Toggle UI theme"
            className={cn(
              "inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[11px]",
              uiTheme === "dark" ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "bg-white",
            )}
            type="button"
            onClick={onToggleTheme}
          >
            {uiTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {uiTheme === "dark" ? "Light UI" : "Dark UI"}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "ml-2 flex min-w-0 shrink-0 items-stretch gap-2 border-l pl-2 sm:ml-3 sm:gap-3 sm:pl-3",
          uiTheme === "dark" ? "border-zinc-600" : "border-zinc-300",
        )}
      >
        <div
          className={cn(
            "min-w-0 rounded border p-1.5",
            uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50",
          )}
        >
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Export
          </p>
          <div className="flex min-w-0 flex-nowrap items-center gap-1">
            <button
              className={tightBtn}
              type="button"
              onClick={() => {
                if (!previewRef.current) return;
                try {
                  openA4Preview(previewRef.current, `${activeResume.meta.name} - A4 Preview`);
                } catch (error) {
                  console.error(error);
                  alert(error instanceof Error ? error.message : "Could not open preview.");
                }
              }}
              title="Open A4 preview in new tab"
            >
              <ExternalLink size={12} />
              Preview
            </button>
            <button className={tightBtn} type="button" onClick={exportAsPrint} title="Export as PDF (print)">
              <FileText size={12} />
              PDF
            </button>
            <button
              className={tightBtn}
              type="button"
              onClick={() => previewRef.current && exportAsPng(previewRef.current)}
              title="Export as PNG image"
            >
              <ImageIcon size={12} />
              PNG
            </button>
            <button className={tightBtn} type="button" onClick={() => exportAsDocx(activeResume)} title="Export as DOCX">
              <Download size={12} />
              DOCX
            </button>
            <button className={tightBtn} type="button" onClick={() => exportResumeJson(activeResume)} title="Export as JSON">
              <FileJson size={12} />
              JSON
            </button>
          </div>
        </div>

        <div
          className={cn(
            "shrink-0 rounded border p-1.5",
            uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50",
          )}
        >
          <p className={cn("mb-0.5 text-[9px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Import
          </p>
          <label className={cn(tightBtn, "cursor-pointer")}>
            <Upload size={12} />
            JSON file
            <input className="hidden" type="file" accept=".json,application/json" onChange={handleImport} />
          </label>
        </div>
      </div>
    </div>
  );
}
