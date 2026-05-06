import { cn } from "@/lib/utils";
import type { SectionShellProps } from "@/components/preview/sections/types";

const densityClassMap = {
  compact: "space-y-1",
  normal: "space-y-2",
  spacious: "space-y-3",
} as const;

const paddingClassMap = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
} as const;

const fontClassMap = {
  default: "",
  mono: "font-mono",
  serif: "font-serif",
} as const;

export function SectionShell({ title, theme, blockStyle, children }: SectionShellProps) {
  const inlineStyle: React.CSSProperties = {
    background: blockStyle?.background,
    color: blockStyle?.textColor,
    borderColor: blockStyle?.accent,
  };

  return (
    <section
      className={cn(
        "mb-5",
        theme.contentClassName,
        fontClassMap[blockStyle?.fontStyle ?? "default"],
        paddingClassMap[blockStyle?.padding ?? "sm"],
        blockStyle?.border ? "border" : "",
        blockStyle?.rounded ? "rounded-md" : "",
      )}
      style={inlineStyle}
    >
      <h3 className={cn("mb-2", theme.sectionTitleClassName)}>{title}</h3>
      <div
        className={cn(
          "text-sm",
          theme.textMutedClassName,
          densityClassMap[blockStyle?.density ?? "normal"],
        )}
      >
        {children}
      </div>
    </section>
  );
}
