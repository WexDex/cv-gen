"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronRight, Copy, Plus, Trash2 } from "lucide-react";

import { ResumePreview } from "@/components/preview/ResumePreview";
import { templateList, resolveTemplateTheme } from "@/components/templates";
import type { TemplateTheme } from "@/components/templates/theme";
import { useTemplateStore, FONT_PRESETS } from "@/lib/templateStore";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  themeConfigToClasses,
  classesToThemeConfig,
  DEFAULT_CONFIG,
} from "@/lib/themeConfig";
import type {
  ThemeConfig,
  ThemeMode, NeutralScale, AccentColor, BaseFontFamily,
  TitleSize, TitleWeight, TitleTracking, TitleCase, TitleDecoration,
  HeaderAlign, HeaderBorderWeight, HeaderBorderColor,
  ChipShape, ChipFill, SidebarBg,
  ColumnDivider, ItemSeparator, SectionSpacing,
} from "@/lib/themeConfig";
import type { LayoutMode, Resume, TemplateId, TemplateVariant } from "@/lib/types";

function createId() {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Font loading ─────────────────────────────────────────────────────────────

function useFontLoader(fontUrl?: string, id?: string) {
  useEffect(() => {
    if (!fontUrl || !id) return;
    const linkId = `cv-font-${id}`;
    if (document.getElementById(linkId)) return;
    const link = document.createElement("link");
    link.id = linkId; link.rel = "stylesheet"; link.href = fontUrl;
    document.head.appendChild(link);
  }, [fontUrl, id]);
}

// ─── Admin preview ────────────────────────────────────────────────────────────

function AdminPreview({ resume, theme, variant }: { resume: Resume; theme: TemplateTheme; variant: TemplateVariant }) {
  useFontLoader(theme.fontUrl, `admin-${theme.id}`);
  const patchedResume: Resume = { ...resume, templateId: theme.id, templateVariant: variant };
  return (
    <div className="bg-zinc-300 p-6">
      <ResumePreview resume={patchedResume} themeOverride={theme} uiTheme="light" />
    </div>
  );
}

// ─── Miniature page canvas ────────────────────────────────────────────────────
// Renders a scaled-down A4 page that reflects the layout config visually.

const ACCENT_HEX: Record<AccentColor, string> = {
  blue:"#3b82f6", cyan:"#06b6d4", indigo:"#6366f1",
  violet:"#8b5cf6", green:"#22c55e", rose:"#f43f5e", amber:"#f59e0b", none:"",
};

function PageCanvas({ config }: { config: ThemeConfig }) {
  const isLight  = config.mode === "light";
  const pageBg   = isLight ? "#fff" : "#09090b";
  const text     = isLight ? "#18181b" : "#f4f4f5";
  const textMuted= isLight ? "#71717a" : "#a1a1aa";
  const divBg    = isLight ? "#f4f4f5" : "#27272a";
  const sideBgMap: Record<SidebarBg, string> = {
    none:     pageBg,
    subtle:   isLight ? "#fafafa" : "#18181b",
    distinct: isLight ? "#f0f0f0" : "#3f3f46",
  };
  const accentHex = config.accentColor !== "none" ? ACCENT_HEX[config.accentColor] : text;
  const is2col    = config.columnLayout !== "1col";
  const sidePct   = config.sidebarWidthPct;
  const sideBg    = sideBgMap[config.sidebarBg];
  const dividerStyle: React.CSSProperties = config.columnDivider === "dashed"
    ? { borderRight: `1px dashed ${isLight ? "#d4d4d8" : "#3f3f46"}` }
    : config.columnDivider === "solid"
      ? { borderRight: `1px solid ${isLight ? "#d4d4d8" : "#3f3f46"}` }
      : {};

  // Header border
  const hBorderPx = { none:0, thin:1, medium:2, thick:4 }[config.headerBorderWeight];
  const hBorderColor = hBorderPx
    ? config.accentColor !== "none" && config.headerBorderColor === "accent"
      ? accentHex
      : isLight ? "#52525b" : "#a1a1aa"
    : "transparent";

  // Section title decoration indicator
  const titleDecoLines: Record<TitleDecoration, React.CSSProperties> = {
    none:      {},
    underline: { borderBottom: `1px solid ${accentHex}`, paddingBottom: 1 },
    overline:  { borderTop: `2px solid ${accentHex}`, paddingTop: 1 },
    "left-bar":{ borderLeft: `3px solid ${accentHex}`, paddingLeft: 3 },
    "filled-bg":{ background: config.accentColor !== "none" ? accentHex + "22" : divBg, borderRadius: 2, padding: "1px 3px" },
  };

  // Item separator style
  const sepStyle: React.CSSProperties = config.itemSeparator === "none" ? {} : {
    borderBottom: `1px ${config.itemSeparator === "dashed" ? "dashed" : config.itemSeparator === "dotted" ? "dotted" : "solid"} ${isLight ? "#d4d4d8" : "#3f3f46"}`,
  };

  const SECTION_BLOCK_H = 26; // px in canvas space

  function SectionBlock({ style }: { style?: React.CSSProperties }) {
    return (
      <div style={{ marginBottom: { compact:4, normal:7, spacious:11 }[config.sectionSpacing], ...style }}>
        {/* Section title */}
        <div style={{ display:"flex", alignItems:"center", marginBottom:3 }}>
          <div style={{
            fontSize:5, fontWeight:700,
            color: config.accentColor !== "none" ? accentHex : text,
            letterSpacing: config.titleTracking === "widest" ? "0.1em" : config.titleTracking === "wider" ? "0.07em" : config.titleTracking === "wide" ? "0.05em" : 0,
            textTransform: config.titleCase === "uppercase" ? "uppercase" : "none",
            ...titleDecoLines[config.titleDecoration],
          }}>
            SECTION
          </div>
        </div>
        {/* Item rows */}
        {[0,1].map((i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", marginBottom:2, ...( i < 1 ? sepStyle : {} ) }}>
            <div style={{ height:3, background: text, opacity:0.25, borderRadius:1, marginBottom:1, width:"85%" }} />
            <div style={{ height:2, background: textMuted, opacity:0.3, borderRadius:1, width:"60%" }} />
          </div>
        ))}
      </div>
    );
  }

  function Column({ bg, borderStyle, width, sections = 3 }: {
    bg: string; borderStyle?: React.CSSProperties; width: string; sections?: number;
  }) {
    return (
      <div style={{ background: bg, width, flexShrink:0, padding:"6px 5px", boxSizing:"border-box", ...borderStyle }}>
        {Array.from({ length: sections }).map((_, i) => <SectionBlock key={i} />)}
      </div>
    );
  }

  return (
    <div
      style={{
        width: 168, height: 238,
        background: pageBg,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header zone */}
      <div style={{
        padding: "8px 8px 6px",
        borderBottom: `${hBorderPx}px solid ${hBorderColor}`,
        textAlign: config.headerAlign === "center" ? "center" : "left",
        flexShrink: 0,
      }}>
        <div style={{ height:5, background:accentHex || text, borderRadius:1, width:config.headerAlign === "center" ? "50%" : "60%", marginLeft: config.headerAlign === "center" ? "auto" : 0, marginRight: config.headerAlign === "center" ? "auto" : 0, marginBottom:3, opacity:0.8 }} />
        <div style={{ height:3, background:textMuted, borderRadius:1, width:"70%", marginLeft: config.headerAlign === "center" ? "auto" : 0, marginRight: config.headerAlign === "center" ? "auto" : 0, opacity:0.5 }} />
      </div>

      {/* Content area */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {is2col ? (
          config.columnLayout === "2col-left-sidebar" ? (
            <>
              <Column bg={sideBg} borderStyle={dividerStyle} width={`${sidePct}%`} sections={4} />
              <Column bg={pageBg} width={`${100 - sidePct}%`} sections={3} />
            </>
          ) : (
            <>
              <Column bg={pageBg} borderStyle={dividerStyle} width={`${100 - sidePct}%`} sections={3} />
              <Column bg={sideBg} width={`${sidePct}%`} sections={4} />
            </>
          )
        ) : (
          <Column bg={pageBg} width="100%" sections={4} />
        )}
      </div>
    </div>
  );
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded border border-zinc-800 bg-zinc-900/50 p-3">
      <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-500">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, children, span }: { label: string; children: React.ReactNode; span?: boolean }) {
  return span ? (
    <div className="space-y-1">
      <span className="text-[10px] text-zinc-500">{label}</span>
      {children}
    </div>
  ) : (
    <div className="grid grid-cols-[72px_1fr] items-start gap-2">
      <span className="pt-0.5 text-[10px] leading-tight text-zinc-500">{label}</span>
      {children}
    </div>
  );
}

interface ChipGroupProps<T extends string> {
  options: { value: T; label: string; title?: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}
function ChipGroup<T extends string>({ options, value, onChange, disabled }: ChipGroupProps<T>) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((o) => (
        <button key={o.value} type="button" disabled={disabled} title={o.title}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded border px-1.5 py-0.5 text-[10px] transition-colors disabled:opacity-40",
            value === o.value
              ? "border-cyan-500 bg-cyan-700 text-white"
              : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100",
          )}
        >{o.label}</button>
      ))}
    </div>
  );
}

