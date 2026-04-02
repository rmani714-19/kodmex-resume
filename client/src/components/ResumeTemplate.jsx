import { forwardRef } from "react";
import { flattenSkills } from "@shared/resumeEngine.js";
import { getResumeTemplate } from "../data/resumeTemplates.js";

const a4Width = 794;
const a4Padding = 24;
const contentWidth = a4Width - a4Padding * 2;

const strictTemplateTheme = {
  pageBackground: "#FFFFFF",
  mainBackground: "#FFFFFF",
  sidebarBackground: "#5B6B75",
  sectionLabel: "#6B7280",
  sidebarSectionLabel: "rgba(255,255,255,0.78)",
  primaryText: "#111827",
  secondaryText: "#374151",
  mutedText: "#6B7280",
  panelBackground: "#FFFFFF",
  border: "#E5E7EB",
  chipBackground: "rgba(255,255,255,0.16)",
  chipText: "#FFFFFF",
  accent: "#2563EB",
  sidebarText: "#FFFFFF",
  sidebarMuted: "rgba(255,255,255,0.82)"
};

const templateAccentById = {
  executivePro: "#111827",
  modernMinimal: "#2563EB",
  impactBold: "#4F46E5",
  modern: "#2563EB",
  professional: "#111827",
  creative: "#10B981",
  minimal: "#475569",
  slate: "#334155",
  executive: "#4F46E5",
  classic: "#78716C",
  cobalt: "#0284C7",
  graphite: "#111827",
  mono: "#171717",
  aurora: "#0F766E",
  metro: "#059669",
  serif: "#78716C",
  focus: "#7C3AED",
  summit: "#9333EA",
  ivory: "#D97706",
  studio: "#EC4899",
  contrast: "#111111",
  harbor: "#0F766E",
  zen: "#4D7C0F"
};

function getTheme(template, selectedTheme) {
  const base = {
    ...strictTemplateTheme,
    sectionLabel: selectedTheme || strictTemplateTheme.sectionLabel,
    accent: selectedTheme || templateAccentById[template.id] || strictTemplateTheme.accent
  };

  if (template.id === "executivePro") {
    return {
      ...base,
      sidebarBackground: "#111827",
      sidebarText: "#FFFFFF",
      sidebarMuted: "rgba(255,255,255,0.8)",
      sidebarSectionLabel: "rgba(255,255,255,0.74)",
      chipBackground: "rgba(255,255,255,0.12)",
      chipText: "#FFFFFF"
    };
  }

  if (template.id === "modernMinimal") {
    return {
      ...base,
      accent: selectedTheme || "#2563EB",
      sectionLabel: selectedTheme || "#2563EB",
      border: "#DBEAFE",
      chipBackground: "transparent",
      chipText: "#111827"
    };
  }

  if (template.id === "impactBold") {
    return {
      ...base,
      accent: selectedTheme || "#4F46E5",
      sectionLabel: selectedTheme || "#4F46E5",
      headerBackground: selectedTheme || "#4F46E5",
      headerText: "#FFFFFF",
      chipBackground: "#ECFDF5",
      chipText: "#047857"
    };
  }

  return base;
}

function normalizeSkillGroups(skills) {
  if (Array.isArray(skills) && skills.every((skill) => typeof skill === "string")) {
    return [
      {
        group: "Skills",
        items: skills.filter(Boolean)
      }
    ];
  }

  if (Array.isArray(skills)) {
    return skills
      .map((group) => ({
        group: group.group || "Skills",
        items: Array.isArray(group.items) ? group.items.filter(Boolean) : []
      }))
      .filter((group) => group.items.length);
  }

  return [];
}

function renderCustomSections(customSections, theme) {
  return (customSections || []).map((section, index) => (
    <Section key={`${section.title}-${index}`} title={section.title} color={theme.sectionLabel}>
      <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: theme.secondaryText }}>
        {section.content}
      </p>
    </Section>
  ));
}

