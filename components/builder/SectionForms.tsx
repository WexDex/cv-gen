"use client";

<<<<<<< Updated upstream
import { useEffect, useRef, useMemo, useState } from "react";
=======
import { useEffect, useMemo, useRef, useState } from "react";
>>>>>>> Stashed changes
import { X } from "lucide-react";

import { contactTypeOptions, getContactIcon } from "@/lib/contactMeta";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ContactType, ResumeData, SectionType } from "@/lib/types";

type FormColumnSide = "left" | "right";

const MORE_SECTION_TYPES: SectionType[] = [
  "openSource",
  "certifications",
  "languages",
  "awards",
  "volunteer",
  "custom",
];

const parseCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
  sectionType?: string;
}

function SectionBlock({ title, children, isDark, sectionType }: SectionBlockProps) {
  return (
    <section
      data-section-type={sectionType}
<<<<<<< Updated upstream
      className={cn("space-y-2 rounded border p-3 transition-shadow duration-300", isDark ? "border-zinc-700 bg-zinc-900" : "bg-white")}
=======
      className={cn("space-y-2 rounded border p-3", isDark ? "border-zinc-700 bg-zinc-900" : "bg-white")}
>>>>>>> Stashed changes
    >
      <h3 className={cn("text-sm font-semibold", isDark ? "text-zinc-100" : "")}>{title}</h3>
      {children}
    </section>
  );
}

interface SectionFormsProps {
  isDark?: boolean;
<<<<<<< Updated upstream
  selectedSectionType?: string | null;
}

export function SectionForms({ isDark = false, selectedSectionType }: SectionFormsProps) {
=======
  selectedSectionId?: string | null;
}

export function SectionForms({ isDark = false, selectedSectionId }: SectionFormsProps) {
>>>>>>> Stashed changes
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const updateData = useResumeStore((state) => state.updateData);
  const updateBlock = useResumeStore((state) => state.updateBlock);
  const [formColumn, setFormColumn] = useState<FormColumnSide>("left");
<<<<<<< Updated upstream
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedSectionType) return;
    const el = document.querySelector(`[data-section-type="${selectedSectionType}"]`) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    el.classList.add("ring-2", "ring-yellow-400");
    highlightTimerRef.current = setTimeout(() => {
      el.classList.remove("ring-2", "ring-yellow-400");
    }, 1400);
  }, [selectedSectionType]);
