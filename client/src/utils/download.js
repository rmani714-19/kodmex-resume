import { useReactToPrint } from "react-to-print";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from "docx";
import { flattenSkills } from "@shared/resumeEngine.js";
import { getResumeTemplate } from "../data/resumeTemplates.js";

const BODY_SIZE = 22;
const META_SIZE = 20;
const HEADING_SIZE = 26;
const NAME_SIZE = 36;
const ROLE_SIZE = 24;
const SECTION_GAP = 200;
const LINE_SPACING = 240;
const TEXT_COLOR = "111111";
const MUTED_COLOR = "6B7280";

const TEMPLATE_PRIMARY_COLORS = {
  executivePro: "#111827",
  modernMinimal: "#2563EB",
  impactBold: "#4F46E5",
  modern: "#2563EB",
  professional: "#111827",
  creative: "#10B981",
  minimal: "#475569",
  slate: "#334155",
  executive: "#4F46E5",
  classic: "#78716C",
  cobalt: "#0284C7",
  graphite: "#111827",
  mono: "#171717",
  aurora: "#0F766E",
  metro: "#059669",
  serif: "#78716C",
  focus: "#7C3AED",
  summit: "#9333EA",
  ivory: "#D97706",
  studio: "#EC4899",
  contrast: "#111111",
  harbor: "#0F766E",
  zen: "#4D7C0F"
};

function stripHash(color = "#2563EB") {
  return String(color || "#2563EB").replace("#", "").toUpperCase();
}

function docxPrimaryColor(selectedTemplate, selectedTheme) {
  if (selectedTheme) {
    return stripHash(selectedTheme);
  }

  return stripHash(TEMPLATE_PRIMARY_COLORS[selectedTemplate] || "#2563EB");
}

function fontForTemplate(selectedTemplate) {
  const template = getResumeTemplate(selectedTemplate);
  return template.family === "topbar" ? "Calibri" : "Arial";
}

function toTextList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item?.name) {
          return String(item.name).trim();
        }

        if (item?.title) {
          return String(item.title).trim();
        }

        return "";
      })
      .filter(Boolean);
  }

  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function flattenSkillText(skills) {
  if (Array.isArray(skills) && skills.every((item) => typeof item === "string")) {
    return skills.filter(Boolean);
  }

  return flattenSkills(skills || []);
}

function templateDocxLayout(selectedTemplate) {
  const template = getResumeTemplate(selectedTemplate);

  if (selectedTemplate === "modern" || selectedTemplate === "modernMinimal") {
    return {
      type: "single",
      order: ["summary", "skills", "projects", "experience", "education", "awards", "certifications", "languages", "interests"]
    };
  }

  if (selectedTemplate === "impactBold" || template.family === "hybrid") {
    return {
      type: "single",
      order: ["summary", "skills", "experience", "projects", "education", "awards", "certifications", "languages", "interests"]
    };
  }

  if (selectedTemplate === "professional" || selectedTemplate === "twoColumn" || template.family === "topbar") {
    return {
      type: "single",
      order: ["summary", "experience", "skills", "projects", "education", "awards", "certifications", "languages", "interests"]
    };
  }

  if (template.family === "sidebar" || template.family === "darkSidebar" || template.family === "accentSplit") {
    return {
      type: "two-column",
      left: ["skills", "certifications", "languages", "interests"],
      right: ["summary", "experience", "projects", "education", "awards"]
    };
  }

  return {
    type: "single",
    order: ["summary", "experience", "projects", "skills", "education", "awards", "certifications", "languages", "interests"]
  };
}

function externalLinkText(resume) {
  return toTextList(
    (resume.externalLinks || []).map((item) => (typeof item === "string" ? item : `${item.label}: ${item.value || item.url || ""}`))
  );
}

function paragraph(text, { font, size = BODY_SIZE, color = TEXT_COLOR, bold = false, alignment, spacingAfter = 80, spacingBefore = 0 } = {}) {
  return new Paragraph({
    alignment,
    spacing: { before: spacingBefore, after: spacingAfter, line: LINE_SPACING },
    children: [
      new TextRun({
        text: String(text || ""),
        font,
        size,
        color,
        bold
      })
    ]
  });
}

function bullet(text, { font, color = TEXT_COLOR } = {}) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 70, line: LINE_SPACING },
    children: [
      new TextRun({
        text: String(text || ""),
        font,
        size: BODY_SIZE,
        color
      })
    ]
  });
}

function heading(text, { font, color, primaryColor }) {
  return new Paragraph({
    spacing: { before: SECTION_GAP, after: 100 },
    children: [
      new TextRun({
        text,
        font,
        size: HEADING_SIZE,
        bold: true,
        color: color || primaryColor || TEXT_COLOR
      })
    ]
  });
}

