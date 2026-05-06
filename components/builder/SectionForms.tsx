"use client";

import { useMemo } from "react";
import { X } from "lucide-react";

import { contactTypeOptions, getContactIcon } from "@/lib/contactMeta";
import { useResumeStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ContactType } from "@/lib/types";
import type { ResumeData } from "@/lib/types";

const parseCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
}

function SectionBlock({ title, children, isDark }: SectionBlockProps) {
  return (
    <section className={cn("space-y-2 rounded border p-3", isDark ? "border-zinc-700 bg-zinc-900" : "bg-white")}>
      <h3 className={cn("text-sm font-semibold", isDark ? "text-zinc-100" : "")}>{title}</h3>
      {children}
    </section>
  );
}

interface SectionFormsProps {
  isDark?: boolean;
}

export function SectionForms({ isDark = false }: SectionFormsProps) {
  const activeResume = useResumeStore((state) => state.getActiveResume());
  const updateData = useResumeStore((state) => state.updateData);

  const data = useMemo(() => activeResume?.data, [activeResume]);

  if (!activeResume || !data) {
    return <div className="p-4 text-sm text-zinc-500">No active resume selected.</div>;
  }

  const inputClass = cn(
    "w-full rounded border px-2 py-1 text-sm",
    isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500" : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500",
  );
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
  const lockedContactTypes = ["email", "phone", "location", "linkedin", "github", "website"] as const;
  const baseContacts = data.personalInfo.contacts ?? [];
  const upsertContact = (list: Array<{ type: string; value: string }>, type: string, value: string) => {
    const index = list.findIndex((item) => item.type.toLowerCase() === type.toLowerCase());
    if (index >= 0) {
      return updateArrayItem(list, index, (item) => ({ ...item, type, value }));
    }
    return [...list, { type, value }];
  };
  const getContactValue = (type: (typeof lockedContactTypes)[number]) => {
    const found = baseContacts.find((item) => item.type.toLowerCase() === type)?.value;
    if (found) return found;
    if (type === "email") return data.personalInfo.email ?? "";
    if (type === "phone") return data.personalInfo.phone ?? "";
    if (type === "location") return data.personalInfo.location ?? "";
    if (type === "linkedin") return data.personalInfo.linkedin ?? "";
    if (type === "github") return data.personalInfo.github ?? "";
    if (type === "website") return data.personalInfo.website ?? "";
    return "";
  };
  const customContacts = baseContacts.filter(
    (item) => !lockedContactTypes.includes(item.type.toLowerCase() as (typeof lockedContactTypes)[number]) && item.type.toLowerCase() !== "summary",
  );
  return (
    <div className="space-y-3 overflow-auto p-3">
      <SectionBlock title="Personal Information" isDark={isDark}>
        <div className="grid grid-cols-[170px_1fr] gap-2">
          <div className={cn("rounded border px-2 py-1 text-sm font-medium", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-zinc-50 text-zinc-700")}>Name</div>
          <input
            className={inputClass}
            value={data.personalInfo.name}
            onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, name: event.target.value } })}
            placeholder="Full name"
          />
          <div className={cn("rounded border px-2 py-1 text-sm font-medium", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-zinc-50 text-zinc-700")}>Title</div>
          <input
            className={inputClass}
            value={data.personalInfo.title}
            onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, title: event.target.value } })}
            placeholder="Professional title"
          />
          <div className={cn("rounded border px-2 py-1 text-sm font-medium", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-200" : "border-zinc-300 bg-zinc-50 text-zinc-700")}>Photo URL</div>
          <input
            className={inputClass}
            value={data.personalInfo.photoUrl ?? ""}
            onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, photoUrl: event.target.value || undefined } })}
            placeholder="https://..."
          />
        </div>
        <textarea
          className={cn(textareaClass, "h-24")}
          value={data.personalInfo.summary}
          onChange={(event) => setData({ ...data, personalInfo: { ...data.personalInfo, summary: event.target.value } })}
          placeholder="Summary (multiline)"
        />
        <div className="space-y-2 rounded border p-2">
          <p className={cn("text-xs font-semibold", isDark ? "text-zinc-200" : "text-zinc-700")}>Flexible Contacts</p>
          {lockedContactTypes.map((type) => (
            <div key={type} className="grid grid-cols-[170px_1fr_36px] gap-2">
              <label className={cn("flex items-center gap-2 rounded border px-2", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "border-zinc-300 bg-white text-zinc-900")}>
                <span className={cn(isDark ? "text-zinc-300" : "text-zinc-600")}>{getContactIcon(type)}</span>
                <span className="w-full py-1 text-sm">
                  {contactTypeOptions.find((option) => option.value === type)?.label ?? type}
                </span>
              </label>
              <input
                className={inputClass}
                value={getContactValue(type)}
                onChange={(event) => {
                  const value = event.target.value;
                  const nextContacts = upsertContact(baseContacts, type, value);
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      contacts: nextContacts,
                      ...(type === "email" ? { email: value } : {}),
                      ...(type === "phone" ? { phone: value } : {}),
                      ...(type === "location" ? { location: value } : {}),
                      ...(type === "linkedin" ? { linkedin: value || undefined } : {}),
                      ...(type === "github" ? { github: value || undefined } : {}),
                      ...(type === "website" ? { website: value || undefined } : {}),
                    },
                  });
                }}
                placeholder="value"
              />
              <div />
            </div>
          ))}
          {customContacts.map((contact, index) => (
            <div key={`${contact.type}-${index}`} className="grid grid-cols-[170px_1fr_36px] gap-2">
              <label className={cn("flex items-center gap-2 rounded border px-2", isDark ? "border-zinc-700 bg-zinc-800 text-zinc-100" : "bg-white")}>
                <span className={cn(isDark ? "text-zinc-300" : "text-zinc-600")}>{getContactIcon(contact.type)}</span>
                <select
                  className={cn("w-full bg-transparent py-1 text-sm outline-none", isDark ? "text-zinc-100" : "text-zinc-900")}
                  value={contact.type}
                  onChange={(event) =>
                    setData({
                      ...data,
                      personalInfo: {
                        ...data.personalInfo,
                        contacts: updateArrayItem(data.personalInfo.contacts ?? [], index, (item) => ({
                          ...item,
                          type: event.target.value as ContactType,
                        })),
                      },
                    })
                  }
                >
                  {contactTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <input
                className={inputClass}
                value={contact.value}
                onChange={(event) =>
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      contacts: updateArrayItem(data.personalInfo.contacts ?? [], index, (item) => ({
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
                      contacts: removeArrayItem(customContacts, index).concat(
                        lockedContactTypes
                          .map((type) => ({ type, value: getContactValue(type) }))
                          .filter((item) => item.value.trim().length > 0),
                      ),
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
                  contacts: [...baseContacts, { type: "link", value: "" }],
                },
              })
            }
          >
            + add contact field
          </button>
        </div>
      </SectionBlock>

      <SectionBlock title="Programming Languages" isDark={isDark}>
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

      <SectionBlock title="Frameworks" isDark={isDark}>
        <input className={inputClass} value={data.frameworks.join(", ")} onChange={(event) => setData({ ...data, frameworks: parseCommaList(event.target.value) })} placeholder="frameworks comma separated" />
      </SectionBlock>

      <SectionBlock title="Tools and DevOps" isDark={isDark}>
        <input className={inputClass} value={data.toolsDevOps.join(", ")} onChange={(event) => setData({ ...data, toolsDevOps: parseCommaList(event.target.value) })} placeholder="tools/devops comma separated" />
      </SectionBlock>

      <SectionBlock title="Databases" isDark={isDark}>
        <input className={inputClass} value={data.databases.join(", ")} onChange={(event) => setData({ ...data, databases: parseCommaList(event.target.value) })} placeholder="databases comma separated" />
      </SectionBlock>

      <SectionBlock title="Experience" isDark={isDark}>
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

      <SectionBlock title="Education" isDark={isDark}>
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

      <SectionBlock title="Projects" isDark={isDark}>
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

      <SectionBlock title="Skills" isDark={isDark}>
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

      <SectionBlock title="More Sections" isDark={isDark}>
        <input className={inputClass} value={JSON.stringify(data.openSource ?? [])} onChange={(event) => { try { setData({ ...data, openSource: JSON.parse(event.target.value) }); } catch {} }} placeholder="openSource JSON array" />
        <input className={inputClass} value={JSON.stringify(data.certifications ?? [])} onChange={(event) => { try { setData({ ...data, certifications: JSON.parse(event.target.value) }); } catch {} }} placeholder="certifications JSON array" />
        <input className={inputClass} value={JSON.stringify(data.languages ?? [])} onChange={(event) => { try { setData({ ...data, languages: JSON.parse(event.target.value) }); } catch {} }} placeholder="languages JSON array" />
        <input className={inputClass} value={JSON.stringify(data.awards ?? [])} onChange={(event) => { try { setData({ ...data, awards: JSON.parse(event.target.value) }); } catch {} }} placeholder="awards JSON array" />
        <input className={inputClass} value={JSON.stringify(data.volunteer ?? [])} onChange={(event) => { try { setData({ ...data, volunteer: JSON.parse(event.target.value) }); } catch {} }} placeholder="volunteer JSON array" />
        <textarea className={cn(textareaClass, "h-24 font-mono text-xs")} value={JSON.stringify(data.custom ?? {}, null, 2)} onChange={(event) => { try { setData({ ...data, custom: JSON.parse(event.target.value) }); } catch {} }} placeholder="custom JSON object" />
      </SectionBlock>
    </div>
  );
}
