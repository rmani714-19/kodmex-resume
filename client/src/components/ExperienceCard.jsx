function ActionButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-black text-white"
    >
      {children}
    </button>
  );
}

function pointsToText(points = []) {
  return points.join("\n");
}

function textToPoints(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ExperienceCard({ item, isEditing, onEdit, onDelete, onMove, onChange }) {
  return (
    <article className="mb-4 rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        {isEditing ? (
          <div className="grid min-w-0 flex-1 gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Designation</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] text-slate-900 outline-none"
                value={item.designation}
                onChange={(event) => onChange({ ...item, designation: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Company</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] text-slate-900 outline-none"
                value={item.company}
                onChange={(event) => onChange({ ...item, company: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Location</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] text-slate-900 outline-none"
                value={item.location}
                onChange={(event) => onChange({ ...item, location: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Date Range</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] text-slate-900 outline-none"
                value={item.dateRange}
                onChange={(event) => onChange({ ...item, dateRange: event.target.value })}
              />
            </label>
          </div>
        ) : (
          <div className="min-w-0">
            <h3 className="text-[18px] font-bold leading-[1.2] text-slate-900">
              {item.designation} at {item.company}
            </h3>
            <p className="mt-2 text-[14px] leading-[1.3] text-slate-500">
              {item.location}, {item.dateRange}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <ActionButton label="Edit" onClick={onEdit}>
            <span className="text-[14px]">{isEditing ? "✓" : "✎"}</span>
          </ActionButton>
          <ActionButton label="Delete" onClick={onDelete}>
            <span className="text-[14px]">🗑</span>
          </ActionButton>
          <ActionButton label="Move" onClick={onMove}>
            <span className="text-[14px]">↕</span>
          </ActionButton>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Description Bullet Points</span>
            <textarea
              className="min-h-[120px] w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] leading-[1.5] text-slate-900 outline-none"
              value={pointsToText(item.points)}
              onChange={(event) => onChange({ ...item, points: textToPoints(event.target.value) })}
            />
          </label>
          <p className="mt-2 text-[12px] text-slate-500">Use one line per bullet point.</p>
        </div>
      ) : (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-[15px] leading-[1.45] text-slate-600">
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
