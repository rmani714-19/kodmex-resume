import { useEffect, useMemo, useRef, useState } from "react";
import EducationList from "../components/EducationList.jsx";
import HeaderSection from "../components/HeaderSection.jsx";
import Sidebar from "../components/Sidebar.jsx";
import ExperienceList from "../components/ExperienceList.jsx";
import ResumePreview from "../components/ResumePreview.jsx";
import SkillsSection from "../components/SkillsSection.jsx";
import SummarySection from "../components/SummarySection.jsx";
import OtherSections from "../components/OtherSections.jsx";
import { downloadResumeDocx, useResumePrint } from "../utils/download.js";

const sections = [
  { id: "header", label: "Header", icon: "user" },
  { id: "experience", label: "Experience", icon: "file" },
  { id: "education", label: "Education", icon: "graduation" },
  { id: "skills", label: "Skills", icon: "tools" },
  { id: "summary", label: "Summary", icon: "file-text" },
  { id: "other", label: "Other sections", icon: "plus" }
];

let experienceId = 4;

const initialExperiences = [
  {
    id: "experience-1",
    designation: "Technical Lead",
    company: "Wipro",
    location: "Chennai",
    dateRange: "Sep 2024 - Current",
    points: [
      "Led end-to-end backend development using Java, Spring Boot, Spring Data JPA, and Hibernate for enterprise banking applications.",
      "Owned technical design and solution architecture for microservices-based systems, ensuring scalability, security, and maintainability.",
      "Guided API design and integrated event-driven processing using Kafka Streams and Solace MQ."
    ]
  },
  {
    id: "experience-2",
    designation: "Senior Software Engineer",
    company: "Optimum InfoSystem",
    location: "Chennai",
    dateRange: "Mar 2021 - Sep 2024",
    points: [
      "Modernized legacy enterprise applications into maintainable service layers with improved operational stability.",
      "Translated complex functional requirements into reliable backend solutions with consistent release quality."
    ]
  },
  {
    id: "experience-3",
    designation: "Junior Engineer",
    company: "IVTL Infoview Technologies Pvt Ltd",
    location: "Chennai",
    dateRange: "Jun 2016 - Aug 2020",
    points: [
      "Contributed to ERP-based enterprise applications used by multiple customers across different workflows.",
      "Developed new features and modules from functional specifications with strong delivery consistency."
    ]
  }
];

const sectionContent = {
  header: {
    subtitle: "Let's review your:",
    title: "Header"
  },
  experience: {
    subtitle: "Let's review your:",
    title: "Experience"
  },
  education: {
    subtitle: "Let's review your:",
    title: "Education"
  },
  skills: {
    subtitle: "Let's review your:",
    title: "Skills"
  },
  summary: {
    subtitle: "Let's review your:",
    title: "Summary"
  },
  other: {
    subtitle: "Let's review your:",
    title: "Other sections"
  }
};

