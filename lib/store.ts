"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { createBlankResume, createDefaultResume } from "@/lib/defaults";
import { normalizeImportedResume } from "@/lib/normalizeResume";
import { createId } from "@/lib/uuid";
import type {
  ColumnId,
  LayoutMode,
  Resume,
  ResumeData,
  ResumeMeta,
  SectionPlacement,
  SectionType,
  TemplateVariant,
  TemplateId,
} from "@/lib/types";

const sortSections = (sections: SectionPlacement[]) => [...sections].sort((a, b) => a.order - b.order);

type ResumeStore = {
  resumes: Resume[];
  activeId: string;
  setActiveResume: (id: string) => void;
  addResume: (template?: "sample" | "blank", name?: string) => void;
  duplicateActiveResume: () => void;
  deleteResume: (id: string) => void;
  renameActiveResume: (name: string) => void;
  setResumeLanguage: (language: string) => void;
  setTemplate: (templateId: TemplateId) => void;
  setTemplateVariant: (variant: TemplateVariant) => void;
  updateData: (data: ResumeData) => void;
  patchData: (patch: Partial<ResumeData>) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setSidebarWidth: (value: number) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  addBlock: (column: ColumnId, type: SectionType, forcedId?: string) => string | null;
  removeBlock: (sectionId: string) => void;
  updateBlock: (sectionId: string, patch: Partial<SectionPlacement>) => void;
  moveSection: (sectionId: string, column: ColumnId, order: number) => void;
  reorderSection: (sectionId: string, order: number) => void;
  setResumeFromJSON: (resume: unknown) => void;
  getActiveResume: () => Resume | undefined;
};

interface PersistedResumeStore {
  resumes: Resume[];
  activeId: string;
}

const touch = (resume: Resume): Resume => ({
  ...resume,
  meta: { ...resume.meta, updatedAt: Date.now() },
});

