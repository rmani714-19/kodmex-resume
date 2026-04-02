import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import { autoGenerateResume, normalizeResumeData } from "../../shared/resumeEngine.js";

const roleSkills = {
  "Java Developer": ["Java", "Spring Boot", "REST API", "MySQL"],
  "Backend Developer": ["Java", "Spring Boot", "Microservices", "AWS"],
  "Full Stack Developer": ["React", "Node.js", "MongoDB", "TypeScript"],
  "Data Analyst": ["SQL", "Power BI", "Excel", "Python"]
};

function cleanText(text) {
  return String(text || "")
    .replace(/[\u0000-\u001f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function parsePdf(buffer) {
  const result = await pdfParse(buffer);
  return cleanText(result.text);
}

async function parseDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return cleanText(result.value);
}

function inferRole(text) {
  const lower = text.toLowerCase();
  const matchedRole = Object.keys(roleSkills).find((role) => lower.includes(role.toLowerCase()));
  return matchedRole || "Backend Developer";
}

function extractName(text, fileName) {
  const match = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/);
  if (match?.[1]) {
    return match[1];
  }

  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .slice(0, 2)
    .join(" ") || "Candidate Name";
}

function extractEmail(text) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function extractPhone(text) {
  const match = text.match(/(?:\+91[-\s]?)?[6-9]\d{9}/);
  return match ? match[0].replace(/\D/g, "").slice(-10) : "";
}

function extractSkills(text, role) {
  const lower = text.toLowerCase();
  const matched = (roleSkills[role] || []).filter((skill) => lower.includes(skill.toLowerCase()));

  return [
    { group: "Core", items: matched.length ? matched : roleSkills[role] || roleSkills["Backend Developer"] },
    { group: "Tools", items: ["Git", "Docker"] }
  ];
}

function extractBulletSentences(text) {
  return (text.match(/([A-Z][^.]+(?:\d+%|\b\d+\b)[^.]*\.)/g) || []).slice(0, 3);
}

function extractEducation(text) {
  const degreeMatch = text.match(/(B\.Tech|B\.E|Bachelor(?:'s)?(?: of [A-Za-z ]+)?|M\.Tech|Master(?:'s)?(?: of [A-Za-z ]+)?)/i);
  const institutionMatch = text.match(/([A-Z][A-Za-z&.\s]+(?:University|College|Institute|School))/);

  return degreeMatch || institutionMatch
    ? [
        {
          degree: degreeMatch?.[1] || "Degree",
          institution: institutionMatch?.[1] || "Institution",
          location: "",
          startDate: "2019",
          endDate: "2023",
          score: ""
        }
      ]
    : [];
}

export async function extractResumePayload(file) {
  const extension = file.originalname.split(".").pop()?.toLowerCase();
  let text = "";

  if (extension === "pdf") {
    text = await parsePdf(file.buffer);
  } else if (extension === "docx") {
    text = await parseDocx(file.buffer);
  } else {
    throw new Error("Unsupported file format");
  }

  const role = inferRole(text);
  const bullets = extractBulletSentences(text);
  const resumeData = normalizeResumeData({
    personal: {
      fullName: extractName(text, file.originalname),
      email: extractEmail(text),
      phone: extractPhone(text),
      role
    },
    summary: "",
    experience: bullets.length
      ? [
          {
            company: "Imported Experience",
            designation: role,
            location: "",
            startDate: "",
            endDate: "",
            isCurrent: true,
            projects: [
              {
                projectName: `${role} Delivery`,
                description: bullets[0],
                toolsUsed: ["Git", "Postman"],
                frameworksUsed: role.includes("Java") || role.includes("Backend") ? ["Spring Boot"] : ["React"],
                technologies: roleSkills[role] || roleSkills["Backend Developer"],
                githubLink: "",
                impact: bullets[1] || "Improved performance by 20% through clearer engineering execution."
              }
            ]
          }
        ]
      : [],
    projects: text.toLowerCase().includes("project")
      ? [
          {
            name: `${role} Portfolio Project`,
            description: bullets[0] || `Built practical ${role.toLowerCase()} workflows with recruiter-friendly structure and clear delivery outcomes.`,
            toolsUsed: ["Git", "Docker"],
            frameworksUsed: role.includes("Java") || role.includes("Backend") ? ["Spring Boot"] : ["React"],
            technologies: roleSkills[role] || roleSkills["Backend Developer"],
            githubLink: "",
            liveLink: "",
            impact: bullets[1] || "Improved workflow efficiency by 20%."
          }
        ]
      : [],
    skills: extractSkills(text, role),
    education: extractEducation(text),
    externalLinks: []
  });

  return {
    text,
    resumeData: autoGenerateResume(resumeData)
  };
}
