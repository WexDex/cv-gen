"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { TemplateTheme } from "@/components/templates/theme";

type TemplateStore = {
  customTemplates: TemplateTheme[];
  saveCustomTemplate: (template: TemplateTheme) => void;
  deleteCustomTemplate: (id: string) => void;
  duplicateTemplate: (template: TemplateTheme, newId: string, newName: string) => TemplateTheme;
};

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      customTemplates: [],

      saveCustomTemplate: (template) => {
        set((state) => {
          const exists = state.customTemplates.some((t) => t.id === template.id);
          return {
            customTemplates: exists
              ? state.customTemplates.map((t) => (t.id === template.id ? { ...template, isCustom: true } : t))
              : [...state.customTemplates, { ...template, isCustom: true }],
          };
        });
      },

      deleteCustomTemplate: (id) => {
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
        }));
      },

      duplicateTemplate: (template, newId, newName) => {
        const copy: TemplateTheme = { ...template, id: newId, name: newName, isCustom: true };
        set((state) => ({ customTemplates: [...state.customTemplates, copy] }));
        return copy;
      },
    }),
    {
      name: "cv-gen:templates:v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/** Google Fonts presets for the font picker. */
export const FONT_PRESETS = [
  { name: "Default (Geist)", fontFamily: "", fontUrl: "" },
  {
    name: "Inter",
    fontFamily: "Inter",
    fontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  {
    name: "Roboto",
    fontFamily: "Roboto",
    fontUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
  },
  {
    name: "Lato",
    fontFamily: "Lato",
    fontUrl: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
  },
  {
    name: "Open Sans",
    fontFamily: "'Open Sans'",
    fontUrl: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap",
  },
  {
    name: "Montserrat",
    fontFamily: "Montserrat",
    fontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap",
  },
  {
    name: "Raleway",
    fontFamily: "Raleway",
    fontUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap",
  },
  {
    name: "Nunito",
    fontFamily: "Nunito",
    fontUrl: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap",
  },
  {
    name: "DM Sans",
    fontFamily: "'DM Sans'",
    fontUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
  },
  {
    name: "Space Grotesk",
    fontFamily: "'Space Grotesk'",
    fontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
  },
  {
    name: "PT Sans",
    fontFamily: "'PT Sans'",
    fontUrl: "https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap",
  },
  {
    name: "Playfair Display",
    fontFamily: "'Playfair Display'",
    fontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
  },
  {
    name: "Merriweather",
    fontFamily: "Merriweather",
    fontUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
  },
  {
    name: "IBM Plex Mono",
    fontFamily: "'IBM Plex Mono'",
    fontUrl: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&display=swap",
  },
  {
    name: "Source Code Pro",
    fontFamily: "'Source Code Pro'",
    fontUrl: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;700&display=swap",
  },
] as const;
