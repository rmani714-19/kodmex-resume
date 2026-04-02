function updateArray(items, index, patch) {
  return items.map((item, currentIndex) => (currentIndex === index ? { ...item, ...patch } : item));
}

function splitItems(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SkillsSectionEditor({ groups = [], onChange }) {
  return (
    <section className="app-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Skills</h3>
          <p className="mt-1 text-sm text-slate-500">Group skills by category so recruiters and ATS can scan them quickly.</p>
        </div>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          onClick={() => onChange([...(groups || []), { group: "", items: [] }])}
        >
          Add Group
        </button>
      </div>

      <div className="space-y-4">
        {(groups || []).map((group, index) => (
          <article key={`skill-group-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <label className="block">
                <span className="field-label">Group</span>
                <input
                  className="field-input"
                  value={group.group || ""}
                  onChange={(event) => onChange(updateArray(groups, index, { group: event.target.value }))}
                />
              </label>
              <label className="block">
                <span className="field-label">Items</span>
                <input
                  className="field-input"
                  value={(group.items || []).join(", ")}
                  onChange={(event) => onChange(updateArray(groups, index, { items: splitItems(event.target.value) }))}
                  placeholder="Java, Spring Boot, REST API"
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
