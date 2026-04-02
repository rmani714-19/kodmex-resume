import { flattenSkills } from "@shared/resumeEngine.js";

function hasStrongProjectDepth(resume) {
  const projects = [
    ...(resume.projects || []),
    ...(resume.experience || []).flatMap((entry) => entry.projects || [])
  ];

  if (!projects.length) {
    return false;
  }

  return projects.every((project) => (project.toolsUsed || []).length && (project.frameworksUsed || []).length && project.impact);
}

function buildChecks(resume) {
  const skills = flattenSkills(resume.skills || []);
  const experienceProjects = (resume.experience || []).flatMap((entry) => entry.projects || []);

  return [
    {
      label: "Summary",
      done: Boolean(resume.summary && resume.summary.trim().length > 60),
      help: "Keep summary to 2-3 lines with role, strengths, and impact."
    },
    {
      label: "Skills",
      done: skills.length >= 5,
      help: "Add at least 5 relevant skills grouped by category."
    },
    {
      label: "Experience",
      done: experienceProjects.length >= 1,
      help: "Every experience entry should include at least one project."
    },
    {
      label: "Project Depth",
      done: hasStrongProjectDepth(resume),
      help: "Include tools, frameworks, technologies, and measurable impact in every project."
    },
    {
      label: "Contact Readiness",
      done: Boolean(resume.personal?.email && resume.personal?.phone && resume.personal?.location),
      help: "Add email, phone, and location so recruiters can act on the resume quickly."
    }
  ];
}

export default function ResumeCoachPanel({ resume }) {
  const checks = buildChecks(resume);
  const completed = checks.filter((item) => item.done).length;

  return (
    <article className="app-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Resume Coach</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Use this space to create a more effective resume</h3>
          <p className="mt-2 text-sm text-slate-500">
            Fix incomplete sections first, then sharpen outcomes, tools, and recruiter-facing clarity.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
          <strong className="block text-3xl font-bold text-slate-900">{completed}/5</strong>
          <span className="text-xs font-medium text-slate-500">priority checks complete</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {checks.map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border p-4 ${
              item.done ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
            }`}
          >
            <h4 className="text-sm font-semibold text-slate-900">{item.label}</h4>
            <p className="mt-1 text-sm text-slate-700">{item.help}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
