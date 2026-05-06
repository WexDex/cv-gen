import { saveAs } from "file-saver";

import type { Resume } from "@/lib/types";

const isResumeLike = (value: unknown): value is Resume => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Resume>;
  return Boolean(
    candidate.id &&
      candidate.meta &&
      candidate.layout &&
      candidate.data &&
      candidate.templateId &&
      candidate.templateVariant,
  );
};

export const exportResumeJson = (resume: Resume) => {
  const blob = new Blob([JSON.stringify(resume, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  saveAs(blob, `${resume.meta.name.replace(/\s+/g, "-").toLowerCase()}.json`);
};

export const parseResumeJson = async (file: File): Promise<Resume> => {
  const text = await file.text();
  const parsed: unknown = JSON.parse(text);
  if (!isResumeLike(parsed)) {
    throw new Error("Invalid resume JSON structure.");
  }
  return parsed;
};
