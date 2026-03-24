import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { useGetResume, useUpdateResume } from "@workspace/api-client-react";
import type { ResumeContent, ResumeTemplate, EnhanceResumeRequestSection } from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, User, Briefcase, GraduationCap, Code, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { AtsScorePanel } from "@/components/resume/AtsScorePanel";
import { EnhanceModal } from "@/components/resume/EnhanceModal";

export function Editor() {
  const params = useParams();
  const resumeId = Number(params.id);
  const [, navigate] = useLocation();

  const { data: resume, isLoading } = useGetResume(resumeId);
  const { mutate: updateResume, isPending: isSaving } = useUpdateResume();

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<ResumeTemplate>("modern");
  const [content, setContent] = useState<ResumeContent | null>(null);
  
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "education" | "skills">("personal");
  const [enhanceSection, setEnhanceSection] = useState<{key: EnhanceResumeRequestSection, index?: number, text: string} | null>(null);

  // Sync initial data
  useEffect(() => {
    if (resume) {
      setTitle(resume.title);
      setTemplate(resume.template);
      setContent(resume.content);
    }
  }, [resume]);

  const handleSave = () => {
    if (!content) return;
    updateResume({
      id: resumeId,
      data: { title, template, content }
    });
  };

  if (isLoading || !content) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="w-64 bg-transparent border-transparent hover:border-border text-lg font-semibold focus-ring-glow px-2"
          />
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={template} 
            onChange={(e) => setTemplate(e.target.value as ResumeTemplate)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="modern">Modern Template</option>
            <option value="classic">Classic Template</option>
            <option value="minimal">Minimal Template</option>
          </select>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Column 1: Forms (40%) */}
        <div className="w-[40%] flex flex-col border-r border-border bg-surface/30 relative">
          
          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto hide-scrollbar shrink-0">
            {[
              { id: "personal", label: "Personal", icon: User },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Code },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "border-primary text-primary bg-primary/5" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {activeTab === "personal" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Full Name</label>
                    <Input 
                      value={content.personalInfo.fullName} 
                      onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, fullName: e.target.value}})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Email</label>
                    <Input 
                      value={content.personalInfo.email} 
                      onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, email: e.target.value}})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Phone</label>
                    <Input 
                      value={content.personalInfo.phone || ""} 
                      onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, phone: e.target.value}})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <Input 
                      value={content.personalInfo.location || ""} 
                      onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, location: e.target.value}})} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2 relative group">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Professional Summary</label>
                    <Button 
                      variant="ghost" size="sm" className="h-6 text-xs text-primary"
                      onClick={() => setEnhanceSection({ key: "summary", text: content.personalInfo.summary || "" })}
                    >
                      <Sparkles className="w-3 h-3 mr-1" /> AI Enhance
                    </Button>
                  </div>
                  <Textarea 
                    value={content.personalInfo.summary || ""} 
                    onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, summary: e.target.value}})}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {(content.workExperience || []).map((exp, idx) => (
                  <div key={exp.id} className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Company</label>
                        <Input 
                          value={exp.company} 
                          onChange={(e) => {
                            const newExp = [...(content.workExperience || [])];
                            newExp[idx].company = e.target.value;
                            setContent({...content, workExperience: newExp});
                          }} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Job Title</label>
                        <Input 
                          value={exp.title} 
                          onChange={(e) => {
                            const newExp = [...(content.workExperience || [])];
                            newExp[idx].title = e.target.value;
                            setContent({...content, workExperience: newExp});
                          }} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-muted-foreground">Description & Achievements</label>
                        <Button 
                          variant="ghost" size="sm" className="h-6 text-xs text-primary"
                          onClick={() => setEnhanceSection({ 
                            key: "workExperience", 
                            index: idx, 
                            text: exp.description || "" 
                          })}
                        >
                          <Sparkles className="w-3 h-3 mr-1" /> AI Enhance
                        </Button>
                      </div>
                      <Textarea 
                        value={exp.description || ""} 
                        placeholder="Bullet points describing your role..."
                        onChange={(e) => {
                          const newExp = [...(content.workExperience || [])];
                          newExp[idx].description = e.target.value;
                          setContent({...content, workExperience: newExp});
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" className="w-full border-dashed"
                  onClick={() => setContent({
                    ...content, 
                    workExperience: [...(content.workExperience || []), { id: Math.random().toString(), company: "", title: "", startDate: "" }]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Experience
                </Button>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {(content.education || []).map((edu, idx) => (
                  <div key={edu.id} className="p-5 bg-card border border-border rounded-xl space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Institution</label>
                      <Input 
                        value={edu.institution} 
                        onChange={(e) => {
                          const newEdu = [...(content.education || [])];
                          newEdu[idx].institution = e.target.value;
                          setContent({...content, education: newEdu});
                        }} 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Degree</label>
                        <Input 
                          value={edu.degree} 
                          onChange={(e) => {
                            const newEdu = [...(content.education || [])];
                            newEdu[idx].degree = e.target.value;
                            setContent({...content, education: newEdu});
                          }} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Field of Study</label>
                        <Input 
                          value={edu.field || ""} 
                          onChange={(e) => {
                            const newEdu = [...(content.education || [])];
                            newEdu[idx].field = e.target.value;
                            setContent({...content, education: newEdu});
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" className="w-full border-dashed"
                  onClick={() => setContent({
                    ...content, 
                    education: [...(content.education || []), { id: Math.random().toString(), institution: "", degree: "" }]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
              </div>
            )}

          </div>
        </div>

        {/* Column 2: Live Preview (40%) */}
        <div className="w-[40%] bg-muted/20 overflow-y-auto border-r border-border p-8 flex justify-center">
          <div className="scale-[0.8] xl:scale-[0.9] origin-top">
            <ResumePreview content={content} template={template} />
          </div>
        </div>

        {/* Column 3: ATS Score Panel (20%) */}
        <div className="w-[20%] bg-surface flex flex-col border-l border-border/50">
          <AtsScorePanel resumeId={resumeId} />
        </div>

      </div>

      {/* AI Enhance Modal */}
      <AnimatePresence>
        {enhanceSection && (
          <EnhanceModal
            resumeId={resumeId}
            section={enhanceSection.key}
            currentContent={enhanceSection.text}
            onClose={() => setEnhanceSection(null)}
            onApply={(newText) => {
              if (enhanceSection.key === "summary") {
                setContent({...content, personalInfo: {...content.personalInfo, summary: newText}});
              } else if (enhanceSection.key === "workExperience" && enhanceSection.index !== undefined) {
                const newExp = [...(content.workExperience || [])];
                newExp[enhanceSection.index].description = newText;
                setContent({...content, workExperience: newExp});
              }
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

