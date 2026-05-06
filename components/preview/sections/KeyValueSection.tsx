import { Fragment } from "react";
import { SectionShell } from "@/components/preview/sections/SectionShell";
import type { TemplateTheme } from "@/components/templates/theme";
import type { BlockStyle } from "@/lib/types";
import { cn } from "@/lib/utils";

interface KeyValueItem {
  key: string;
  value: string;
}

interface KeyValueSectionProps {
  title: string;
  items: KeyValueItem[];
  theme: TemplateTheme;
  display?: string;
  blockStyle?: BlockStyle;
}

export function KeyValueSection({
  title,
  items,
  theme,
  display = "list",
  blockStyle,
}: KeyValueSectionProps) {
  if (display === "bars") {
    return (
      <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
        {items.map((item) => {
          const level = Number(item.value.replace("/5", "")) || 0;
          return (
            <div key={`${item.key}-${item.value}`} className="cv-print-subblock space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{item.key}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-1.5 rounded bg-black/10">
                <div className="h-1.5 rounded bg-current" style={{ width: `${Math.min(level, 5) * 20}%` }} />
              </div>
            </div>
          );
        })}
      </SectionShell>
    );
  }

  if (display === "dots") {
    return (
      <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
        {items.map((item) => {
          const level = Number(item.value.replace("/5", "")) || 0;
          return (
            <div key={`${item.key}-${item.value}`} className="cv-print-subblock flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold">{item.key}</span>
              <span className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn("h-2 w-2 rounded-full", index < level ? "bg-current" : "bg-black/20")}
                  />
                ))}
              </span>
            </div>
          );
        })}
      </SectionShell>
    );
  }

  if (display === "inline-between") {
    return (
      <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
        <div
          className="cv-print-subblock flex w-full min-w-0 flex-nowrap items-baseline gap-y-1 overflow-x-auto overflow-y-visible pb-0.5 text-[0.7rem] leading-tight sm:text-xs"
          role="list"
        >
          {items.map((item, index) => (
            <Fragment key={`${item.key}-${item.value}`}>
              {index > 0 ? (
                <span
                  className="mx-1.5 min-h-px min-w-[12px] flex-1 basis-8 translate-y-[0.1em] border-0 border-b border-dashed border-current/50 sm:mx-2"
                  aria-hidden
                />
              ) : null}
              <span className="shrink-0 whitespace-nowrap" role="listitem">
                <span className="font-semibold uppercase tracking-wide">{item.key}</span>
                <span className="mx-0.5 text-current/50 sm:mx-1">:</span>
                <span className="font-medium normal-case">{item.value}</span>
              </span>
            </Fragment>
          ))}
        </div>
      </SectionShell>
    );
  }

  if (display === "chips" || display === "code-chips") {
    return (
      <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span key={`${item.key}-${item.value}`} className={cn("cv-print-subblock", theme.chipClassName, display === "code-chips" && "font-mono")}>
              {display === "code-chips" ? `<${item.key} />` : item.key}
            </span>
          ))}
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell title={title} theme={theme} blockStyle={blockStyle}>
      <ul className="space-y-1 text-xs">
        {items.map((item) => (
          <li key={`${item.key}-${item.value}`} className="cv-print-subblock">
            <span className="font-semibold">{item.key}</span>: {item.value}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
