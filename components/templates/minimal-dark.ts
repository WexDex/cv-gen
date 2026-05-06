import type { TemplateTheme } from "@/components/templates/theme";

export const minimalDarkSkin: TemplateTheme = {
  id: "minimal",
  name: "Minimal Dark",
  rootClassName: "bg-neutral-950 text-neutral-100",
  headerClassName: "border-b border-neutral-700 pb-3",
  sectionTitleClassName: "text-sm font-semibold uppercase tracking-[0.16em] text-neutral-200",
  textMutedClassName: "text-neutral-300",
  chipClassName: "rounded-full border border-neutral-700 px-2 py-1 text-xs",
  linkClassName: "text-neutral-100 hover:underline",
  dividerClassName: "border-neutral-800",
  sidebarClassName: "bg-neutral-900",
  contentClassName: "bg-neutral-950",
};
