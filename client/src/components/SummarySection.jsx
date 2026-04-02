export default function SummarySection({ value, onChange }) {
  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4">
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Summary</span>
        <textarea
          className="min-h-[220px] w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] leading-[1.6] outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </section>
  );
}
