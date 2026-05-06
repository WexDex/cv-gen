import { saveAs } from "file-saver";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

import type { Resume } from "@/lib/types";

const heading = (text: string) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
  });

const bullet = (text: string) =>
  new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 80 },
  });

export const exportAsDocx = async (resume: Resume) => {
  const { data } = resume;
  const children: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: data.personalInfo.name, bold: true, size: 34 })],
    }),
    new Paragraph({ text: data.personalInfo.title }),
    new Paragraph({ text: `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}` }),
    new Paragraph({ text: "" }),
    heading("Summary"),
    new Paragraph({ text: data.personalInfo.summary }),
    heading("Experience"),
  ];

  data.experience.forEach((item) => {
    children.push(new Paragraph({ text: `${item.position} - ${item.company} (${item.duration})`, spacing: { before: 120, after: 100 } }));
    item.description.forEach((line) => children.push(bullet(line)));
  });

  children.push(heading("Projects"));
  data.projects.forEach((item) => {
    children.push(new Paragraph({ text: `${item.name}: ${item.description}` }));
    children.push(new Paragraph({ text: `Tech: ${item.tech.join(", ")}` }));
  });

  children.push(heading("Programming Languages"));
  data.programmingLanguages.forEach((item) =>
    children.push(
      bullet(`${item.name}${item.level ? ` (${item.level}/5)` : ""}`),
    ),
  );

  children.push(heading("Frameworks"));
  children.push(new Paragraph({ text: data.frameworks.join(", ") }));

  children.push(heading("Tools and DevOps"));
  children.push(new Paragraph({ text: data.toolsDevOps.join(", ") }));

  children.push(heading("Databases"));
  children.push(new Paragraph({ text: data.databases.join(", ") }));

  children.push(heading("Education"));
  data.education.forEach((item) =>
    children.push(new Paragraph({ text: `${item.degree}, ${item.institution} (${item.duration})` })),
  );

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${resume.meta.name.replace(/\s+/g, "-").toLowerCase()}.docx`);
};
