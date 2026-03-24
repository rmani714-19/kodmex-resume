interface ResumeContent {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    role?: string;
  };
  workExperience?: Array<{
    company: string;
    title: string;
    description?: string;
    achievements?: string[];
    startDate: string;
    endDate?: string;
    current?: boolean;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: Array<{ name: string; level?: string; category?: string }>;
  projects?: Array<{ name: string; description: string; technologies?: string[] }>;
  certifications?: string[];
  languages?: string[];
}

// KodMex ATS scoring weights (v3.0 spec)
const ATS_WEIGHTS = {
  keywords: 40,
  contentQuality: 20,
  formatting: 20,
  sections: 10,
  validation: 10,
};

// ATS validation rules from spec
const ACTION_VERBS = [
  "developed", "built", "led", "designed", "implemented", "optimized",
  "created", "managed", "delivered", "improved", "achieved", "executed",
  "spearheaded", "orchestrated", "accelerated", "engineered", "drove",
  "transformed", "launched", "reduced", "increased", "automated",
  "deployed", "architected", "scaled", "maintained", "collaborated",
  "mentored", "streamlined", "integrated",
];
const METRICS_REGEX = /(\d+%|\d+\+?|\d+x|increase[d]?|reduc[ed]+|improv[ed]+|grew|saved|generated)/i;

function hasActionVerb(text: string): boolean {
  const lower = text.toLowerCase();
  return ACTION_VERBS.some((v) => lower.includes(v));
}

function hasMetric(text: string): boolean {
  return METRICS_REGEX.test(text);
}

function extractText(content: ResumeContent): string {
  const parts: string[] = [];
  if (content.personalInfo?.summary) parts.push(content.personalInfo.summary);
  if (content.personalInfo?.role) parts.push(content.personalInfo.role);
  (content.workExperience || []).forEach((exp) => {
    parts.push(exp.title, exp.company);
    if (exp.description) parts.push(exp.description);
    (exp.achievements || []).forEach((a) => parts.push(a));
  });
  (content.education || []).forEach((edu) => {
    parts.push(edu.degree, edu.institution);
    if (edu.field) parts.push(edu.field);
  });
  (content.skills || []).forEach((s) => parts.push(s.name, s.category || ""));
  (content.projects || []).forEach((p) => {
    parts.push(p.name, p.description);
    (p.technologies || []).forEach((t) => parts.push(t));
  });
  (content.certifications || []).forEach((c) => parts.push(c));
  return parts.join(" ").toLowerCase();
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
    "with", "by", "from", "as", "is", "was", "are", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "shall", "can", "need", "must", "not", "no", "nor", "so",
    "yet", "both", "either", "neither", "each", "every", "all", "any", "few",
    "more", "most", "other", "some", "such", "than", "then", "these", "those",
    "this", "that", "their", "there", "they", "we", "you", "he", "she", "it",
    "its", "our", "your", "my", "his", "her", "who", "which", "what", "when",
    "where", "how", "why", "while", "also", "just", "into", "through", "about",
    "after", "before", "during", "without", "within", "including", "up", "out",
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s\+\#\.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
  return [...new Set(words)];
}

