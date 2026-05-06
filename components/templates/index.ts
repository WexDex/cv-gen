import { classicDarkSkin } from "@/components/templates/classic-dark";
import { classicLightSkin } from "@/components/templates/classic-light";
import { minimalDarkSkin } from "@/components/templates/minimal-dark";
import { minimalLightSkin } from "@/components/templates/minimal-light";
import { modernDarkSkin } from "@/components/templates/modern-dark";
import { modernLightSkin } from "@/components/templates/modern-light";
import { webDevDarkSkin } from "@/components/templates/webdev-dark";
import { webDevLightSkin } from "@/components/templates/webdev-light";
import type { TemplateId, TemplateVariant } from "@/lib/types";
import type { TemplateTheme } from "@/components/templates/theme";

export const templateThemes: Record<TemplateId, Partial<Record<TemplateVariant, TemplateTheme>>> = {
  modern: { light: modernLightSkin, dark: modernDarkSkin },
  classic: { light: classicLightSkin, dark: classicDarkSkin },
  minimal: { light: minimalLightSkin, dark: minimalDarkSkin },
  webdev: { light: webDevLightSkin, dark: webDevDarkSkin },
};

export const getTemplateTheme = (templateId: TemplateId, variant: TemplateVariant): TemplateTheme =>
  templateThemes[templateId][variant] ?? templateThemes[templateId].light ?? templateThemes[templateId].dark!;

export const templateList: Array<{ id: TemplateId; name: string; description: string }> = [
  { id: "modern", name: "Modern", description: "Blue accent, clean hierarchy." },
  { id: "classic", name: "Classic", description: "Serif-heavy traditional style." },
  { id: "minimal", name: "Minimal", description: "Neutral compact look." },
  { id: "webdev", name: "WebDev", description: "Dark code-like style for engineers." },
];
