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

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b px-3 py-2",
        uiTheme === "dark" ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "bg-white text-zinc-900",
      )}
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className={cn("rounded border p-2", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50")}>
          <p className={cn("mb-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Project List
          </p>
            <div className="flex items-center gap-1">
            <button
              type="button"
              title="Previous project"
              className={cn("rounded border p-1", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}
              onClick={() => setActiveResume(prevResume.id)}
                disabled={resumes.length <= 1}
            >
              <ChevronLeft size={14} />
            </button>
              <div key={activeResume.id} className="cv-project-window flex items-center gap-1">
                {windowResumes.map((resume) => {
                  const isActive = resume.id === activeResume.id;
                  return (
                    <button
                      key={resume.id}
                      type="button"
                      title={isActive ? "Current project" : `Open project ${resume.meta.name}`}
                      onClick={isActive ? undefined : () => setActiveResume(resume.id)}
                      className={cn(
                        "max-w-[140px] truncate rounded border px-2 py-1 text-xs",
                        isActive
                          ? uiTheme === "dark"
                            ? "border-cyan-600 bg-cyan-700 text-white"
                            : "border-blue-500 bg-blue-600 text-white"
                          : uiTheme === "dark"
                            ? "border-zinc-700 bg-zinc-900 text-zinc-300 opacity-75"
                            : "bg-white text-zinc-600 opacity-75",
                      )}
                    >
                      {resume.meta.name}
                    </button>
                  );
                })}
              </div>
            <button
              type="button"
              title="Next project"
              className={cn("rounded border p-1", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}
              onClick={() => setActiveResume(nextResume.id)}
                disabled={resumes.length <= 1}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className={cn("rounded border p-2", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50")}>
          <p className={cn("mb-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Add New
          </p>
          <div className="flex items-center gap-1">
            <button title="Create sample project" type="button" className={cn("rounded border px-2 py-1 text-xs", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} onClick={() => addResume("sample", "Sample Project")}>From sample</button>
            <button title="Create blank project" type="button" className={cn("rounded border px-2 py-1 text-xs", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} onClick={() => addResume("blank", "Blank Project")}>Blank</button>
            <Link title="Browse template gallery" href="/templates" className={cn("rounded border px-2 py-1 text-xs", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}>Template gallery</Link>
          </div>
        </div>

        <div className={cn("rounded border p-2", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50")}>
          <p className={cn("mb-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Actions
          </p>
          <div className="flex items-center gap-1">
            <button
              title="Edit current project name"
              type="button"
              className={cn("inline-flex items-center gap-1 rounded border px-2 py-1 text-xs", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")}
              onClick={() => {
                const nextName = window.prompt("Project name", activeResume.meta.name);
                if (nextName === null) return;
                renameActiveResume(nextName);
              }}
            >
              <Pencil size={12} />
              Edit name
            </button>
            <button title="Duplicate current project" type="button" className={cn("inline-flex items-center gap-1 rounded border px-2 py-1 text-xs", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} onClick={duplicateActiveResume}>
              <CopyPlus size={12} />
              Duplicate
            </button>
            <button title="Delete current project" type="button" className={cn("inline-flex items-center gap-1 rounded border px-2 py-1 text-xs text-red-600 disabled:opacity-50", uiTheme === "dark" ? "border-zinc-700 bg-zinc-900" : "bg-white")} disabled={resumes.length <= 1} onClick={() => deleteResume(activeId)}>
              <Trash2 size={12} />
              Delete
            </button>
          </div>
        </div>

        <div className={cn("rounded border p-2", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50")}>
          <p className={cn("mb-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            Template Selection
          </p>
          <OptionChips
            options={templateList.map((template) => ({ value: template.id, label: template.name }))}
            value={activeResume.templateId}
            onChange={(value) => setTemplate(value as typeof activeResume.templateId)}
            isDark={uiTheme === "dark"}
            size="sm"
          />
        </div>

        <div className={cn("rounded border p-2", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50")}>
          <p className={cn("mb-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
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
                    "rounded px-2 py-1 text-xs capitalize",
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

        <div className={cn("rounded border p-2", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50")}>
          <p className={cn("mb-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
            UI Theme
          </p>
          <button
            title="Toggle UI theme"
            className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-1 text-xs",
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

      <div className={cn("rounded border p-2", uiTheme === "dark" ? "border-zinc-700 bg-zinc-800/60" : "border-zinc-200 bg-zinc-50")}>
        <p className={cn("mb-1 text-[10px] uppercase tracking-wide", uiTheme === "dark" ? "text-zinc-300" : "text-zinc-500")}>
          Export / Import
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-1",
              uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white",
            )}
            type="button"
            onClick={() => {
              if (!previewRef.current) return;
              openA4Preview(previewRef.current, `${activeResume.meta.name} - A4 Preview`);
            }}
            title="Open A4 preview in new tab"
          >
            <ExternalLink size={14} />
            Preview
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-1",
              uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white",
            )}
            type="button"
            onClick={exportAsPrint}
            title="Export as PDF (print)"
          >
            <FileText size={14} />
            PDF
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-1",
              uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white",
            )}
            type="button"
            onClick={() => previewRef.current && exportAsPng(previewRef.current)}
            title="Export as PNG image"
          >
            <ImageIcon size={14} />
            PNG
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-1",
              uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white",
            )}
            type="button"
            onClick={() => exportAsDocx(activeResume)}
            title="Export as DOCX"
          >
            <Download size={14} />
            DOCX
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-1 rounded border px-2 py-1",
              uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white",
            )}
            type="button"
            onClick={() => exportResumeJson(activeResume)}
            title="Export as JSON"
          >
            <FileJson size={14} />
            JSON
          </button>
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-1 rounded border px-2 py-1",
              uiTheme === "dark" ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white",
            )}
          >
            <Upload size={14} />
            Import
            <input className="hidden" type="file" accept=".json,application/json" onChange={handleImport} />
          </label>
        </div>
      </div>
    </div>
  );
}
