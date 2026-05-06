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
}
