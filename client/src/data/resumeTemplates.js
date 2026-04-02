function createSidebarTemplate({
  id,
  name,
  preview,
  badgeClass = "bg-blue-600 text-white",
  sidebarColumnsClass = "lg:grid-cols-[0.3fr_0.7fr]",
  classes = {}
}) {
  return {
    id,
    name,
    preview,
    family: "sidebar",
    sidebarColumnsClass,
    badgeClass,
    classes: {
      frame: "border-slate-200 bg-white",
      sidebar: "bg-slate-100",
      main: "bg-white",
      name: "text-slate-900",
      role: "text-slate-500",
      heading: "text-slate-500",
      divider: "border-slate-200",
      chip: "bg-white text-slate-700",
      toolCard: "bg-white text-slate-700",
      contact: "text-slate-700",
      previewFrame: "border-slate-200 bg-white",
      previewSidebar: "bg-slate-200",
      previewStrong: "bg-slate-400",
      previewSoft: "bg-slate-200",
      ...classes
    }
  };
}

function createTopbarTemplate({
  id,
  name,
  preview,
  badgeClass = "bg-slate-900 text-white",
  classes = {}
}) {
  return {
    id,
    name,
    preview,
    family: "topbar",
    badgeClass,
    classes: {
      frame: "border-slate-200 bg-white",
      header: "bg-white",
      name: "text-slate-900",
      role: "text-slate-500",
      heading: "text-slate-500",
      divider: "border-slate-200",
      chip: "bg-slate-100 text-slate-700",
      contact: "text-slate-500",
      previewFrame: "border-slate-200 bg-white",
      previewSidebar: "bg-transparent",
      previewStrong: "bg-slate-500",
      previewSoft: "bg-slate-200",
      ...classes
    }
  };
}

function createDarkSidebarTemplate({
  id,
  name,
  preview,
  badgeClass = "bg-emerald-500 text-white",
  sidebarColumnsClass = "lg:grid-cols-[0.35fr_0.65fr]",
  classes = {}
}) {
  return {
    id,
    name,
    preview,
    family: "darkSidebar",
    sidebarColumnsClass,
    badgeClass,
    classes: {
      frame: "border-slate-900 bg-white",
      sidebar: "bg-slate-900",
      main: "bg-white",
      name: "text-white",
      role: "text-white/70",
      heading: "text-white/60",
      mainHeading: "text-slate-500",
      chip: "bg-white/10 text-white",
      contact: "text-white/80",
      previewFrame: "border-slate-900 bg-white",
      previewSidebar: "bg-slate-900",
      previewStrong: "bg-slate-200/80",
      previewSoft: "bg-slate-200/30",
      ...classes
    }
  };
}

function createMinimalTemplate({
  id,
  name,
  preview,
  badgeClass = "bg-slate-700 text-white",
  classes = {}
}) {
  return {
    id,
    name,
    preview,
    family: "minimal",
    badgeClass,
    classes: {
      frame: "border-slate-200 bg-white",
      name: "text-slate-900",
      role: "text-slate-500",
      heading: "text-slate-500",
      chip: "bg-slate-100 text-slate-700",
      previewFrame: "border-slate-200 bg-slate-50",
      previewSidebar: "bg-transparent",
      previewStrong: "bg-slate-500",
      previewSoft: "bg-slate-200",
      ...classes
    }
  };
}

function createAccentSplitTemplate({
  id,
  name,
  preview,
  badgeClass = "bg-amber-500 text-slate-900",
  sidebarColumnsClass = "lg:grid-cols-[0.32fr_0.68fr]",
  classes = {}
}) {
  return {
    id,
    name,
    preview,
    family: "accentSplit",
    sidebarColumnsClass,
    badgeClass,
    classes: {
      frame: "border-slate-200 bg-white",
      sidebar: "bg-slate-50",
      main: "bg-white",
      band: "bg-blue-600",
      name: "text-slate-900",
      bandText: "text-white",
      heading: "text-slate-500",
      chip: "bg-white text-slate-700",
      contact: "text-slate-700",
      previewFrame: "border-slate-200 bg-white",
      previewSidebar: "bg-blue-600",
      previewStrong: "bg-slate-400",
      previewSoft: "bg-slate-200",
      ...classes
    }
  };
}

