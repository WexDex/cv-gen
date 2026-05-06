import zendouhSeed from "@/public/zendouh-abdelhamid-cv.json";
import { createId } from "@/lib/uuid";
import type { Resume } from "@/lib/types";

export const createDefaultResume = (): Resume => {
  const base = structuredClone(zendouhSeed) as Resume;
  const id = createId();
  const t = Date.now();
  return {
    ...base,
    id,
    meta: {
      ...base.meta,
      createdAt: t,
      updatedAt: t,
    },
  };
};

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
