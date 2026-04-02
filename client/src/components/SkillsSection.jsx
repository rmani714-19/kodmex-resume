function listToText(items = []) {
  return items.join("\n");
}

function textToList(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SkillsSection({ skills, onChange }) {
  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Skills</span>
        <textarea
          className="min-h-[240px] w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] leading-[1.5] outline-none"
          value={listToText(skills)}
          onChange={(event) => onChange(textToList(event.target.value))}
        />
      </label>
      <p className="mt-2 text-[12px] text-slate-500">Use one line per skill.</p>
    </section>
  );
}