function renderHighlightedText(text, theme, accent = false) {
  const metricPattern = /(\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?x\b|\b\d+(?:\.\d+)?\b)/gi;
  const content = String(text || "");

  if (!content) {
    return "";
  };

  const parts = content.split(metricPattern);

  return parts.map((part, index) => {
    if (!part) {
      return null;
    }

    const isMetric = metricPattern.test(part);
    metricPattern.lastIndex = 0;

    if (isMetric) {
      return (
        <strong
          key={`${part}-${index}`}
          style={{ fontWeight: 700, color: accent ? theme.accent : undefined }}
        >
          {part}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function joinPeriod(item) {
  if (item.dateRange) {
    return item.dateRange;
  }

  const end = item.isCurrent ? "Present" : item.endDate;
  return [item.startDate, end].filter(Boolean).join(" - ");
}

function SectionTitle({ children, color }) {
  return (
    <h3
      style={{
        margin: 0,
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color
      }}
    >
      {children}
    </h3>
  );
}

function Section({ title, color, children }) {
  return (
    <section style={{ marginTop: "24px" }}>
      <SectionTitle color={color}>{title}</SectionTitle>
      <div style={{ marginTop: "12px" }}>{children}</div>
    </section>
  );
}

function InfoRow({ label, value, color, labelColor, marginTop = 8 }) {
  if (!value) {
    return null;
  }

  return (
    <p style={{ margin: `${marginTop}px 0 0`, fontSize: "13px", lineHeight: 1.6, color }}>
      {label ? <span style={{ fontWeight: 700, color: labelColor }}>{label}: </span> : null}
      {value}
    </p>
  );
}

function InlineLinks({ items, color, marginTop = 10 }) {
  if (!items?.length) {
    return null;
  }

  return (
    <p style={{ margin: `${marginTop}px 0 0`, fontSize: "12px", lineHeight: 1.6, color }}>
      {items.map((item, index) => (
        <span key={`${item.label}-${item.value}`}>
          {item.label}: {item.value}
          {index < items.length - 1 ? " | " : ""}
        </span>
      ))}
    </p>
  );
}

function SkillChip({ value, background, color }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "999px",
        background,
        color,
        fontSize: "12px",
        lineHeight: 1.3,
        marginRight: "8px",
        marginBottom: "8px",
        border: background === "transparent" ? "1px solid #BFDBFE" : "none"
      }}
    >
      {value}
    </span>
  );
}

function ExperienceProject({ project, theme }) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "14px",
        border: `1px solid ${theme.border}`,
        borderRadius: "14px",
        background: theme.panelBackground,
        breakInside: "avoid"
      }}
    >
      <h5 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: theme.primaryText }}>{project.projectName}</h5>
      <p style={{ margin: "8px 0 0", fontSize: "13px", lineHeight: 1.65, color: theme.secondaryText }}>
        {renderHighlightedText(project.description, theme)}
      </p>
      <InfoRow label="Impact" value={project.impact} color={theme.secondaryText} labelColor={theme.primaryText} />
      <InfoRow
        label="Tools"
        value={(project.toolsUsed || []).join(", ")}
        color={theme.secondaryText}
        labelColor={theme.primaryText}
      />
      <InfoRow
        label="Frameworks"
        value={(project.frameworksUsed || []).join(", ")}
        color={theme.secondaryText}
        labelColor={theme.primaryText}
      />
      <InfoRow
        label="Technologies"
        value={(project.technologies || []).join(", ")}
        color={theme.secondaryText}
        labelColor={theme.primaryText}
      />
    </div>
  );
}

function GlobalProject({ project, theme }) {
  return (
    <div
      style={{
        marginTop: "12px",
        padding: "14px",
        border: `1px solid ${theme.border}`,
        borderRadius: "14px",
        background: theme.panelBackground,
        breakInside: "avoid"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px"
        }}
      >
        <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.primaryText }}>
          {project.name || project.projectName}
        </h4>
        <div style={{ fontSize: "11px", color: theme.accent, lineHeight: 1.5, flexShrink: 0 }}>
          {project.githubLink ? <div>GitHub</div> : null}
          {project.liveLink ? <div>Live</div> : null}
        </div>
      </div>
      <p style={{ margin: "8px 0 0", fontSize: "13px", lineHeight: 1.65, color: theme.secondaryText }}>
        {renderHighlightedText(project.description, theme, true)}
      </p>
      <InfoRow label="Impact" value={project.impact} color={theme.secondaryText} labelColor={theme.primaryText} />
      <InfoRow
        label="Tools & Frameworks"
        value={[...(project.toolsUsed || []), ...(project.frameworksUsed || [])].join(", ")}
        color={theme.secondaryText}
        labelColor={theme.primaryText}
      />
    </div>
  );
}