export default function ExperiencePage() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === "undefined") {
      return "experience";
    }

    const savedSection = window.localStorage.getItem("kodmex-active-section");
    return sections.some((section) => section.id === savedSection) ? savedSection : "experience";
  });
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    if (typeof window === "undefined") {
      return "modern";
    }

    return window.localStorage.getItem("kodmex-selected-template") || "modern";
  });
  const [selectedTheme, setSelectedTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "#2563EB";
    }

    return window.localStorage.getItem("kodmex-selected-theme") || "#2563EB";
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [experiences, setExperiences] = useState(initialExperiences);
  const [editingIndex, setEditingIndex] = useState(0);
  const [header, setHeader] = useState({
    fullName: "RAMANI MANI",
    role: "Senior Software Engineer",
    email: "rmani714@gmail.com",
    phone: "9843729076",
    location: "Chennai, India",
    linkedin: "",
    github: ""
  });
  const [education, setEducation] = useState([
    {
      id: "education-1",
      degree: "B.E Mechanical Engineering",
      institution: "Muthayammal Engineering College",
      startYear: "2012",
      endYear: "2016",
      score: "CGPA 7.2"
    }
  ]);
  const [skills, setSkills] = useState([
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
  ]);
  const [summary, setSummary] = useState(
    "Senior Software Engineer with 9+ years of experience in Java, Spring Boot, Microservices, and Cloud-native architecture design. Strong expertise in building scalable enterprise systems using TDD and event-driven architecture."
  );
  const [otherSections, setOtherSections] = useState({
    languages: "English\nTamil",
    certifications: "AWS Associate",
    achievements: "Reduced manual testing effort from 2–3 days to under 30 minutes."
  });
  const [customSections, setCustomSections] = useState([]);
  const previewRef = useRef(null);

  const printResume = useResumePrint({
    contentRef: previewRef,
    documentTitle: `${header.fullName || "kodmex-resume"}-${selectedTemplate}`.replace(/\s+/g, "-").toLowerCase()
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("kodmex-active-section", activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("kodmex-selected-template", selectedTemplate);
  }, [selectedTemplate]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("kodmex-selected-theme", selectedTheme);
  }, [selectedTheme]);

  const previewResume = useMemo(
    () => ({
      personal: {
        ...header
      },
      summary,
      skills,
      education,
      languages: otherSections.languages,
      certifications: otherSections.certifications,
      achievements: otherSections.achievements,
      customSections
    }),
    [customSections, education, header, otherSections, skills, summary]
  );

  const exportResume = useMemo(
    () => ({
      ...previewResume,
      skills: Array.isArray(skills) ? skills : [],
      experience: experiences,
      education: education.map((item) => ({
        ...item,
        startDate: item.startYear || "",
        endDate: item.endYear || ""
      })),
      certifications: String(otherSections.certifications || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      languages: String(otherSections.languages || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      awards: String(otherSections.achievements || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item, index) => ({
          title: `Achievement ${index + 1}`,
          description: item
        })),
      customSections: customSections
        .filter((section) => section.title.trim() && section.content.trim().length >= 10)
        .map((section) => ({
          title: section.title.trim(),
          content: section.content.trim()
        }))
    }),
    [customSections, education, experiences, otherSections.achievements, otherSections.certifications, otherSections.languages, previewResume, skills]
  );

  function handleDelete(index) {
    setExperiences((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function handleMove(index) {
    setExperiences((current) => {
      if (current.length < 2) {
        return current;
      }

      const targetIndex = index === current.length - 1 ? index - 1 : index + 1;
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  function handleUpdate(index, nextItem) {
    setExperiences((current) =>
      current.map((item, currentIndex) => (currentIndex === index ? nextItem : item))
    );
  }

  function handleAdd() {
    setExperiences((current) => {
      const next = [
        ...current,
        {
          id: `experience-${experienceId++}`,
          designation: "Software Engineer",
          company: "New Company",
          location: "Chennai",
          dateRange: "Jan 2025 - Present",
          points: [
            "Developed backend services and APIs for internal platforms and customer-facing workflows.",
            "Improved response times and operational reliability with structured engineering practices."
          ]
        }
      ];
      setEditingIndex(next.length - 1);
      return next;
    });
  }

  function handleSelectTemplate(templateId) {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  }

  async function handleSavePdf() {
    setShowSaveMenu(false);
    await printResume();
  }

  async function handleSaveDocx() {
    setShowSaveMenu(false);
    await downloadResumeDocx(exportResume, selectedTemplate, selectedTheme);
  }

  function renderEditorSection() {
    if (activeSection === "header") {
      return <HeaderSection value={header} onChange={setHeader} />;
    }

    if (activeSection === "experience") {
      return (
        <ExperienceList
          experiences={experiences}
          editingIndex={editingIndex}
          onEdit={(index) => {
            setEditingIndex((current) => (current === index ? -1 : index));
            console.log("edit experience", index);
          }}
          onDelete={(index) => {
            handleDelete(index);
            setEditingIndex((current) => {
              if (current === index) {
                return -1;
              }
              return current > index ? current - 1 : current;
            });
          }}
          onMove={handleMove}
          onAdd={handleAdd}
          onChange={handleUpdate}
        />
      );
    }

    if (activeSection === "education") {
      return <EducationList items={education} onChange={setEducation} />;
    }

    if (activeSection === "skills") {
      return <SkillsSection skills={skills} onChange={setSkills} />;
    }

    if (activeSection === "summary") {
      return <SummarySection value={summary} onChange={setSummary} />;
    }

    return (
      <OtherSections
        value={otherSections}
        onChange={setOtherSections}
        customSections={customSections}
        onChangeCustomSections={setCustomSections}
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
      />
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar sections={sections} activeSection={activeSection} onSelect={setActiveSection} />

      <section className="flex min-h-0 basis-[52%] flex-col overflow-hidden border-r border-[#E5E7EB] bg-[#FCFCFD] px-10 py-8">
        <div className="mx-auto flex min-h-0 w-full max-w-[760px] flex-1 flex-col">
          <div>
            <p className="text-[18px] font-semibold text-slate-900">{sectionContent[activeSection].subtitle}</p>
            <h1 className="mt-2 text-[48px] font-bold leading-[1.05] text-black">{sectionContent[activeSection].title}</h1>
          </div>

          <div className="section-switch mt-8 min-h-0 flex-1 overflow-y-auto pr-2">
            {renderEditorSection()}
          </div>
        </div>
      </section>

      <section className="flex min-h-0 basis-[48%] flex-col overflow-y-auto bg-[#F3F4F6] px-4 py-4">
        <ResumePreview
          resume={previewResume}
          experiences={experiences}
          resumeRef={previewRef}
          selectedTemplate={selectedTemplate}
          selectedTheme={selectedTheme}
          showTemplateSelector={showTemplateSelector}
          onToggleTemplateSelector={() => setShowTemplateSelector((current) => !current)}
          onSelectTemplate={handleSelectTemplate}
          showSaveMenu={showSaveMenu}
          onToggleSaveMenu={() => setShowSaveMenu((current) => !current)}
          onSavePdf={handleSavePdf}
          onSaveDocx={handleSaveDocx}
        />
      </section>
    </main>
  );
}
