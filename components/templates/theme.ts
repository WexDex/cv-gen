import type { TemplateId } from "@/lib/types";

export interface TemplateTheme {
  id: TemplateId;
  name: string;
  rootClassName: string;
  headerClassName: string;
  sectionTitleClassName: string;
  textMutedClassName: string;
  chipClassName: string;
  linkClassName: string;
  dividerClassName: string;
  sidebarClassName?: string;
  contentClassName?: string;
  /** CSS font-family value to apply to the entire resume, e.g. "Inter" */
  fontFamily?: string;
  /** Full URL to load the font (e.g. a Google Fonts stylesheet URL) */
  fontUrl?: string;
  /** True for templates stored in localStorage rather than bundled code */
  isCustom?: boolean;

  // ── Layout defaults (applied when user selects this template) ──────────────
  /** Default column layout for this template */
  defaultColumns?: import("@/lib/types").LayoutMode;
  /** Default sidebar width percentage (25–40) */
  defaultSidebarWidthPct?: number;

  // ── Section spacing ────────────────────────────────────────────────────────
  /** Tailwind class controlling the bottom margin between sections, e.g. "mb-4" */
  sectionGapClassName?: string;

  // ── Item separators (experience, education, projects entries) ──────────────
  /**
   * Full class string for item separators within sections.
   * undefined = legacy fallback (border-b last:border-none + dividerClassName).
   * "" = no separator.
   * Any other string = used verbatim (should include border-b last:border-none when needed).
   */
  itemSeparatorClassName?: string;
}
