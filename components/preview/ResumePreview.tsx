"use client";

import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Eye, EyeOff, Trash2 } from "lucide-react";

import { resolveTemplateTheme } from "@/components/templates";
import { useTemplateStore } from "@/lib/templateStore";
import { BadgeListSection } from "@/components/preview/sections/BadgeListSection";
import { EducationSection } from "@/components/preview/sections/EducationSection";
import { ExperienceSection } from "@/components/preview/sections/ExperienceSection";
import { HeaderSection } from "@/components/preview/sections/HeaderSection";
import { KeyValueSection } from "@/components/preview/sections/KeyValueSection";
import { PlainTextSection } from "@/components/preview/sections/PlainTextSection";
import { ProjectsSection } from "@/components/preview/sections/ProjectsSection";
import { SectionShell } from "@/components/preview/sections/SectionShell";
import { useA4PreviewPageSnap } from "@/components/preview/useA4PreviewPageSnap";
import { cn } from "@/lib/utils";
import type { ColumnId, Resume, SectionPlacement } from "@/lib/types";

interface ResumePreviewProps {
  resume: Resume;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onRemoveBlock?: (id: string) => void;
  onMoveBlock?: (id: string, column: ColumnId, order: number) => void;
  onReorderBlock?: (id: string, dir: "up" | "down") => void;
  showSpacing?: boolean;
  uiTheme?: "light" | "dark";
  /** When provided, bypasses the store and uses this theme directly (used in admin preview). */
  themeOverride?: import("@/components/templates/theme").TemplateTheme;
}

const defaultTitleMap: Partial<Record<SectionPlacement["type"], string>> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  programmingLanguages: "Programming Languages",
  frameworks: "Frameworks",
  toolsDevOps: "Tools and DevOps",
  databases: "Databases",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards",
  volunteer: "Volunteer",
  openSource: "Open Source",
  custom: "Custom",
};

const sortByOrder = (items: SectionPlacement[]) => [...items].sort((a, b) => a.order - b.order);

