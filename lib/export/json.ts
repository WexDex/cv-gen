import { saveAs } from "file-saver";

import { normalizeImportedResume } from "@/lib/normalizeResume";
import type { Resume } from "@/lib/types";

export const exportResumeJson = (resume: Resume) => {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  saveAs(blob, `${resume.meta.name.replace(/\s+/g, "-").toLowerCase()}.json`);
};

export const parseResumeJson = async (file: File): Promise<Resume> => {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON in file.");
  }
  const normalized = normalizeImportedResume(parsed);
  if (!normalized) {
    throw new Error("Could not read a resume from this file.");
  }
  return normalized;
};