function Tog({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] transition-colors disabled:opacity-40",
        checked ? "border-cyan-600 bg-cyan-900/50 text-cyan-300" : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500",
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", checked ? "bg-cyan-400" : "bg-zinc-600")} />
      {label}
    </button>
  );
}

const ACCENT_OPTIONS: { value: AccentColor; label: string; hex: string }[] = [
  { value:"none",   label:"—",    hex:"#71717a" },
  { value:"blue",   label:"Blue", hex:"#3b82f6" },
  { value:"cyan",   label:"Cyan", hex:"#06b6d4" },
  { value:"indigo", label:"Ind",  hex:"#6366f1" },
  { value:"violet", label:"Vio",  hex:"#8b5cf6" },
  { value:"green",  label:"Grn",  hex:"#22c55e" },
  { value:"rose",   label:"Rose", hex:"#f43f5e" },
  { value:"amber",  label:"Amb",  hex:"#f59e0b" },
];

function AccentPicker({ value, onChange, disabled }: { value: AccentColor; onChange: (v: AccentColor) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ACCENT_OPTIONS.map((c) => (
        <button key={c.value} type="button" disabled={disabled} title={c.label}
          onClick={() => onChange(c.value)}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all disabled:opacity-40",
            value === c.value ? "border-white scale-110" : "border-transparent hover:border-zinc-400",
          )}
        >
          <span className="h-3.5 w-3.5 rounded-full" style={{ background: c.hex }} />
        </button>
      ))}
    </div>
  );
}

