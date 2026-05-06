import type { TemplateTheme } from "@/components/templates/theme";

export const minimalSkin: TemplateTheme = {
  id: "minimal",
  name: "Minimal",
  rootClassName: "bg-white text-neutral-900",
  headerClassName: "border-b border-neutral-300 pb-3",
  sectionTitleClassName: "text-sm font-semibold uppercase tracking-[0.16em] text-neutral-900",
  textMutedClassName: "text-neutral-600",
  chipClassName: "rounded-full border border-neutral-300 px-2 py-1 text-xs",
  linkClassName: "text-neutral-800 hover:underline",
  dividerClassName: "border-neutral-200",
};
