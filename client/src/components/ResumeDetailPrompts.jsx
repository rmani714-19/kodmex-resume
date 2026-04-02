const promptFields = [
  {
    key: "yearsExperience",
    label: "Years of Experience",
    placeholder: "3+ years"
  },
  {
    key: "currentCompany",
    label: "Current Company / Internship",
    placeholder: "ABC Tech"
  },
  {
    key: "targetIndustry",
    label: "Target Industry",
    placeholder: "Fintech, SaaS, Healthcare"
  },
  {
    key: "topAchievement",
    label: "Top Achievement",
    placeholder: "Improved release reliability by 28%"
  },
  {
    key: "projectHighlight",
    label: "Best Project Highlight",
    placeholder: "Built internal dashboard used by 40+ team members"
  },
  {
    key: "jobDescription",
    label: "Target Job Description Keywords",
    placeholder: "Spring Boot, Microservices, AWS, Kafka"
  }
];

export default function ResumeDetailPrompts({ values, onChange }) {
  return (
    <section className="app-card space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Resume Assistant</p>
        <h3 className="mt-1 text-base font-semibold text-slate-900">Answer a few prompts to generate a better resume</h3>
        <p className="mt-1 text-sm text-slate-500">
          These answers improve summary quality, ATS keywords, project impact, and recruiter relevance instantly.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {promptFields.map((field) => (
          <label key={field.key} className={`block ${field.key === "jobDescription" || field.key === "projectHighlight" ? "md:col-span-2" : ""}`}>
            <span className="field-label">{field.label}</span>
            {field.key === "jobDescription" || field.key === "projectHighlight" ? (
              <textarea
                className="field-input min-h-24"
                value={values.guidance?.[field.key] || ""}
                onChange={(event) =>
                  onChange((draft) => ({
                    ...draft,
                    guidance: {
                      ...draft.guidance,
                      [field.key]: event.target.value
                    }
                  }))
                }
                placeholder={field.placeholder}
              />
            ) : (
              <input
                className="field-input"
                value={values.guidance?.[field.key] || ""}
                onChange={(event) =>
                  onChange((draft) => ({
                    ...draft,
                    guidance: {
                      ...draft.guidance,
                      [field.key]: event.target.value
                    }
                  }))
                }
                placeholder={field.placeholder}
              />
            )}
          </label>
        ))}
      </div>
    </section>
  );
}
