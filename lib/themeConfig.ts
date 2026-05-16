/**
 * Structured design-token representation of a TemplateTheme.
 * Visual controls write to ThemeConfig; themeConfigToClasses() converts to className strings.
 */

import type { TemplateTheme } from "@/components/templates/theme";
import type { LayoutMode } from "@/lib/types";

// ─── Token types ─────────────────────────────────────────────────────────────

export type ThemeMode         = "light" | "dark";
export type NeutralScale      = "zinc" | "slate" | "neutral" | "stone" | "gray";
export type AccentColor       = "blue" | "cyan" | "indigo" | "violet" | "green" | "rose" | "amber" | "none";
export type BaseFontFamily    = "sans" | "serif" | "mono";
export type TitleSize         = "sm" | "base" | "lg";
export type TitleWeight       = "medium" | "semibold" | "bold";
export type TitleTracking     = "normal" | "wide" | "wider" | "widest";
export type TitleCase         = "normal" | "uppercase";
export type TitleDecoration   = "none" | "underline" | "overline" | "left-bar" | "filled-bg";
export type HeaderAlign       = "left" | "center";
export type HeaderBorderWeight= "none" | "thin" | "medium" | "thick";
export type HeaderBorderColor = "accent" | "neutral";
export type ChipShape         = "square" | "rounded" | "pill";
export type ChipFill          = "none" | "subtle" | "solid";
export type SidebarBg         = "none" | "subtle" | "distinct";
export type ColumnDivider     = "none" | "solid" | "dashed";
export type ItemSeparator     = "none" | "line" | "dashed" | "dotted";
export type SectionSpacing    = "compact" | "normal" | "spacious";

export interface ThemeConfig {
  // ── Color
  mode: ThemeMode;
  neutralScale: NeutralScale;
  accentColor: AccentColor;

  // ── Typography
  baseFontFamily: BaseFontFamily;
  titleSize: TitleSize;
  titleWeight: TitleWeight;
  titleTracking: TitleTracking;
  titleCase: TitleCase;
  titleDecoration: TitleDecoration;

  // ── Header
  headerAlign: HeaderAlign;
  headerBorderWeight: HeaderBorderWeight;
  headerBorderColor: HeaderBorderColor;

  // ── Layout
  columnLayout: LayoutMode;
  sidebarWidthPct: number;         // 25–40
  columnDivider: ColumnDivider;

  // ── Section / item design
  sectionSpacing: SectionSpacing;
  itemSeparator: ItemSeparator;

  // ── Chips
  chipShape: ChipShape;
  chipFill: ChipFill;
  chipMono: boolean;

  // ── 2-col sidebar
  sidebarBg: SidebarBg;
}

export const DEFAULT_CONFIG: ThemeConfig = {
  mode: "light",
  neutralScale: "zinc",
  accentColor: "none",
  baseFontFamily: "sans",
  titleSize: "sm",
  titleWeight: "bold",
  titleTracking: "wide",
  titleCase: "uppercase",
  titleDecoration: "none",
  headerAlign: "left",
  headerBorderWeight: "medium",
  headerBorderColor: "neutral",
  columnLayout: "1col",
  sidebarWidthPct: 30,
  columnDivider: "solid",
  sectionSpacing: "normal",
  itemSeparator: "line",
  chipShape: "rounded",
  chipFill: "none",
  chipMono: false,
  sidebarBg: "subtle",
};

// ─── Accent color shade tables ─────────────────────────────────────────────

type AccentShades = {
  title: string; link: string; border: string;
  chipBg: string; chipBgSolid: string; chipText: string;
  decorBg: string;  // for filled-bg title decoration
};

