import type { TemplateTheme } from "@/components/templates/theme";

export const webDevSkin: TemplateTheme = {
  id: "webdev",
  name: "WebDev",
  rootClassName: "bg-slate-950 text-slate-100",
  headerClassName: "border-b border-cyan-500 pb-4",
  sectionTitleClassName: "text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300",
  textMutedClassName: "text-slate-300",
  chipClassName: "rounded border border-slate-700 bg-slate-900 text-cyan-200 px-2 py-1 text-xs font-mono",
  linkClassName: "text-cyan-300 underline-offset-2 hover:underline",
  dividerClassName: "border-slate-800",
  sidebarClassName: "bg-slate-900",
  contentClassName: "bg-slate-950",
};
