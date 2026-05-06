import { SectionShell } from "@/components/preview/sections/SectionShell";
import type { TemplateTheme } from "@/components/templates/theme";
import type { BlockStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PlainTextSectionProps {
  title: string;
  text: string;
  theme: TemplateTheme;
  display?: string;
  blockStyle?: BlockStyle;
}

export function PlainTextSection({ title, text, theme, display = "plain", blockStyle }: PlainTextSectionProps) {
  return (
    <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
      <p
        className={cn(
          "text-xs leading-relaxed",
          display === "boxed" && "rounded-md bg-black/10 p-3",
          display === "callout" && "border-l-2 border-current pl-3",
        )}
      >
        {text}
      </p>
    </SectionShell>
  );
}