=======
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingScrollTypeRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedSectionId || !activeResume) return;
    const section = activeResume.layout.sections.find((s) => s.id === selectedSectionId);
    if (!section) return;

    const targetColumn =
      section.column === "left" || section.column === "right" ? section.column : formColumn;

    if (targetColumn !== formColumn) {
      pendingScrollTypeRef.current = section.type;
      setFormColumn(targetColumn);
    } else {
      pendingScrollTypeRef.current = section.type;
      requestAnimationFrame(() => {
        const el = containerRef.current?.querySelector(`[data-section-type="${pendingScrollTypeRef.current}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        pendingScrollTypeRef.current = null;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSectionId]);

  useEffect(() => {
    if (!pendingScrollTypeRef.current) return;
    const type = pendingScrollTypeRef.current;
    const timer = setTimeout(() => {
      const el = containerRef.current?.querySelector(`[data-section-type="${type}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      pendingScrollTypeRef.current = null;
    }, 60);
    return () => clearTimeout(timer);
  }, [formColumn]);
>>>>>>> Stashed changes

  const data = useMemo(() => activeResume?.data, [activeResume]);

  const typesInColumn = useMemo(() => {
    const next = new Set<SectionType>();
    if (!activeResume) return next;
    for (const section of activeResume.layout.sections) {
      if (section.column === "full" || section.column === formColumn) {
        next.add(section.type);
      }
    }
    return next;
  }, [activeResume, formColumn]);

  if (!activeResume || !data) {
    return <div className="p-4 text-sm text-zinc-500">No active resume selected.</div>;
  }

  const hasType = (type: SectionType) => typesInColumn.has(type);
  const hasAnyType = (types: SectionType[]) => types.some((t) => typesInColumn.has(t));

  const showPersonalCore = hasType("personalInfo");
  const showSummaryField = hasType("summary");
  const showMoreSections = hasAnyType(MORE_SECTION_TYPES);

  const personalInfoBlock = activeResume.layout.sections.find(
    (section) =>
      section.type === "personalInfo" && (section.column === "full" || section.column === formColumn),
  );

  const tabBtn = (side: FormColumnSide, label: string) => (
    <button
      key={side}
      type="button"
      className={cn(
        "rounded px-2 py-1 text-xs font-medium uppercase tracking-wide",
        formColumn === side
          ? isDark
            ? "bg-cyan-700 text-white"
            : "bg-zinc-900 text-white"
          : isDark
            ? "bg-zinc-800 text-zinc-200"
            : "bg-zinc-200 text-zinc-800",
      )}
      onClick={() => setFormColumn(side)}
    >
      {label}
    </button>
  );

  const inputClass = cn(
    "w-full rounded border px-2 py-1 text-sm",
    isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500" : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500",
  );
  const selectClass = cn(
    inputClass,
    "min-w-0 flex-1 cursor-pointer",
    isDark ? "[color-scheme:dark]" : "[color-scheme:light]",
  );
  const optionClass = isDark ? "bg-zinc-800 text-zinc-100" : "bg-white text-zinc-900";
  const textareaClass = cn(
    "w-full rounded border px-2 py-1 text-sm",
    isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500" : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500",
  );
  const btnClass = cn("rounded border px-2 py-1 text-xs", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-zinc-100");
  const setData = (next: ResumeData) => updateData(next);

  const updateArrayItem = <T,>(list: T[], index: number, updater: (item: T) => T): T[] =>
    list.map((item, i) => (i === index ? updater(item) : item));
  const removeArrayItem = <T,>(list: T[], index: number): T[] => list.filter((_, i) => i !== index);
  const removeBtnClass = cn(
    "inline-flex h-7 w-7 items-center justify-center rounded border text-red-600",
    isDark ? "border-red-700 bg-zinc-900 hover:bg-red-950/40" : "border-red-300 bg-red-50 hover:bg-red-100",
  );
  const contacts =
    data.personalInfo.contacts && data.personalInfo.contacts.length > 0
      ? data.personalInfo.contacts
      : [
          { type: "email", value: data.personalInfo.email ?? "" },
          { type: "phone", value: data.personalInfo.phone ?? "" },
          { type: "location", value: data.personalInfo.location ?? "" },
          ...(data.personalInfo.linkedin ? [{ type: "linkedin", value: data.personalInfo.linkedin }] : []),
          ...(data.personalInfo.github ? [{ type: "github", value: data.personalInfo.github }] : []),
          ...(data.personalInfo.website ? [{ type: "website", value: data.personalInfo.website }] : []),
        ];
  return (
    <div ref={containerRef} className="space-y-3 overflow-auto p-3">
      <div
        className={cn(
          "sticky top-0 z-1 -mx-1 flex flex-wrap items-center gap-2 border-b px-1 pb-2",
          isDark ? "border-zinc-600 bg-zinc-900" : "border-zinc-200 bg-zinc-50",
        )}
      >
        <span className={cn("text-[10px] uppercase tracking-wide", isDark ? "text-zinc-400" : "text-zinc-500")}>Column</span>
        <div className="flex gap-1">
          {tabBtn("left", "Left")}
          {tabBtn("right", "Right")}
        </div>
      </div>

      {typesInColumn.size === 0 ? (
        <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")}>
          No blocks in this column (add blocks in Layout, or move blocks from the other column).
        </p>
      ) : null}

      {showPersonalCore || showSummaryField ? (
      <SectionBlock
        title={showPersonalCore ? "Personal Information" : "Summary"}
        sectionType={showPersonalCore ? "personalInfo" : "summary"}
        isDark={isDark}
        sectionType={showPersonalCore ? "personalInfo" : "summary"}
      >
        {showPersonalCore ? (
        <div className="grid grid-cols-[170px_1fr] gap-2">
          <div className={cn("rounded border px-2 py-1 text-sm font-medium", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-zinc-50 text-zinc-700")}>Name</div>
          <input
            className={inputClass}
            value={data.personalInfo.name}
            onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, name: event.target.value } })}
            placeholder="Full name"
          />
          <div className={cn("rounded border px-2 py-1 text-sm font-medium", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-zinc-50 text-zinc-700")}>Specialty / Title</div>
          <input
            className={inputClass}
            value={data.personalInfo.title}
            onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, title: event.target.value } })}
            placeholder="Professional title"
          />
          <div className={cn("rounded border px-2 py-1 text-sm font-medium", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-zinc-50 text-zinc-700")}>Show image</div>
          <label className={cn("inline-flex items-center gap-2 rounded border px-2 py-1 text-sm", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "border-zinc-300 bg-white text-zinc-900")}>
            <input
              type="checkbox"
              checked={Boolean(personalInfoBlock?.params?.showPhoto)}
              onChange={(event) => {
                if (!personalInfoBlock) return;
                updateBlock(personalInfoBlock.id, {
                  params: { ...personalInfoBlock.params, showPhoto: event.target.checked },
                });
              }}
            />
            Enable profile image in preview
          </label>
          <div className={cn("rounded border px-2 py-1 text-sm font-medium", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-zinc-50 text-zinc-700")}>Photo URL</div>
          <input
            className={inputClass}
            value={data.personalInfo.photoUrl ?? ""}
            onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, photoUrl: event.target.value || undefined } })}
            placeholder="https://..."
          />
        </div>
        ) : null}
        {showSummaryField ? (
        <textarea
          className={cn(textareaClass, "h-24", showPersonalCore && "mt-2")}
          value={data.personalInfo.summary}
          onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, summary: event.target.value } })}
          placeholder="Summary (multiline)"
        />
        ) : null}
        {showPersonalCore ? (
        <div className="space-y-2 rounded border p-2">
          <p className={cn("text-xs font-semibold", isDark ? "text-zinc-200" : "text-zinc-700")}>Flexible Contacts</p>
          {contacts.map((contact, index) => (
            <div key={`${contact.type}-${index}`} className="grid grid-cols-[170px_1fr_36px] gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded border",
                    isDark ? "border-zinc-700 bg-zinc-900 text-zinc-300" : "border-zinc-300 bg-zinc-50 text-zinc-600",
                  )}
                  aria-hidden
                >
                  {getContactIcon(contact.type)}
                </span>
                <select
                  className={selectClass}
                  aria-label={`Contact type ${index + 1}`}
                  value={contact.type}
                  onChange={(event) =>
                    setData({
                      ...data,
                      personalInfo: {
                        ...data.personalInfo,
                        contacts: updateArrayItem(contacts, index, (item) => ({
                          ...item,
                          type: event.target.value as ContactType,
                        })),
                      },
                    })
                  }
                >
                  {contactTypeOptions.map((option) => (
                    <option key={option.value} value={option.value} className={optionClass}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className={inputClass}
                value={contact.value}
                onChange={(event) =>
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      contacts: updateArrayItem(contacts, index, (item) => ({
                        ...item,
                        value: event.target.value,
                      })),
                    },
                  })
                }
                placeholder="value"
              />
              <button
                type="button"
                className={removeBtnClass}
                onClick={() =>
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      contacts: removeArrayItem(contacts, index),
                    },
                  })
                }
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            className={btnClass}
            onClick={() =>
              setData({
                ...data,
                personalInfo: {
                  ...data.personalInfo,
                  contacts: [...contacts, { type: "link", value: "" }],
                },
              })
            }
          >
            + add contact field
          </button>
        </div>
        ) : null}
      </SectionBlock>
      ) : null}

      {hasType("programmingLanguages") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Programming Languages" isDark={isDark} sectionType="programmingLanguages">
=======
      <SectionBlock title="Programming Languages" sectionType="programmingLanguages" isDark={isDark}>
>>>>>>> Stashed changes
        {data.programmingLanguages.map((lang, index) => (
          <div key={`${lang.name}-${index}`} className="grid grid-cols-[1fr_90px_36px] gap-2">
            <input
              className={inputClass}
              value={lang.name}
              onChange={(event) =>
                setData({
                  ...data,
                  programmingLanguages: updateArrayItem(data.programmingLanguages, index, (item) => ({ ...item, name: event.target.value })),
                })
              }
              placeholder="language"
            />
            <input
              className={inputClass}
              type="number"
              min={1}
              max={5}
              value={lang.level ?? ""}
              onChange={(event) =>
                setData({
                  ...data,
                  programmingLanguages: updateArrayItem(data.programmingLanguages, index, (item) => ({
                    ...item,
                    level: event.target.value ? (Number(event.target.value) as 1 | 2 | 3 | 4 | 5) : undefined,
                  })),
                })
              }
              placeholder="level"
            />
            <button type="button" className={removeBtnClass} onClick={() => setData({ ...data, programmingLanguages: removeArrayItem(data.programmingLanguages, index) })}>
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className={btnClass} onClick={() => setData({ ...data, programmingLanguages: [...data.programmingLanguages, { name: "", level: 3 }] })}>
          + add language
        </button>
      </SectionBlock>
      ) : null}

      {hasType("frameworks") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Frameworks" isDark={isDark} sectionType="frameworks">
=======
      <SectionBlock title="Frameworks" sectionType="frameworks" isDark={isDark}>
>>>>>>> Stashed changes
        <input className={inputClass} value={data.frameworks.join(", ")} onChange={(event) => setData({ ...data, frameworks: parseCommaList(event.target.value) })} placeholder="frameworks comma separated" />
      </SectionBlock>
      ) : null}

      {hasType("toolsDevOps") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Tools and DevOps" isDark={isDark} sectionType="toolsDevOps">
=======
      <SectionBlock title="Tools and DevOps" sectionType="toolsDevOps" isDark={isDark}>
>>>>>>> Stashed changes
        <input className={inputClass} value={data.toolsDevOps.join(", ")} onChange={(event) => setData({ ...data, toolsDevOps: parseCommaList(event.target.value) })} placeholder="tools/devops comma separated" />
      </SectionBlock>
      ) : null}

      {hasType("databases") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Databases" isDark={isDark} sectionType="databases">
=======
      <SectionBlock title="Databases" sectionType="databases" isDark={isDark}>
>>>>>>> Stashed changes
        <input className={inputClass} value={data.databases.join(", ")} onChange={(event) => setData({ ...data, databases: parseCommaList(event.target.value) })} placeholder="databases comma separated" />
      </SectionBlock>
      ) : null}

      {hasType("experience") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Experience" isDark={isDark} sectionType="experience">
=======
      <SectionBlock title="Experience" sectionType="experience" isDark={isDark}>
>>>>>>> Stashed changes
        {data.experience.map((exp, index) => (
          <div key={`${exp.company}-${index}`} className="space-y-2 rounded border p-2">
            <input className={inputClass} value={exp.company} onChange={(event) => setData({ ...data, experience: updateArrayItem(data.experience, index, (item) => ({ ...item, company: event.target.value })) })} placeholder="company" />
            <input className={inputClass} value={exp.position} onChange={(event) => setData({ ...data, experience: updateArrayItem(data.experience, index, (item) => ({ ...item, position: event.target.value })) })} placeholder="position" />
            <input className={inputClass} value={exp.duration} onChange={(event) => setData({ ...data, experience: updateArrayItem(data.experience, index, (item) => ({ ...item, duration: event.target.value })) })} placeholder="duration" />
            <textarea
              className={cn(textareaClass, "h-20")}
              value={exp.description.join("\n")}
              onChange={(event) =>
                setData({
                  ...data,
                  experience: updateArrayItem(data.experience, index, (item) => ({
                    ...item,
                    description: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean),
                  })),
                })
              }
              placeholder="description bullets"
            />
            <button type="button" className={removeBtnClass} onClick={() => setData({ ...data, experience: removeArrayItem(data.experience, index) })}>
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className={btnClass} onClick={() => setData({ ...data, experience: [...data.experience, { company: "", position: "", duration: "", description: [] }] })}>
          + add experience
        </button>
      </SectionBlock>
      ) : null}

      {hasType("education") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Education" isDark={isDark} sectionType="education">
=======
      <SectionBlock title="Education" sectionType="education" isDark={isDark}>
>>>>>>> Stashed changes
        {data.education.map((edu, index) => (
          <div key={`${edu.institution}-${index}`} className="grid grid-cols-[1fr_1fr_90px_36px] gap-2">
            <input className={inputClass} value={edu.institution} onChange={(event) => setData({ ...data, education: updateArrayItem(data.education, index, (item) => ({ ...item, institution: event.target.value })) })} placeholder="institution" />
            <input className={inputClass} value={edu.degree} onChange={(event) => setData({ ...data, education: updateArrayItem(data.education, index, (item) => ({ ...item, degree: event.target.value })) })} placeholder="degree" />
            <input className={inputClass} value={edu.duration} onChange={(event) => setData({ ...data, education: updateArrayItem(data.education, index, (item) => ({ ...item, duration: event.target.value })) })} placeholder="duration" />
            <button type="button" className={removeBtnClass} onClick={() => setData({ ...data, education: removeArrayItem(data.education, index) })}>
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className={btnClass} onClick={() => setData({ ...data, education: [...data.education, { institution: "", degree: "", duration: "" }] })}>
          + add education
        </button>
      </SectionBlock>
      ) : null}

      {hasType("projects") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Projects" isDark={isDark} sectionType="projects">
=======
      <SectionBlock title="Projects" sectionType="projects" isDark={isDark}>
>>>>>>> Stashed changes
        {data.projects.map((project, index) => (
          <div key={`${project.name}-${index}`} className="space-y-2 rounded border p-2">
            <input className={inputClass} value={project.name} onChange={(event) => setData({ ...data, projects: updateArrayItem(data.projects, index, (item) => ({ ...item, name: event.target.value })) })} placeholder="name" />
            <textarea className={cn(textareaClass, "h-14")} value={project.description} onChange={(event) => setData({ ...data, projects: updateArrayItem(data.projects, index, (item) => ({ ...item, description: event.target.value })) })} placeholder="description" />
            <input className={inputClass} value={project.tech.join(", ")} onChange={(event) => setData({ ...data, projects: updateArrayItem(data.projects, index, (item) => ({ ...item, tech: parseCommaList(event.target.value) })) })} placeholder="tech comma separated" />
            <input className={inputClass} value={project.link ?? ""} onChange={(event) => setData({ ...data, projects: updateArrayItem(data.projects, index, (item) => ({ ...item, link: event.target.value || undefined })) })} placeholder="link" />
            <input className={inputClass} value={project.github ?? ""} onChange={(event) => setData({ ...data, projects: updateArrayItem(data.projects, index, (item) => ({ ...item, github: event.target.value || undefined })) })} placeholder="github" />
            <button type="button" className={removeBtnClass} onClick={() => setData({ ...data, projects: removeArrayItem(data.projects, index) })}>
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className={btnClass} onClick={() => setData({ ...data, projects: [...data.projects, { name: "", description: "", tech: [] }] })}>
          + add project
        </button>
      </SectionBlock>
      ) : null}

      {hasType("skills") ? (
<<<<<<< Updated upstream
      <SectionBlock title="Skills" isDark={isDark} sectionType="skills">
=======
      <SectionBlock title="Skills" sectionType="skills" isDark={isDark}>
>>>>>>> Stashed changes
        {(data.skills ?? []).map((skill, index) => (
          <div key={`${skill.category}-${index}`} className="grid grid-cols-[1fr_1fr_36px] gap-2">
            <input className={inputClass} value={skill.category} onChange={(event) => setData({ ...data, skills: updateArrayItem(data.skills ?? [], index, (item) => ({ ...item, category: event.target.value })) })} placeholder="category" />
            <input className={inputClass} value={skill.items.join(", ")} onChange={(event) => setData({ ...data, skills: updateArrayItem(data.skills ?? [], index, (item) => ({ ...item, items: parseCommaList(event.target.value) })) })} placeholder="items" />
            <button type="button" className={removeBtnClass} onClick={() => setData({ ...data, skills: removeArrayItem(data.skills ?? [], index) })}>
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className={btnClass} onClick={() => setData({ ...data, skills: [...(data.skills ?? []), { category: "", items: [] }] })}>
          + add skill group
        </button>
      </SectionBlock>
      ) : null}

      {showMoreSections ? (
<<<<<<< Updated upstream
      <SectionBlock title="More Sections" isDark={isDark} sectionType="openSource">
=======
      <SectionBlock title="More Sections" sectionType="openSource" isDark={isDark}>
>>>>>>> Stashed changes
        <input className={inputClass} value={JSON.stringify(data.openSource ?? [])} onChange={(event) => { try { setData({ ...data, openSource: JSON.parse(event.target.value) }); } catch {} }} placeholder="openSource JSON array" />
        <input className={inputClass} value={JSON.stringify(data.certifications ?? [])} onChange={(event) => { try { setData({ ...data, certifications: JSON.parse(event.target.value) }); } catch {} }} placeholder="certifications JSON array" />
        <input className={inputClass} value={JSON.stringify(data.languages ?? [])} onChange={(event) => { try { setData({ ...data, languages: JSON.parse(event.target.value) }); } catch {} }} placeholder="languages JSON array" />
        <input className={inputClass} value={JSON.stringify(data.awards ?? [])} onChange={(event) => { try { setData({ ...data, awards: JSON.parse(event.target.value) }); } catch {} }} placeholder="awards JSON array" />
        <input className={inputClass} value={JSON.stringify(data.volunteer ?? [])} onChange={(event) => { try { setData({ ...data, volunteer: JSON.parse(event.target.value) }); } catch {} }} placeholder="volunteer JSON array" />
        <textarea className={cn(textareaClass, "h-24 font-mono text-xs")} value={JSON.stringify(data.custom ?? {}, null, 2)} onChange={(event) => { try { setData({ ...data, custom: JSON.parse(event.target.value) }); } catch {} }} placeholder="custom JSON object" />
      </SectionBlock>
      ) : null}
    </div>
  );
}
