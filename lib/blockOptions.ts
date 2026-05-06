import type { SectionType } from "@/lib/types";

export const sectionTypeLabels: Record<SectionType, string> = {
  personalInfo: "Personal Info",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  programmingLanguages: "Programming Languages",
  frameworks: "Frameworks",
  toolsDevOps: "Tools & DevOps",
  databases: "Databases",
  projects: "Projects",
  openSource: "Open Source",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards",
  volunteer: "Volunteer",
  custom: "Custom",
};

export const displayOptionsByType: Partial<Record<SectionType, string[]>> = {
  summary: ["plain", "boxed", "callout"],
  experience: ["list", "timeline", "compact"],
  education: ["list", "compact"],
  projects: ["cards", "compact"],
  programmingLanguages: ["chips", "code-chips", "bars", "dots", "list"],
  frameworks: ["chips", "code-chips", "comma", "list"],
  toolsDevOps: ["chips", "code-chips", "comma", "list"],
  databases: ["chips", "code-chips", "comma", "list"],
  languages: ["list", "inline-between"],
};

export const colorPresets = [
  "#ffffff",
  "#f8fafc",
  "#e2e8f0",
  "#111827",
  "#0f172a",
  "#1e293b",
  "#cffafe",
  "#ecfeff",
  "#fef3c7",
  "#d1fae5",
  "#fecaca",
];