const selectCls = "w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 [color-scheme:dark]";
const inputCls  = "w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono";

// Sidebar width preset buttons
const WIDTH_OPTIONS = [25, 28, 30, 32, 35, 38, 40];

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminPageClient() {
  const customTemplates  = useTemplateStore((s) => s.customTemplates);
  const saveCustomTemplate   = useTemplateStore((s) => s.saveCustomTemplate);
  const deleteCustomTemplate = useTemplateStore((s) => s.deleteCustomTemplate);
  const activeResume     = useResumeStore((s) => s.getActiveResume());

  const builtInThemes: TemplateTheme[] = templateList.map((t) => resolveTemplateTheme(t.id, "light", []));
  const allTemplates: TemplateTheme[]  = [...builtInThemes, ...customTemplates];

  const [selectedId, setSelectedId]   = useState<TemplateId>(allTemplates[0]?.id ?? "classic");
  const [draft, setDraft]             = useState<TemplateTheme | null>(null);
  const [config, setConfig]           = useState<ThemeConfig>(DEFAULT_CONFIG);
  const [previewVariant, setPreviewVariant] = useState<TemplateVariant>("light");
  const [saved, setSaved]             = useState(false);
  const [advOpen, setAdvOpen]         = useState(false);

  const isCustom = !!(draft?.isCustom);

  useEffect(() => {
    const t = allTemplates.find((x) => x.id === selectedId) ?? allTemplates[0];
    if (!t) return;
    setDraft({ ...t });
    setConfig(classesToThemeConfig(t));
    setSaved(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // ── Patch helpers ──────────────────────────────────────────────────────────

  const patchConfig = (partial: Partial<ThemeConfig>) => {
    if (!isCustom) return;
    const next = { ...config, ...partial };
    setConfig(next);
    const classes = themeConfigToClasses(next);
    setDraft((prev) => prev ? { ...prev, ...classes } : prev);
    setSaved(false);
  };

  const patchRaw = (partial: Partial<TemplateTheme>) => {
    if (!isCustom) return;
    setDraft((prev) => prev ? { ...prev, ...partial } : prev);
    setSaved(false);
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleNew = () => {
    const base = resolveTemplateTheme("classic", "light", []);
    const id   = createId();
    const t: TemplateTheme = { ...base, id, name: "New Template", isCustom: true };
    saveCustomTemplate(t);
    setSelectedId(id);
  };

  const handleDuplicate = () => {
    if (!draft) return;
    const id   = createId();
    const copy: TemplateTheme = { ...draft, id, name: `${draft.name} (copy)`, isCustom: true };
    saveCustomTemplate(copy);
    setSelectedId(id);
  };

  const handleDelete = () => {
    if (!draft || !isCustom) return;
    if (!window.confirm(`Delete "${draft.name}"?`)) return;
    deleteCustomTemplate(draft.id);
    const rest = allTemplates.filter((t) => t.id !== draft.id);
    setSelectedId(rest[0]?.id ?? "classic");
  };

  const handleSave = () => {
    if (!draft || !isCustom) return;
    saveCustomTemplate(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectedFontPreset =
    FONT_PRESETS.find((p) => p.fontFamily === draft?.fontFamily && p.fontUrl === draft?.fontUrl) ?? FONT_PRESETS[0];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">

      {/* Header bar */}
      <header className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <Link href="/builder" className="inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-700">
          <ArrowLeft size={12} /> Builder
        </Link>
        <h1 className="text-sm font-semibold">Template Editor</h1>
        <span className="ml-auto text-[10px] text-zinc-600">Duplicate a built-in to start. Changes appear in the preview instantly.</span>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">

        {/* ── Left: template list ───────────────────────────────────────────── */}
        <aside className="flex w-40 shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500">Templates</span>
            <button type="button" onClick={handleNew}
              className="inline-flex items-center gap-0.5 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-300 hover:bg-zinc-700">
              <Plus size={9} /> New
            </button>
          </div>
          <div className="flex-1 overflow-auto text-xs">
            <p className="px-3 pt-2 pb-0.5 text-[8px] uppercase tracking-widest text-zinc-600">Built-in</p>
            {builtInThemes.map((t) => (
              <button key={t.id} type="button" onClick={() => setSelectedId(t.id)}
                className={cn("flex w-full px-3 py-2 text-left", selectedId === t.id ? "bg-cyan-900/40 text-cyan-300 font-medium" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200")}>
                {t.name}
              </button>
            ))}
            {customTemplates.length > 0 && (
              <>
                <p className="px-3 pt-3 pb-0.5 text-[8px] uppercase tracking-widest text-zinc-600">Custom</p>
                {customTemplates.map((t) => (
                  <button key={t.id} type="button" onClick={() => setSelectedId(t.id)}
                    className={cn("flex w-full truncate px-3 py-2 text-left", selectedId === t.id ? "bg-cyan-900/40 text-cyan-300 font-medium" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200")}>
                    {t.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </aside>

        {/* ── Middle: editor ────────────────────────────────────────────────── */}
        <div className="flex w-[340px] shrink-0 flex-col overflow-hidden border-r border-zinc-800">

          {/* Editor toolbar */}
          <div className="flex shrink-0 items-center gap-1 border-b border-zinc-800 bg-zinc-900 px-3 py-2">
            <button type="button" onClick={handleDuplicate}
              className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 hover:bg-zinc-700">
              <Copy size={10} /> Duplicate
            </button>
            {isCustom && (
              <button type="button" onClick={handleDelete}
                className="inline-flex items-center gap-1 rounded border border-red-900 bg-red-950/60 px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-900/60">
                <Trash2 size={10} />
              </button>
            )}
            {isCustom ? (
              <button type="button" onClick={handleSave}
                className={cn("ml-auto rounded border px-3 py-0.5 text-[10px] font-semibold transition-colors",
                  saved ? "border-green-600 bg-green-700 text-white" : "border-cyan-600 bg-cyan-700 text-white hover:bg-cyan-600")}>
                {saved ? "Saved ✓" : "Save"}
              </button>
            ) : (
              <span className="ml-auto text-[10px] text-amber-500">Read-only — Duplicate to edit</span>
            )}
          </div>

          {draft ? (
            <div className="flex-1 space-y-3 overflow-auto p-3">

              {/* Name */}
              <input className={inputCls} value={draft.name} disabled={!isCustom}
                onChange={(e) => patchRaw({ name: e.target.value })} placeholder="Template name" />

              {/* ── PAGE LAYOUT ────────────────────────────────────────────── */}
              <Panel title="Page Layout">

                {/* Visual canvas */}
                <div className="flex items-start gap-3">
                  <PageCanvas config={config} />

                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    {/* Column layout */}
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-widest text-zinc-500">Columns</span>
                      <div className="flex flex-col gap-1">
                        {([
                          { value:"1col",             label:"Single column" },
                          { value:"2col-left-sidebar",  label:"Sidebar — Content" },
                          { value:"2col-right-sidebar", label:"Content — Sidebar" },
                        ] as { value: LayoutMode; label: string }[]).map((opt) => (
                          <button key={opt.value} type="button" disabled={!isCustom}
                            onClick={() => patchConfig({ columnLayout: opt.value })}
                            className={cn(
                              "rounded border px-2 py-1 text-left text-[10px] transition-colors disabled:opacity-40",
                              config.columnLayout === opt.value
                                ? "border-cyan-500 bg-cyan-900/40 text-cyan-200"
                                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
                            )}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sidebar width — only when 2col */}
                    {config.columnLayout !== "1col" && (
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-widest text-zinc-500">Sidebar width</span>
                        <div className="flex flex-wrap gap-1">
                          {WIDTH_OPTIONS.map((w) => (
                            <button key={w} type="button" disabled={!isCustom}
                              onClick={() => patchConfig({ sidebarWidthPct: w })}
                              className={cn(
                                "rounded border px-1.5 py-0.5 text-[9px] disabled:opacity-40",
                                config.sidebarWidthPct === w
                                  ? "border-cyan-500 bg-cyan-700 text-white"
                                  : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500",
                              )}>
                              {w}%
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column divider */}
                {config.columnLayout !== "1col" && (
                  <Row label="Col divider">
                    <ChipGroup<ColumnDivider>
                      options={[{ value:"solid", label:"Solid" }, { value:"dashed", label:"Dashed" }, { value:"none", label:"None" }]}
                      value={config.columnDivider} onChange={(v) => patchConfig({ columnDivider: v })} disabled={!isCustom} />
                  </Row>
                )}

                {/* Sidebar bg */}
                {config.columnLayout !== "1col" && (
                  <Row label="Sidebar bg">
                    <ChipGroup<SidebarBg>
                      options={[{ value:"none", label:"Same" }, { value:"subtle", label:"Subtle" }, { value:"distinct", label:"Distinct" }]}
                      value={config.sidebarBg} onChange={(v) => patchConfig({ sidebarBg: v })} disabled={!isCustom} />
                  </Row>
                )}
              </Panel>

              {/* ── SECTION DESIGN ─────────────────────────────────────────── */}
              <Panel title="Section Design">
                <Row label="Title style">
                  <ChipGroup<TitleDecoration>
                    options={[
                      { value:"none",      label:"Plain" },
                      { value:"underline", label:"Underline" },
                      { value:"overline",  label:"Overline" },
                      { value:"left-bar",  label:"Left bar" },
                      { value:"filled-bg", label:"Filled bg" },
                    ]}
                    value={config.titleDecoration} onChange={(v) => patchConfig({ titleDecoration: v })} disabled={!isCustom} />
                </Row>
                <Row label="Item sep">
                  <ChipGroup<ItemSeparator>
                    options={[
                      { value:"none",   label:"None" },
                      { value:"line",   label:"Line" },
                      { value:"dashed", label:"Dashed" },
                      { value:"dotted", label:"Dotted" },
                    ]}
                    value={config.itemSeparator} onChange={(v) => patchConfig({ itemSeparator: v })} disabled={!isCustom} />
                </Row>
                <Row label="Spacing">
                  <ChipGroup<SectionSpacing>
                    options={[{ value:"compact", label:"Tight" }, { value:"normal", label:"Normal" }, { value:"spacious", label:"Open" }]}
                    value={config.sectionSpacing} onChange={(v) => patchConfig({ sectionSpacing: v })} disabled={!isCustom} />
                </Row>
              </Panel>

              {/* ── HEADER ─────────────────────────────────────────────────── */}
              <Panel title="Header">
                <Row label="Align">
                  <ChipGroup<HeaderAlign>
                    options={[{ value:"left", label:"Left" }, { value:"center", label:"Center" }]}
                    value={config.headerAlign} onChange={(v) => patchConfig({ headerAlign: v })} disabled={!isCustom} />
                </Row>
                <Row label="Border">
                  <ChipGroup<HeaderBorderWeight>
                    options={[{ value:"none", label:"None" }, { value:"thin", label:"1px" }, { value:"medium", label:"2px" }, { value:"thick", label:"4px" }]}
                    value={config.headerBorderWeight} onChange={(v) => patchConfig({ headerBorderWeight: v })} disabled={!isCustom} />
                </Row>
                {config.headerBorderWeight !== "none" && config.accentColor !== "none" && (
                  <Row label="Border color">
                    <ChipGroup<HeaderBorderColor>
                      options={[{ value:"neutral", label:"Neutral" }, { value:"accent", label:"Accent" }]}
                      value={config.headerBorderColor} onChange={(v) => patchConfig({ headerBorderColor: v })} disabled={!isCustom} />
                  </Row>
                )}
              </Panel>

              {/* ── COLOR & ACCENT ──────────────────────────────────────────── */}
              <Panel title="Color & Accent">
                <Row label="Mode">
                  <ChipGroup<ThemeMode>
                    options={[{ value:"light", label:"Light" }, { value:"dark", label:"Dark" }]}
                    value={config.mode} onChange={(v) => patchConfig({ mode: v })} disabled={!isCustom} />
                </Row>
                <Row label="Neutrals">
                  <ChipGroup<NeutralScale>
                    options={[
                      { value:"zinc",    label:"Zinc" },
                      { value:"slate",   label:"Slate" },
                      { value:"neutral", label:"Neutral" },
                      { value:"stone",   label:"Stone" },
                      { value:"gray",    label:"Gray" },
                    ]}
                    value={config.neutralScale} onChange={(v) => patchConfig({ neutralScale: v })} disabled={!isCustom} />
                </Row>
                <Row label="Accent">
                  <AccentPicker value={config.accentColor} onChange={(v) => patchConfig({ accentColor: v })} disabled={!isCustom} />
                </Row>
              </Panel>

              {/* ── TYPOGRAPHY ─────────────────────────────────────────────── */}
              <Panel title="Typography">
                <Row label="Font">
                  <select className={selectCls} disabled={!isCustom}
                    value={selectedFontPreset.name}
                    onChange={(e) => {
                      const p = FONT_PRESETS.find((f) => f.name === e.target.value);
                      if (p) patchRaw({ fontFamily: p.fontFamily, fontUrl: p.fontUrl });
                    }}>
                    {FONT_PRESETS.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </Row>
                <Row label="Base style">
                  <ChipGroup<BaseFontFamily>
                    options={[{ value:"sans", label:"Sans" }, { value:"serif", label:"Serif" }, { value:"mono", label:"Mono" }]}
                    value={config.baseFontFamily} onChange={(v) => patchConfig({ baseFontFamily: v })} disabled={!isCustom} />
                </Row>
                <Row label="Title size">
                  <ChipGroup<TitleSize>
                    options={[{ value:"sm", label:"S" }, { value:"base", label:"M" }, { value:"lg", label:"L" }]}
                    value={config.titleSize} onChange={(v) => patchConfig({ titleSize: v })} disabled={!isCustom} />
                </Row>
                <Row label="Weight">
                  <ChipGroup<TitleWeight>
                    options={[{ value:"medium", label:"Medium" }, { value:"semibold", label:"Semibold" }, { value:"bold", label:"Bold" }]}
                    value={config.titleWeight} onChange={(v) => patchConfig({ titleWeight: v })} disabled={!isCustom} />
                </Row>
                <Row label="Tracking">
                  <ChipGroup<TitleTracking>
                    options={[{ value:"normal", label:"—" }, { value:"wide", label:"Wide" }, { value:"wider", label:"Wider" }, { value:"widest", label:"Widest" }]}
                    value={config.titleTracking} onChange={(v) => patchConfig({ titleTracking: v })} disabled={!isCustom} />
                </Row>
                <Row label="Case">
                  <ChipGroup<TitleCase>
                    options={[{ value:"normal", label:"Normal" }, { value:"uppercase", label:"UPPER" }]}
                    value={config.titleCase} onChange={(v) => patchConfig({ titleCase: v })} disabled={!isCustom} />
                </Row>
              </Panel>

              {/* ── CHIPS ──────────────────────────────────────────────────── */}
              <Panel title="Chips & Badges">
                <Row label="Shape">
                  <ChipGroup<ChipShape>
                    options={[{ value:"square", label:"Square" }, { value:"rounded", label:"Rounded" }, { value:"pill", label:"Pill" }]}
                    value={config.chipShape} onChange={(v) => patchConfig({ chipShape: v })} disabled={!isCustom} />
                </Row>
                <Row label="Fill">
                  <ChipGroup<ChipFill>
                    options={[{ value:"none", label:"Border" }, { value:"subtle", label:"Subtle" }, { value:"solid", label:"Solid" }]}
                    value={config.chipFill} onChange={(v) => patchConfig({ chipFill: v })} disabled={!isCustom} />
                </Row>
                <Row label="Font">
                  <Tog label="Monospace" checked={config.chipMono} onChange={(v) => patchConfig({ chipMono: v })} disabled={!isCustom} />
                </Row>
              </Panel>

              {/* ── ADVANCED (raw class editor) ─────────────────────────────── */}
              <div className="rounded border border-zinc-800">
                <button type="button" onClick={() => setAdvOpen((o) => !o)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[9px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400">
                  {advOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  Advanced — raw Tailwind classes
                </button>
                {advOpen && (
                  <div className="border-t border-zinc-800 px-3 pb-3 pt-2 space-y-2">
                    {([
                      ["rootClassName",         "Root",          "bg + text-color on outer wrapper"],
                      ["headerClassName",       "Header",        "personal info zone"],
                      ["sectionTitleClassName", "Section title", "every h3"],
                      ["textMutedClassName",    "Muted text",    "dates, subtitles"],
                      ["chipClassName",         "Chip",          "skill badges"],
                      ["linkClassName",         "Link",          "hyperlinks"],
                      ["dividerClassName",      "Col divider",   "column border color"],
                      ["itemSeparatorClassName","Item sep",      "full class incl. border-b last:border-none (empty = none)"],
                      ["sectionGapClassName",   "Section gap",   "mb-* spacing between sections"],
                      ["sidebarClassName",      "Sidebar",       "2-col left column bg"],
                      ["contentClassName",      "Content",       "2-col right column bg"],
                    ] as [keyof TemplateTheme, string, string][]).map(([key, label, hint]) => (
                      <div key={key} className="space-y-0.5">
                        <label className="block text-[9px] text-zinc-600">
                          <span className="font-mono text-zinc-400">{label}</span> — {hint}
                        </label>
                        <textarea rows={2}
                          className="w-full resize-y rounded border border-zinc-700 bg-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          value={(draft[key] as string | undefined) ?? ""}
                          disabled={!isCustom}
                          onChange={(e) => patchRaw({ [key]: e.target.value || undefined } as Partial<TemplateTheme>)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-zinc-600">Select a template.</div>
          )}
        </div>

        {/* ── Right: live preview ───────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-3 py-2">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500">Preview</span>
            <div className="flex gap-1">
              {(["light","dark"] as TemplateVariant[]).map((v) => (
                <button key={v} type="button" onClick={() => setPreviewVariant(v)}
                  className={cn("rounded border px-2 py-0.5 text-[10px]",
                    previewVariant === v ? "border-cyan-600 bg-cyan-700 text-white" : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700")}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {activeResume && draft ? (
              <AdminPreview resume={activeResume} theme={draft} variant={previewVariant} />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-300 text-sm text-zinc-500">
                {!activeResume ? "No resume loaded — open the builder first." : "Select a template."}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
