import { getBlankResumeData } from "@/lib/defaults";
import type {
  ContactItem,
  EducationItem,
  ExperienceItem,
  PersonalInfo,
  ProgrammingLanguageItem,
  ProjectItem,
  ResumeData,
} from "@/lib/types";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

function coerceStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => (item === null || item === undefined ? "" : String(item)));
}

function coerceLevel(v: unknown): 1 | 2 | 3 | 4 | 5 | undefined {
  const n = Number(v);
  if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5) return n;
  return undefined;
}

function coercePersonalInfo(v: unknown, fallback: PersonalInfo): PersonalInfo {
  if (!isPlainObject(v)) return { ...fallback };
  const contacts: ContactItem[] = Array.isArray(v.contacts)
    ? v.contacts
        .map((c) => {
          if (!isPlainObject(c)) return null;
          return { type: String(c.type ?? "link"), value: String(c.value ?? "") };
        })
        .filter((c): c is ContactItem => c !== null)
    : (fallback.contacts ?? []);
  return {
    name: v.name != null ? String(v.name) : fallback.name,
    title: v.title != null ? String(v.title) : fallback.title,
    email: v.email != null ? String(v.email) : fallback.email,
    phone: v.phone != null ? String(v.phone) : fallback.phone,
    location: v.location != null ? String(v.location) : fallback.location,
    contacts,
    linkedin: v.linkedin != null ? String(v.linkedin) : fallback.linkedin,
    github: v.github != null ? String(v.github) : fallback.github,
    website: v.website != null ? String(v.website) : fallback.website,
    summary: v.summary != null ? String(v.summary) : fallback.summary,
    photoUrl: v.photoUrl != null ? String(v.photoUrl) : fallback.photoUrl,
  };
}

function coerceExperience(v: unknown): ExperienceItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) {
      return { company: "", position: "", duration: "", description: [] };
    }
    return {
      company: String(item.company ?? ""),
      position: String(item.position ?? ""),
      duration: String(item.duration ?? ""),
      description: coerceStringArray(item.description),
    };
  });
}

function coerceEducation(v: unknown): EducationItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) {
      return { institution: "", degree: "", duration: "", details: "" };
    }
    return {
      institution: String(item.institution ?? ""),
      degree: String(item.degree ?? ""),
      duration: String(item.duration ?? ""),
      details: item.details != null ? String(item.details) : undefined,
    };
  });
}

function coerceProgrammingLanguages(v: unknown): ProgrammingLanguageItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) return { name: "" };
    return {
      name: String(item.name ?? ""),
      level: coerceLevel(item.level),
    };
  });
}

function coerceProjects(v: unknown): ProjectItem[] {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) {
      return { name: "", description: "", tech: [] };
    }
    return {
      name: String(item.name ?? ""),
      description: String(item.description ?? ""),
      tech: coerceStringArray(item.tech),
      link: item.link != null ? String(item.link) : undefined,
      github: item.github != null ? String(item.github) : undefined,
    };
  });
}

function coerceOpenSource(v: unknown): NonNullable<ResumeData["openSource"]> {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) return { name: "", url: "", description: "" };
    return {
      name: String(item.name ?? ""),
      url: String(item.url ?? ""),
      description: String(item.description ?? ""),
    };
  });
}

function coerceSkills(v: unknown): NonNullable<ResumeData["skills"]> {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) return { category: "", items: [] };
    return {
      category: String(item.category ?? ""),
      items: coerceStringArray(item.items),
    };
  });
}

function coerceCertifications(v: unknown): NonNullable<ResumeData["certifications"]> {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) return { name: "", issuer: "", date: "" };
    return {
      name: String(item.name ?? ""),
      issuer: String(item.issuer ?? ""),
      date: String(item.date ?? ""),
    };
  });
}

function coerceLanguages(v: unknown): NonNullable<ResumeData["languages"]> {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) return { language: "", proficiency: "" };
    return {
      language: String(item.language ?? ""),
      proficiency: String(item.proficiency ?? ""),
    };
  });
}

function coerceAwards(v: unknown): NonNullable<ResumeData["awards"]> {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) return { title: "" };
    return {
      title: String(item.title ?? ""),
      issuer: item.issuer != null ? String(item.issuer) : undefined,
      date: item.date != null ? String(item.date) : undefined,
    };
  });
}

function coerceVolunteer(v: unknown): NonNullable<ResumeData["volunteer"]> {
  if (!Array.isArray(v)) return [];
  return v.map((item) => {
    if (!isPlainObject(item)) {
      return { organization: "", role: "", duration: "" };
    }
    return {
      organization: String(item.organization ?? ""),
      role: String(item.role ?? ""),
      duration: String(item.duration ?? ""),
      description: item.description != null ? String(item.description) : undefined,
    };
  });
}

function coerceCustom(v: unknown): NonNullable<ResumeData["custom"]> {
  if (!isPlainObject(v)) return {};
  const out: NonNullable<ResumeData["custom"]> = {};
  for (const [key, val] of Object.entries(v)) {
    if (!isPlainObject(val)) continue;
    out[key] = {
      title: String(val.title ?? ""),
      body: String(val.body ?? ""),
    };
  }
  return out;
}

/**
 * Turns arbitrary JSON (after `JSON.parse`) into a safe `ResumeData`.
 * Never throws: invalid shapes are replaced with defaults for those fields.
 */
export function coerceResumeData(raw: unknown): ResumeData {
  const base = getBlankResumeData();
  if (!isPlainObject(raw)) return base;

  return {
    personalInfo: coercePersonalInfo(raw.personalInfo, base.personalInfo),
    experience: coerceExperience(raw.experience),
    education: coerceEducation(raw.education),
    programmingLanguages: coerceProgrammingLanguages(raw.programmingLanguages),
    frameworks: coerceStringArray(raw.frameworks),
    toolsDevOps: coerceStringArray(raw.toolsDevOps),
    databases: coerceStringArray(raw.databases),
    projects: coerceProjects(raw.projects),
    openSource: coerceOpenSource(raw.openSource),
    skills: coerceSkills(raw.skills),
    certifications: coerceCertifications(raw.certifications),
    languages: coerceLanguages(raw.languages),
    awards: coerceAwards(raw.awards),
    volunteer: coerceVolunteer(raw.volunteer),
    custom: coerceCustom(raw.custom),
  };
}