function createEditorialTemplate({
  id,
  name,
  preview,
  badgeClass = "bg-rose-500 text-white",
  classes = {}
}) {
  return {
    id,
    name,
    preview,
    family: "editorial",
    badgeClass,
    classes: {
      frame: "border-stone-200 bg-white",
      header: "bg-stone-50",
      name: "font-serif text-stone-900",
      role: "text-stone-600",
      heading: "text-stone-500",
      divider: "border-stone-200",
      chip: "bg-stone-100 text-stone-700",
      contact: "text-stone-600",
      previewFrame: "border-stone-200 bg-stone-50",
      previewSidebar: "bg-transparent",
      previewStrong: "bg-stone-500",
      previewSoft: "bg-stone-200",
      ...classes
    }
  };
}

function createHybridTemplate({
  id,
  name,
  preview,
  badgeClass = "bg-violet-600 text-white",
  classes = {}
}) {
  return {
    id,
    name,
    preview,
    family: "hybrid",
    badgeClass,
    classes: {
      frame: "border-slate-200 bg-white",
      header: "bg-violet-600",
      name: "text-white",
      role: "text-violet-100",
      heading: "text-violet-700",
      divider: "border-slate-200",
      chip: "bg-violet-50 text-violet-900",
      contact: "text-slate-500",
      previewFrame: "border-violet-200 bg-white",
      previewSidebar: "bg-violet-600",
      previewStrong: "bg-violet-500",
      previewSoft: "bg-violet-200",
      ...classes
    }
  };
}

