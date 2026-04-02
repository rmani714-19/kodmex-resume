function updateArray(items, index, patch) {
  return items.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item));
}

function splitTagInput(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function RepeatableSection({
  title,
  itemLabel,
  items = [],
  fields = [],
  onChange,
  createItem,
  renderExtraFields = false
}) {
  const factory =
    createItem ||
    (() =>
      fields.reduce((accumulator, field) => {
        accumulator[field.key] = field.type === "tags" ? [] : "";
        return accumulator;
      }, {}));

  return (
    <section className="app-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">Add multiple entries and keep each one concise and recruiter-friendly.</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={() => onChange([...(items || []), factory()])}
        >
          Add {itemLabel}
        </button>
      </div>

      <div className="space-y-4">
        {(items || []).map((item, index) => (
          <article key={`${title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              {(fields.length
                ? fields
                : [
                    { key: "name", label: "Name", type: "text" },
                    { key: "description", label: "Description", type: "textarea" },
                    { key: "impact", label: "Impact", type: "textarea" },
                    { key: "githubLink", label: "GitHub Link", type: "url" },
                    { key: "liveLink", label: "Live Link", type: "url" }
                  ]
              ).map((field) => (
                <label key={field.key} className={`block ${field.type === "textarea" ? "md:col-span-2" : ""}`}>
                  <span className="field-label">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      className="field-input min-h-24"
                      value={item[field.key] || ""}
                      onChange={(event) => onChange(updateArray(items, index, { [field.key]: event.target.value }))}
                    />
                  ) : (
                    <input
                      className="field-input"
                      type={field.type === "number" ? "text" : field.type}
                      value={item[field.key] || ""}
                      onChange={(event) => onChange(updateArray(items, index, { [field.key]: event.target.value }))}
                    />
                  )}
                </label>
              ))}

              {renderExtraFields ? (
                <>
                  <label className="block">
                    <span className="field-label">Tools Used</span>
                    <input
                      className="field-input"
                      value={(item.toolsUsed || []).join(", ")}
                      onChange={(event) =>
                        onChange(updateArray(items, index, { toolsUsed: splitTagInput(event.target.value) }))
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="field-label">Frameworks Used</span>
                    <input
                      className="field-input"
                      value={(item.frameworksUsed || []).join(", ")}
                      onChange={(event) =>
                        onChange(updateArray(items, index, { frameworksUsed: splitTagInput(event.target.value) }))
                      }
                    />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="field-label">Technologies</span>
                    <input
                      className="field-input"
                      value={(item.technologies || []).join(", ")}
                      onChange={(event) =>
                        onChange(updateArray(items, index, { technologies: splitTagInput(event.target.value) }))
                      }
                    />
                  </label>
                </>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