const ACCENT: Record<AccentColor, { light: AccentShades; dark: AccentShades }> = {
  blue:   { light: { title:"text-blue-700",   link:"text-blue-700",   border:"border-blue-600",   chipBg:"bg-blue-50",   chipBgSolid:"bg-blue-600",   chipText:"text-blue-700",   decorBg:"bg-blue-50"   },
             dark:  { title:"text-blue-300",   link:"text-blue-300",   border:"border-blue-400",   chipBg:"bg-blue-950",  chipBgSolid:"bg-blue-500",   chipText:"text-blue-200",   decorBg:"bg-blue-950"  } },
  cyan:   { light: { title:"text-cyan-800",   link:"text-cyan-700",   border:"border-cyan-600",   chipBg:"bg-cyan-50",   chipBgSolid:"bg-cyan-600",   chipText:"text-cyan-800",   decorBg:"bg-cyan-50"   },
             dark:  { title:"text-cyan-300",   link:"text-cyan-300",   border:"border-cyan-500",   chipBg:"bg-cyan-950",  chipBgSolid:"bg-cyan-500",   chipText:"text-cyan-200",   decorBg:"bg-cyan-950"  } },
  indigo: { light: { title:"text-indigo-700", link:"text-indigo-700", border:"border-indigo-600", chipBg:"bg-indigo-50", chipBgSolid:"bg-indigo-600", chipText:"text-indigo-700", decorBg:"bg-indigo-50" },
             dark:  { title:"text-indigo-300", link:"text-indigo-300", border:"border-indigo-400", chipBg:"bg-indigo-950",chipBgSolid:"bg-indigo-500", chipText:"text-indigo-200", decorBg:"bg-indigo-950"} },
  violet: { light: { title:"text-violet-700", link:"text-violet-700", border:"border-violet-600", chipBg:"bg-violet-50", chipBgSolid:"bg-violet-600", chipText:"text-violet-700", decorBg:"bg-violet-50" },
             dark:  { title:"text-violet-300", link:"text-violet-300", border:"border-violet-400", chipBg:"bg-violet-950",chipBgSolid:"bg-violet-500", chipText:"text-violet-200", decorBg:"bg-violet-950"} },
  green:  { light: { title:"text-green-800",  link:"text-green-700",  border:"border-green-600",  chipBg:"bg-green-50",  chipBgSolid:"bg-green-600",  chipText:"text-green-800",  decorBg:"bg-green-50"  },
             dark:  { title:"text-green-300",  link:"text-green-300",  border:"border-green-500",  chipBg:"bg-green-950", chipBgSolid:"bg-green-500",  chipText:"text-green-200",  decorBg:"bg-green-950" } },
  rose:   { light: { title:"text-rose-700",   link:"text-rose-700",   border:"border-rose-600",   chipBg:"bg-rose-50",   chipBgSolid:"bg-rose-600",   chipText:"text-rose-700",   decorBg:"bg-rose-50"   },
             dark:  { title:"text-rose-300",   link:"text-rose-300",   border:"border-rose-400",   chipBg:"bg-rose-950",  chipBgSolid:"bg-rose-500",   chipText:"text-rose-200",   decorBg:"bg-rose-950"  } },
  amber:  { light: { title:"text-amber-700",  link:"text-amber-700",  border:"border-amber-600",  chipBg:"bg-amber-50",  chipBgSolid:"bg-amber-500",  chipText:"text-amber-800",  decorBg:"bg-amber-50"  },
             dark:  { title:"text-amber-300",  link:"text-amber-300",  border:"border-amber-400",  chipBg:"bg-amber-950", chipBgSolid:"bg-amber-400",  chipText:"text-amber-200",  decorBg:"bg-amber-950" } },
  none:   { light: { title:"", link:"", border:"", chipBg:"", chipBgSolid:"", chipText:"", decorBg:"" },
             dark:  { title:"", link:"", border:"", chipBg:"", chipBgSolid:"", chipText:"", decorBg:"" } },
};

// ─── Class generators ─────────────────────────────────────────────────────

function n(scale: NeutralScale, shade: number) { return `${scale}-${shade}`; }

