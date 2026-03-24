import type { ResumeContent } from "@workspace/api-client-react/src/generated/api.schemas";
import { Mail, MapPin, Phone, Globe, Linkedin } from "lucide-react";

interface ResumePreviewProps {
  content: ResumeContent;
  template?: string;
}

export function ResumePreview({ content, template = "modern" }: ResumePreviewProps) {
  // We force a white background and black text to look like a real document
  return (
    <div className="bg-white text-black min-h-[1056px] w-[816px] shadow-2xl p-12 shrink-0 origin-top overflow-hidden">
      
      {/* HEADER */}
      <header className="border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 uppercase">
          {content.personalInfo.fullName || "Your Name"}
        </h1>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-gray-600">
          {content.personalInfo.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {content.personalInfo.email}
            </span>
          )}
          {content.personalInfo.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" /> {content.personalInfo.phone}
            </span>
          )}
          {content.personalInfo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {content.personalInfo.location}
            </span>
          )}
          {content.personalInfo.linkedin && (
            <span className="flex items-center gap-1.5">
              <Linkedin className="w-4 h-4" /> {content.personalInfo.linkedin}
            </span>
          )}
          {content.personalInfo.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4" /> {content.personalInfo.website}
            </span>
          )}
        </div>

        {content.personalInfo.summary && (
          <p className="mt-5 text-sm leading-relaxed text-gray-800">
            {content.personalInfo.summary}
          </p>
        )}
      </header>

      {/* EXPERIENCE */}
      {content.workExperience && content.workExperience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">
            Experience
          </h2>
          <div className="space-y-6">
            {content.workExperience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-semibold text-gray-900">{exp.title}</h3>
                  <span className="text-sm font-medium text-gray-600">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-2">{exp.company}</div>
                {exp.description && <p className="text-sm text-gray-700 mb-2">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                    {exp.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {content.education && content.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">
            Education
          </h2>
          <div className="space-y-4">
            {content.education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{edu.institution}</h3>
                  <div className="text-sm text-gray-700">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-600 block">
                    {edu.startDate} - {edu.endDate || 'Expected'}
                  </span>
                  {edu.gpa && <span className="text-sm text-gray-600">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {content.skills && content.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, idx) => (
              <span key={skill.id || idx} className="text-sm text-gray-800 bg-gray-100 px-3 py-1 rounded-sm font-medium">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {content.projects && content.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-1">
            Projects
          </h2>
          <div className="space-y-4">
            {content.projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {proj.name} 
                    {proj.url && <a href={proj.url} className="text-blue-600 font-normal ml-2 hover:underline text-sm">(Link)</a>}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {proj.startDate} {proj.endDate && `- ${proj.endDate}`}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 font-medium">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