function EducationItem({ item, theme }) {
  return (
    <div style={{ marginTop: "12px", breakInside: "avoid" }}>
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: theme.primaryText }}>{item.degree}</p>
      <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>
        {[item.institution, item.location].filter(Boolean).join(" | ")}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: "12px", color: theme.mutedText }}>
        {[item.startDate || item.startYear, item.endDate || item.endYear].filter(Boolean).join(" - ")}
        {item.score ? ` | ${item.score}` : ""}
      </p>
    </div>
  );
}

function PlainListSection({ items, theme }) {
  return items.map((item, index) => (
    <p
      key={`${item}-${index}`}
      style={{
        margin: index === 0 ? 0 : "8px 0 0",
        fontSize: "13px",
        lineHeight: 1.6,
        color: theme.secondaryText
      }}
    >
      {item}
    </p>
  ));
}

function ExperienceDetails({ item, theme }) {
  if (item.points?.length) {
    return (
      <ul style={{ margin: "10px 0 0", paddingLeft: "18px", color: theme.secondaryText }}>
        {item.points.map((point, index) => (
          <li
            key={`${item.company || item.designation}-${index}`}
            style={{ marginTop: index === 0 ? 0 : "6px", fontSize: "13px", lineHeight: 1.55 }}
          >
            {renderHighlightedText(point, theme)}
          </li>
        ))}
      </ul>
    );
  }

  return (item.projects || []).map((project, projectIndex) => (
    <ExperienceProject key={`${project.projectName}-${projectIndex}`} project={project} theme={theme} />
  ));
}

