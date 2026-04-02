import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <section className="premium-card overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-slate-50 p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500">7-Step Guided Flow</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-slate-900">
          Build a professional resume with guided steps, premium visuals, and exact template-based export.
        </h2>
        <p className="mt-4 max-w-3xl text-base text-slate-600">
          Kodmex Resume Builder now walks users through experience level, target company type, industries, template choice, build mode, personal details, and a live editor with exact PDF/DOCX export.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/builder" className="button-primary">
            Start Builder
          </Link>
          <Link to="/preview" className="rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
            Open Preview
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="selection-card">
            <h3 className="text-lg font-semibold">Guided Setup</h3>
            <p className="mt-2 text-sm text-slate-500">
              Seven centered steps reduce friction before users reach the live editing workspace.
            </p>
          </div>
          <div className="selection-card">
            <h3 className="text-lg font-semibold">Live Preview + ATS</h3>
            <p className="mt-2 text-sm text-slate-500">
              Real-time resume rendering stays bound to the selected template while ATS score updates alongside it.
            </p>
          </div>
          <div className="selection-card">
            <h3 className="text-lg font-semibold">Exact Export</h3>
            <p className="mt-2 text-sm text-slate-500">
              PDF uses the same preview template, and DOCX preserves section order and font consistency.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
