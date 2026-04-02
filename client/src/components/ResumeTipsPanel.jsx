export default function ResumeTipsPanel({ title, tips, tone = "blue" }) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
