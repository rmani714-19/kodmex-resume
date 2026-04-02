import { resumeTemplates } from "../data/resumeTemplates.js";

function PreviewSkeleton({ template }) {
  const frameClass = template.classes.previewFrame;
  const sidebarClass = template.classes.previewSidebar;
  const strongClass = template.classes.previewStrong;
  const softClass = template.classes.previewSoft;
  const previewGridClass = (template.sidebarColumnsClass || "grid-cols-[0.34fr_0.66fr]").replaceAll("md:", "");

  if (template.family === "sidebar" || template.family === "darkSidebar" || template.family === "accentSplit") {
    return (
      <div className={`mb-4 h-28 overflow-hidden rounded-xl border ${frameClass}`}>
        <div className={`grid h-full ${previewGridClass}`}>
          <div className={sidebarClass} />
          <div className="flex flex-col gap-2 p-3">
            <div className={`h-3 w-2/3 rounded-full ${strongClass}`} />
            <div className={`h-2 w-full rounded-full ${softClass}`} />
            <div className={`h-2 w-5/6 rounded-full ${softClass}`} />
            <div className={`mt-1 h-2 w-full rounded-full ${softClass}`} />
            <div className={`h-2 w-4/5 rounded-full ${softClass}`} />
          </div>
        </div>
      </div>
    );
  }

  if (template.family === "editorial") {
    return (
      <div className={`mb-4 h-28 overflow-hidden rounded-xl border ${frameClass}`}>
        <div className={`h-7 ${sidebarClass || "bg-transparent"}`} />
        <div className="space-y-2 p-3">
          <div className={`h-3 w-1/2 rounded-full ${strongClass}`} />
          <div className={`h-2 w-full rounded-full ${softClass}`} />
          <div className={`h-2 w-4/5 rounded-full ${softClass}`} />
          <div className={`h-2 w-full rounded-full ${softClass}`} />
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 h-28 overflow-hidden rounded-xl border ${frameClass}`}>
      <div className={`h-7 ${sidebarClass || "bg-transparent"}`} />
      <div className="space-y-2 p-3">
        <div className={`h-3 w-2/3 rounded-full ${strongClass}`} />
        <div className={`h-2 w-full rounded-full ${softClass}`} />
        <div className={`h-2 w-5/6 rounded-full ${softClass}`} />
        <div className={`mt-1 h-2 w-full rounded-full ${softClass}`} />
      </div>
    </div>
  );
}

function normalizeTemplateId(templateId) {
  if (templateId === "professional") {
    return "twoColumn";
  }

  if (templateId === "modernClean") {
    return "modern";
  }

  return templateId;
}

function getToolbarTemplates() {
  return resumeTemplates.filter((template) =>
    ["executivePro", "modernMinimal", "impactBold", "modern", "professional", "classic", "minimal"].includes(template.id)
  );
}

export default function TemplateSelector({ selectedTemplate, onSelect, variant = "cards" }) {
  if (variant === "toolbar") {
    return (
      <div className="flex flex-wrap gap-2">
        {getToolbarTemplates().map((template) => {
          const normalizedId = normalizeTemplateId(template.id);
          const active = selectedTemplate === normalizedId || selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              type="button"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
              onClick={() => onSelect(normalizedId)}
            >
              {normalizedId === "twoColumn" ? "Two Column" : normalizedId === "modern" ? "Modern" : template.name}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="h-full overflow-y-auto px-3 py-4">
        {resumeTemplates.map((template) => {
          const normalizedId = normalizeTemplateId(template.id);
          const active = normalizedId === selectedTemplate || template.id === selectedTemplate;

          return (
            <button
              key={template.id}
              type="button"
              className={`mb-3 block w-full rounded-[10px] border p-2 text-left transition ${
                active
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-600"
              }`}
              onClick={() => onSelect(normalizedId)}
            >
              <PreviewSkeleton template={template} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {normalizedId === "twoColumn" ? "Two Column" : normalizedId === "modern" ? "Modern" : template.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{template.preview}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    active ? "bg-blue-600 text-white" : template.badgeClass
                  }`}
                >
                  {active ? "Selected" : "Use"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <section className="app-card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Template Selector</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">Choose from 20 resume templates</h3>
        </div>
        <p className="hidden text-sm text-slate-500 sm:block">Switch templates any time without losing content</p>
      </div>

      <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
        {resumeTemplates.map((template) => {
          const normalizedId = normalizeTemplateId(template.id);
          const active = normalizedId === selectedTemplate || template.id === selectedTemplate;

          return (
            <button
              key={template.id}
              type="button"
              className={`min-w-[220px] snap-start rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white"
              }`}
              onClick={() => onSelect(normalizedId)}
            >
              <PreviewSkeleton template={template} />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {normalizedId === "twoColumn" ? "Two Column" : normalizedId === "modern" ? "Modern" : template.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{template.preview}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-emerald-500 text-white" : template.badgeClass}`}>
                  {active ? "Selected" : "Use"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