function determineImportance(keyword: string, jobText: string): "high" | "medium" | "low" {
  const count = (jobText.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length;
  if (count >= 3) return "high";
  if (count >= 2) return "medium";
  return "low";
}

// --- SCORE COMPONENTS ---

function scoreKeywords(
  resumeText: string,
  jobKeywords: string[],
  jobText: string
): { score: number; matches: Array<{ keyword: string; found: boolean; importance: "high" | "medium" | "low"; suggestion?: string }> } {
  const matches = jobKeywords.slice(0, 30).map((keyword) => {
    const found = resumeText.includes(keyword);
    const importance = determineImportance(keyword, jobText);
    return { keyword, found, importance, suggestion: found ? undefined : `Add "${keyword}" to your resume.` };
  });
  const highWeight = 3, medWeight = 2, lowWeight = 1;
  let earned = 0, maxPossible = 0;
  matches.forEach(({ found, importance }) => {
    const w = importance === "high" ? highWeight : importance === "medium" ? medWeight : lowWeight;
    if (found) earned += w;
    maxPossible += w;
  });
  const keywordScore = maxPossible > 0 ? (earned / maxPossible) * ATS_WEIGHTS.keywords : 0;
  return { score: Math.round(keywordScore), matches };
}

function scoreContentQuality(content: ResumeContent): { score: number; suggestions: string[] } {
  const suggestions: string[] = [];
  let earned = 0;
  const maxScore = ATS_WEIGHTS.contentQuality;

  // Summary quality (6pts)
  const summary = content.personalInfo?.summary || "";
  const summaryWords = summary.trim().split(/\s+/).filter(Boolean).length;
  if (summaryWords >= 20) earned += 6;
  else if (summaryWords >= 10) { earned += 3; suggestions.push("Expand your summary to at least 20 words."); }
  else suggestions.push("Write a professional summary of at least 20 words.");

  // Experience quality (8pts)
  const exps = content.workExperience || [];
  if (exps.length > 0) {
    let expScore = 0;
    exps.forEach((exp) => {
      const desc = exp.description || "";
      if (hasActionVerb(desc)) expScore += 2;
      else suggestions.push(`Use action verbs in your ${exp.company} description.`);
      if (hasMetric(desc)) expScore += 2;
      else suggestions.push(`Add measurable metrics to your ${exp.company} description.`);
    });
    earned += Math.min(8, expScore);
  } else {
    suggestions.push("Add work experience to improve content quality.");
    earned += 0;
  }

  // Skills quality (3pts)
  const skills = content.skills || [];
  if (skills.length >= 5) earned += 3;
  else if (skills.length >= 3) { earned += 2; suggestions.push("Add at least 5 skills."); }
  else suggestions.push("Add at least 3 skills (required by ATS).");

  // Projects (3pts)
  const projects = content.projects || [];
  if (projects.length > 0) {
    let projScore = 0;
    projects.forEach((p) => {
      const words = p.description?.trim().split(/\s+/).length || 0;
      if (words >= 15) projScore += 2;
    });
    earned += Math.min(3, projScore);
  }

  return { score: Math.min(maxScore, Math.round(earned)), suggestions };
}

function scoreFormatting(content: ResumeContent, resumeText: string): { score: number; suggestions: string[] } {
  const suggestions: string[] = [];
  let earned = 0;
  const maxScore = ATS_WEIGHTS.formatting;

  // Word count (6pts)
  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 300 && wordCount <= 800) earned += 6;
  else if (wordCount >= 200) { earned += 4; suggestions.push("Aim for 300–800 words for best ATS compatibility."); }
  else { earned += 2; suggestions.push("Your resume is too brief. Add more detail (300–800 words ideal)."); }

  // Contact completeness (6pts)
  const pi = content.personalInfo;
  if (pi.email) earned += 2;
  if (pi.phone) earned += 2;
  else suggestions.push("Add a phone number.");
  if (pi.location) earned += 2;
  else suggestions.push("Add your location (city, state).");

  // Role specified (4pts)
  if (pi.role || (content.workExperience && content.workExperience.length > 0)) earned += 4;
  else suggestions.push("Specify your target role/title.");

  // Certifications (4pts)
  const certs = content.certifications || [];
  if (certs.length > 0) earned += 4;
  else suggestions.push("Consider adding certifications to stand out.");

  return { score: Math.min(maxScore, Math.round(earned)), suggestions };
}

function scoreSections(content: ResumeContent): { score: number; suggestions: string[] } {
  const suggestions: string[] = [];
  let earned = 0;
  const maxScore = ATS_WEIGHTS.sections;
  const requiredSections = ["personal", "education", "skills", "summary"];
  const present: Record<string, boolean> = {
    personal: !!(content.personalInfo?.fullName && content.personalInfo?.email),
    education: !!(content.education && content.education.length > 0),
    skills: !!(content.skills && content.skills.length >= 3),
    summary: !!(content.personalInfo?.summary && content.personalInfo.summary.trim().length > 10),
  };
  const perSection = maxScore / requiredSections.length;
  requiredSections.forEach((section) => {
    if (present[section]) earned += perSection;
    else suggestions.push(`Complete the ${section} section (required).`);
  });
  return { score: Math.round(earned), suggestions };
}

function scoreValidation(content: ResumeContent): { score: number; suggestions: string[] } {
  const suggestions: string[] = [];
  let earned = 0;
  const maxScore = ATS_WEIGHTS.validation;
  const exps = content.workExperience || [];

  // Action verbs (4pts)
  const allDescriptions = exps.map((e) => e.description || "").join(" ");
  if (exps.length === 0 || hasActionVerb(allDescriptions)) earned += 4;
  else suggestions.push("Use action verbs: developed, built, led, implemented, etc.");

  // Metrics (3pts)
  if (exps.length === 0 || hasMetric(allDescriptions)) earned += 3;
  else suggestions.push("Add measurable results: %, $, numbers, or improvement words.");

  // Skills unique & min 3 (3pts)
  const skillNames = (content.skills || []).map((s) => s.name.toLowerCase());
  const uniqueSkills = new Set(skillNames);
  if (uniqueSkills.size >= 3) earned += 3;
  else suggestions.push("Add at least 3 unique skills.");

  return { score: Math.min(maxScore, Math.round(earned)), suggestions };
}

