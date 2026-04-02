let educationId = 2;

export default function EducationList({ items, onChange }) {
  function updateItem(index, key, value) {
    onChange(items.map((item, currentIndex) => (currentIndex === index ? { ...item, [key]: value } : item)));
  }

  function removeItem(index) {
    onChange(items.filter((_, currentIndex) => currentIndex !== index));
  }

  function addItem() {
    onChange([
      ...items,
      {
        id: `education-${educationId++}`,
        degree: "",
        institution: "",
        startYear: "",
        endYear: "",
        score: ""
      }
    ]);
  }

  return (
    <div>
      {items.map((item, index) => (
        <article key={item.id} className="mb-4 rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Degree</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
                value={item.degree}
                onChange={(event) => updateItem(index, "degree", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Institution</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
                value={item.institution}
                onChange={(event) => updateItem(index, "institution", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Start Year</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
                value={item.startYear}
                onChange={(event) => updateItem(index, "startYear", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">End Year</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
                value={item.endYear}
                onChange={(event) => updateItem(index, "endYear", event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Score</span>
              <input
                className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
                value={item.score}
                onChange={(event) => updateItem(index, "score", event.target.value)}
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="h-10 rounded-[10px] bg-black px-4 text-[13px] font-medium text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="flex w-full items-center justify-center rounded-[12px] border-2 border-dashed border-[#6366F1] px-5 py-4 text-[16px] font-semibold text-[#6366F1]"
      >
        + Add more education
      </button>
    </div>
  );
}
