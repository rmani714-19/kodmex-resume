const themeOptions = ["#2563EB", "#4F46E5", "#10B981", "#F59E0B", "#DC2626"];

function cardClassName(hasHover = true) {
  return `rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4 ${hasHover ? "subtle-card-hover" : ""}`.trim();
}

export default function OtherSections({
  value,
  onChange,
  customSections,
  onChangeCustomSections,
  selectedTheme,
  onThemeChange
}) {
  function updateField(key, nextValue) {
    onChange({
      ...value,
      [key]: nextValue
    });
  }

  function updateCustomSection(index, key, nextValue) {
    onChangeCustomSections(
      customSections.map((section, currentIndex) =>
        currentIndex === index
          ? {
              ...section,
              [key]: nextValue
            }
          : section
      )
    );
  }

  function addCustomSection() {
    onChangeCustomSections([
      ...customSections,
      {
        id: `custom-${Date.now()}-${customSections.length}`,
        title: "",
        content: ""
      }
    ]);
  }

  function removeCustomSection(index) {
    onChangeCustomSections(customSections.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="space-y-4">
      <section className={cardClassName()}>
        <p className="mb-3 text-[13px] font-medium text-slate-700">Theme Accent</p>
        <div className="flex flex-wrap gap-3">
          {themeOptions.map((color) => {
            const active = selectedTheme === color;

            return (
              <button
                key={color}
                type="button"
                className={`pressable inline-flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  active ? "border-slate-900" : "border-slate-200"
                }`}
                style={{ background: color }}
                onClick={() => onThemeChange(color)}
                aria-label={`Select theme ${color}`}
                title={color}
              >
                {active ? <span className="text-sm font-bold text-white">✓</span> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className={cardClassName()}>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Languages</span>
          <textarea
            className="min-h-[120px] w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] leading-[1.6] outline-none"
            value={value.languages}
            onChange={(event) => updateField("languages", event.target.value)}
          />
        </label>
      </section>

      <section className={cardClassName()}>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Certifications</span>
          <textarea
            className="min-h-[120px] w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] leading-[1.6] outline-none"
            value={value.certifications}
            onChange={(event) => updateField("certifications", event.target.value)}
          />
        </label>
      </section>

      <section className={cardClassName()}>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Achievements</span>
          <textarea
            className="min-h-[120px] w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] leading-[1.6] outline-none"
            value={value.achievements}
            onChange={(event) => updateField("achievements", event.target.value)}
          />
        </label>
      </section>

      <section className={cardClassName(false)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[13px] font-medium text-slate-700">Custom Sections</p>
            <p className="mt-1 text-[12px] text-slate-500">Add optional sections that appear at the end of the resume.</p>
          </div>
          <button type="button" className="button-secondary-pill pressable" onClick={addCustomSection}>
            Add Section
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {customSections.map((section, index) => {
            const titleError = !section.title.trim();
            const contentError = section.content.trim().length > 0 && section.content.trim().length < 10;

            return (
              <div key={section.id} className="subtle-card-hover rounded-[12px] border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <label className="block">
                      <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Section Title</span>
                      <input
                        className="field-input"
                        type="text"
                        value={section.title}
                        onChange={(event) => updateCustomSection(index, "title", event.target.value)}
                        placeholder="Awards, Publications, Community, Volunteering"
                      />
                    </label>
                    {titleError ? <p className="mt-1 text-[12px] text-red-600">Title is required.</p> : null}
                  </div>

                  <button
                    type="button"
                    className="pressable mt-6 inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-3 text-[12px] font-semibold text-slate-700"
                    onClick={() => removeCustomSection(index)}
                  >
                    Remove
                  </button>
                </div>

                <label className="mt-4 block">
                  <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Content</span>
                  <textarea
                    className="min-h-[120px] w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] leading-[1.6] outline-none"
                    value={section.content}
                    onChange={(event) => updateCustomSection(index, "content", event.target.value)}
                    placeholder="Write concise ATS-friendly content for this section."
                  />
                </label>
                {contentError ? <p className="mt-1 text-[12px] text-red-600">Content must be at least 10 characters.</p> : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