export function ResumePreview({
  resume,
  previewRef,
  selectedBlockId,
  onSelectBlock,
  onToggleVisibility,
  onRemoveBlock,
  onMoveBlock,
  onReorderBlock,
  showSpacing = false,
  uiTheme = "light",
  themeOverride,
}: ResumePreviewProps) {
  const customTemplates = useTemplateStore((state) => state.customTemplates);
  const theme = themeOverride ?? resolveTemplateTheme(resume.templateId, resume.templateVariant ?? "light", customTemplates);
  const visibleSections = resume.layout.sections.filter((section) => section.visible);
  const isPreviewDark = resume.templateVariant === "dark";

  useEffect(() => {
    if (!theme.fontUrl) return;
    const id = `cv-font-${theme.id}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = theme.fontUrl;
    document.head.appendChild(link);
  }, [theme.fontUrl, theme.id]);

  useA4PreviewPageSnap(previewRef, resume);

  useEffect(() => {
    if (!resume.fontOverride?.fontUrl) return;
    const existing = document.querySelector(`link[data-cv-font="${resume.fontOverride.fontFamily}"]`);
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = resume.fontOverride.fontUrl;
    link.setAttribute("data-cv-font", resume.fontOverride.fontFamily);
    document.head.appendChild(link);
  }, [resume.fontOverride]);

  const applySlice = <T,>(items: T[], section: SectionPlacement): T[] => {
    if (!section.dataSlice || section.dataSlice.kind === "all") return items;
    const { order, indexes } = section.dataSlice;
    const indexSet = indexes ? new Set(indexes) : null;

    if (order) {
      // Display items in the user-specified order, filtered by visible indexes
      return order
        .filter((originalIdx) => !indexSet || indexSet.has(originalIdx))
        .map((originalIdx) => items[originalIdx])
        .filter((item): item is T => item !== undefined);
    }

    if (indexSet) {
      return items.filter((_, i) => indexSet.has(i));
    }

    return items;
  };

  const renderSection = (section: SectionPlacement) => {
    const sectionTitle = section.title || defaultTitleMap[section.type] || section.type;
    const { data } = resume;

    switch (section.type) {
      case "personalInfo":
        return <HeaderSection info={data.personalInfo} theme={theme} params={section.params} blockStyle={section.style} />;
      case "summary":
        return (
          <PlainTextSection
            title={sectionTitle}
            text={data.personalInfo.summary}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
          />
        );
      case "experience":
        return (
          <ExperienceSection
            title={sectionTitle}
            items={applySlice(data.experience, section)}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
          />
        );
      case "education":
        return (
          <EducationSection
            title={sectionTitle}
            items={applySlice(data.education, section)}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
          />
        );
      case "projects":
        return (
          <ProjectsSection
            title={sectionTitle}
            items={applySlice(data.projects, section)}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
          />
        );
      case "programmingLanguages":
        return (
          <KeyValueSection
            title={sectionTitle}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
            items={applySlice(data.programmingLanguages, section).map((lang) => ({
              key: lang.name,
              value: lang.level ? `${lang.level}/5` : "n/a",
            }))}
          />
        );
      case "frameworks":
        return (
          <BadgeListSection
            title={sectionTitle}
            items={applySlice(data.frameworks, section)}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
          />
        );
      case "toolsDevOps":
        return (
          <BadgeListSection
            title={sectionTitle}
            items={applySlice(data.toolsDevOps, section)}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
          />
        );
      case "databases":
        return (
          <BadgeListSection
            title={sectionTitle}
            items={applySlice(data.databases, section)}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
          />
        );
      case "skills":
        return (
          <SectionShell title={sectionTitle} theme={theme} blockStyle={section.style}>
            {data.skills?.map((group) => (
              <p key={group.category} className="cv-print-subblock text-xs">
                <span className="font-semibold">{group.category}:</span> {group.items.join(" • ")}
              </p>
            ))}
          </SectionShell>
        );
      case "openSource":
        return (
          <SectionShell title={sectionTitle} theme={theme} blockStyle={section.style}>
            {applySlice(data.openSource ?? [], section).map((item) => (
              <div key={item.name} className="cv-print-subblock text-xs">
                <p className="font-semibold">{item.name}</p>
                <p>{item.description}</p>
                <p className={theme.linkClassName}>{item.url}</p>
              </div>
            ))}
          </SectionShell>
        );
      case "certifications":
        return (
          <SectionShell title={sectionTitle} theme={theme} blockStyle={section.style}>
            {applySlice(data.certifications ?? [], section).map((item) => (
              <p key={item.name} className="cv-print-subblock text-xs">
                <span className="font-semibold">{item.name}</span> - {item.issuer} ({item.date})
              </p>
            ))}
          </SectionShell>
        );
      case "languages":
        return (
          <KeyValueSection
            title={sectionTitle}
            theme={theme}
            display={section.display}
            blockStyle={section.style}
            items={applySlice(data.languages ?? [], section).map((item) => ({
              key: item.language,
              value: item.proficiency,
            }))}
          />
        );
      case "awards":
        return (
          <SectionShell title={sectionTitle} theme={theme} blockStyle={section.style}>
            {applySlice(data.awards ?? [], section).map((item) => (
              <p key={`${item.title}-${item.date ?? ""}`} className="cv-print-subblock text-xs">
                <span className="font-semibold">{item.title}</span>
                {item.issuer ? ` - ${item.issuer}` : ""}
                {item.date ? ` (${item.date})` : ""}
              </p>
            ))}
          </SectionShell>
        );
      case "volunteer":
        return (
          <SectionShell title={sectionTitle} theme={theme} blockStyle={section.style}>
            {applySlice(data.volunteer ?? [], section).map((item) => (
              <div key={`${item.organization}-${item.role}`} className="cv-print-subblock text-xs">
                <p className="font-semibold">
                  {item.role} - {item.organization}
                </p>
                <p>{item.duration}</p>
                {item.description ? <p>{item.description}</p> : null}
              </div>
            ))}
          </SectionShell>
        );
      case "custom":
        return (
          <SectionShell title={sectionTitle} theme={theme} blockStyle={section.style}>
            {Object.entries(data.custom ?? {}).map(([key, value]) => (
              <div key={key} className="cv-print-subblock text-xs">
                <p className="font-semibold">{value.title}</p>
                <p>{value.body}</p>
              </div>
            ))}
          </SectionShell>
        );
      default:
        return null;
    }
  };

  const layoutColumns =
    resume.layout.columns === "1col"
      ? (["full"] as ColumnId[])
      : resume.layout.columns === "2col-left-sidebar"
        ? (["left", "right"] as ColumnId[])
        : (["right", "left"] as ColumnId[]);

  return (
    <div className="bg-zinc-100 p-4 md:p-8 print:bg-white print:p-0">
      <div
        id="print-root"
        ref={previewRef}
        data-show-spacing={showSpacing ? "" : undefined}
        className={cn(
          "relative mx-auto min-h-[297mm] w-[210mm] max-w-full overflow-hidden border border-zinc-200 shadow-lg print:min-h-0 print:overflow-visible print:shadow-none print:border-none",
          theme.rootClassName,
        )}
        style={(resume.fontOverride?.fontFamily ?? theme.fontFamily) ? { fontFamily: resume.fontOverride?.fontFamily ?? theme.fontFamily } : undefined}
      >
        <div
          className="cv-resume-sheet-inner relative z-0 grid min-h-[297mm] print:min-h-0 print:items-start print:content-start"
          style={{ gridTemplateColumns: layoutColumns.length === 1 ? "1fr" : `${resume.layout.sidebarWidthPct}% 1fr` }}
        >
          {layoutColumns.map((column) => (
            <div
              key={column}
              className={cn(
                "p-6",
                column !== layoutColumns[layoutColumns.length - 1] && "border-r",
                column !== layoutColumns[layoutColumns.length - 1] && theme.dividerClassName,
                column === "left" && theme.sidebarClassName,
                column === "right" && theme.contentClassName,
              )}
            >
              {sortByOrder(visibleSections.filter((section) => section.column === column)).map((section, sectionIdx, colSections) => (
                <div
                  key={section.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectBlock?.(section.id);
                  }}
                  data-keep-selection="true"
                  className={cn(
                    "group relative rounded transition-all",
                    selectedBlockId === section.id
                      ? "ring-2 ring-yellow-500/80 ring-offset-2 animate-pulse"
                      : "hover:ring-2 hover:ring-yellow-500/60 hover:ring-offset-2 hover:animate-pulse",
                  )}
                >
                  <div
                    data-export-ignore
                    className={cn(
                      "absolute right-0 top-0 z-20 -translate-y-full gap-1 rounded border p-1 text-[10px] shadow-md",
                      selectedBlockId === section.id ? "flex" : "hidden group-hover:flex group-focus-within:flex",
                      isPreviewDark
                        ? "border-slate-700 bg-slate-900/95 text-slate-100"
                        : "border-slate-300 bg-white/95 text-slate-800",
                      uiTheme === "dark" && "shadow-black/40",
                    )}
                  >
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1 rounded border px-1 py-0.5",
                        isPreviewDark
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-slate-300 hover:bg-zinc-100",
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleVisibility?.(section.id);
                      }}
                    >
                      {section.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                      visible
                    </button>
                    <button
                      type="button"
                      disabled={sectionIdx === 0}
                      className={cn(
                        "inline-flex items-center gap-1 rounded border px-1 py-0.5 disabled:opacity-40",
                        isPreviewDark
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-slate-300 hover:bg-zinc-100",
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        onReorderBlock?.(section.id, "up");
                      }}
                    >
                      <ChevronUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={sectionIdx === colSections.length - 1}
                      className={cn(
                        "inline-flex items-center gap-1 rounded border px-1 py-0.5 disabled:opacity-40",
                        isPreviewDark
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-slate-300 hover:bg-zinc-100",
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        onReorderBlock?.(section.id, "down");
                      }}
                    >
                      <ChevronDown size={11} />
                    </button>
                    {resume.layout.columns !== "1col" && section.column !== "left" ? (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1 rounded border px-1 py-0.5",
                          isPreviewDark
                            ? "border-slate-700 hover:bg-slate-800"
                            : "border-slate-300 hover:bg-zinc-100",
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          onMoveBlock?.(
                            section.id,
                            "left",
                            resume.layout.sections.filter((item) => item.column === "left").length,
                          );
                        }}
                      >
                        <ArrowLeft size={11} />
                        move left
                      </button>
                    ) : null}
                    {resume.layout.columns !== "1col" && section.column !== "right" ? (
                      <button
                        type="button"
                        className={cn(
                          "inline-flex items-center gap-1 rounded border px-1 py-0.5",
                          isPreviewDark
                            ? "border-slate-700 hover:bg-slate-800"
                            : "border-slate-300 hover:bg-zinc-100",
                        )}
                        onClick={(event) => {
                          event.stopPropagation();
                          onMoveBlock?.(
                            section.id,
                            "right",
                            resume.layout.sections.filter((item) => item.column === "right").length,
                          );
                        }}
                      >
                        <ArrowRight size={11} />
                        move right
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1 rounded border px-1 py-0.5 text-red-600",
                        isPreviewDark
                          ? "border-red-700 hover:bg-red-900/30"
                          : "border-red-300 hover:bg-red-50",
                      )}
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveBlock?.(section.id);
                      }}
                    >
                      <Trash2 size={11} />
                      delete
                    </button>
                  </div>
                  {renderSection(section)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          className="cv-a4-guide-overlay print:hidden"
          aria-hidden
          title="Approximate A4 page breaks (297mm per sheet, 0 print margin in export)"
        />
      </div>
    </div>
  );
}