function buildHeader(resume, { font, primaryColor, centered = false, inverse = false }) {
  const align = centered ? AlignmentType.CENTER : AlignmentType.LEFT;
  const color = inverse ? "FFFFFF" : TEXT_COLOR;
  const metaColor = inverse ? "F8FAFC" : MUTED_COLOR;
  const lines = [
    [resume.personal.email, resume.personal.phone, resume.personal.location].filter(Boolean).join(" | "),
    externalLinkText(resume).join(" | ")
  ].filter(Boolean);

  return [
    paragraph(resume.personal.fullName || "Candidate Name", {
      font,
      size: NAME_SIZE,
      bold: true,
      color,
      alignment: align,
      spacingAfter: 60
    }),
    paragraph(resume.personal.role || "", {
      font,
      size: ROLE_SIZE,
      color: centered ? color : primaryColor,
      alignment: align,
      spacingAfter: 120
    }),
    ...lines.map((line, index) =>
      paragraph(line, {
        font,
        size: META_SIZE,
        color: metaColor,
        alignment: align,
        spacingAfter: index === lines.length - 1 ? 180 : 70
      })
    )
  ];
}

function renderSummary(resume, options) {
  if (!resume.summary) {
    return [];
  }

  return [heading("Summary", options), paragraph(resume.summary, { font: options.font })];
}

function renderSkills(resume, options, { bullets = false } = {}) {
  const skills = flattenSkillText(resume.skills || []);

  if (!skills.length) {
    return [];
  }

  const content = bullets ? skills.map((item) => bullet(item, { font: options.font, color: options.color || TEXT_COLOR })) : [paragraph(skills.join(", "), { font: options.font, color: options.color || TEXT_COLOR })];
  return [heading("Skills", options), ...content];
}

function renderExperience(resume, options) {
  if (!resume.experience?.length) {
    return [];
  }

  return [
    heading("Experience", options),
    ...resume.experience.flatMap((item) => {
      const meta = [item.location, item.dateRange || [item.startDate, item.isCurrent ? "Present" : item.endDate].filter(Boolean).join(" - ")]
        .filter(Boolean)
        .join(" | ");

      const intro = [
        paragraph(`${item.designation || ""}${item.company ? ` at ${item.company}` : ""}`.trim(), {
          font: options.font,
          bold: true,
          spacingAfter: 50
        }),
        meta
          ? paragraph(meta, {
              font: options.font,
              size: META_SIZE,
              color: MUTED_COLOR,
              spacingAfter: 70
            })
          : null
      ].filter(Boolean);

      const points = item.points?.length
        ? item.points.map((point) => bullet(point, { font: options.font }))
        : (item.projects || []).flatMap((project) => [
            bullet(`${project.projectName || project.name}: ${project.description || ""}`.trim(), { font: options.font }),
            project.impact ? bullet(`Impact: ${project.impact}`, { font: options.font }) : null
          ]).filter(Boolean);

      return [...intro, ...points];
    })
  ];
}

function renderProjects(resume, options) {
  if (!resume.projects?.length) {
    return [];
  }

  return [
    heading("Projects", options),
    ...resume.projects.flatMap((project) => {
      const tools = [...(project.toolsUsed || []), ...(project.frameworksUsed || [])].filter(Boolean).join(", ");

      return [
        paragraph(project.name || project.projectName || "Project", {
          font: options.font,
          bold: true,
          color: options.primaryColor
        }),
        project.description ? paragraph(project.description, { font: options.font, spacingAfter: 70 }) : null,
        tools ? paragraph(`Tools & Frameworks: ${tools}`, { font: options.font, size: META_SIZE, color: MUTED_COLOR, spacingAfter: 50 }) : null,
        project.impact ? paragraph(`Impact: ${project.impact}`, { font: options.font, size: META_SIZE, color: MUTED_COLOR, spacingAfter: 110 }) : null
      ].filter(Boolean);
    })
  ];
}

function renderEducation(resume, options) {
  if (!resume.education?.length) {
    return [];
  }

  return [
    heading("Education", options),
    ...resume.education.flatMap((item) => [
      paragraph(item.degree, { font: options.font, bold: true, spacingAfter: 50 }),
      paragraph(
        [item.institution, [item.startDate || item.startYear, item.endDate || item.endYear].filter(Boolean).join(" - "), item.score]
          .filter(Boolean)
          .join(" | "),
        { font: options.font, size: META_SIZE, color: MUTED_COLOR, spacingAfter: 110 }
      )
    ])
  ];
}

function renderSimpleListSection(title, items, options) {
  const values = toTextList(items);

  if (!values.length) {
    return [];
  }

  return [heading(title, options), ...values.map((item) => bullet(item, { font: options.font, color: options.color || TEXT_COLOR }))];
}