// --- MAIN EXPORT ---

export function calculateAtsScore(
  content: ResumeContent,
  jobDescription: string
): {
  overallScore: number;
  grade: string;
  keywordMatches: Array<{ keyword: string; found: boolean; importance: "high" | "medium" | "low"; suggestion?: string }>;
  sections: Array<{ name: string; score: number; maxScore: number; feedback: string; suggestions: string[] }>;
  missingKeywords: string[];
  improvementSuggestions: string[];
  strengths: string[];
} {
  const resumeText = extractText(content);
  const jobText = jobDescription.toLowerCase();
  const jobKeywords = extractKeywords(jobText);

  const { score: kwScore, matches: keywordMatches } = scoreKeywords(resumeText, jobKeywords, jobText);
  const { score: cqScore, suggestions: cqSuggestions } = scoreContentQuality(content);
  const { score: fmtScore, suggestions: fmtSuggestions } = scoreFormatting(content, resumeText);
  const { score: secScore, suggestions: secSuggestions } = scoreSections(content);
  const { score: valScore, suggestions: valSuggestions } = scoreValidation(content);

  const overallScore = Math.min(100, kwScore + cqScore + fmtScore + secScore + valScore);

  const grade =
    overallScore >= 85 ? "A" :
    overallScore >= 70 ? "B" :
    overallScore >= 55 ? "C" :
    overallScore >= 40 ? "D" : "F";

  const sectionResults = [
    {
      name: "Keyword Match",
      score: kwScore,
      maxScore: ATS_WEIGHTS.keywords,
      feedback: kwScore >= 30 ? "Strong keyword alignment." : kwScore >= 20 ? "Decent match, some keywords missing." : "Low keyword density — tailor to job description.",
      suggestions: [],
    },
    {
      name: "Content Quality",
      score: cqScore,
      maxScore: ATS_WEIGHTS.contentQuality,
      feedback: cqScore >= 16 ? "High-quality content with metrics." : cqScore >= 10 ? "Good content, some improvements possible." : "Content needs more depth and metrics.",
      suggestions: cqSuggestions,
    },
    {
      name: "Formatting",
      score: fmtScore,
      maxScore: ATS_WEIGHTS.formatting,
      feedback: fmtScore >= 16 ? "Well-formatted and complete." : fmtScore >= 10 ? "Good structure, a few details missing." : "Missing key contact or formatting details.",
      suggestions: fmtSuggestions,
    },
    {
      name: "Required Sections",
      score: secScore,
      maxScore: ATS_WEIGHTS.sections,
      feedback: secScore >= 8 ? "All required sections present." : "Some required sections are incomplete.",
      suggestions: secSuggestions,
    },
    {
      name: "Validation",
      score: valScore,
      maxScore: ATS_WEIGHTS.validation,
      feedback: valScore >= 8 ? "Passes all validation checks." : "Failed some validation rules.",
      suggestions: valSuggestions,
    },
  ];

  const missingKeywords = keywordMatches
    .filter((k) => !k.found && k.importance === "high")
    .map((k) => k.keyword)
    .slice(0, 10);

  const allSuggestions = [...cqSuggestions, ...fmtSuggestions, ...secSuggestions, ...valSuggestions];
  if (missingKeywords.length > 0) {
    allSuggestions.unshift(`Add these high-priority keywords: ${missingKeywords.slice(0, 5).join(", ")}.`);
  }

  const strengths: string[] = [];
  if (kwScore >= 30) strengths.push("Strong keyword alignment with job description");
  if (cqScore >= 16) strengths.push("High-quality content with action verbs and metrics");
  if (fmtScore >= 16) strengths.push("Well-formatted and complete contact info");
  if (secScore >= 8) strengths.push("All required ATS sections present");
  if (valScore >= 8) strengths.push("Passes all validation checks");
  if (strengths.length === 0) strengths.push("Resume has foundational structure — keep improving!");

  return {
    overallScore,
    grade,
    keywordMatches,
    sections: sectionResults,
    missingKeywords,
    improvementSuggestions: allSuggestions.slice(0, 8),
    strengths,
  };
}

