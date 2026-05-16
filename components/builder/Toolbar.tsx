"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CopyPlus,
  Download,
  ExternalLink,
  FileJson,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Moon,
  MoreHorizontal,
  Pencil,
  Plus,
  Ruler,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { templateList, templateThemes } from "@/components/templates";
import { useTemplateStore } from "@/lib/templateStore";
import { useResumeStore } from "@/lib/store";
import { exportAsDocx } from "@/lib/export/docx";
import { exportAsPng } from "@/lib/export/png";
import { exportAsPrint, openA4Preview } from "@/lib/export/print";
import { exportResumeJson, parseResumeJson } from "@/lib/export/json";
import type { BuiltInTemplateId } from "@/lib/types";

const FONT_PRESETS = [
  { label: "Default", fontFamily: "", fontUrl: "" },
  { label: "Roboto", fontFamily: "Roboto", fontUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" },
  { label: "Inter", fontFamily: "Inter", fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" },
  { label: "Lato", fontFamily: "Lato", fontUrl: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" },
  { label: "Montserrat", fontFamily: "Montserrat", fontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" },
  { label: "Merriweather", fontFamily: "Merriweather", fontUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" },
];

interface ToolbarProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  uiTheme: "light" | "dark";
  onToggleTheme: () => void;
  showSpacing?: boolean;
  onToggleSpacing?: () => void;
}

// ─── Dropdown primitives ──────────────────────────────────────────────────────

function useOutsideClose(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb]);
  return ref;
}

function Dropdown({
  trigger,
  children,
  isDark,
  align = "left",
}: {
  trigger: (open: boolean) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  isDark: boolean;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const ref = useOutsideClose(close);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)}>{trigger(open)}</div>
      {open && (
        <div
          className={cn(
            "absolute top-full z-50 mt-1 min-w-45 rounded-lg border py-1 shadow-xl",
            align === "right" ? "right-0" : "left-0",
            isDark
              ? "border-zinc-700 bg-zinc-900 text-zinc-100"
              : "border-zinc-200 bg-white text-zinc-800",
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  sublabel,
  onClick,
  danger = false,
  disabled = false,
  active = false,
  isDark,
}: {
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  active?: boolean;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm disabled:opacity-40",
        danger
          ? "text-red-500 hover:bg-red-500/10"
          : active
            ? isDark
              ? "bg-cyan-700/40 text-cyan-300"
              : "bg-blue-50 text-blue-700"
            : isDark
              ? "hover:bg-zinc-800"
              : "hover:bg-zinc-50",
      )}
    >
      {icon && <span className="shrink-0 opacity-60">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{label}</span>
        {sublabel && <span className="block truncate text-xs opacity-50">{sublabel}</span>}
      </span>
      {active && <span className="ml-auto shrink-0 text-xs">✓</span>}
    </button>
  );
}

function MenuDivider({ isDark }: { isDark: boolean }) {
  return <div className={cn("my-1 border-t", isDark ? "border-zinc-800" : "border-zinc-100")} />;
}

function MenuLabel({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <p className={cn("px-3 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-widest first:pt-1.5", isDark ? "text-zinc-500" : "text-zinc-400")}>
      {label}
    </p>
  );
}

// ─── Toolbar button styles ────────────────────────────────────────────────────

function tbtn(isDark: boolean, active = false, danger = false) {
  return cn(
    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors select-none whitespace-nowrap",
    danger
      ? "text-red-500 hover:bg-red-500/10"
      : active
        ? isDark
          ? "bg-cyan-700 text-white"
          : "bg-blue-600 text-white"
        : isDark
          ? "text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
          : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
  );
}

function Sep({ isDark }: { isDark: boolean }) {
  return <div className={cn("mx-1 h-5 w-px shrink-0", isDark ? "bg-zinc-700" : "bg-zinc-200")} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Toolbar({ previewRef, uiTheme, onToggleTheme, showSpacing = false, onToggleSpacing }: ToolbarProps) {
  const isDark = uiTheme === "dark";

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
  const setFontOverride = useResumeStore((state) => state.setFontOverride);

  const customTemplates = useTemplateStore((state) => state.customTemplates);
  const allTemplateOptions = [
    ...templateList.map((t) => ({ value: t.id, label: t.name })),
    ...customTemplates.map((t) => ({ value: t.id, label: t.name })),
  ];

  if (!activeResume || resumes.length === 0) return null;

  const activeIndex = resumes.findIndex((r) => r.id === activeId);
  const prevResume = resumes[(activeIndex - 1 + resumes.length) % resumes.length];
  const nextResume = resumes[(activeIndex + 1) % resumes.length];

  const currentTemplate = allTemplateOptions.find((t) => t.value === activeResume.templateId);
  const hasVariants =
    Boolean(templateThemes[activeResume.templateId as BuiltInTemplateId]?.light) &&
    Boolean(templateThemes[activeResume.templateId as BuiltInTemplateId]?.dark);

  const currentFont = FONT_PRESETS.find((p) => p.fontFamily === (activeResume.fontOverride?.fontFamily ?? "")) ?? FONT_PRESETS[0];

  const atsChecks = [
    { label: "Name", pass: Boolean(activeResume.data.personalInfo.name?.trim()) },
    { label: "Email", pass: Boolean(activeResume.data.personalInfo.contacts?.some((c) => c.type === "email" && c.value?.trim()) || activeResume.data.personalInfo.email?.trim()) },
    { label: "Phone", pass: Boolean(activeResume.data.personalInfo.contacts?.some((c) => c.type === "phone" && c.value?.trim()) || activeResume.data.personalInfo.phone?.trim()) },
    { label: "Experience", pass: activeResume.data.experience.length > 0 },
    { label: "Education", pass: activeResume.data.education.length > 0 },
    { label: "Text template", pass: activeResume.templateId !== "webdev" },
  ];
  const atsScore = atsChecks.filter((c) => c.pass).length;

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseResumeJson(file);
      setResumeFromJSON(parsed);
    } catch {
      alert("Could not parse JSON file.");
    }
    event.target.value = "";
  };

  return (
    <div
      className={cn(
        "flex h-11 min-w-0 items-center gap-0.5 border-b px-2",
        isDark ? "border-zinc-700 bg-zinc-900 text-zinc-100" : "border-zinc-200 bg-white text-zinc-900",
      )}
    >
      {/* ── Project switcher ─────────────────────────────────────────────── */}
      <button
        type="button"
        title="Previous project"
        disabled={resumes.length <= 1}
        onClick={() => setActiveResume(prevResume.id)}
        className={tbtn(isDark)}
      >
        <ChevronLeft size={14} />
      </button>

      <Dropdown
        isDark={isDark}
        trigger={(open) => (
          <button type="button" className={cn(tbtn(isDark), "max-w-40", open && (isDark ? "bg-zinc-700" : "bg-zinc-100"))}>
            <span className="min-w-0 truncate">{activeResume.meta.name}</span>
            {activeResume.meta.language?.trim() && (
              <span className={cn("shrink-0 rounded-full border px-1 py-px text-[9px] font-semibold uppercase", isDark ? "border-zinc-600 bg-zinc-800 text-zinc-300" : "border-zinc-200 bg-zinc-100 text-zinc-600")}>
                {activeResume.meta.language.trim()}
              </span>
            )}
            <ChevronDown size={12} className="shrink-0 opacity-50" />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuLabel label="Projects" isDark={isDark} />
            {resumes.map((r) => (
              <MenuItem
                key={r.id}
                label={r.meta.name}
                sublabel={r.meta.language?.trim() ? `lang: ${r.meta.language.trim()}` : undefined}
                active={r.id === activeId}
                isDark={isDark}
                onClick={() => { setActiveResume(r.id); close(); }}
              />
            ))}
          </>
        )}
      </Dropdown>

      <button
        type="button"
        title="Next project"
        disabled={resumes.length <= 1}
        onClick={() => setActiveResume(nextResume.id)}
        className={tbtn(isDark)}
      >
        <ChevronRight size={14} />
      </button>

      {/* New project */}
      <Dropdown
        isDark={isDark}
        trigger={(open) => (
          <button type="button" className={cn(tbtn(isDark), open && (isDark ? "bg-zinc-700" : "bg-zinc-100"))}>
            <Plus size={13} />
            New
            <ChevronDown size={11} className="opacity-50" />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuLabel label="Create project" isDark={isDark} />
            <MenuItem icon={<Plus size={13} />} label="Sample project" isDark={isDark} onClick={() => { addResume("sample", "Sample Project"); close(); }} />
            <MenuItem icon={<Plus size={13} />} label="Blank project" isDark={isDark} onClick={() => { addResume("blank", "Blank Project"); close(); }} />
          </>
        )}
      </Dropdown>

      {/* Project actions */}
      <Dropdown
        isDark={isDark}
        trigger={(open) => (
          <button type="button" title="Project actions" className={cn(tbtn(isDark), open && (isDark ? "bg-zinc-700" : "bg-zinc-100"))}>
            <MoreHorizontal size={14} />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuLabel label="Project" isDark={isDark} />
            <MenuItem
              icon={<Pencil size={13} />}
              label="Rename"
              isDark={isDark}
              onClick={() => {
                const next = window.prompt("Project name", activeResume.meta.name);
                if (next !== null) renameActiveResume(next);
                close();
              }}
            />
            <MenuItem icon={<CopyPlus size={13} />} label="Duplicate" isDark={isDark} onClick={() => { duplicateActiveResume(); close(); }} />
            <MenuDivider isDark={isDark} />
            <MenuLabel label="Language" isDark={isDark} />
            <div className="px-3 pb-2">
              <input
                type="text"
                value={activeResume.meta.language ?? ""}
                onChange={(e) => setResumeLanguage(e.target.value)}
                placeholder="en, fr, ar…"
                autoComplete="off"
                spellCheck={false}
                className={cn(
                  "w-full rounded border px-2 py-1 text-xs outline-none",
                  isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500" : "border-zinc-200 bg-zinc-50 placeholder:text-zinc-400",
                )}
              />
            </div>
            <MenuDivider isDark={isDark} />
            <MenuItem
              icon={<Trash2 size={13} />}
              label="Delete project"
              danger
              disabled={resumes.length <= 1}
              isDark={isDark}
              onClick={() => { deleteResume(activeId); close(); }}
            />
          </>
        )}
      </Dropdown>

      <Sep isDark={isDark} />

      {/* ── Template dropdown ──────────────────────────────────────────────── */}
      <Dropdown
        isDark={isDark}
        trigger={(open) => (
          <button type="button" className={cn(tbtn(isDark), "max-w-45", open && (isDark ? "bg-zinc-700" : "bg-zinc-100"))}>
            <LayoutTemplate size={13} className="shrink-0" />
            <span className="min-w-0 truncate">{currentTemplate?.label ?? activeResume.templateId}</span>
            <ChevronDown size={11} className="shrink-0 opacity-50" />
          </button>
        )}
      >
        {(close) => (
          <>
            {templateList.length > 0 && <MenuLabel label="Built-in" isDark={isDark} />}
            {templateList.map((t) => (
              <MenuItem
                key={t.id}
                label={t.name}
                active={activeResume.templateId === t.id}
                isDark={isDark}
                onClick={() => { setTemplate(t.id); close(); }}
              />
            ))}
            {customTemplates.length > 0 && (
              <>
                <MenuDivider isDark={isDark} />
                <MenuLabel label="Custom" isDark={isDark} />
                {customTemplates.map((t) => (
                  <MenuItem
                    key={t.id}
                    label={t.name}
                    active={activeResume.templateId === t.id}
                    isDark={isDark}
                    onClick={() => { setTemplate(t.id); close(); }}
                  />
                ))}
              </>
            )}
            <MenuDivider isDark={isDark} />
            <Link href="/admin" onClick={close} className={cn("flex items-center gap-2.5 px-3 py-1.5 text-sm", isDark ? "text-zinc-400 hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-50")}>
              <LayoutTemplate size={13} className="opacity-60" />
              Manage templates →
            </Link>
          </>
        )}
      </Dropdown>

      {/* Light/Dark variant */}
      {hasVariants && (
        <div className={cn("flex items-center rounded-md border", isDark ? "border-zinc-700 bg-zinc-800" : "border-zinc-200 bg-zinc-100")}>
          {(["light", "dark"] as const).map((v) => (
            <button
              key={v}
              type="button"
              title={`${v} resume style`}
              onClick={() => setTemplateVariant(v)}
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium capitalize transition-colors",
                activeResume.templateVariant === v
                  ? isDark ? "bg-zinc-600 text-zinc-100" : "bg-white text-zinc-900 shadow-sm"
                  : isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-500 hover:text-zinc-700",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* Font */}
      <Dropdown
        isDark={isDark}
        trigger={(open) => (
          <button type="button" className={cn(tbtn(isDark), open && (isDark ? "bg-zinc-700" : "bg-zinc-100"))}>
            <span className="font-semibold text-[11px]">Aa</span>
            <span className="max-w-18 truncate">{currentFont.label}</span>
            <ChevronDown size={11} className="opacity-50" />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuLabel label="Font" isDark={isDark} />
            {FONT_PRESETS.map((preset) => (
              <MenuItem
                key={preset.label}
                label={preset.label}
                active={(activeResume.fontOverride?.fontFamily ?? "") === preset.fontFamily}
                isDark={isDark}
                onClick={() => {
                  if (!preset.fontFamily) setFontOverride(null);
                  else setFontOverride({ fontFamily: preset.fontFamily, fontUrl: preset.fontUrl });
                  close();
                }}
              />
            ))}
          </>
        )}
      </Dropdown>

      <Sep isDark={isDark} />

      {/* ── Tools ────────────────────────────────────────────────────────── */}

      {/* ATS badge */}
      <Dropdown
        isDark={isDark}
        trigger={(open) => (
          <button
            type="button"
            title="ATS readiness"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
              atsScore === 6
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-amber-500 text-white hover:bg-amber-600",
            )}
          >
            {atsScore === 6 ? "✓ ATS" : `ATS ${atsScore}/6`}
          </button>
        )}
      >
        {() => (
          <>
            <MenuLabel label="ATS Checklist" isDark={isDark} />
            {atsChecks.map((check) => (
              <div key={check.label} className={cn("flex items-center gap-2 px-3 py-1 text-sm", isDark ? "text-zinc-300" : "text-zinc-700")}>
                <span className={check.pass ? "text-green-500" : "text-red-400"}>{check.pass ? "✓" : "✗"}</span>
                {check.label}
              </div>
            ))}
          </>
        )}
      </Dropdown>

      {/* Spacing overlay */}
      <button
        type="button"
        title="Toggle spacing overlay"
        onClick={onToggleSpacing}
        className={tbtn(isDark, showSpacing)}
      >
        <Ruler size={13} />
      </button>

      <Sep isDark={isDark} />

      {/* ── Export ────────────────────────────────────────────────────────── */}
      <Dropdown
        isDark={isDark}
        align="right"
        trigger={(open) => (
          <button type="button" className={cn(tbtn(isDark), open && (isDark ? "bg-zinc-700" : "bg-zinc-100"))}>
            <FileText size={13} />
            Export
            <ChevronDown size={11} className="opacity-50" />
          </button>
        )}
      >
        {(close) => (
          <>
            <MenuLabel label="Preview" isDark={isDark} />
            <MenuItem
              icon={<ExternalLink size={13} />}
              label="Open A4 preview"
              isDark={isDark}
              onClick={() => {
                if (!previewRef.current) return;
                try { openA4Preview(previewRef.current, `${activeResume.meta.name} - A4 Preview`); }
                catch (err) { alert(err instanceof Error ? err.message : "Could not open preview."); }
                close();
              }}
            />
            <MenuDivider isDark={isDark} />
            <MenuLabel label="Export as" isDark={isDark} />
            <MenuItem icon={<FileText size={13} />} label="PDF (print)" isDark={isDark} onClick={() => { exportAsPrint(); close(); }} />
            <MenuItem icon={<ImageIcon size={13} />} label="PNG image" isDark={isDark} onClick={() => { previewRef.current && exportAsPng(previewRef.current); close(); }} />
            <MenuItem icon={<Download size={13} />} label="DOCX" isDark={isDark} onClick={() => { exportAsDocx(activeResume); close(); }} />
            <MenuItem icon={<FileJson size={13} />} label="JSON" isDark={isDark} onClick={() => { exportResumeJson(activeResume); close(); }} />
          </>
        )}
      </Dropdown>

      {/* Import */}
      <label className={cn(tbtn(isDark), "cursor-pointer")} title="Import JSON file">
        <Upload size={13} />
        Import
        <input className="hidden" type="file" accept=".json,application/json" onChange={handleImport} />
      </label>

      <Sep isDark={isDark} />

      {/* ── UI controls ───────────────────────────────────────────────────── */}
      <Link href="/admin" className={tbtn(isDark)} title="Template editor">
        <LayoutTemplate size={13} />
        Admin
      </Link>

      <button type="button" onClick={onToggleTheme} title={isDark ? "Switch to light UI" : "Switch to dark UI"} className={tbtn(isDark)}>
        {isDark ? <Sun size={13} /> : <Moon size={13} />}
      </button>
    </div>
  );
}
