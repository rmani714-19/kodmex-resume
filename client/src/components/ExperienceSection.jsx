import { useState } from "react";

function splitTagInput(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function updateArray(items, index, patch) {
  return items.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item));
}

function updateProject(items, experienceIndex, projectIndex, patch) {
  return items.map((item, currentIndex) =>
    currentIndex === experienceIndex
      ? {
          ...item,
          projects: item.projects.map((project, currentProjectIndex) =>
            currentProjectIndex === projectIndex ? { ...project, ...patch } : project
          )
        }
      : item
  );
}

function createProject() {
  return {
    projectName: "",
    description: "",
    toolsUsed: [],
    frameworksUsed: [],
    technologies: [],
    githubLink: "",
    impact: ""
  };
}

function createExperience() {
  return {
    company: "",
    designation: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: true,
    projects: [createProject()]
  };
}

export default function ExperienceSection({ items = [], onChange }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  function moveItem(index) {
    const targetIndex = index === items.length - 1 ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
    onChange(nextItems);
    setExpandedIndex(targetIndex);
  }

  function removeItem(index) {
    const nextItems = items.filter((_, currentIndex) => currentIndex !== index);
    onChange(nextItems.length ? nextItems : [createExperience()]);
    setExpandedIndex(Math.max(0, index - 1));
  }

  return (
    <section className="app-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Experience</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add each company once, then capture one or more measurable projects underneath it.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {(items || []).map((item, experienceIndex) => (
          <article
            key={`experience-${experienceIndex}`}
            className="rounded-[12px] border border-slate-200 bg-white px-5 py-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h4 className="truncate text-lg font-semibold text-slate-900">
                  {(item.designation || "Designation") + (item.company ? ` • ${item.company}` : "")}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  {[item.location || "Location", [item.startDate, item.isCurrent ? "Present" : item.endDate].filter(Boolean).join(" - ")]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="ghost-icon-button" onClick={() => setExpandedIndex(experienceIndex)} title="Edit">
                  ✎
                </button>
                <button type="button" className="ghost-icon-button" onClick={() => removeItem(experienceIndex)} title="Delete">
                  🗑
                </button>
                <button type="button" className="ghost-icon-button" onClick={() => moveItem(experienceIndex)} title="Move">
                  ↕
                </button>
              </div>
            </div>

            {expandedIndex === experienceIndex ? (
              <>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="field-label">Company</span>
                    <input
                      className="field-input"
                      value={item.company || ""}
                      onChange={(event) => onChange(updateArray(items, experienceIndex, { company: event.target.value }))}
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Designation</span>
                    <input
                      className="field-input"
                      value={item.designation || ""}
                      onChange={(event) => onChange(updateArray(items, experienceIndex, { designation: event.target.value }))}
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Location</span>
                    <input
                      className="field-input"
                      value={item.location || ""}
                      onChange={(event) => onChange(updateArray(items, experienceIndex, { location: event.target.value }))}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="field-label">Start Date</span>
                      <input
                        className="field-input"
                        value={item.startDate || ""}
                        onChange={(event) => onChange(updateArray(items, experienceIndex, { startDate: event.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="field-label">End Date</span>
                      <input
                        className="field-input"
                        value={item.endDate || ""}
                        onChange={(event) => onChange(updateArray(items, experienceIndex, { endDate: event.target.value }))}
                        disabled={item.isCurrent}
                        placeholder={item.isCurrent ? "Present" : ""}
                      />
                    </label>
                  </div>
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={Boolean(item.isCurrent)}
                    onChange={(event) =>
                      onChange(
                        updateArray(items, experienceIndex, {
                          isCurrent: event.target.checked,
                          endDate: event.target.checked ? "" : item.endDate
                        })
                      )
                    }
                  />
                  Current role
                </label>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Projects under this role</h4>
                    <button
                      type="button"
                      className="button-secondary-pill"
                      onClick={() =>
                        onChange(
                          updateArray(items, experienceIndex, {
                            projects: [...(item.projects || []), createProject()]
                          })
                        )
                      }
                    >
                      + Add Project
                    </button>
                  </div>

                  {(item.projects || []).map((project, projectIndex) => (
                    <div key={`project-${experienceIndex}-${projectIndex}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block">
                          <span className="field-label">Project Name</span>
                          <input
                            className="field-input"
                            value={project.projectName || ""}
                            onChange={(event) =>
                              onChange(updateProject(items, experienceIndex, projectIndex, { projectName: event.target.value }))
                            }
                          />
                        </label>
                        <label className="block">
                          <span className="field-label">GitHub Link</span>
                          <input
                            className="field-input"
                            value={project.githubLink || ""}
                            onChange={(event) =>
                              onChange(updateProject(items, experienceIndex, projectIndex, { githubLink: event.target.value }))
                            }
                          />
                        </label>
                      </div>

                      <label className="mt-4 block">
                        <span className="field-label">Description</span>
                        <textarea
                          className="field-input min-h-24"
                          value={project.description || ""}
                          onChange={(event) =>
                            onChange(updateProject(items, experienceIndex, projectIndex, { description: event.target.value }))
                          }
                          placeholder="Explain what was built and how it worked."
                        />
                      </label>

                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <label className="block">
                          <span className="field-label">Tools Used</span>
                          <input
                            className="field-input"
                            value={(project.toolsUsed || []).join(", ")}
                            onChange={(event) =>
                              onChange(
                                updateProject(items, experienceIndex, projectIndex, {
                                  toolsUsed: splitTagInput(event.target.value)
                                })
                              )
                            }
                            placeholder="Git, Docker"
                          />
                        </label>
                        <label className="block">
                          <span className="field-label">Frameworks Used</span>
                          <input
                            className="field-input"
                            value={(project.frameworksUsed || []).join(", ")}
                            onChange={(event) =>
                              onChange(
                                updateProject(items, experienceIndex, projectIndex, {
                                  frameworksUsed: splitTagInput(event.target.value)
                                })
                              )
                            }
                            placeholder="Spring Boot, JUnit"
                          />
                        </label>
                        <label className="block">
                          <span className="field-label">Technologies</span>
                          <input
                            className="field-input"
                            value={(project.technologies || []).join(", ")}
                            onChange={(event) =>
                              onChange(
                                updateProject(items, experienceIndex, projectIndex, {
                                  technologies: splitTagInput(event.target.value)
                                })
                              )
                            }
                            placeholder="Java, MySQL"
                          />
                        </label>
                      </div>

                      <label className="mt-4 block">
                        <span className="field-label">Impact</span>
                        <textarea
                          className="field-input min-h-20"
                          value={project.impact || ""}
                          onChange={(event) =>
                            onChange(updateProject(items, experienceIndex, projectIndex, { impact: event.target.value }))
                          }
                          placeholder="State measurable results, efficiency gains, or business impact."
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-4 space-y-3">
                {(item.projects || []).map((project, projectIndex) => (
                  <div key={`project-summary-${experienceIndex}-${projectIndex}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{project.projectName || "Project"}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{project.description || "No project summary added yet."}</p>
                    {project.impact ? <p className="mt-2 text-sm font-medium text-slate-700">Impact: {project.impact}</p> : null}
                  </div>
                ))}

                <div className="flex gap-4 pt-1">
                  <button type="button" className="text-sm font-semibold text-slate-700" onClick={() => setExpandedIndex(experienceIndex)}>
                    Show more
                  </button>
                  <button type="button" className="text-sm font-semibold text-slate-700" onClick={() => setExpandedIndex(experienceIndex)}>
                    Edit description
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}

        <button
          type="button"
          className="dashed-add-card"
          onClick={() => {
            onChange([...(items || []), createExperience()]);
            setExpandedIndex(items.length);
          }}
        >
          + Add more experience
        </button>
      </div>
    </section>
  );
}
