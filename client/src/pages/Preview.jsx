import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { autoGenerateResume } from "@shared/resumeEngine.js";
import ResumePreview from "../components/ResumePreview.jsx";
import TemplateSelector from "../components/TemplateSelector.jsx";
import { useResumeStore } from "../store/useResumeStore.js";
import { downloadResumeDocx, useResumePrint } from "../utils/download.js";

export default function Preview() {
  const { generatedResume, resumeData, selectedTemplate, setSelectedTemplate } = useResumeStore();
  const previewRef = useRef(null);
  const resume = useMemo(
    () => (resumeData?.personal?.fullName || resumeData?.personal?.role ? autoGenerateResume(resumeData) : generatedResume),
    [generatedResume, resumeData]
  );
  const handlePrintResume = useResumePrint({
    contentRef: previewRef,
    documentTitle: `${(resume?.personal?.fullName || "resume").trim() || "resume"}-${selectedTemplate}`
  });

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="app-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500">Preview Workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Review the final template-bound resume</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This page keeps the same template renderer as the builder so the preview and exported output stay aligned.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/builder"
              className="rounded-[12px] border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700"
            >
              Back to Editor
            </Link>
            <button type="button" className="button-primary" onClick={handlePrintResume}>
              Download PDF
            </button>
            <button
              type="button"
              className="rounded-[12px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              onClick={() => downloadResumeDocx(resume, selectedTemplate)}
            >
              Download DOCX
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 app-card">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">Template</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Change template inline</h2>
          </div>
          <TemplateSelector selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} variant="toolbar" />
        </div>
      </section>

      <div className="mt-6">
        <ResumePreview resume={resume} selectedTemplate={selectedTemplate} resumeRef={previewRef} />
      </div>
    </main>
  );
}
