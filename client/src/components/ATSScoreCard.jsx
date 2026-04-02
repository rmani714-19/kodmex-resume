export default function ATSScoreCard({ atsScore, compact = false }) {
  if (!atsScore) {
    return (
      <article className="app-card">
        <h3 className="text-lg font-semibold text-slate-900">ATS Score</h3>
        <p className="mt-2 text-sm text-slate-500">Generate a resume to see keyword coverage, missing sections, and optimization suggestions.</p>
      </article>
    );
  }

  if (compact) {
    return (
      <article className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">ATS Score</p>
            <p className="mt-1 text-sm text-slate-500">Real-time score from current resume content.</p>
          </div>
          <div className="rounded-2xl bg-blue-50 px-4 py-3 text-center">
            <strong className="block text-3xl font-bold text-blue-600">{atsScore.score}</strong>
            <span className="text-xs font-medium text-slate-500">/100</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="app-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">ATS Score</h3>
          <p className="mt-1 text-sm text-slate-500">
            Scored on keyword match, action verbs, metrics, section completeness, project depth, and validation.
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 px-5 py-4 text-center">
          <strong className="block text-3xl font-bold text-blue-600">{atsScore.score}</strong>
          <span className="text-xs font-medium text-slate-500">out of 100</span>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Matched Keywords</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {(atsScore.matchedKeywords || []).length ? (
              atsScore.matchedKeywords.map((item) => (
                <span key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No matched keywords yet.</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">Missing Keywords</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {(atsScore.missingKeywords || []).length ? (
              atsScore.missingKeywords.map((item) => (
                <span key={item} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No major keyword gaps detected.</span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">Suggestions</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {(atsScore.suggestions || []).length ? (
              atsScore.suggestions.map((item) => (
                <span key={item} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">Resume is already in strong ATS shape.</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
