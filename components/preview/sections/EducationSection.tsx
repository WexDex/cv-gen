import type { EducationItem } from "@/lib/types";

import { SectionShell } from "@/components/preview/sections/SectionShell";
import type { TemplateTheme } from "@/components/templates/theme";
import { cn } from "@/lib/utils";
import type { BlockStyle } from "@/lib/types";

interface EducationSectionProps {
  title: string;
  items: EducationItem[];
  theme: TemplateTheme;
  display?: string;
  blockStyle?: BlockStyle;
}

export function EducationSection({
  title,
  items,
  theme,
  display = "list",
  blockStyle,
}: EducationSectionProps) {
  return (
    <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
      {items.map((item, index) => (
        <article
          key={`${item.institution}-${index}`}
          className={cn(
            "cv-print-subblock pb-2 border-b last:border-none",
            display === "compact" && "pb-1",
            theme.dividerClassName,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{item.degree}</p>
              <p className="text-xs">{item.institution}</p>
              {item.details ? <p className="text-xs">{item.details}</p> : null}
            </div>
            <span className="text-xs">{item.duration}</span>
          </div>
        </article>
      ))}
    </SectionShell>
  );
}
