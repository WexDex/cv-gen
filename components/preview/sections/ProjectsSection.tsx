import type { ProjectItem } from "@/lib/types";

import { SectionShell } from "@/components/preview/sections/SectionShell";
import type { TemplateTheme } from "@/components/templates/theme";
import { cn } from "@/lib/utils";
import type { BlockStyle } from "@/lib/types";

interface ProjectsSectionProps {
  title: string;
  items: ProjectItem[];
  theme: TemplateTheme;
  display?: string;
  blockStyle?: BlockStyle;
}

export function ProjectsSection({
  title,
  items,
  theme,
  display = "cards",
  blockStyle,
}: ProjectsSectionProps) {
  return (
    <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
      {items.map((item, index) => (
        <article
          key={`${item.name}-${index}`}
          className={cn(
            "pb-2 border-b last:border-none",
            display === "cards" && "rounded-md border p-2 mb-2",
            display === "compact" && "pb-1",
            theme.dividerClassName,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-sm">{item.name}</p>
            {item.link ? <span className={cn("text-xs", theme.linkClassName)}>{item.link}</span> : null}
          </div>
          <p className="text-xs">{item.description}</p>
          <p className="text-xs mt-1">{item.tech.join(" • ")}</p>
          {item.github ? <p className={cn("text-xs", theme.linkClassName)}>{item.github}</p> : null}
        </article>
      ))}
    </SectionShell>
  );
}
