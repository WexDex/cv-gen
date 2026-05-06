import type { CSSProperties } from "react";
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

const paddingPresetPx = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

const fontClassMap = {
  default: "",
  mono: "font-mono",
  serif: "font-serif",
} as const;

export function SectionShell({ title, theme, blockStyle, children }: SectionShellProps) {
  const preset = blockStyle?.padding ?? "sm";
  const basePad = paddingPresetPx[preset];
  const inset = blockStyle?.paddingInset;
  const useCustomPadding =
    inset &&
    (inset.top !== undefined ||
      inset.right !== undefined ||
      inset.bottom !== undefined ||
      inset.left !== undefined);

  const pad = useCustomPadding
    ? {
        paddingTop: inset!.top ?? basePad,
        paddingRight: inset!.right ?? basePad,
        paddingBottom: inset!.bottom ?? basePad,
        paddingLeft: inset!.left ?? basePad,
      }
    : {};

  const m = blockStyle?.margin;
  const marginStyle: CSSProperties = {
    ...(m?.top !== undefined ? { marginTop: m.top } : {}),
    ...(m?.right !== undefined ? { marginRight: m.right } : {}),
    ...(m?.bottom !== undefined ? { marginBottom: m.bottom } : {}),
    ...(m?.left !== undefined ? { marginLeft: m.left } : {}),
  };

  const inlineStyle: CSSProperties = {
    background: blockStyle?.background,
    color: blockStyle?.textColor,
    borderColor: blockStyle?.accent,
    ...pad,
    ...marginStyle,
  };

  return (
    <section
      className={cn(
        "cv-print-section mb-5",
        theme.contentClassName,
        fontClassMap[blockStyle?.fontStyle ?? "default"],
        useCustomPadding ? "" : paddingClassMap[preset],
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
        style={blockStyle?.lineHeight !== undefined ? { lineHeight: blockStyle.lineHeight } : undefined}
      >
        {children}
      </div>
    </section>
  );
}
