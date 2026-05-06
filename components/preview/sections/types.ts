import type { TemplateTheme } from "@/components/templates/theme";
import type { BlockStyle } from "@/lib/types";

export interface SectionShellProps {
  title: string;
  theme: TemplateTheme;
  blockStyle?: BlockStyle;
  children: React.ReactNode;
}
