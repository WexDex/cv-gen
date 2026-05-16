import type { ExperienceItem } from "@/lib/types";

import { SectionShell } from "@/components/preview/sections/SectionShell";
import type { TemplateTheme } from "@/components/templates/theme";
import { cn } from "@/lib/utils";
import type { BlockStyle } from "@/lib/types";

interface ExperienceSectionProps {
  title: string;
  items: ExperienceItem[];
  theme: TemplateTheme;
  display?: string;
  blockStyle?: BlockStyle;
}

export function ExperienceSection({
  title,
  items,
  theme,
  display = "list",
  blockStyle,
}: ExperienceSectionProps) {
  const sepCls = theme.itemSeparatorClassName !== undefined
    ? theme.itemSeparatorClassName
    : cn("border-b last:border-none", theme.dividerClassName);

  return (
    <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
      {items.map((item, index) => (
        <article
          key={`${item.company}-${index}`}
          className={cn(
            "cv-print-subblock pb-2",
            sepCls,
            display === "timeline" && "relative pl-4 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-current/30",
            display === "compact" && "pb-1",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{item.position}</p>
              <p className="text-xs">{item.company}</p>
            </div>
            <time className="text-xs">{item.duration}</time>
          </div>
          <ul className={cn("mt-1 list-disc pl-4 text-xs", display === "compact" ? "space-y-0" : "space-y-0.5")}>
            {item.description.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </article>
      ))}
    </SectionShell>
  );
}
