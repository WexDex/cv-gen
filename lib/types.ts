export type ColumnId = "full" | "left" | "right";

export type LayoutMode = "1col" | "2col-left-sidebar" | "2col-right-sidebar";

export type BuiltInTemplateId = "modern" | "classic" | "minimal" | "webdev";
/** Allows custom template IDs stored in localStorage while still autocompleting built-in ones. */
export type TemplateId = BuiltInTemplateId | (string & {});
export type TemplateVariant = "light" | "dark";

export type BlockFontStyle = "default" | "mono" | "serif";
export type BlockDensity = "compact" | "normal" | "spacious";
export type BlockPadding = "sm" | "md" | "lg";

/** Per-side spacing in px (screen / print). Omitted sides are left unset in CSS. */
export interface BlockEdgeInsets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface BlockStyle {
  background?: string;
  textColor?: string;
  accent?: string;
  fontStyle?: BlockFontStyle;
  density?: BlockDensity;
  padding?: BlockPadding;
  /** Overrides preset padding for any side that is set; other sides fall back to the current padding preset (sm/md/lg). */
  paddingInset?: BlockEdgeInsets;
  /** Per-side margin in px. */
  margin?: BlockEdgeInsets;
  /** Unitless line-height for body text (e.g. 1.45). */
  lineHeight?: number;
  border?: boolean;
  rounded?: boolean;
}

export interface BlockDataSlice {
  kind: "all" | "indexes";
  indexes?: number[];
  order?: number[];
}

export type SectionType =
  | "personalInfo"
  | "summary"
  | "experience"
  | "education"
  | "programmingLanguages"
  | "frameworks"
  | "toolsDevOps"
  | "databases"
  | "projects"
  | "openSource"
  | "skills"
  | "certifications"
  | "languages"
  | "awards"
  | "volunteer"
  | "custom";

export interface SectionPlacement {
  id: string;
  type: SectionType;
  column: ColumnId;
  order: number;
  visible: boolean;
  title?: string;
  style?: BlockStyle;
  display?: string;
  params?: Record<string, unknown>;
  dataSlice?: BlockDataSlice;
}

export interface PageLayout {
  columns: LayoutMode;
  sidebarWidthPct: number;
  sections: SectionPlacement[];
}

export type ContactType =
  | "phone"
  | "email"
  | "location"
  | "link"
  | "github"
  | "linkedin"
  | "discord"
  | "whatsapp"
  | "website"
  | "summary";

export interface ContactItem {
  type: ContactType | string;
  value: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  contacts?: ContactItem[];
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  details?: string;
}

export interface ProgrammingLanguageItem {
  name: string;
  level?: 1 | 2 | 3 | 4 | 5;
}

export interface ProjectItem {
  name: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  programmingLanguages: ProgrammingLanguageItem[];
  frameworks: string[];
  toolsDevOps: string[];
  databases: string[];
  projects: ProjectItem[];
  openSource?: { name: string; url: string; description: string }[];
  skills?: { category: string; items: string[] }[];
  certifications?: { name: string; issuer: string; date: string }[];
  languages?: { language: string; proficiency: string }[];
  awards?: { title: string; issuer?: string; date?: string }[];
  volunteer?: {
    organization: string;
    role: string;
    duration: string;
    description?: string;
  }[];
  custom?: Record<string, { title: string; body: string }>;
}

export interface ResumeMeta {
  name: string;
  createdAt: number;
  updatedAt: number;
  /** Document / UI language tag for metadata and future export (e.g. en, fr, ar). */
  language?: string;
}

export interface FontOverride {
  fontFamily: string;
  fontUrl: string;
}

export interface Resume {
  id: string;
  meta: ResumeMeta;
  templateId: TemplateId;
  templateVariant: TemplateVariant;
  layout: PageLayout;
  data: ResumeData;
  fontOverride?: FontOverride;
}
