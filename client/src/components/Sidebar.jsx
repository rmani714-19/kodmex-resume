function NavIcon({ name, active }) {
  const gradientId = `sidebar-icon-gradient-${name}-${active ? "active" : "default"}`;
  const stroke = `url(#${gradientId})`;
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  const gradient = (
    <defs>
      <linearGradient id={gradientId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={active ? "#FDE68A" : "#A78BFA"} />
        <stop offset="50%" stopColor={active ? "#F472B6" : "#60A5FA"} />
        <stop offset="100%" stopColor={active ? "#34D399" : "#22D3EE"} />
      </linearGradient>
    </defs>
  );

  if (name === "user") {
    return (
      <svg {...common}>
        {gradient}
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  if (name === "file") {
    return (
      <svg {...common}>
        {gradient}
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
      </svg>
    );
  }

  if (name === "graduation") {
    return (
      <svg {...common}>
        {gradient}
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v4c0 1.6 2.7 3 6 3s6-1.4 6-3v-4" />
      </svg>
    );
  }

  if (name === "tools") {
    return (
      <svg {...common}>
        {gradient}
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.2 2.2-2.8-2.8Z" />
      </svg>
    );
  }

  if (name === "file-text") {
    return (
      <svg {...common}>
        {gradient}
        <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      {gradient}
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}

export default function Sidebar({ sections, activeSection, onSelect }) {
  return (
    <aside
      className="flex h-screen w-[88px] shrink-0 flex-col items-center px-2 py-6"
      style={{
        background: "linear-gradient(180deg, #081857 0%, #0B1E6D 38%, #16359C 100%)"
      }}
    >
      <nav className="flex flex-col items-center gap-7">
        {sections.map((section) => {
          const active = section.id === activeSection;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`flex w-full flex-col items-center justify-center gap-2 rounded-[12px] px-[10px] py-[10px] text-center ${
                active ? "bg-[#1E3A8A]" : "bg-transparent"
              }`}
              title={section.label}
            >
              <NavIcon name={section.icon} active={active} />
              <span className={`text-[11px] font-medium leading-[1.2] ${active ? "text-white" : "text-[#C7D2FE]"}`}>
                {section.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
