import { coerceResumeData } from "@/lib/coerceResumeData";
import { createBlankResume } from "@/lib/defaults";
import { createId } from "@/lib/uuid";
import type {
  ColumnId,
  LayoutMode,
  Resume,
  SectionPlacement,
  SectionType,
  TemplateId,
  BlockDataSlice,
} from "@/lib/types";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

const TEMPLATE_IDS = new Set<TemplateId>(["modern", "classic", "minimal", "webdev"]);

const SECTION_TYPES = new Set<SectionType>([
  "personalInfo",
  "summary",
  "experience",
  "education",
  "programmingLanguages",
  "frameworks",
  "toolsDevOps",
  "databases",
  "projects",
  "openSource",
  "skills",
  "certifications",
  "languages",
  "awards",
  "volunteer",
  "custom",
]);

function isLayoutMode(v: unknown): v is LayoutMode {
  return v === "1col" || v === "2col-left-sidebar" || v === "2col-right-sidebar";
}

function isColumnId(v: unknown): v is ColumnId {
  return v === "full" || v === "left" || v === "right";
}

function coerceSectionType(v: unknown): SectionType {
  return typeof v === "string" && SECTION_TYPES.has(v as SectionType) ? (v as SectionType) : "summary";
}

function normalizeSection(raw: unknown, index: number): SectionPlacement {
  const fallback: SectionPlacement = {
    id: createId(),
    type: "summary",
    column: "left",
    order: index,
    visible: true,
    dataSlice: { kind: "all" },
  };
  if (!isPlainObject(raw)) return fallback;

  const dataSliceRaw = raw.dataSlice;
  let dataSlice: BlockDataSlice = { kind: "all" };
  if (isPlainObject(dataSliceRaw) && dataSliceRaw.kind === "indexes") {
    dataSlice = {
      kind: "indexes",
      indexes: Array.isArray(dataSliceRaw.indexes)
        ? dataSliceRaw.indexes.filter((n): n is number => typeof n === "number" && Number.isFinite(n))
        : [],
    };
  } else if (isPlainObject(dataSliceRaw) && dataSliceRaw.kind === "all") {
    dataSlice = { kind: "all" };
  }

  return {
    id: createId(),
    type: coerceSectionType(raw.type),
    column: isColumnId(raw.column) ? raw.column : fallback.column,
    order: typeof raw.order === "number" && Number.isFinite(raw.order) ? raw.order : index,
    visible: typeof raw.visible === "boolean" ? raw.visible : true,
    title: typeof raw.title === "string" ? raw.title : undefined,
    style: isPlainObject(raw.style) ? (raw.style as SectionPlacement["style"]) : undefined,
    display: typeof raw.display === "string" ? raw.display : undefined,
    params: isPlainObject(raw.params) ? (raw.params as SectionPlacement["params"]) : undefined,
    dataSlice,
  };
}

/**
 * Builds a valid `Resume` from loosely validated JSON (file import or paste).
 */
export function normalizeImportedResume(input: unknown): Resume | null {
  if (!isPlainObject(input)) return null;

  const blank = createBlankResume();

  const layoutRaw = input.layout;
  const layout = (() => {
    if (!isPlainObject(layoutRaw)) return blank.layout;
    const columns = isLayoutMode(layoutRaw.columns) ? layoutRaw.columns : blank.layout.columns;
    const sidebarWidthPct =
      typeof layoutRaw.sidebarWidthPct === "number" && Number.isFinite(layoutRaw.sidebarWidthPct)
        ? Math.min(40, Math.max(25, Math.round(layoutRaw.sidebarWidthPct)))
        : blank.layout.sidebarWidthPct;
    const sectionsRaw = layoutRaw.sections;
    const sections = Array.isArray(sectionsRaw)
      ? sectionsRaw.map((s, i) => normalizeSection(s, i))
      : blank.layout.sections;
    return { columns, sidebarWidthPct, sections };
  })();

  const metaRaw = input.meta;
  const meta = (() => {
    if (!isPlainObject(metaRaw)) {
      return { ...blank.meta, name: "Imported", updatedAt: Date.now() };
    }
    const langRaw = metaRaw.language;
    return {
      name: (String(metaRaw.name ?? "").trim() || blank.meta.name),
      createdAt: typeof metaRaw.createdAt === "number" ? metaRaw.createdAt : Date.now(),
      updatedAt: Date.now(),
      ...(typeof langRaw === "string" && langRaw.trim() ? { language: langRaw.trim() } : {}),
    };
  })();

  const data = coerceResumeData(input.data);

  const templateId =
    typeof input.templateId === "string" && TEMPLATE_IDS.has(input.templateId as TemplateId)
      ? (input.templateId as TemplateId)
      : blank.templateId;
  const templateVariant =
    input.templateVariant === "dark" || input.templateVariant === "light"
      ? input.templateVariant
      : blank.templateVariant;

  return {
    id: createId(),
    meta,
    templateId,
    templateVariant,
    layout,
    data,
  };
}