export function themeConfigToClasses(config: ThemeConfig): Omit<TemplateTheme, "id" | "name" | "fontFamily" | "fontUrl" | "isCustom"> {
  const { mode, neutralScale: ns, accentColor, baseFontFamily } = config;
  const isLight = mode === "light";
  const accent = ACCENT[accentColor][mode];

  // ── Root
  const rootBg   = isLight ? "bg-white" : `bg-${n(ns,950)}`;
  const rootText  = isLight ? `text-${n(ns,900)}` : `text-${n(ns,100)}`;
  const rootFont  = baseFontFamily === "sans" ? "" : baseFontFamily === "serif" ? "font-serif" : "font-mono";
  const rootClassName = [rootBg, rootText, rootFont].filter(Boolean).join(" ");

  // ── Header
  const headerAlignCls = config.headerAlign === "center" ? "text-center" : "";
  const hBorderW = { none:"", thin:"border-b", medium:"border-b-2", thick:"border-b-4" }[config.headerBorderWeight];
  const hasAccentBorder = accentColor !== "none" && config.headerBorderColor === "accent";
  const hBorderColor = hBorderW
    ? hasAccentBorder ? accent.border : isLight ? `border-${n(ns,700)}` : `border-${n(ns,300)}`
    : "";
  const headerClassName = [hBorderW, hBorderColor, hBorderW ? "pb-4" : "", headerAlignCls].filter(Boolean).join(" ").trim() || "pb-4";

  // ── Section title  (base classes)
  const titleSizeCls    = { sm:"text-sm", base:"text-base", lg:"text-lg" }[config.titleSize];
  const titleWeightCls  = { medium:"font-medium", semibold:"font-semibold", bold:"font-bold" }[config.titleWeight];
  const titleTrackCls   = { normal:"", wide:"tracking-wide", wider:"tracking-wider", widest:"tracking-widest" }[config.titleTracking];
  const titleCaseCls    = config.titleCase === "uppercase" ? "uppercase" : "";
  const titleColorCls   = accentColor !== "none" ? accent.title : isLight ? `text-${n(ns,800)}` : `text-${n(ns,200)}`;

  // ── Title decoration (appended to sectionTitleClassName)
  const accentBorderCls = accentColor !== "none" ? accent.border : isLight ? `border-${n(ns,400)}` : `border-${n(ns,500)}`;
  const decorationCls = (() => {
    switch (config.titleDecoration) {
      case "underline":  return `border-b pb-0.5 ${accentBorderCls}`;
      case "overline":   return `border-t-2 pt-1 mt-1 ${accentBorderCls}`;
      case "left-bar":   return `border-l-4 pl-2 ${accentBorderCls}`;
      case "filled-bg": {
        const bg = accentColor !== "none" ? accent.decorBg : isLight ? `bg-${n(ns,100)}` : `bg-${n(ns,800)}`;
        return `${bg} px-2 py-0.5 rounded-sm`;
      }
      default: return "";
    }
  })();
  const sectionTitleClassName = [titleSizeCls, titleWeightCls, titleCaseCls, titleTrackCls, titleColorCls, decorationCls].filter(Boolean).join(" ");

  // ── Muted text
  const textMutedClassName = isLight ? `text-${n(ns,500)}` : `text-${n(ns,400)}`;

  // ── Column divider (used for column separator border + fallback for items)
  const dividerColor = isLight ? `border-${n(ns,200)}` : `border-${n(ns,700)}`;
  const dividerStyle = config.columnDivider === "dashed" ? "border-dashed" : "";
  const dividerClassName = [dividerColor, dividerStyle].filter(Boolean).join(" ");

  // ── Item separator
  const itemSeparatorClassName = (() => {
    if (config.itemSeparator === "none") return "";
    const baseColor = isLight ? `border-${n(ns,200)}` : `border-${n(ns,700)}`;
    const style = config.itemSeparator === "dashed" ? "border-dashed"
                : config.itemSeparator === "dotted" ? "border-dotted"
                : "";
    return ["border-b last:border-none", baseColor, style].filter(Boolean).join(" ");
  })();

  // ── Section spacing
  const sectionGapClassName = { compact:"mb-3", normal:"mb-5", spacious:"mb-7" }[config.sectionSpacing];

  // ── Chips
  const chipShapeCls = { square:"", rounded:"rounded", pill:"rounded-full" }[config.chipShape];
  const chipFillCls  = (() => {
    if (config.chipFill === "none") {
      const bc = isLight ? `border-${n(ns,300)}` : `border-${n(ns,600)}`;
      const tc = isLight ? `text-${n(ns,800)}` : `text-${n(ns,200)}`;
      return `border ${bc} ${tc}`;
    }
    if (config.chipFill === "subtle") {
      const bg = accentColor !== "none" ? accent.chipBg : isLight ? `bg-${n(ns,100)}` : `bg-${n(ns,900)}`;
      const tc = accentColor !== "none" ? accent.chipText : isLight ? `text-${n(ns,800)}` : `text-${n(ns,200)}`;
      return `${bg} ${tc}`;
    }
    const bg = accentColor !== "none" ? accent.chipBgSolid : isLight ? `bg-${n(ns,800)}` : `bg-${n(ns,200)}`;
    const tc = accentColor !== "none" ? "text-white" : isLight ? "text-white" : `text-${n(ns,900)}`;
    return `${bg} ${tc}`;
  })();
  const chipClassName = [chipShapeCls, chipFillCls, "px-2 py-0.5 text-xs", config.chipMono ? "font-mono" : ""].filter(Boolean).join(" ");

  // ── Links
  const linkColor = accentColor !== "none" ? accent.link : isLight ? `text-${n(ns,800)}` : `text-${n(ns,200)}`;
  const linkClassName = `${linkColor} underline-offset-2 hover:underline`;

  // ── Sidebar / content columns
  const { sidebarClassName, contentClassName } = (() => {
    if (config.sidebarBg === "none") return { sidebarClassName: undefined, contentClassName: undefined };
    if (config.sidebarBg === "subtle") return {
      sidebarClassName: isLight ? `bg-${n(ns,50)}` : `bg-${n(ns,900)}`,
      contentClassName: isLight ? "bg-white" : `bg-${n(ns,950)}`,
    };
    return {
      sidebarClassName: isLight ? `bg-${n(ns,100)}` : `bg-${n(ns,800)}`,
      contentClassName: isLight ? "bg-white" : `bg-${n(ns,950)}`,
    };
  })();

  return {
    rootClassName,
    headerClassName,
    sectionTitleClassName,
    textMutedClassName,
    chipClassName,
    linkClassName,
    dividerClassName,
    sidebarClassName,
    contentClassName,
    sectionGapClassName,
    itemSeparatorClassName,
    defaultColumns: config.columnLayout,
    defaultSidebarWidthPct: config.sidebarWidthPct,
  };
}