const initialResume = createDefaultResume();

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [initialResume],
      activeId: initialResume.id,

      getActiveResume: () => get().resumes.find((item) => item.id === get().activeId),

      setActiveResume: (id) => {
        set((state) => ({
          activeId: state.resumes.some((resume) => resume.id === id) ? id : state.activeId,
        }));
      },

      addResume: (template = "sample", name) => {
        const created = template === "blank" ? createBlankResume() : createDefaultResume();
        created.id = createId();
        created.meta.name = name?.trim() || `Resume ${new Date().toLocaleDateString()}`;
        created.meta.createdAt = Date.now();
        created.meta.updatedAt = Date.now();
        set((state) => ({
          resumes: [created, ...state.resumes],
          activeId: created.id,
        }));
      },

      duplicateActiveResume: () => {
        const current = get().getActiveResume();
        if (!current) return;

        const copy: Resume = {
          ...current,
          id: createId(),
          meta: {
            ...current.meta,
            name: `${current.meta.name} Copy`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          layout: {
            ...current.layout,
            sections: current.layout.sections.map((section) => ({ ...section, id: createId() })),
          },
        };

        set((state) => ({
          resumes: [copy, ...state.resumes],
          activeId: copy.id,
        }));
      },

      deleteResume: (id) => {
        set((state) => {
          if (state.resumes.length <= 1) return state;
          const next = state.resumes.filter((resume) => resume.id !== id);
          const activeId = state.activeId === id ? next[0].id : state.activeId;
          return { resumes: next, activeId };
        });
      },

      renameActiveResume: (name) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId
              ? touch({ ...resume, meta: { ...resume.meta, name: name.trim() || "Untitled Resume" } })
              : resume,
          ),
        }));
      },

      setResumeLanguage: (language) => {
        const trimmed = language.trim();
        set((state) => ({
          resumes: state.resumes.map((resume) => {
            if (resume.id !== state.activeId) return resume;
            if (!trimmed) {
              const { language, ...metaRest } = resume.meta;
              void language;
              return touch({ ...resume, meta: metaRest as ResumeMeta });
            }
            return touch({ ...resume, meta: { ...resume.meta, language: trimmed } });
          }),
        }));
      },

      setTemplate: (templateId) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId ? touch({ ...resume, templateId }) : resume,
          ),
        }));
      },

      setTemplateVariant: (templateVariant) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId ? touch({ ...resume, templateVariant }) : resume,
          ),
        }));
      },

      updateData: (data) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId ? touch({ ...resume, data }) : resume,
          ),
        }));
      },

      patchData: (patch) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId
              ? touch({
                  ...resume,
                  data: { ...resume.data, ...patch },
                })
              : resume,
          ),
        }));
      },

      setLayoutMode: (mode) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId
              ? touch({
                  ...resume,
                  layout: { ...resume.layout, columns: mode },
                })
              : resume,
          ),
        }));
      },

      setSidebarWidth: (value) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId
              ? touch({
                  ...resume,
                  layout: { ...resume.layout, sidebarWidthPct: Math.min(40, Math.max(25, value)) },
                })
              : resume,
          ),
        }));
      },

      toggleSectionVisibility: (sectionId) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId
              ? touch({
                  ...resume,
                  layout: {
                    ...resume.layout,
                    sections: resume.layout.sections.map((section) =>
                      section.id === sectionId ? { ...section, visible: !section.visible } : section,
                    ),
                  },
                })
              : resume,
          ),
        }));
      },

      updateSectionTitle: (sectionId, title) => {
        get().updateBlock(sectionId, { title });
      },

      addBlock: (column, type, forcedId) => {
        let createdId: string | null = null;
        set((state) => ({
          resumes: state.resumes.map((resume) => {
            if (resume.id !== state.activeId) return resume;
            const order = resume.layout.sections.filter((section) => section.column === column).length;
            const newBlock: SectionPlacement = {
              id: forcedId ?? createId(),
              type,
              column,
              order,
              visible: true,
              title: undefined,
              dataSlice: { kind: "all" },
              params: type === "personalInfo" ? { showPhoto: false, photoSize: 96 } : undefined,
            };
            createdId = newBlock.id;
            return touch({
              ...resume,
              layout: { ...resume.layout, sections: [...resume.layout.sections, newBlock] },
            });
          }),
        }));
        return createdId;
      },

      removeBlock: (sectionId) => {
        set((state) => ({
          resumes: state.resumes.map((resume) => {
            if (resume.id !== state.activeId) return resume;
            if (resume.layout.sections.length <= 1) return resume;

            const remaining = resume.layout.sections
              .filter((section) => section.id !== sectionId)
              .map((section) => ({ ...section }));
            const columns: ColumnId[] = ["left", "right", "full"];

            for (const column of columns) {
              sortSections(remaining.filter((section) => section.column === column)).forEach((section, index) => {
                section.order = index;
              });
            }

            return touch({
              ...resume,
              layout: { ...resume.layout, sections: remaining },
            });
          }),
        }));
      },

      updateBlock: (sectionId, patch) => {
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === state.activeId
              ? touch({
                  ...resume,
                  layout: {
                    ...resume.layout,
                    sections: resume.layout.sections.map((section) =>
                      section.id === sectionId ? { ...section, ...patch } : section,
                    ),
                  },
                })
              : resume,
          ),
        }));
      },

      moveSection: (sectionId, column, order) => {
        set((state) => ({
          resumes: state.resumes.map((resume) => {
            if (resume.id !== state.activeId) return resume;
            const sections = resume.layout.sections.map((section) => ({ ...section }));
            const moving = sections.find((section) => section.id === sectionId);
            if (!moving) return resume;

            const sourceColumn = moving.column;

            if (sourceColumn === column) {
              const sameColumnItems = sortSections(
                sections.filter((section) => section.column === column && section.id !== sectionId),
              );
              const clampedIndex = Math.max(0, Math.min(order, sameColumnItems.length));
              sameColumnItems.splice(clampedIndex, 0, moving);
              sameColumnItems.forEach((item, index) => {
                item.order = index;
              });

              const updatedSections = [
                ...sections.filter((section) => section.column !== column),
                ...sameColumnItems,
              ];

              return touch({
                ...resume,
                layout: { ...resume.layout, sections: updatedSections },
              });
            }

            const sourceItems = sortSections(
              sections.filter((section) => section.column === sourceColumn && section.id !== sectionId),
            );
            const targetItems = sortSections(
              sections.filter((section) => section.column === column && section.id !== sectionId),
            );

            const clampedIndex = Math.max(0, Math.min(order, targetItems.length));
            moving.column = column;
            targetItems.splice(clampedIndex, 0, moving);

            sourceItems.forEach((item, index) => {
              item.order = index;
            });
            targetItems.forEach((item, index) => {
              item.order = index;
            });

            const untouched = sections.filter(
              (section) => section.column !== sourceColumn && section.column !== column && section.id !== sectionId,
            );

            const updatedSections = [...untouched, ...sourceItems, ...targetItems];

            return touch({
              ...resume,
              layout: { ...resume.layout, sections: updatedSections },
            });
          }),
        }));
      },

      reorderSection: (sectionId, order) => {
        set((state) => ({
          resumes: state.resumes.map((resume) => {
            if (resume.id !== state.activeId) return resume;
            const sections = resume.layout.sections.map((section) => ({ ...section }));
            const moving = sections.find((section) => section.id === sectionId);
            if (!moving) return resume;

            const sameColumn = sortSections(
              sections.filter((section) => section.column === moving.column && section.id !== sectionId),
            );
            const clampedIndex = Math.max(0, Math.min(order, sameColumn.length));
            sameColumn.splice(clampedIndex, 0, moving);
            sameColumn.forEach((item, index) => {
              item.order = index;
            });

            const updatedSections = [
              ...sections.filter((section) => section.column !== moving.column),
              ...sameColumn,
            ];

            return touch({ ...resume, layout: { ...resume.layout, sections: updatedSections } });
          }),
        }));
      },

      setResumeFromJSON: (resume) => {
        set((state) => {
          const normalizedResume = normalizeImportedResume(resume);
          if (!normalizedResume) return state;

          return {
            resumes: [touch(normalizedResume), ...state.resumes],
            activeId: normalizedResume.id,
          };
        });
      },
    }),
    {
      name: "cv-gen:store:v1",
      storage: createJSONStorage(() => localStorage),
      version: 3,
      migrate: (persistedState, oldVersion) => {
        if (oldVersion < 3) {
          const resume = createDefaultResume();
          return {
            resumes: [resume],
            activeId: resume.id,
          };
        }

        const state = persistedState as PersistedResumeStore | undefined;
        if (!state?.resumes) return persistedState as ResumeStore;
        return persistedState as ResumeStore;
      },
    },
  ),
);