function SidebarLayout({ resume, theme }) {
  const sidebarWidth = 238;
  const mainWidth = contentWidth - sidebarWidth;
  const skillGroups = normalizeSkillGroups(resume.skills);
  const hasSkills = skillGroups.some((group) => group.items.length);
  const hasEducation = resume.education?.length > 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${sidebarWidth}px ${mainWidth}px`,
        minHeight: "100%",
        background: theme.pageBackground
      }}
    >
      <aside
        style={{
          width: `${sidebarWidth}px`,
          background: theme.sidebarBackground,
          borderRight: `1px solid ${theme.border}`,
          padding: "24px 20px",
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ margin: 0, fontSize: "28px", lineHeight: 1.15, fontWeight: 700, color: theme.sidebarText || theme.primaryText }}>
          {resume.personal.fullName}
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: theme.sidebarMuted || theme.mutedText }}>
          {resume.personal.role}
        </p>

        {hasEducation ? (
          <Section title="Education" color={theme.sidebarSectionLabel || theme.sectionLabel}>
            {(resume.education || []).map((item, index) => (
              <EducationItem key={`${item.institution}-${index}`} item={item} theme={theme} />
            ))}
          </Section>
        ) : null}

        <Section title="Contact" color={theme.sidebarSectionLabel || theme.sectionLabel}>
          {[resume.personal.email, resume.personal.phone, resume.personal.location].filter(Boolean).map((item) => (
            <p key={item} style={{ margin: "0 0 8px", fontSize: "13px", lineHeight: 1.6, color: theme.sidebarText || theme.secondaryText }}>
              {item}
            </p>
          ))}
          <InlineLinks items={resume.externalLinks} color={theme.sidebarText || theme.secondaryText} marginTop={6} />
        </Section>

        {hasSkills ? (
          <Section title="Skills" color={theme.sidebarSectionLabel || theme.sectionLabel}>
            {skillGroups.map((group) => (
              <div key={group.group} style={{ marginTop: "10px" }}>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.sidebarSectionLabel || theme.sectionLabel }}>
                  {group.group}
                </p>
                <div style={{ marginTop: "8px" }}>
                  {(group.items || []).map((skill) => (
                    <SkillChip
                      key={`${group.group}-${skill}`}
                      value={skill}
                      background={theme.chipBackground}
                      color={theme.chipText}
                    />
                  ))}
                </div>
              </div>
            ))}
          </Section>
        ) : null}

        {resume.externalLinks?.length ? (
          <Section title="External Links" color={theme.sidebarSectionLabel || theme.sectionLabel}>
            {resume.externalLinks.map((item) => (
              <p
                key={`${item.label}-${item.url}`}
                style={{ margin: "0 0 8px", fontSize: "13px", lineHeight: 1.6, color: theme.sidebarText || theme.secondaryText }}
              >
                {item.label}
              </p>
            ))}
          </Section>
        ) : null}
      </aside>

      <div
        style={{
          width: `${mainWidth}px`,
          background: theme.mainBackground,
          padding: "24px 24px 28px",
          boxSizing: "border-box"
        }}
      >
        <Section title="Summary" color={theme.sectionLabel}>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: theme.secondaryText }}>
            {renderHighlightedText(resume.summary, theme)}
          </p>
        </Section>

        <Section title="Experience" color={theme.sectionLabel}>
          {(resume.experience || []).map((item, index) => (
            <div key={`${item.company}-${index}`} style={{ marginTop: index === 0 ? 0 : "18px", breakInside: "avoid" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px"
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.primaryText }}>{item.designation}</p>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>
                    {[item.company, item.location].filter(Boolean).join(" | ")}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: theme.mutedText, textAlign: "right", flexShrink: 0 }}>
                  {joinPeriod(item)}
                </p>
              </div>
              <ExperienceDetails item={item} theme={theme} />
            </div>
          ))}
        </Section>

        <Section title="Projects" color={theme.sectionLabel}>
          {(resume.projects || []).map((project, index) => (
            <GlobalProject key={`${project.name}-${index}`} project={project} theme={theme} />
          ))}
        </Section>

        {resume.awards?.length ? (
          <Section title="Awards & Achievements" color={theme.sectionLabel}>
            {resume.awards.map((item, index) => (
              <div key={`${item.title}-${index}`} style={{ marginTop: index === 0 ? 0 : "12px", breakInside: "avoid" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: theme.primaryText }}>
                  {typeof item === "string" ? item : item.title}
                </p>
                {typeof item === "string" ? null : (
                  <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>{item.description}</p>
                )}
              </div>
            ))}
          </Section>
        ) : null}

        {resume.certifications?.length ? (
          <Section title="Certifications" color={theme.sectionLabel}>
            {resume.certifications.map((item, index) => (
              <div key={`${item.name}-${index}`} style={{ marginTop: index === 0 ? 0 : "12px", breakInside: "avoid" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: theme.primaryText }}>
                  {typeof item === "string" ? item : item.name}
                </p>
                {typeof item === "string" ? null : (
                  <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>
                    {[item.issuer, item.year].filter(Boolean).join(" | ")}
                  </p>
                )}
              </div>
            ))}
          </Section>
        ) : null}

        {resume.languages?.length ? (
          <Section title="Languages" color={theme.sectionLabel}>
            {PlainListSection({ items: resume.languages, theme })}
          </Section>
        ) : null}

        {resume.interests?.length ? (
          <Section title="Interests" color={theme.sectionLabel}>
            {PlainListSection({ items: resume.interests, theme })}
          </Section>
        ) : null}

        {renderCustomSections(resume.customSections, theme)}
      </div>
    </div>
  );
}

function SingleColumnLayout({ resume, theme }) {
  const skillItems = flattenSkills(normalizeSkillGroups(resume.skills));
  const hasEducation = resume.education?.length > 0;

  return (
    <div
      style={{
        width: `${contentWidth}px`,
        background: theme.mainBackground,
        padding: "24px 24px 28px",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          padding: "20px",
          border: `1px solid ${theme.border}`,
          borderRadius: "18px",
          background: theme.headerBackground || theme.pageBackground
        }}
      >
        <h2 style={{ margin: 0, fontSize: "30px", lineHeight: 1.12, fontWeight: 700, color: theme.primaryText }}>
          {resume.personal.fullName}
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "14px", fontWeight: 600, color: theme.accent }}>{resume.personal.role}</p>
        <p style={{ margin: "10px 0 0", fontSize: "12px", lineHeight: 1.6, color: theme.mutedText }}>
          {[resume.personal.email, resume.personal.phone, resume.personal.location].filter(Boolean).join(" | ")}
        </p>
        <InlineLinks items={resume.externalLinks} color={theme.accent} marginTop={8} />
      </div>

      {hasEducation ? (
        <Section title="Education" color={theme.sectionLabel}>
          {(resume.education || []).map((item, index) => (
            <EducationItem key={`${item.institution}-${index}`} item={item} theme={theme} />
          ))}
        </Section>
      ) : null}

      <Section title="Summary" color={theme.sectionLabel}>
        <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: theme.secondaryText }}>
          {renderHighlightedText(resume.summary, theme)}
        </p>
      </Section>

      <Section title="Experience" color={theme.sectionLabel}>
        {(resume.experience || []).map((item, index) => (
          <div key={`${item.company}-${index}`} style={{ marginTop: index === 0 ? 0 : "18px", breakInside: "avoid" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px"
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.primaryText }}>{item.designation}</p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>
                  {[item.company, item.location].filter(Boolean).join(" | ")}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: theme.mutedText, textAlign: "right", flexShrink: 0 }}>
                {joinPeriod(item)}
              </p>
            </div>
            <ExperienceDetails item={item} theme={theme} />
          </div>
        ))}
      </Section>

      <Section title="Projects" color={theme.sectionLabel}>
        {(resume.projects || []).map((project, index) => (
          <GlobalProject key={`${project.name}-${index}`} project={project} theme={theme} />
        ))}
      </Section>

      {skillItems.length ? (
        <Section title="Skills" color={theme.sectionLabel}>
          <div>
            {skillItems.map((skill) => (
              <SkillChip key={skill} value={skill} background={theme.chipBackground} color={theme.chipText} />
            ))}
          </div>
        </Section>
      ) : null}

      {resume.awards?.length ? (
          <Section title="Awards & Achievements" color={theme.sectionLabel}>
            {resume.awards.map((item, index) => (
              <div key={`${item.title}-${index}`} style={{ marginTop: index === 0 ? 0 : "12px", breakInside: "avoid" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: theme.primaryText }}>
                  {typeof item === "string" ? item : item.title}
                </p>
                {typeof item === "string" ? null : (
                  <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>{item.description}</p>
                )}
              </div>
            ))}
          </Section>
      ) : null}

      {resume.certifications?.length ? (
        <Section title="Certifications" color={theme.sectionLabel}>
            {resume.certifications.map((item, index) => (
              <div key={`${item.name}-${index}`} style={{ marginTop: index === 0 ? 0 : "12px", breakInside: "avoid" }}>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: theme.primaryText }}>
                  {typeof item === "string" ? item : item.name}
                </p>
                {typeof item === "string" ? null : (
                  <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>
                    {[item.issuer, item.year].filter(Boolean).join(" | ")}
                  </p>
                )}
              </div>
            ))}
          </Section>
      ) : null}

      {resume.languages?.length ? (
        <Section title="Languages" color={theme.sectionLabel}>
          {PlainListSection({ items: resume.languages, theme })}
        </Section>
      ) : null}

      {resume.interests?.length ? (
        <Section title="Interests" color={theme.sectionLabel}>
          {PlainListSection({ items: resume.interests, theme })}
        </Section>
      ) : null}

      {resume.externalLinks?.length ? (
        <Section title="External Links" color={theme.sectionLabel}>
          {resume.externalLinks.map((item, index) => (
            <p key={`${item.label}-${index}`} style={{ margin: index === 0 ? 0 : "8px 0 0", fontSize: "13px", color: theme.accent }}>
              {item.label}
            </p>
          ))}
        </Section>
      ) : null}

      {renderCustomSections(resume.customSections, theme)}
    </div>
  );
}

function HybridLayout({ resume, theme }) {
  const skillItems = flattenSkills(normalizeSkillGroups(resume.skills));
  const hasEducation = resume.education?.length > 0;

  return (
    <div
      style={{
        width: `${contentWidth}px`,
        background: theme.mainBackground,
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          background: theme.headerBackground || theme.accent,
          color: theme.headerText || "#FFFFFF",
          padding: "26px 26px 24px",
          textAlign: "center",
          borderRadius: "18px 18px 0 0"
        }}
      >
        <h2 style={{ margin: 0, fontSize: "28px", lineHeight: 1.08, fontWeight: 700 }}>{resume.personal.fullName}</h2>
        <p style={{ margin: "8px 0 0", fontSize: "14px", fontWeight: 600, opacity: 0.92 }}>{resume.personal.role}</p>
        <p style={{ margin: "10px 0 0", fontSize: "12px", lineHeight: 1.6, opacity: 0.9 }}>
          {[resume.personal.email, resume.personal.phone, resume.personal.location].filter(Boolean).join(" | ")}
        </p>
        <InlineLinks items={resume.externalLinks} color="rgba(255,255,255,0.94)" marginTop={8} />
      </div>

      <div
        style={{
          padding: "24px 24px 28px",
          border: `1px solid ${theme.border}`,
          borderTop: "none",
          borderRadius: "0 0 18px 18px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "30% 70%",
            gap: "24px",
            alignItems: "start"
          }}
        >
          <div>
            {hasEducation ? (
              <Section title="Education" color={theme.sectionLabel}>
                {(resume.education || []).map((item, index) => (
                  <EducationItem key={`${item.institution}-${index}`} item={item} theme={theme} />
                ))}
              </Section>
            ) : null}

            {skillItems.length ? (
              <Section title="Skills" color={theme.sectionLabel}>
                <div>
                  {skillItems.map((skill) => (
                    <SkillChip key={skill} value={skill} background={theme.chipBackground} color={theme.chipText} />
                  ))}
                </div>
              </Section>
            ) : null}
          </div>

          <div>
            <Section title="Summary" color={theme.sectionLabel}>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.7, color: theme.secondaryText }}>
                {renderHighlightedText(resume.summary, theme, true)}
              </p>
            </Section>

            <Section title="Experience" color={theme.sectionLabel}>
              {(resume.experience || []).map((item, index) => (
                <div
                  key={`${item.company}-${index}`}
                  style={{
                    marginTop: index === 0 ? 0 : "18px",
                    paddingLeft: "14px",
                    borderLeft: `3px solid ${theme.accent}`,
                    breakInside: "avoid"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "12px"
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.primaryText }}>{item.designation}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>
                        {[item.company, item.location].filter(Boolean).join(" | ")}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: theme.mutedText, textAlign: "right", flexShrink: 0 }}>
                      {joinPeriod(item)}
                    </p>
                  </div>
                  <ExperienceDetails item={item} theme={theme} />
                </div>
              ))}
            </Section>

            <Section title="Projects" color={theme.sectionLabel}>
              {(resume.projects || []).map((project, index) => (
                <div key={`${project.name}-${index}`} style={{ marginTop: index === 0 ? 0 : "14px", breakInside: "avoid" }}>
                  <p style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: theme.accent }}>
                    {project.name || project.projectName}
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: 1.65, color: theme.secondaryText }}>
                    {renderHighlightedText(project.description, theme, true)}
                  </p>
                  <InfoRow
                    label="Tools & Frameworks"
                    value={[...(project.toolsUsed || []), ...(project.frameworksUsed || [])].join(", ")}
                    color={theme.secondaryText}
                    labelColor={theme.primaryText}
                  />
                  <InfoRow label="Impact" value={project.impact} color={theme.secondaryText} labelColor={theme.primaryText} />
                </div>
              ))}
            </Section>

            {resume.awards?.length ? (
              <Section title="Awards & Achievements" color={theme.sectionLabel}>
                {resume.awards.map((item, index) => (
                  <div key={`${item.title}-${index}`} style={{ marginTop: index === 0 ? 0 : "12px", breakInside: "avoid" }}>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: theme.primaryText }}>
                      {typeof item === "string" ? item : item.title}
                    </p>
                    {typeof item === "string" ? null : (
                      <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.6, color: theme.secondaryText }}>{item.description}</p>
                    )}
                  </div>
                ))}
              </Section>
            ) : null}

            {renderCustomSections(resume.customSections, theme)}
          </div>
        </div>
      </div>
    </div>
  );
}

const ResumeTemplate = forwardRef(function ResumeTemplate(
  { resume, selectedTemplate = "modern", selectedTheme = "#2563EB", className = "", style = {} },
  ref
) {
  const template = getResumeTemplate(selectedTemplate);
  const theme = getTheme(template, selectedTheme);
  const usesSidebar = !["topbar", "minimal", "editorial", "hybrid"].includes(template.family);

  return (
    <article
      ref={ref}
      className={`resume-container ${className}`.trim()}
      data-template-id={selectedTemplate}
      style={{
        width: `${a4Width}px`,
        minWidth: `${a4Width}px`,
        background: "#FFFFFF",
        padding: `${a4Padding}px`,
        boxSizing: "border-box",
        color: theme.primaryText,
        fontFamily: 'Arial, Calibri, "Helvetica Neue", sans-serif',
        lineHeight: 1.6,
        ...style
      }}
    >
      <div
        className="resume-page-shell"
        style={{
          width: `${contentWidth}px`,
          background: theme.pageBackground,
          boxSizing: "border-box"
        }}
      >
        {template.family === "hybrid" ? (
          <HybridLayout resume={resume} theme={theme} />
        ) : usesSidebar ? (
          <SidebarLayout resume={resume} theme={theme} />
        ) : (
          <SingleColumnLayout resume={resume} theme={theme} />
        )}
      </div>
    </article>
  );
});

export default ResumeTemplate;
