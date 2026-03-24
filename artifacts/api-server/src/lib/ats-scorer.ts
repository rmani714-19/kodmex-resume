interface ResumeContent {
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
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

function extractText(content: ResumeContent): string {
  const parts: string[] = [];

  if (content.personalInfo?.summary) parts.push(content.personalInfo.summary);

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
  (content.languages || []).forEach((l) => parts.push(l));

  return parts.join(" ").toLowerCase();
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
    "with", "by", "from", "as", "is", "was", "are", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "shall", "can", "need", "must", "ought", "used", "able",
    "not", "no", "nor", "so", "yet", "both", "either", "neither", "each", "every",
    "all", "any", "few", "more", "most", "other", "some", "such", "than", "then",
    "these", "those", "this", "that", "their", "there", "they", "we", "you", "he",
    "she", "it", "its", "our", "your", "my", "his", "her", "who", "which", "what",
    "when", "where", "how", "why", "while", "also", "just", "into", "through",
    "about", "after", "before", "during", "without", "within", "including",
    "across", "behind", "beyond", "plus", "except", "up", "out", "around", "over",
    "under", "between", "throughout", "along", "following", "among", "whereas",
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

function scoreSection(
  sectionName: string,
  content: ResumeContent,
  jobKeywords: string[],
  resumeText: string
): { name: string; score: number; maxScore: number; feedback: string; suggestions: string[] } {
  const suggestions: string[] = [];

  switch (sectionName) {
    case "Contact & Summary": {
      let score = 0;
      const max = 20;
      const pi = content.personalInfo;
      if (pi.email) score += 4;
      if (pi.phone) score += 3;
      if (pi.location) score += 3;
      if (pi.summary && pi.summary.length > 50) {
        score += 5;
        const summaryLower = pi.summary.toLowerCase();
        const summaryKeywordHits = jobKeywords.filter((k) => summaryLower.includes(k)).length;
        score += Math.min(5, summaryKeywordHits * 1.5);
      } else {
        suggestions.push("Add a compelling professional summary that includes key skills from the job description.");
      }
      const feedback =
        score >= 15
          ? "Strong contact section with a well-tailored summary."
          : score >= 10
            ? "Good basics, but your summary could be more impactful."
            : "Your summary is missing or too brief. Add keywords from the job posting.";
      return { name: sectionName, score: Math.round(score), maxScore: max, feedback, suggestions };
    }

    case "Work Experience": {
      let score = 0;
      const max = 35;
      const exps = content.workExperience || [];
      if (exps.length === 0) {
        suggestions.push("Add work experience entries to strengthen your resume.");
        return { name: sectionName, score: 0, maxScore: max, feedback: "No work experience listed.", suggestions };
      }
      score += Math.min(10, exps.length * 3);
      exps.forEach((exp) => {
        const expText = `${exp.title} ${exp.company} ${exp.description || ""} ${(exp.achievements || []).join(" ")}`.toLowerCase();
        const hits = jobKeywords.filter((k) => expText.includes(k)).length;
        score += Math.min(8, hits * 1.2);
        if (!exp.achievements || exp.achievements.length === 0) {
          suggestions.push(`Add measurable achievements for your role at ${exp.company}.`);
        }
        if (exp.description && exp.description.length < 50) {
          suggestions.push(`Expand your description for ${exp.company} to include more detail.`);
        }
      });
      const finalScore = Math.min(max, Math.round(score));
      const feedback =
        finalScore >= 28
          ? "Excellent work experience section with strong keyword alignment."
          : finalScore >= 20
            ? "Good experience, but could better mirror the job description language."
            : "Work experience needs more detail and job-specific keywords.";
      return { name: sectionName, score: finalScore, maxScore: max, feedback, suggestions };
    }

    case "Skills": {
      let score = 0;
      const max = 25;
      const skills = content.skills || [];
      if (skills.length === 0) {
        suggestions.push("Add a skills section with relevant technical and soft skills.");
        return { name: sectionName, score: 0, maxScore: max, feedback: "No skills listed.", suggestions };
      }
      const skillNames = skills.map((s) => s.name.toLowerCase());
      const matchedSkills = jobKeywords.filter((k) => skillNames.some((s) => s.includes(k) || k.includes(s)));
      score += Math.min(20, matchedSkills.length * 2.5);
      if (skills.length >= 5) score += 5;
      else suggestions.push("Add at least 5-10 skills to improve ATS matching.");
      const finalScore = Math.min(max, Math.round(score));
      const feedback =
        finalScore >= 20
          ? "Strong skills section matching the job requirements."
          : finalScore >= 12
            ? "Good skills listed, but some key skills from the job description are missing."
            : "Your skills section needs more keywords from the job description.";
      return { name: sectionName, score: finalScore, maxScore: max, feedback, suggestions };
    }

    case "Education": {
      let score = 0;
      const max = 10;
      const edu = content.education || [];
      if (edu.length === 0) {
        suggestions.push("Add your educational background.");
      } else {
        score += 6;
        if (edu[0].field) score += 2;
        const eduText = edu.map((e) => `${e.degree} ${e.institution} ${e.field || ""}`).join(" ").toLowerCase();
        const hits = jobKeywords.filter((k) => eduText.includes(k)).length;
        score += Math.min(2, hits);
      }
      const feedback =
        score >= 8 ? "Education section looks good." : "Add your degree, institution, and field of study.";
      return { name: sectionName, score: Math.round(score), maxScore: max, feedback, suggestions };
    }

    case "Format & Completeness": {
      let score = 0;
      const max = 10;
      const wordCount = resumeText.split(/\s+/).length;
      if (wordCount >= 300 && wordCount <= 800) score += 5;
      else if (wordCount > 800) {
        score += 3;
        suggestions.push("Your resume may be too long. Aim for 300-800 words for best ATS performance.");
      } else {
        score += 2;
        suggestions.push("Your resume is too brief. Add more detail to improve ATS compatibility.");
      }
      if (content.personalInfo.phone) score += 2;
      if (content.skills && content.skills.length > 0) score += 1;
      if (content.workExperience && content.workExperience.length > 0) score += 1;
      if (content.education && content.education.length > 0) score += 1;
      return {
        name: sectionName,
        score: Math.min(max, Math.round(score)),
        maxScore: max,
        feedback:
          score >= 8 ? "Well-structured and complete resume." : "Improve completeness by filling in all sections.",
        suggestions,
      };
    }

    default:
      return { name: sectionName, score: 0, maxScore: 10, feedback: "", suggestions: [] };
  }
}

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

  const keywordMatches = jobKeywords.slice(0, 30).map((keyword) => {
    const found = resumeText.includes(keyword);
    const importance = determineImportance(keyword, jobText);
    return {
      keyword,
      found,
      importance,
      suggestion: found ? undefined : `Consider adding "${keyword}" to your resume.`,
    };
  });

  const missingKeywords = keywordMatches
    .filter((k) => !k.found && k.importance === "high")
    .map((k) => k.keyword)
    .slice(0, 10);

  const sectionNames = ["Contact & Summary", "Work Experience", "Skills", "Education", "Format & Completeness"];
  const sections = sectionNames.map((name) => scoreSection(name, content, jobKeywords, resumeText));

  const totalScore = sections.reduce((sum, s) => sum + s.score, 0);
  const maxTotal = sections.reduce((sum, s) => sum + s.maxScore, 0);
  const overallScore = Math.round((totalScore / maxTotal) * 100);

  const grade =
    overallScore >= 85 ? "A" : overallScore >= 70 ? "B" : overallScore >= 55 ? "C" : overallScore >= 40 ? "D" : "F";

  const allSuggestions = sections.flatMap((s) => s.suggestions);
  if (missingKeywords.length > 0) {
    allSuggestions.unshift(`Add these important keywords: ${missingKeywords.slice(0, 5).join(", ")}.`);
  }

  const strengths: string[] = [];
  if (sections[0].score >= 15) strengths.push("Strong professional summary");
  if (sections[1].score >= 28) strengths.push("Excellent work experience alignment");
  if (sections[2].score >= 20) strengths.push("Strong skills match");
  if (sections[3].score >= 8) strengths.push("Solid educational background");
  if (keywordMatches.filter((k) => k.found).length > keywordMatches.length * 0.7)
    strengths.push("High keyword density");
  if (strengths.length === 0) strengths.push("Resume has foundational structure in place");

  return {
    overallScore,
    grade,
    keywordMatches,
    sections,
    missingKeywords,
    improvementSuggestions: allSuggestions.slice(0, 8),
    strengths,
  };
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
      const enhanced = lines
        .map((line) => {
          const trimmed = line.trim();
          if (trimmed.length < 20) return trimmed;
          if (!trimmed.match(/\d/)) {
            return trimmed + " with proven results";
          }
          return trimmed;
        })
        .join(". ");
      enhancedContent = enhanced + (enhanced.endsWith(".") ? "" : ".");
      suggestions.push("Quantify your impact with specific numbers and percentages.");
      suggestions.push("Start with your most impressive achievement.");
      suggestions.push("Tailor this to match the job description keywords.");
      explanation = "Enhanced your summary to be more impactful by adding result-oriented language.";
      break;
    }

    case "workExperience": {
      const bullets = currentContent.split("\n").filter((l) => l.trim());
      const actionVerbs = [
        "Spearheaded", "Delivered", "Optimized", "Orchestrated", "Accelerated",
        "Engineered", "Drove", "Transformed", "Achieved", "Executed",
      ];
      let verbIdx = 0;
      const enhanced = bullets.map((bullet) => {
        const clean = bullet.replace(/^[-•*]\s*/, "").trim();
        if (clean.length < 10) return bullet;
        const hasVerb = /^[A-Z][a-z]+ed|^[A-Z][a-z]+ed|^Managed|^Led|^Built|^Created|^Developed/.test(clean);
        if (!hasVerb) {
          const verb = actionVerbs[verbIdx % actionVerbs.length];
          verbIdx++;
          return `• ${verb} ${clean.charAt(0).toLowerCase()}${clean.slice(1)}`;
        }
        return `• ${clean}`;
      });
      enhancedContent = enhanced.join("\n");
      suggestions.push("Add metrics: percentages, dollar amounts, team sizes, timeframes.");
      suggestions.push("Use strong action verbs at the start of each bullet.");
      suggestions.push("Focus on accomplishments, not just responsibilities.");
      explanation = "Reformatted bullets with stronger action verbs and a consistent structure.";
      break;
    }

    case "skills": {
      const skillList = currentContent.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
      const categorized = {
        "Technical": [] as string[],
        "Soft Skills": [] as string[],
        "Tools": [] as string[],
      };
      skillList.forEach((skill) => {
        const lower = skill.toLowerCase();
        if (lower.match(/communication|leadership|teamwork|problem|analytical|creative|manage/)) {
          categorized["Soft Skills"].push(skill);
        } else if (lower.match(/software|tool|platform|system|database|cloud|aws|azure|docker|git/)) {
          categorized["Tools"].push(skill);
        } else {
          categorized["Technical"].push(skill);
        }
      });
      const parts = Object.entries(categorized)
        .filter(([, skills]) => skills.length > 0)
        .map(([cat, skills]) => `${cat}: ${skills.join(", ")}`);
      enhancedContent = parts.join("\n") || currentContent;
      suggestions.push("Group skills by category for better readability.");
      suggestions.push("Add proficiency levels (Expert, Advanced, Intermediate).");
      explanation = "Organized your skills into logical categories for better ATS parsing and readability.";
      break;
    }

    case "achievements": {
      const lines = currentContent.split("\n").filter((l) => l.trim());
      const enhanced = lines.map((line) => {
        const clean = line.replace(/^[-•*]\s*/, "").trim();
        if (!clean.match(/\d+/)) {
          return `• ${clean} (consider adding specific metrics)`;
        }
        return `• ${clean}`;
      });
      enhancedContent = enhanced.join("\n");
      suggestions.push("Every achievement should have a number or percentage.");
      suggestions.push("Use the STAR method: Situation, Task, Action, Result.");
      explanation = "Structured your achievements for maximum impact with clear result indicators.";
      break;
    }

    default:
      explanation = "Content reviewed and minor improvements applied.";
  }

  return { enhancedContent, suggestions, explanation };
}
