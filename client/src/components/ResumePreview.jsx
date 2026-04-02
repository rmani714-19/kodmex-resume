import { forwardRef, useEffect, useRef, useState } from "react";
import TemplateSelector from "./TemplateSelector.jsx";
import ResumeTemplate from "./ResumeTemplate.jsx";
import { getResumeTemplate } from "../data/resumeTemplates.js";

const previewBaseWidth = 794;
const previewBaseHeight = 1123;

const sampleResume = {
  personal: {
    fullName: "RAMANI MANI",
    role: "Senior Software Engineer",
    email: "rmani714@gmail.com",
    phone: "9843729076",
    location: "Chennai, India"
  },
  summary:
    "Senior Software Engineer with 9+ years of experience in Java, Spring Boot, Microservices, and Cloud-native architecture design. Strong expertise in building scalable enterprise systems using TDD and event-driven architecture.",
  skills: [
    "Java (JDK 8/11/17)",
    "Python (Basics)",
    "Shell Scripting",
    "Spring",
    "Spring Boot",
    "Spring MVC",
    "Spring Data JPA",
    "RESTful APIs",
    "Kafka Streams",
    "Microservices"
  ]
};

function textBlockToList(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toProfileLink(url, fallbackLabel) {
  const raw = String(url || "").trim();

  if (!raw) {
    return null;
  }

  try {
    const normalized = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
    const parsed = new URL(normalized);
    const path = parsed.pathname.replace(/^\/+/, "");

    return {
      label: fallbackLabel,
      value: path ? `${parsed.hostname}/${path}` : parsed.hostname,
      url: normalized
    };
  } catch {
    return {
      label: fallbackLabel,
      value: raw.replace(/^https?:\/\//, ""),
      url: raw
    };
  }
}

function buildTemplateResume(resume, experiences) {
  const source = resume || sampleResume;
  const normalizedExperiences = experiences?.length
    ? experiences
    : [
        {
          id: "experience-sample",
          designation: "Technical Lead",
          company: "Wipro",
          dateRange: "September 2024 - Current",
          location: "Chennai, India",
          points: [
            "Led end-to-end backend development using Java, Spring Boot, Spring Data JPA, and Hibernate for enterprise banking applications.",
            "Defined solution architecture for microservices-based systems, ensuring scalability, security, and maintainability.",
            "Guided API design and integrated event-driven processing using Kafka Streams and Solace MQ."
          ]
        }
      ];

  return {
    personal: {
      fullName: source.personal?.fullName || sampleResume.personal.fullName,
      role: source.personal?.role || sampleResume.personal.role,
      email: source.personal?.email || sampleResume.personal.email,
      phone: source.personal?.phone || sampleResume.personal.phone,
      location: source.personal?.location || sampleResume.personal.location,
      linkedin: source.personal?.linkedin || "",
      github: source.personal?.github || ""
    },
    summary: source.summary || sampleResume.summary,
    skills: [
      {
        group: "Skills",
        items: Array.isArray(source.skills) ? source.skills : textBlockToList(source.skills)
      }
    ],
    education: Array.isArray(source.education)
      ? source.education.map((item) => ({
          ...item,
          startDate: item.startDate || item.startYear || "",
          endDate: item.endDate || item.endYear || ""
        }))
      : [],
    experience: normalizedExperiences,
    awards: Array.isArray(source.achievements)
      ? source.achievements
      : textBlockToList(source.achievements).map((item, index) => ({
          title: `Achievement ${index + 1}`,
          description: item
        })),
    certifications: Array.isArray(source.certifications)
      ? source.certifications
      : textBlockToList(source.certifications).map((item) => ({ name: item })),
    languages: Array.isArray(source.languages) ? source.languages : textBlockToList(source.languages),
    projects: Array.isArray(source.projects) ? source.projects : [],
    externalLinks: [
      toProfileLink(source.personal?.linkedin, "LinkedIn"),
      toProfileLink(source.personal?.github, "GitHub")
    ].filter(Boolean),
    customSections: Array.isArray(source.customSections) ? source.customSections : []
  };
}

function getPreviewLinkColor(selectedTemplate, selectedTheme) {
  if (selectedTheme) {
    return selectedTheme;
  }

  const template = getResumeTemplate(selectedTemplate);

  if (template.family === "darkSidebar") {
    return "#059669";
  }

  if (template.family === "accentSplit") {
    return "#2563EB";
  }

  if (template.family === "editorial") {
    return "#7C2D12";
  }

  return "#1126D3";
}

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

const ResumePreview = forwardRef(function ResumePreview(
  {
    resume = null,
    experiences = [],
    resumeRef = null,
    selectedTemplate = "modern",
    selectedTheme = "#2563EB",
    showTemplateSelector = false,
    onToggleTemplateSelector,
    onSelectTemplate,
    showSaveMenu = false,
    onToggleSaveMenu,
    onSavePdf,
    onSaveDocx
  },
  ref
) {
  const templateResume = buildTemplateResume(resume, experiences);
  const sheetRef = resumeRef || ref;
  const linkColor = getPreviewLinkColor(selectedTemplate, selectedTheme);
  const previewViewportRef = useRef(null);
  const [scale, setScale] = useState(0.72);

  useEffect(() => {
    const node = previewViewportRef.current;

    if (!node) {
      return undefined;
    }

    function updateScale() {
      const viewportHeight = node.clientHeight;
      const viewportWidth = node.clientWidth;
      const heightScale = viewportHeight / previewBaseHeight;
      const widthScale = viewportWidth / previewBaseWidth;
      const nextScale = Math.max(0.6, Math.min(1, heightScale, widthScale));

      setScale(nextScale);
    }

    updateScale();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => updateScale());
      observer.observe(node);

      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <section className="relative flex h-full flex-col bg-[#F3F4F6] pt-2">
      <div className="flex items-center justify-between px-4 pb-4 text-[16px] font-semibold" style={{ color: linkColor }}>
        <button
          type="button"
          className="pressable inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
          onClick={onToggleTemplateSelector}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
            <PaletteIcon />
          </span>
          <span>Change Template</span>
        </button>

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              className="pressable inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-3 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-800"
              onClick={onToggleSaveMenu}
            >
              <SaveIcon />
              <span>Download</span>
            </button>

            {showSaveMenu ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-[180px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  onClick={onSavePdf}
                >
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  onClick={onSaveDocx}
                >
                  DOCX
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        ref={previewViewportRef}
        className="flex flex-1 items-center justify-center overflow-hidden bg-[#F3F4F6]"
      >
        <div
          className="preview-fade-in flex items-start justify-center"
          style={{
            width: `${previewBaseWidth * scale}px`,
            height: `${previewBaseHeight * scale}px`
          }}
        >
          <div
            style={{
              width: `${previewBaseWidth}px`,
              height: `${previewBaseHeight}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top center"
            }}
          >
            <ResumeTemplate
              ref={sheetRef}
              resume={templateResume}
              selectedTemplate={selectedTemplate}
              selectedTheme={selectedTheme}
            />
          </div>
        </div>
      </div>

      <aside
        className={`absolute bottom-0 right-0 top-0 z-20 w-[260px] border-l border-[#E5E7EB] bg-white shadow-lg transition-transform duration-200 ${
          showTemplateSelector ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <TemplateSelector selectedTemplate={selectedTemplate} onSelect={onSelectTemplate} variant="sidebar" />
      </aside>
    </section>
  );
});

export default ResumePreview;