// Auto-generate summary templates (v3.0 spec)
const SUMMARY_TEMPLATES: Record<string, string> = {
  fresher: "Motivated {role} graduate with a strong foundation in {skills}. Eager to apply theoretical knowledge and build impactful solutions.",
  mid: "Results-driven {role} with {years}+ years of experience delivering scalable solutions. Proven track record in {skills} with measurable impact.",
  senior: "Senior {role} with extensive experience architecting and delivering enterprise-grade solutions. Expert in {skills}, driving cross-functional teams toward business goals.",
  school: "Ambitious student with hands-on experience in {skills} through academic projects and competitions. Passionate about {role} and eager to grow.",
};

export function autoGenerateSummary(
  role: string,
  skills: string[],
  experienceLevel: "school" | "fresher" | "mid" | "senior" = "fresher"
): string {
  const template = SUMMARY_TEMPLATES[experienceLevel] || SUMMARY_TEMPLATES.fresher;
  const topSkills = skills.slice(0, 3).join(", ") || "technology";
  return template
    .replace(/{role}/g, role || "professional")
    .replace(/{skills}/g, topSkills)
    .replace(/{years}/g, experienceLevel === "mid" ? "3" : "7");
}

export function enhanceContent(
  section: string,
  currentContent: string,
  context?: string,
  jobDescription?: string
): { enhancedContent: string; suggestions: string[]; explanation: string } {
  const suggestions: string[] = [];
  let enhancedContent = currentContent;
  let explanation = "";

  switch (section) {
    case "summary": {
      const lines = currentContent.split(".").filter((s) => s.trim().length > 0);
      const enhanced = lines.map((line) => {
        const trimmed = line.trim();
        if (trimmed.length < 20) return trimmed;
        if (!METRICS_REGEX.test(trimmed)) return trimmed + " with proven results";
        return trimmed;
      }).join(". ");
      enhancedContent = enhanced + (enhanced.endsWith(".") ? "" : ".");
      suggestions.push("Quantify your impact with specific numbers and percentages.");
      suggestions.push("Start with your most impressive achievement.");
      suggestions.push("Include your target role/title at the start.");
      explanation = "Enhanced your summary with result-oriented language and stronger positioning.";
      break;
    }
    case "workExperience": {
      const bullets = currentContent.split("\n").filter((l) => l.trim());
      let verbIdx = 0;
      const enhanced = bullets.map((bullet) => {
        const clean = bullet.replace(/^[-•*]\s*/, "").trim();
        if (clean.length < 10) return bullet;
        const hasVerb = ACTION_VERBS.some((v) => clean.toLowerCase().startsWith(v));
        if (!hasVerb) {
          const verb = ACTION_VERBS[verbIdx % ACTION_VERBS.length];
          verbIdx++;
          return `• ${verb.charAt(0).toUpperCase() + verb.slice(1)} ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
        }
        return `• ${clean}`;
      });
      enhancedContent = enhanced.join("\n");
      suggestions.push("Add metrics: percentages, dollar amounts, team sizes, timeframes.");
      suggestions.push("Use strong action verbs at the start of each bullet.");
      suggestions.push("Focus on accomplishments, not just responsibilities.");
      explanation = "Reformatted bullets with stronger action verbs and consistent structure.";
      break;
    }
    case "skills": {
      const skillList = currentContent.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
      const unique = [...new Set(skillList)];
      enhancedContent = unique.join(", ");
      suggestions.push("Group skills by category (Technical, Tools, Soft Skills).");
      suggestions.push("Add proficiency levels where relevant.");
      suggestions.push(`Ensure at least 3 skills (you have ${unique.length}).`);
      explanation = "Removed duplicate skills and ensured uniqueness for ATS optimization.";
      break;
    }
    case "achievements": {
      const lines = currentContent.split("\n").filter((l) => l.trim());
      const enhanced = lines.map((line) => {
        const clean = line.replace(/^[-•*]\s*/, "").trim();
        if (!METRICS_REGEX.test(clean)) return `• ${clean} (add a specific number or % here)`;
        return `• ${clean}`;
      });
      enhancedContent = enhanced.join("\n");
      suggestions.push("Every achievement needs a number or percentage.");
      suggestions.push("Use STAR: Situation, Task, Action, Result.");
      explanation = "Highlighted achievements that need quantification for stronger impact.";
      break;
    }
    default:
      explanation = "Content reviewed and improvements applied.";
  }

  return { enhancedContent, suggestions, explanation };
}
