export default function HeaderSection({ value, onChange }) {
  function updateField(key, nextValue) {
    onChange({
      ...value,
      [key]: nextValue
    });
  }

  return (
    <section className="rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Full Name</span>
          <input
            className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
            value={value.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Role</span>
          <input
            className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
            value={value.role}
            onChange={(event) => updateField("role", event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
            value={value.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Phone</span>
          <input
            className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
            value={value.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">Location</span>
          <input
            className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
            value={value.location}
            onChange={(event) => updateField("location", event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">LinkedIn</span>
          <input
            className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
            type="url"
            placeholder="https://linkedin.com/in/username"
            value={value.linkedin || ""}
            onChange={(event) => updateField("linkedin", event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-slate-700">GitHub</span>
          <input
            className="w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2.5 text-[14px] outline-none"
            type="url"
            placeholder="https://github.com/username"
            value={value.github || ""}
            onChange={(event) => updateField("github", event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
