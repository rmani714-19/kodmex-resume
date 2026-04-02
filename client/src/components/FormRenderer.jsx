import { appConfig } from "@shared/config.js";
import ExperienceSection from "./ExperienceSection.jsx";
import RepeatableSection from "./RepeatableSection.jsx";
import SkillsSectionEditor from "./SkillsSectionEditor.jsx";

function Field({ field, value, onChange }) {
  const commonProps = {
    className: "field-input",
    value: value || "",
    onChange: (event) => onChange(field.key, event.target.value),
    placeholder: field.placeholder || ""
  };

  return (
    <label className={`block ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
      <span className="field-label">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea {...commonProps} className="field-input min-h-28" />
      ) : (
        <input {...commonProps} type={field.type === "tel" ? "text" : field.type} />
      )}
    </label>
  );
}

export default function FormRenderer({ values, onChange, sectionIds = null }) {
  const sections = sectionIds
    ? appConfig.formSchema.sections.filter((section) => sectionIds.includes(section.id))
    : appConfig.formSchema.sections;

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        if (section.type === "fields") {
          return (
            <section key={section.id} className="app-card space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
                <p className="mt-1 text-sm text-slate-500">Keep contact details clean and recruiter-friendly.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <Field
                    key={field.key}
                    field={field}
                    value={values.personal?.[field.key]}
                    onChange={(key, nextValue) =>
                      onChange((draft) => ({
                        ...draft,
                        personal: {
                          ...draft.personal,
                          [key]: nextValue
                        }
                      }))
                    }
                  />
                ))}
              </div>
            </section>
          );
        }

        if (section.type === "textarea") {
          return (
            <section key={section.id} className="app-card">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900">{section.title}</h3>
                <p className="mt-1 text-sm text-slate-500">Leave this blank to auto-generate a recruiter-ready summary.</p>
              </div>
              <textarea
                className="field-input min-h-32"
                value={values.summary || ""}
                onChange={(event) =>
                  onChange((draft) => ({
                    ...draft,
                    summary: event.target.value
                  }))
                }
                placeholder={section.placeholder}
              />
            </section>
          );
        }

        if (section.id === "experience") {
          return (
            <ExperienceSection
              key={section.id}
              items={values.experience}
              onChange={(experience) =>
                onChange((draft) => ({
                  ...draft,
                  experience
                }))
              }
            />
          );
        }

        if (section.id === "projects") {
          return (
            <RepeatableSection
              key={section.id}
              title={section.title}
              itemLabel="Project"
              items={values.projects}
              createItem={() => ({
                name: "",
                description: "",
                toolsUsed: [],
                frameworksUsed: [],
                technologies: [],
                githubLink: "",
                liveLink: "",
                impact: ""
              })}
              onChange={(projects) =>
                onChange((draft) => ({
                  ...draft,
                  projects
                }))
              }
              renderExtraFields
            />
          );
        }

        if (section.id === "skills") {
          return (
            <SkillsSectionEditor
              key={section.id}
              groups={values.skills}
              onChange={(skills) =>
                onChange((draft) => ({
                  ...draft,
                  skills
                }))
              }
            />
          );
        }

        return (
          <RepeatableSection
            key={section.id}
            title={section.title}
            itemLabel={section.itemLabel}
            items={values[section.id]}
            fields={section.fields}
            onChange={(items) =>
              onChange((draft) => ({
                ...draft,
                [section.id]: items
              }))
            }
          />
        );
      })}
    </div>
  );
}
