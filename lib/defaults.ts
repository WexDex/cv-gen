import { createId } from "@/lib/uuid";
import type { Resume, SectionPlacement } from "@/lib/types";

const now = Date.now();

const defaultSections = (): SectionPlacement[] => [
  {
    id: createId(),
    type: "personalInfo",
    column: "left",
    order: 0,
    visible: true,
    params: { showPhoto: false, photoSize: 96 },
    dataSlice: { kind: "all" },
  },
  {
    id: createId(),
    type: "summary",
    column: "left",
    order: 1,
    visible: true,
    display: "boxed",
    style: { background: "#0f172a14", rounded: true, padding: "md" },
    dataSlice: { kind: "all" },
  },
  { id: createId(), type: "experience", column: "right", order: 0, visible: true },
  { id: createId(), type: "projects", column: "right", order: 1, visible: true },
  {
    id: createId(),
    type: "programmingLanguages",
    column: "left",
    order: 2,
    visible: true,
    title: "Programming Languages",
    display: "code-chips",
    dataSlice: { kind: "all" },
  },
  { id: createId(), type: "frameworks", column: "left", order: 3, visible: true },
  { id: createId(), type: "toolsDevOps", column: "left", order: 4, visible: true, title: "Tools and DevOps" },
  { id: createId(), type: "databases", column: "left", order: 5, visible: true },
  { id: createId(), type: "education", column: "right", order: 2, visible: true },
  { id: createId(), type: "certifications", column: "right", order: 3, visible: true },
];

export const createDefaultResume = (): Resume => ({
  id: createId(),
  meta: {
    name: "WebDev Resume",
    createdAt: now,
    updatedAt: now,
  },
  templateId: "webdev",
  templateVariant: "dark",
  layout: {
    columns: "2col-left-sidebar",
    sidebarWidthPct: 33,
    sections: defaultSections(),
  },
  data: {
    personalInfo: {
      name: "Alex Morgan",
      title: "Senior Web Developer",
      email: "alex.morgan@email.com",
      phone: "+1 (555) 124-8800",
      location: "Berlin, Germany",
      contacts: [
        { type: "email", value: "alex.morgan@email.com" },
        { type: "phone", value: "+1 (555) 124-8800" },
        { type: "location", value: "Berlin, Germany" },
        { type: "github", value: "github.com/alexmorgan" },
        { type: "linkedin", value: "linkedin.com/in/alexmorgan-dev" },
        { type: "website", value: "alexmorgan.dev" },
      ],
      linkedin: "linkedin.com/in/alexmorgan-dev",
      github: "github.com/alexmorgan",
      website: "alexmorgan.dev",
      summary:
        "Web developer focused on TypeScript, React, and modern frontend architecture. I design and ship performance-driven products with strong UX, testing culture, and scalable component systems.",
    },
    experience: [
      {
        company: "NovaStack",
        position: "Senior Frontend Engineer",
        duration: "2022 - Present",
        description: [
          "Led migration from legacy SPA to Next.js App Router, improving Lighthouse performance by 35%.",
          "Built a design-system package consumed by 6 teams with token-based theming.",
          "Set up Playwright visual regression checks in CI for critical user flows.",
        ],
      },
      {
        company: "CloudSprint",
        position: "Full Stack Developer",
        duration: "2019 - 2022",
        description: [
          "Developed internal dashboards with React, Node.js, and PostgreSQL.",
          "Introduced feature-flag workflows and reduced risky releases by 40%.",
        ],
      },
    ],
    education: [
      {
        institution: "Technical University of Munich",
        degree: "B.Sc. Computer Science",
        duration: "2015 - 2019",
        details: "Specialization: Software Engineering",
      },
    ],
    programmingLanguages: [
      { name: "TypeScript", level: 5 },
      { name: "JavaScript", level: 5 },
      { name: "Python", level: 4 },
      { name: "Go", level: 3 },
    ],
    frameworks: ["React", "Next.js", "Vue", "Node.js", "Express"],
    toolsDevOps: ["Docker", "GitHub Actions", "Vercel", "Jest", "Playwright", "Figma"],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    projects: [
      {
        name: "Telemetry UI Toolkit",
        description: "Component toolkit and dashboard shell for IoT telemetry analytics.",
        tech: ["Next.js", "TypeScript", "Recharts"],
        github: "github.com/alexmorgan/telemetry-ui",
      },
      {
        name: "SnippetFlow",
        description: "Collaborative code snippet manager with markdown previews.",
        tech: ["React", "Firebase", "Tailwind"],
        link: "snippetflow.app",
      },
    ],
    openSource: [
      {
        name: "react-accessibility-hooks",
        url: "github.com/alexmorgan/react-accessibility-hooks",
        description: "Hooks for keyboard navigation and focus management.",
      },
    ],
    skills: [
      {
        category: "Frontend",
        items: ["React", "Next.js", "Tailwind", "Zustand"],
      },
      {
        category: "Backend",
        items: ["Node.js", "REST APIs", "GraphQL"],
      },
    ],
    certifications: [
      {
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        date: "2024",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "German", proficiency: "Professional" },
    ],
    awards: [{ title: "Best Developer Experience Project", issuer: "Frontend Europe", date: "2023" }],
    volunteer: [
      {
        organization: "Code4Youth",
        role: "Mentor",
        duration: "2021 - Present",
        description: "Mentor junior students learning web development fundamentals.",
      },
    ],
    custom: {
      highlights: {
        title: "Career Highlights",
        body: "Scaled a design system to 200+ reusable components across teams.",
      },
    },
  },
});

export const createBlankResume = (): Resume => ({
  id: createId(),
  meta: {
    name: "Blank Resume",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  templateId: "modern",
  templateVariant: "light",
  layout: {
    columns: "2col-left-sidebar",
    sidebarWidthPct: 33,
    sections: [
      {
        id: createId(),
        type: "personalInfo",
        column: "left",
        order: 0,
        visible: true,
        params: { showPhoto: false, photoSize: 96 },
        dataSlice: { kind: "all" },
      },
      { id: createId(), type: "summary", column: "left", order: 1, visible: true, dataSlice: { kind: "all" } },
      { id: createId(), type: "experience", column: "right", order: 0, visible: true, dataSlice: { kind: "all" } },
      { id: createId(), type: "projects", column: "right", order: 1, visible: true, dataSlice: { kind: "all" } },
      { id: createId(), type: "education", column: "right", order: 2, visible: true, dataSlice: { kind: "all" } },
      { id: createId(), type: "programmingLanguages", column: "left", order: 2, visible: true, dataSlice: { kind: "all" } },
    ],
  },
  data: {
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      contacts: [],
      summary: "",
    },
    experience: [],
    education: [],
    programmingLanguages: [],
    frameworks: [],
    toolsDevOps: [],
    databases: [],
    projects: [],
    openSource: [],
    skills: [],
    certifications: [],
    languages: [],
    awards: [],
    volunteer: [],
    custom: {},
  },
});