// ─── Heuristic parser: TemplateTheme → ThemeConfig ────────────────────────

export function classesToThemeConfig(theme: TemplateTheme): ThemeConfig {
  const root   = theme.rootClassName ?? "";
  const header = theme.headerClassName ?? "";
  const title  = theme.sectionTitleClassName ?? "";
  const chip   = theme.chipClassName ?? "";
  const sep    = theme.itemSeparatorClassName ?? "";

  const mode: ThemeMode = root.includes("bg-white") ? "light" : "dark";

  const neutralScale: NeutralScale =
    (["slate","neutral","stone","gray","zinc"] as NeutralScale[])
      .find((s) => (root + " " + (theme.dividerClassName ?? "")).includes(s)) ?? "zinc";

  const accentColor: AccentColor =
    (["blue","cyan","indigo","violet","green","rose","amber"] as AccentColor[])
      .find((a) => (title + " " + (theme.linkClassName ?? "")).includes(a)) ?? "none";

  const baseFontFamily: BaseFontFamily =
    root.includes("font-serif") ? "serif" : root.includes("font-mono") ? "mono" : "sans";

  const titleSize: TitleSize =
    title.includes("text-base") ? "base" : title.includes("text-lg") ? "lg" : "sm";
  const titleWeight: TitleWeight =
    title.includes("font-bold") ? "bold" : title.includes("font-semibold") ? "semibold" : "medium";
  const titleCase: TitleCase = title.includes("uppercase") ? "uppercase" : "normal";
  const titleTracking: TitleTracking =
    title.includes("tracking-widest") ? "widest"
    : title.includes("tracking-wider") || title.includes("tracking-[0.1") ? "wider"
    : title.includes("tracking-wide") ? "wide" : "normal";

  const titleDecoration: TitleDecoration =
    title.includes("border-l") ? "left-bar"
    : title.includes("border-t") ? "overline"
    : title.includes("rounded-sm") || title.includes("bg-") ? "filled-bg"
    : title.includes("border-b") ? "underline"
    : "none";

  const headerAlign: HeaderAlign    = header.includes("text-center") ? "center" : "left";
  const headerBorderWeight: HeaderBorderWeight =
    header.includes("border-b-4") ? "thick"
    : header.includes("border-b-2") ? "medium"
    : header.includes("border-b") ? "thin" : "none";
  const headerBorderColor: HeaderBorderColor =
    accentColor !== "none" && ACCENT[accentColor][mode].border &&
    header.includes(ACCENT[accentColor][mode].border.replace("border-","")) ? "accent" : "neutral";

  const columnLayout: LayoutMode   = theme.defaultColumns ?? "1col";
  const sidebarWidthPct            = theme.defaultSidebarWidthPct ?? 30;
  const columnDivider: ColumnDivider =
    (theme.dividerClassName ?? "").includes("dashed") ? "dashed" : "solid";

  const sectionSpacing: SectionSpacing =
    (theme.sectionGapClassName ?? "").includes("mb-3") ? "compact"
    : (theme.sectionGapClassName ?? "").includes("mb-7") ? "spacious" : "normal";

  const itemSeparator: ItemSeparator =
    theme.itemSeparatorClassName === "" ? "none"
    : sep.includes("dotted") ? "dotted"
    : sep.includes("dashed") ? "dashed"
    : "line";

  const chipShape: ChipShape =
    chip.includes("rounded-full") ? "pill" : chip.includes("rounded") ? "rounded" : "square";
  const chipFill: ChipFill =
    chip.includes("bg-") ? (chip.includes("-50") || chip.includes("-950") || chip.includes("-100") ? "subtle" : "solid") : "none";
  const chipMono = chip.includes("font-mono");

  const side = theme.sidebarClassName ?? "";
  const sidebarBg: SidebarBg =
    !side ? "none" : side.includes("-100") || side.includes("-800") ? "distinct" : "subtle";

  return {
    mode, neutralScale, accentColor, baseFontFamily,
    titleSize, titleWeight, titleTracking, titleCase, titleDecoration,
    headerAlign, headerBorderWeight, headerBorderColor,
    columnLayout, sidebarWidthPct, columnDivider,
    sectionSpacing, itemSeparator,
    chipShape, chipFill, chipMono,
    sidebarBg,
  };
}
