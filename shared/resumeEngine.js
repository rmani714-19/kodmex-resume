import { appConfig } from "./config.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;
const namePattern = /^[A-Za-z ]+$/;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function nonEmpty(value, fallback = "") {
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

function sentence(value, fallback) {
  const normalized = nonEmpty(value, fallback);
  if (!normalized) {
    return "";
  }

  return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
}

function splitList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function countWords(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function hasMetric(value) {
  return new RegExp(appConfig.atsEngine.rules.metricsRegex, "i").test(String(value || ""));
}

function hasActionVerb(value) {
  return appConfig.atsEngine.rules.actionVerbs.some((verb) =>
    String(value || "").toLowerCase().includes(verb.toLowerCase())
  );
}

function normalizeProject(project = {}, fallbackRole = "Professional Project") {
  const technologies = splitList(project.technologies);
  const toolsUsed = splitList(project.toolsUsed);
  const frameworksUsed = splitList(project.frameworksUsed);
  const descriptionBase = nonEmpty(
    project.description,
    `Built ${fallbackRole.toLowerCase()} workflows with production-ready delivery and measurable improvements`
  );
  const impactBase = nonEmpty(project.impact, "Improved delivery speed by 20% and strengthened user-facing reliability.");
  const description = hasActionVerb(descriptionBase)
    ? sentence(descriptionBase)
    : sentence(`Developed ${descriptionBase.charAt(0).toLowerCase()}${descriptionBase.slice(1)}`);
  const impact = hasMetric(impactBase)
    ? sentence(impactBase)
    : sentence(`${impactBase} by 20% through clearer ownership and streamlined execution`);

  return {
    projectName: nonEmpty(project.projectName || project.name, `${fallbackRole} Initiative`),
    name: nonEmpty(project.name || project.projectName, `${fallbackRole} Initiative`),
    description,
    toolsUsed: toolsUsed.length ? toolsUsed : ["Git", "Postman"],
    frameworksUsed: frameworksUsed.length ? frameworksUsed : ["Spring Boot"],
    technologies: technologies.length ? technologies : ["Java", "REST API"],
    githubLink: nonEmpty(project.githubLink),
    liveLink: nonEmpty(project.liveLink),
    impact
  };
}

function normalizeSkillGroups(skillGroups = [], role = "Backend Developer") {
  const profile = appConfig.roleProfiles[role] || appConfig.roleProfiles["Backend Developer"];
  const incoming = ensureArray(skillGroups)
    .map((group) => ({
      group: nonEmpty(group.group),
      items: splitList(group.items)
    }))
    .filter((group) => group.group || group.items.length);

  if (incoming.length) {
    return incoming.map((group, index) => ({
      group: group.group || `Skill Group ${index + 1}`,
      items: [...new Set(group.items)]
    }));
  }

  return clone(profile.skillGroups || []);
}

export function flattenSkills(skillGroups = []) {
  return [...new Set(ensureArray(skillGroups).flatMap((group) => splitList(group.items)))];
}

export function createEmptyResumeData() {
  return {
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      role: "Backend Developer",
      linkedin: "",
      github: ""
    },
    summary: "",
    guidance: {
      jobDescription: "",
      yearsExperience: "",
      targetIndustry: "",
      currentCompany: "",
      topAchievement: "",
      projectHighlight: "",
      linkedinHeadline: "",
      linkedinSummary: "",
      githubUsername: ""
    },
    experience: [
      {
        company: "",
        designation: "",
        location: "",
        startDate: "",
        endDate: "",
        isCurrent: true,
        projects: [
          {
            projectName: "",
            description: "",
            toolsUsed: [],
            frameworksUsed: [],
            technologies: [],
            githubLink: "",
            impact: ""
          }
        ]
      }
    ],
    projects: [
      {
        name: "",
        description: "",
        toolsUsed: [],
        frameworksUsed: [],
        technologies: [],
        githubLink: "",
        liveLink: "",
        impact: ""
      }
    ],
    skills: clone(appConfig.roleProfiles["Backend Developer"].skillGroups),
    education: [
      {
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        score: ""
      }
    ],
    awards: [],
    certifications: [],
    languages: [],
    interests: [],
    externalLinks: []
  };
}

export function getSampleResumeData() {
  const sample = appConfig.sampleResumes[0]?.data;
  return sample ? normalizeResumeData(sample) : createEmptyResumeData();
}

export function normalizeResumeData(data = {}) {
  const fallback = createEmptyResumeData();
  const personal = {
    ...fallback.personal,
    ...clone(data.personal || {})
  };
  const role = nonEmpty(personal.role, "Backend Developer");
  const profile = appConfig.roleProfiles[role] || appConfig.roleProfiles["Backend Developer"];
  const experience = ensureArray(data.experience).map((entry) => ({
    company: nonEmpty(entry.company, fallback.guidance.currentCompany || "Company Name"),
    designation: nonEmpty(entry.designation || entry.role, role),
    location: nonEmpty(entry.location),
    startDate: nonEmpty(entry.startDate || entry.startYear),
    endDate: nonEmpty(entry.endDate || entry.endYear),
    isCurrent: Boolean(entry.isCurrent ?? !entry.endDate),
    projects: ensureArray(entry.projects).length
      ? entry.projects.map((project) => normalizeProject(project, role))
      : [normalizeProject(profile.projectTemplate, role)]
  }));
  const projects = ensureArray(data.projects).map((project) => normalizeProject(project, role));

  return {
    personal,
    summary: nonEmpty(data.summary),
    guidance: {
      ...fallback.guidance,
      ...clone(data.guidance || {})
    },
    experience: experience.length
      ? experience
      : [
          {
            company: nonEmpty(data.guidance?.currentCompany, "Company Name"),
            designation: role,
            location: "",
            startDate: "",
            endDate: "",
            isCurrent: true,
            projects: [normalizeProject(profile.projectTemplate, role)]
          }
        ],
    projects: projects.length ? projects : [],
    skills: normalizeSkillGroups(data.skills, role),
    education: ensureArray(data.education).length
      ? ensureArray(data.education).map((entry) => ({
          degree: nonEmpty(entry.degree),
          institution: nonEmpty(entry.institution),
          location: nonEmpty(entry.location),
          startDate: nonEmpty(entry.startDate || entry.startYear),
          endDate: nonEmpty(entry.endDate || entry.endYear),
          score: nonEmpty(entry.score)
        }))
      : clone(fallback.education),
    awards: ensureArray(data.awards).map((entry) => ({
      title: nonEmpty(entry.title),
      description: sentence(entry.description, "Recognized for high-impact execution and measurable delivery outcomes"),
      year: nonEmpty(entry.year)
    })),
    certifications: ensureArray(data.certifications).map((entry) => ({
      name: nonEmpty(entry.name),
      issuer: nonEmpty(entry.issuer),
      year: nonEmpty(entry.year),
      credentialId: nonEmpty(entry.credentialId),
      link: nonEmpty(entry.link)
    })),
    languages: splitList(data.languages),
    interests: splitList(data.interests),
    externalLinks: ensureArray(data.externalLinks).map((entry) => ({
      label: nonEmpty(entry.label),
      url: nonEmpty(entry.url)
    }))
  };
}

function buildSummary(resume) {
  if (nonEmpty(resume.summary)) {
    return resume.summary.trim();
  }

  const role = resume.personal.role;
  const profile = appConfig.roleProfiles[role] || appConfig.roleProfiles["Backend Developer"];
  const skills = flattenSkills(resume.skills).slice(0, 5);
  const years = nonEmpty(resume.guidance.yearsExperience);
  const industry = nonEmpty(resume.guidance.targetIndustry);
  const achievement = nonEmpty(resume.guidance.topAchievement);
  const experiencePrefix = years ? `${years} ${role}` : role;
  const industryPhrase = industry ? ` supporting ${industry} teams` : " delivering business-ready engineering outcomes";
  const impact = achievement
    ? sentence(achievement)
    : "Improves delivery speed, platform reliability, and recruiter readability with outcome-focused execution.";

  return `${experiencePrefix} with strengths in ${skills.join(", ")}${industryPhrase}. ${profile.summarySnippet} ${impact}`.trim();
}

function improveProject(project, role) {
  const normalized = normalizeProject(project, role);
  const techLine = [...normalized.frameworksUsed, ...normalized.technologies].slice(0, 4).join(", ");
  const description = countWords(normalized.description) >= appConfig.atsEngine.rules.minimumDescriptionWords
    ? normalized.description
    : sentence(`Developed ${normalized.projectName.toLowerCase()} using ${techLine} to deliver production-ready workflows and measurable business improvements`);
  const impact = hasMetric(normalized.impact)
    ? normalized.impact
    : sentence(`${normalized.impact} while improving efficiency by 20%`);

  return {
    ...normalized,
    description,
    impact
  };
}

function improveExperienceEntry(entry, role, guidance = {}) {
  const profile = appConfig.roleProfiles[role] || appConfig.roleProfiles["Backend Developer"];
  const projects = ensureArray(entry.projects).length
    ? entry.projects
    : [profile.projectTemplate];

  return {
    ...entry,
    company: nonEmpty(entry.company, guidance.currentCompany || "Company Name"),
    designation: nonEmpty(entry.designation, role),
    projects: projects.map((project, index) =>
      improveProject(
        {
          ...profile.projectTemplate,
          ...project,
          impact:
            index === 0 && guidance.topAchievement && !nonEmpty(project.impact)
              ? guidance.topAchievement
              : project.impact
        },
        role
      )
    )
  };
}

function ensureProjects(resume) {
  const role = resume.personal.role;
  const profile = appConfig.roleProfiles[role] || appConfig.roleProfiles["Backend Developer"];
  const projects = ensureArray(resume.projects).filter(
    (project) => nonEmpty(project.name || project.projectName) || nonEmpty(project.description)
  );

  if (projects.length) {
    return projects.map((project) => improveProject(project, role));
  }

  const highlight = nonEmpty(resume.guidance.projectHighlight);
  return [
    improveProject(
      {
        ...profile.projectTemplate,
        name: profile.projectTemplate.projectName,
        description: highlight || profile.projectTemplate.description,
        impact: highlight ? `${highlight} improving delivery quality by 20%.` : profile.projectTemplate.impact
      },
      role
    )
  ];
}

export function autoGenerateResume(input) {
  const resume = normalizeResumeData(input);
  const role = resume.personal.role;
  const generated = {
    ...resume,
    summary: buildSummary(resume),
    skills: normalizeSkillGroups(resume.skills, role),
    experience: resume.experience.map((entry) => improveExperienceEntry(entry, role, resume.guidance)),
    projects: ensureProjects(resume)
  };

  if (!generated.externalLinks.length) {
    generated.externalLinks = [
      generated.personal.linkedin ? { label: "LinkedIn", url: generated.personal.linkedin } : null,
      generated.personal.github ? { label: "GitHub", url: generated.personal.github } : null
    ].filter(Boolean);
  }

  return generated;
}

export function createResumeText(resumeInput) {
  const resume = autoGenerateResume(resumeInput);
  const skillText = resume.skills.map((group) => `${group.group}: ${group.items.join(", ")}`).join(" | ");
  const experienceText = resume.experience
    .map((entry) =>
      [
        `${entry.designation} ${entry.company} ${entry.location}`.trim(),
        entry.projects
          .map((project) =>
            `${project.projectName} ${project.description} ${project.impact} ${project.toolsUsed.join(" ")} ${project.frameworksUsed.join(" ")} ${project.technologies.join(" ")}`
          )
          .join(" ")
      ].join(" ")
    )
    .join(" ");
  const projectText = resume.projects
    .map((project) =>
      `${project.name || project.projectName} ${project.description} ${project.impact} ${project.toolsUsed.join(" ")} ${project.frameworksUsed.join(" ")} ${project.technologies.join(" ")}`
    )
    .join(" ");

  return [
    "Personal",
    resume.personal.fullName,
    resume.personal.role,
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    "Summary",
    resume.summary,
    "Skills",
    skillText,
    "Experience",
    experienceText,
    "Projects",
    projectText,
    "Education",
    resume.education.map((entry) => `${entry.degree} ${entry.institution} ${entry.startDate} ${entry.endDate}`).join(" "),
    "Awards",
    resume.awards.map((entry) => `${entry.title} ${entry.description} ${entry.year}`).join(" "),
    "Certifications",
    resume.certifications.map((entry) => `${entry.name} ${entry.issuer} ${entry.year}`).join(" "),
    "Languages",
    resume.languages.join(" "),
    "Interests",
    resume.interests.join(" "),
    "External Links",
    resume.externalLinks.map((entry) => `${entry.label} ${entry.url}`).join(" ")
  ]
    .filter(Boolean)
    .join("\n");
}

export function validateResumeData(resumeInput) {
  const resume = normalizeResumeData(resumeInput);
  const errors = [];

  if (resume.personal.fullName.trim().length < 3 || !namePattern.test(resume.personal.fullName.trim())) {
    errors.push("Full name must contain at least 3 alphabetic characters.");
  }

  if (!emailPattern.test(resume.personal.email || "")) {
    errors.push("Enter a valid email address.");
  }

  if (!phonePattern.test((resume.personal.phone || "").replace(/\D/g, "").slice(-10))) {
    errors.push("Enter a valid 10-digit phone number.");
  }

  if (!resume.personal.role.trim()) {
    errors.push("Target role is required.");
  }

  if (flattenSkills(resume.skills).length < appConfig.atsEngine.rules.minimumSkills) {
    errors.push(`Add at least ${appConfig.atsEngine.rules.minimumSkills} skills.`);
  }

  resume.experience.forEach((entry, experienceIndex) => {
    if (!ensureArray(entry.projects).length) {
      errors.push(`Experience ${experienceIndex + 1} must include at least one project.`);
    }

    entry.projects.forEach((project, projectIndex) => {
      if (countWords(project.description) < appConfig.atsEngine.rules.minimumDescriptionWords) {
        errors.push(`Experience project ${experienceIndex + 1}.${projectIndex + 1} needs at least 10 words in the description.`);
      }

      if (!project.toolsUsed.length) {
        errors.push(`Experience project ${experienceIndex + 1}.${projectIndex + 1} needs tools used.`);
      }

      if (!project.frameworksUsed.length) {
        errors.push(`Experience project ${experienceIndex + 1}.${projectIndex + 1} needs frameworks used.`);
      }

      if (!nonEmpty(project.impact)) {
        errors.push(`Experience project ${experienceIndex + 1}.${projectIndex + 1} needs impact.`);
      }
    });
  });

  resume.projects.forEach((project, index) => {
    if (countWords(project.description) < appConfig.atsEngine.rules.minimumDescriptionWords) {
      errors.push(`Global project ${index + 1} needs at least 10 words in the description.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    resume
  };
}

function extractKeywords(jobDescription = "") {
  const stopWords = new Set([
    "with",
    "from",
    "that",
    "this",
    "have",
    "your",
    "will",
    "into",
    "their",
    "using",
    "about",
    "they",
    "them",
    "need",
    "role",
    "team",
    "work",
    "years",
    "experience"
  ]);

  return [...new Set(
    String(jobDescription || "")
      .toLowerCase()
      .match(/[a-z][a-z0-9+#.-]{2,}/g)
      ?.filter((token) => !stopWords.has(token)) || []
  )].slice(0, 20);
}

export function scoreResume({ resume, resumeText, jobDescription = "" }) {
  const normalizedResume = autoGenerateResume(resume || createEmptyResumeData());
  const text = String(resumeText || createResumeText(normalizedResume)).toLowerCase();
  const keywords = extractKeywords(jobDescription);
  const matchedKeywords = keywords.filter((keyword) => text.includes(keyword));
  const missingKeywords = keywords.filter((keyword) => !matchedKeywords.includes(keyword));
  const experienceProjects = normalizedResume.experience.flatMap((entry) => entry.projects);
  const allProjects = [...experienceProjects, ...normalizedResume.projects];
  const projectDepthMatches = allProjects.filter((project) => project.toolsUsed.length && project.frameworksUsed.length);
  const validation = validateResumeData(normalizedResume);

  const keywordScore = keywords.length
    ? Math.round((matchedKeywords.length / keywords.length) * appConfig.atsEngine.weights.keywords)
    : Math.round(appConfig.atsEngine.weights.keywords * 0.7);

  const actionVerbScore = hasActionVerb(text) ? appConfig.atsEngine.weights.actionVerbs : 0;
  const metricsScore = hasMetric(text) ? appConfig.atsEngine.weights.metrics : 0;

  const completedSections = appConfig.atsEngine.rules.requiredSections.filter((section) => {
    if (section === "personal") {
      return Boolean(normalizedResume.personal.fullName && normalizedResume.personal.email && normalizedResume.personal.role);
    }

    if (section === "summary") {
      return Boolean(normalizedResume.summary);
    }

    return ensureArray(normalizedResume[section]).length > 0 || Boolean(normalizedResume[section]);
  });

  const sectionScore = Math.round(
    (completedSections.length / appConfig.atsEngine.rules.requiredSections.length) *
      appConfig.atsEngine.weights.sections
  );

  const projectDepthScore = allProjects.length
    ? Math.round((projectDepthMatches.length / allProjects.length) * appConfig.atsEngine.weights.projectDepth)
    : 0;

  const validationScore = Math.max(
    0,
    appConfig.atsEngine.weights.validation - Math.min(validation.errors.length, appConfig.atsEngine.weights.validation)
  );

  const suggestions = [...new Set([
    ...validation.errors.slice(0, 5),
    !hasActionVerb(text) ? "Add stronger action verbs such as Developed, Built, Led, or Optimized." : "",
    !hasMetric(text) ? "Add measurable outcomes such as percentages, counts, or time savings." : "",
    missingKeywords.length ? `Add job description keywords: ${missingKeywords.slice(0, 6).join(", ")}` : "",
    projectDepthMatches.length !== allProjects.length
      ? "Make every project include tools, frameworks, and impact to improve ATS depth."
      : ""
  ].filter(Boolean))];

  return {
    score: Math.min(100, keywordScore + actionVerbScore + metricsScore + sectionScore + projectDepthScore + validationScore),
    missingKeywords,
    matchedKeywords,
    suggestions
  };
}

export function mapGithubReposToProjects(repositories = []) {
  return ensureArray(repositories)
    .slice(0, appConfig.github.maxProjects)
    .map((repository) => ({
      name: repository.name,
      description: sentence(
        repository.description,
        `Built and maintained ${repository.name} with production-focused engineering and documented repository workflows`
      ),
      toolsUsed: ["Git", "GitHub Actions"],
      frameworksUsed: repository.topics?.filter((topic) => /react|express|spring|django|next|vue/i.test(topic)) || [],
      technologies: [...new Set([repository.language, ...(repository.topics || []).slice(0, 4)].filter(Boolean))],
      githubLink: repository.html_url || "",
      liveLink: repository.homepage || "",
      impact: sentence(
        repository.stargazers_count
          ? `Earned ${repository.stargazers_count}+ stars and showcased practical implementation quality`
          : `Improved development throughput and demonstrated reusable project delivery`
      )
    }));
}

export function buildLinkedInImport(input = {}) {
  const role = nonEmpty(input.role || input.personal?.role, "Backend Developer");
  const fullName = nonEmpty(input.fullName || input.personal?.fullName, "Candidate");
  const profile = appConfig.roleProfiles[role] || appConfig.roleProfiles["Backend Developer"];

  return {
    headline: `${role} | ${profile.summarySnippet}`,
    summary: `${fullName} is a ${role.toLowerCase()} focused on ${flattenSkills(profile.skillGroups).slice(0, 4).join(", ")} and measurable business outcomes.`,
    suggestions: [
      "Use your LinkedIn headline as a one-line role statement in the resume header.",
      "Turn LinkedIn responsibilities into metrics-driven project impact statements.",
      "Mirror your top GitHub repositories in the Projects section."
    ]
  };
}