function renderAwards(resume, options) {
  if (!resume.awards?.length) {
    return [];
  }

  return [
    heading("Awards & Achievements", options),
    ...resume.awards.flatMap((item) => {
      if (typeof item === "string") {
        return [bullet(item, { font: options.font })];
      }

      return [
        paragraph(item.title, { font: options.font, bold: true, spacingAfter: 50 }),
        item.description ? paragraph(item.description, { font: options.font, spacingAfter: 110 }) : null
      ].filter(Boolean);
    })
  ];
}

function renderCustomSections(resume, options) {
  if (!resume.customSections?.length) {
    return [];
  }

  return resume.customSections.flatMap((section) => [
    heading(section.title, options),
    paragraph(section.content, { font: options.font })
  ]);
}

function buildSectionChildren(sectionKey, resume, options, sectionMode = {}) {
  if (sectionKey === "summary") {
    return renderSummary(resume, options);
  }

  if (sectionKey === "skills") {
    return renderSkills(resume, options, sectionMode);
  }

  if (sectionKey === "experience") {
    return renderExperience(resume, options);
  }

  if (sectionKey === "projects") {
    return renderProjects(resume, options);
  }

  if (sectionKey === "education") {
    return renderEducation(resume, options);
  }

  if (sectionKey === "awards") {
    return renderAwards(resume, options);
  }

  if (sectionKey === "certifications") {
    return renderSimpleListSection("Certifications", resume.certifications, options);
  }

  if (sectionKey === "languages") {
    return renderSimpleListSection("Languages", resume.languages, options);
  }

  if (sectionKey === "interests") {
    return renderSimpleListSection("Interests", resume.interests, options);
  }

  return [];
}

function buildTwoColumnBody(resume, template, options) {
  const darkSidebar = template.id === "executivePro" || template.family === "darkSidebar";
  const sidebarColor = darkSidebar ? "111827" : options.primaryColor;
  const leftColor = darkSidebar ? "FFFFFF" : "F8FAFC";
  const layout = templateDocxLayout(template.id);
  const leftChildren = [
    ...buildSectionChildren("skills", resume, { ...options, color: leftColor }, { bullets: true }),
    ...buildSectionChildren("certifications", resume, { ...options, color: leftColor }, { bullets: true }),
    ...buildSectionChildren("languages", resume, { ...options, color: leftColor }, { bullets: true }),
    ...buildSectionChildren("interests", resume, { ...options, color: leftColor }, { bullets: true })
  ];
  const rightChildren = [
    ...layout.right.flatMap((sectionKey) => buildSectionChildren(sectionKey, resume, options)),
    ...renderCustomSections(resume, options)
  ];

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: sidebarColor },
              margins: { top: 180, bottom: 180, left: 180, right: 180 },
              children: leftChildren.length ? leftChildren : [paragraph("", { font: options.font, color: leftColor })]
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              margins: { top: 180, bottom: 180, left: 220, right: 180 },
              children: rightChildren.length ? rightChildren : [paragraph("", { font: options.font })]
            })
          ]
        })
      ]
    })
  ];
}

export function useResumePrint({ contentRef, documentTitle = "kodmex-resume" }) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 0;
      }

      @media print {
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .resume-container {
          width: 794px !important;
          min-width: 794px !important;
          margin: 0 auto !important;
          padding: 24px !important;
          background: white !important;
          box-sizing: border-box !important;
        }
      }
    `
  });

  return async function printResume() {
    if (!contentRef?.current) {
      return;
    }

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    } catch {
      // Ignore font readiness errors and continue with the print flow.
    }

    await new Promise((resolve) => window.setTimeout(resolve, 300));
    await handlePrint();
  };
}

export async function downloadResumeDocx(resume, selectedTemplate = "modern", selectedTheme = "#2563EB") {
  const template = getResumeTemplate(selectedTemplate);
  const font = fontForTemplate(selectedTemplate);
  const primaryColor = docxPrimaryColor(selectedTemplate, selectedTheme);
  const layout = templateDocxLayout(selectedTemplate);
  const options = { font, color: TEXT_COLOR, primaryColor };
  const children = [
    ...buildHeader(resume, {
      font,
      primaryColor,
      centered: layout.type === "single" && (template.family === "topbar" || template.family === "hybrid" || template.family === "minimal" || template.family === "editorial"),
      inverse: false
    })
  ];

  if (layout.type === "two-column") {
    children.push(...buildTwoColumnBody(resume, template, options));
  } else {
    layout.order.forEach((sectionKey) => {
      children.push(...buildSectionChildren(sectionKey, resume, options));
    });
    children.push(...renderCustomSections(resume, options));
  }

  const docxDocument = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  const blob = await Packer.toBlob(docxDocument);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(resume.personal.fullName || "resume").replace(/\s+/g, "-").toLowerCase()}-${selectedTemplate}.docx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