export const resumeTemplates = [
  createDarkSidebarTemplate({
    id: "executivePro",
    name: "Executive Pro",
    preview: "premium leadership layout for mid and senior roles",
    badgeClass: "bg-slate-950 text-white",
    sidebarColumnsClass: "lg:grid-cols-[0.3fr_0.7fr]",
    classes: {
      sidebar: "bg-[#111827]",
      chip: "bg-white/10 text-white",
      previewSidebar: "bg-slate-900"
    }
  }),
  createMinimalTemplate({
    id: "modernMinimal",
    name: "Modern Minimal",
    preview: "wide ATS-first layout for fresher and mid-level profiles",
    badgeClass: "bg-blue-600 text-white",
    classes: {
      frame: "border-blue-100 bg-white",
      name: "text-slate-900",
      role: "text-blue-600",
      heading: "text-blue-700",
      chip: "bg-transparent text-slate-700",
      previewFrame: "border-blue-200 bg-white",
      previewStrong: "bg-blue-600",
      previewSoft: "bg-slate-200"
    }
  }),
  createHybridTemplate({
    id: "impactBold",
    name: "Impact Bold",
    preview: "centered statement header with bold impact sections",
    badgeClass: "bg-violet-600 text-white",
    classes: {
      header: "bg-[#4F46E5]",
      chip: "bg-emerald-50 text-emerald-700",
      previewSidebar: "bg-[#4F46E5]",
      previewStrong: "bg-violet-600",
      previewSoft: "bg-emerald-200"
    }
  }),
  createSidebarTemplate({
    id: "modern",
    name: "Modern",
    preview: "soft sidebar with clean cards",
    badgeClass: "bg-blue-600 text-white"
  }),
  createTopbarTemplate({
    id: "professional",
    name: "Professional",
    preview: "corporate single column ATS layout",
    badgeClass: "bg-slate-900 text-white"
  }),
  createDarkSidebarTemplate({
    id: "creative",
    name: "Creative",
    preview: "dark sidebar with bold contrast",
    badgeClass: "bg-emerald-500 text-white"
  }),
  createMinimalTemplate({
    id: "minimal",
    name: "Minimal",
    preview: "lightweight stripped-back resume",
    badgeClass: "bg-slate-700 text-white"
  }),
  createSidebarTemplate({
    id: "slate",
    name: "Slate",
    preview: "cool gray sidebar and crisp sections",
    badgeClass: "bg-slate-700 text-white",
    classes: {
      sidebar: "bg-slate-200",
      chip: "bg-slate-50 text-slate-800",
      toolCard: "bg-slate-50 text-slate-800",
      previewSidebar: "bg-slate-300"
    }
  }),
  createAccentSplitTemplate({
    id: "executive",
    name: "Executive",
    preview: "accent band with polished executive layout",
    badgeClass: "bg-indigo-600 text-white",
    classes: {
      band: "bg-indigo-600",
      previewSidebar: "bg-indigo-600"
    }
  }),
  createTopbarTemplate({
    id: "classic",
    name: "Classic",
    preview: "traditional resume with restrained spacing",
    badgeClass: "bg-stone-700 text-white",
    classes: {
      frame: "border-stone-200 bg-white",
      header: "bg-white",
      name: "font-serif text-stone-900",
      role: "text-stone-600",
      heading: "text-stone-500",
      divider: "border-stone-200",
      chip: "bg-stone-100 text-stone-700",
      contact: "text-stone-600",
      previewFrame: "border-stone-200 bg-white",
      previewStrong: "bg-stone-500",
      previewSoft: "bg-stone-200"
    }
  }),
  createAccentSplitTemplate({
    id: "cobalt",
    name: "Cobalt",
    preview: "electric blue edge with balanced columns",
    badgeClass: "bg-sky-600 text-white",
    classes: {
      band: "bg-sky-600",
      sidebar: "bg-sky-50",
      previewSidebar: "bg-sky-600"
    }
  }),
  createTopbarTemplate({
    id: "graphite",
    name: "Graphite",
    preview: "dark top header with dense professional rhythm",
    badgeClass: "bg-neutral-800 text-white",
    classes: {
      header: "bg-neutral-900",
      name: "text-white",
      role: "text-neutral-300",
      heading: "text-neutral-500",
      chip: "bg-neutral-100 text-neutral-700",
      contact: "text-neutral-400",
      previewFrame: "border-neutral-300 bg-neutral-50",
      previewStrong: "bg-neutral-700",
      previewSoft: "bg-neutral-300"
    }
  }),
  createMinimalTemplate({
    id: "mono",
    name: "Mono",
    preview: "monochrome resume with strong spacing",
    badgeClass: "bg-neutral-900 text-white",
    classes: {
      frame: "border-neutral-300 bg-white",
      name: "text-neutral-950",
      role: "text-neutral-500",
      heading: "text-neutral-600",
      chip: "bg-neutral-100 text-neutral-700",
      previewFrame: "border-neutral-300 bg-white",
      previewStrong: "bg-neutral-800",
      previewSoft: "bg-neutral-300"
    }
  }),
  createDarkSidebarTemplate({
    id: "aurora",
    name: "Aurora",
    preview: "teal dark sidebar with vivid highlights",
    badgeClass: "bg-teal-500 text-white",
    classes: {
      sidebar: "bg-teal-900",
      chip: "bg-teal-800/70 text-teal-50",
      previewSidebar: "bg-teal-900"
    }
  }),
  createAccentSplitTemplate({
    id: "metro",
    name: "Metro",
    preview: "city-grid style with sharp accent rail",
    badgeClass: "bg-emerald-600 text-white",
    classes: {
      band: "bg-emerald-600",
      sidebar: "bg-emerald-50",
      previewSidebar: "bg-emerald-600"
    }
  }),
  createEditorialTemplate({
    id: "serif",
    name: "Serif",
    preview: "editorial serif header with refined hierarchy",
    badgeClass: "bg-stone-700 text-white"
  }),
  createSidebarTemplate({
    id: "focus",
    name: "Focus",
    preview: "high-clarity sidebar built for readability",
    badgeClass: "bg-violet-600 text-white",
    classes: {
      sidebar: "bg-violet-50",
      chip: "bg-white text-violet-900",
      toolCard: "bg-white text-violet-900",
      previewSidebar: "bg-violet-200"
    }
  }),
  createAccentSplitTemplate({
    id: "summit",
    name: "Summit",
    preview: "leadership profile with royal accent band",
    badgeClass: "bg-purple-600 text-white",
    classes: {
      band: "bg-purple-600",
      sidebar: "bg-purple-50",
      previewSidebar: "bg-purple-600"
    }
  }),
  createTopbarTemplate({
    id: "ivory",
    name: "Ivory",
    preview: "warm neutral professional document style",
    badgeClass: "bg-amber-600 text-white",
    classes: {
      frame: "border-amber-100 bg-amber-50/40",
      header: "bg-amber-50/50",
      name: "text-amber-950",
      role: "text-amber-800",
      heading: "text-amber-700",
      divider: "border-amber-200",
      chip: "bg-white text-amber-900",
      contact: "text-amber-700",
      previewFrame: "border-amber-200 bg-amber-50",
      previewStrong: "bg-amber-500",
      previewSoft: "bg-amber-200"
    }
  }),
  createDarkSidebarTemplate({
    id: "studio",
    name: "Studio",
    preview: "designer-inspired charcoal split layout",
    badgeClass: "bg-pink-500 text-white",
    classes: {
      sidebar: "bg-zinc-900",
      chip: "bg-pink-500/15 text-pink-100",
      previewSidebar: "bg-zinc-900"
    }
  }),
  createEditorialTemplate({
    id: "contrast",
    name: "Contrast",
    preview: "editorial format with black and sand rhythm",
    badgeClass: "bg-black text-white",
    classes: {
      frame: "border-stone-300 bg-stone-50",
      header: "bg-black",
      name: "font-serif text-white",
      role: "text-stone-200",
      heading: "text-stone-600",
      divider: "border-stone-300",
      chip: "bg-white text-stone-800",
      contact: "text-stone-500",
      previewFrame: "border-stone-300 bg-stone-50",
      previewStrong: "bg-black",
      previewSoft: "bg-stone-300"
    }
  }),
  createSidebarTemplate({
    id: "harbor",
    name: "Harbor",
    preview: "navy and mist split resume for tech roles",
    badgeClass: "bg-cyan-700 text-white",
    classes: {
      sidebar: "bg-cyan-50",
      chip: "bg-white text-cyan-900",
      toolCard: "bg-white text-cyan-900",
      previewSidebar: "bg-cyan-200"
    }
  }),
  createMinimalTemplate({
    id: "zen",
    name: "Zen",
    preview: "quiet minimal resume with spacious rhythm",
    badgeClass: "bg-lime-700 text-white",
    classes: {
      frame: "border-lime-100 bg-white",
      name: "text-lime-950",
      role: "text-lime-800",
      heading: "text-lime-700",
      chip: "bg-lime-50 text-lime-900",
      previewFrame: "border-lime-200 bg-lime-50",
      previewStrong: "bg-lime-700",
      previewSoft: "bg-lime-200"
    }
  })
];

export function getResumeTemplate(templateId) {
  if (templateId === "modernClean") {
    return resumeTemplates.find((template) => template.id === "modern") || resumeTemplates[0];
  }

  if (templateId === "modernMinimal") {
    return resumeTemplates.find((template) => template.id === "modernMinimal") || resumeTemplates[0];
  }

  if (templateId === "twoColumn") {
    return resumeTemplates.find((template) => template.id === "professional") || resumeTemplates[0];
  }

  return resumeTemplates.find((template) => template.id === templateId) || resumeTemplates[0];
}
