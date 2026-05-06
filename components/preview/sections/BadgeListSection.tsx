import { SectionShell } from "@/components/preview/sections/SectionShell";
import type { TemplateTheme } from "@/components/templates/theme";
import type { BlockStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgeListSectionProps {
  title: string;
  items: string[];
  theme: TemplateTheme;
  display?: string;
  blockStyle?: BlockStyle;
}

export function BadgeListSection({
  title,
  items,
  theme,
  display = "chips",
  blockStyle,
}: BadgeListSectionProps) {
  if (display === "comma") {
    return (
      <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
        <p className="text-xs">{items.join(", ")}</p>
      </SectionShell>
    );
  }

  if (display === "list") {
    return (
      <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
        <ul className="list-disc pl-4 text-xs space-y-1">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SectionShell>
    );
  }

  return (
    <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={cn(theme.chipClassName, display === "code-chips" && "font-mono")}
          >
            {display === "code-chips" ? `<${item} />` : item}
          </span>
        ))}
      </div>
    </SectionShell>
  );
}
