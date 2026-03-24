import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { useGetResume, useUpdateResume } from "@workspace/api-client-react";
import type { ResumeContent, ResumeTemplate, EnhanceResumeRequestSection } from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, User, Briefcase, GraduationCap, Code, ArrowLeft, Loader2, Sparkles, LayoutTemplate, FileText, CheckCircle2, XCircle, Trash2, Award } from "lucide-react";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { AtsScorePanel } from "@/components/resume/AtsScorePanel";
import { EnhanceModal } from "@/components/resume/EnhanceModal";
import { SkillsTagInput } from "@/components/resume/SkillsTagInput";
import { cn } from "@/lib/utils";

export function Editor() {
  const params = useParams();
  const resumeId = Number(params.id);
  const [, navigate] = useLocation();

  const { data: resume, isLoading } = useGetResume(resumeId);
  const { mutate: updateResume, isPending: isSaving } = useUpdateResume();

  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState<ResumeTemplate>("modern");
  const [content, setContent] = useState<ResumeContent | null>(null);
  
  const [activeTab, setActiveTab] = useState<"personal" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications">("personal");
  const [enhanceSection, setEnhanceSection] = useState<{key: EnhanceResumeRequestSection, index?: number, text: string} | null>(null);
  
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial data
  useEffect(() => {
    if (resume && !content) {
      setTitle(resume.title);
      setTemplate(resume.template);
      setContent(resume.content);
    }
  }, [resume, content]);

  const handleSave = (currentTitle: string, currentTemplate: ResumeTemplate, currentContent: ResumeContent) => {
    setSaveStatus("saving");
    updateResume({
      id: resumeId,
      data: { title: currentTitle, template: currentTemplate, content: currentContent }
    }, {
      onSuccess: () => {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    });
  };

  // Auto-save debounce effect
  useEffect(() => {
    if (!content || !resume) return;

    // Simple deep check to see if changed (avoid unnecessary saves)
    const isChanged = title !== resume.title || template !== resume.template || JSON.stringify(content) !== JSON.stringify(resume.content);
    if (!isChanged) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleSave(title, template, content);
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [title, template, content, resumeId]);

  if (isLoading || !content) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const experienceLevel = (content as any).experienceLevel || "fresher";
  
  const handleAutoGenerateSummary = () => {
    let newSummary = "";
    const role = (content.personalInfo as any).role || "professional";
    
    if (experienceLevel === "school") {
      newSummary = `Highly motivated and enthusiastic student eager to learn and contribute. Strong academic background with excellent communication and teamwork skills.`;
    } else if (experienceLevel === "fresher") {
      newSummary = `Recent graduate and aspiring ${role} with a strong foundation in modern technologies. Passionate about building scalable applications and ready to make an immediate impact in a collaborative environment.`;
    } else if (experienceLevel === "mid") {
      newSummary = `Experienced ${role} with a proven track record of delivering high-quality solutions. Skilled in driving project success, optimizing performance, and collaborating with cross-functional teams.`;
    } else {
      newSummary = `Senior ${role} with extensive experience leading technical initiatives and mentoring teams. Expertise in architecting complex systems, driving strategic vision, and delivering measurable business value.`;
    }
    
    setContent({
      ...content,
      personalInfo: { ...content.personalInfo, summary: newSummary }
    });
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    ...(experienceLevel !== "school" ? [{ id: "experience", label: "Experience", icon: Briefcase }] : []),
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Code },
    { id: "projects", label: "Projects", icon: LayoutTemplate },
    { id: "certifications", label: "Certs", icon: Award },
  ] as const;

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
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === "saving" && <span className="text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Auto-saving...</span>}
            {saveStatus === "saved" && <span className="text-success flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
          </div>
          <select 
            value={template} 
            onChange={(e) => setTemplate(e.target.value as ResumeTemplate)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="modern">Modern Template</option>
            <option value="classic">Classic Template</option>
            <option value="minimal">Minimal Template</option>
          </select>
          <Button onClick={() => handleSave(title, template, content)} isLoading={isSaving || saveStatus === "saving"}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Column 1: Forms (40%) */}
        <div className="w-[40%] flex flex-col border-r border-border bg-surface/30 relative">
          
          {/* Level Selector */}
          <div className="p-4 border-b border-border bg-surface/50">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Experience Level</label>
            <div className="flex bg-background border border-border p-1 rounded-xl">
              {['school', 'fresher', 'mid', 'senior'].map(level => (
                <button
                  key={level}
                  onClick={() => setContent({...content, experienceLevel: level} as any)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors",
                    experienceLevel === level ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto hide-scrollbar shrink-0 px-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
                    <label className="text-xs font-medium text-muted-foreground">Role / Title</label>
                    <Input 
                      value={(content.personalInfo as any).role || ""} 
                      placeholder="e.g. Software Engineer"
                      onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, role: e.target.value}})} 
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
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">LinkedIn</label>
                    <Input 
                      value={content.personalInfo.linkedin || ""} 
                      onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, linkedin: e.target.value}})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Website / Portfolio</label>
                    <Input 
                      value={content.personalInfo.website || ""} 
                      onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, website: e.target.value}})} 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "summary" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Professional Summary</label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" size="sm" className="h-8 text-xs"
                      onClick={handleAutoGenerateSummary}
                    >
                      <Sparkles className="w-3 h-3 mr-1" /> Auto-Generate
                    </Button>
                    <Button 
                      variant="ghost" size="sm" className="h-8 text-xs text-primary"
                      onClick={() => setEnhanceSection({ key: "summary", text: content.personalInfo.summary || "" })}
                    >
                      <Sparkles className="w-3 h-3 mr-1" /> AI Enhance
                    </Button>
                  </div>
                </div>
                <Textarea 
                  value={content.personalInfo.summary || ""} 
                  onChange={(e) => setContent({...content, personalInfo: {...content.personalInfo, summary: e.target.value}})}
                  className="min-h-[250px] text-sm leading-relaxed"
                  placeholder="Write a brief professional summary..."
                />
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {(content.workExperience || []).map((exp, idx) => {
                  
                  const hasActionVerb = /^(developed|built|led|designed|implemented|optimized|created|managed|engineered)/i.test(exp.description || "");
                  const hasMetric = /(\d+%|\d+|increase|reduced|improved)/i.test(exp.description || "");

                  return (
                    <div key={exp.id || idx} className="p-5 bg-card border border-border rounded-xl space-y-4 relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        onClick={() => {
                          const newExp = [...(content.workExperience || [])];
                          newExp.splice(idx, 1);
                          setContent({...content, workExperience: newExp});
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
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
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                          <Input 
                            value={exp.startDate} 
                            placeholder="e.g. Jan 2020"
                            onChange={(e) => {
                              const newExp = [...(content.workExperience || [])];
                              newExp[idx].startDate = e.target.value;
                              setContent({...content, workExperience: newExp});
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">End Date</label>
                          <Input 
                            value={exp.endDate || ""} 
                            placeholder="e.g. Present"
                            onChange={(e) => {
                              const newExp = [...(content.workExperience || [])];
                              newExp[idx].endDate = e.target.value;
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
                          className={cn(
                            "min-h-[120px]", 
                            (!hasActionVerb || !hasMetric) && exp.description ? "border-warning/50 focus:border-warning" : ""
                          )}
                        />
                        {exp.description && (
                          <div className="flex flex-col gap-1 mt-2">
                            {!hasActionVerb && (
                              <div className="flex items-center gap-1.5 text-xs text-destructive">
                                <XCircle className="w-3.5 h-3.5" />
                                Add an action verb (e.g. developed, built, led)
                              </div>
                            )}
                            {!hasMetric && (
                              <div className="flex items-center gap-1.5 text-xs text-warning">
                                <XCircle className="w-3.5 h-3.5" />
                                Add a metric (e.g. 50%, 3 users, increased by 2x)
                              </div>
                            )}
                            {hasActionVerb && hasMetric && (
                              <div className="flex items-center gap-1.5 text-xs text-success">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Great description! Action verb and metrics found.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                  <div key={edu.id || idx} className="p-5 bg-card border border-border rounded-xl space-y-4 relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      onClick={() => {
                        const newEdu = [...(content.education || [])];
                        newEdu.splice(idx, 1);
                        setContent({...content, education: newEdu});
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                        <Input 
                          value={edu.startDate || ""} 
                          onChange={(e) => {
                            const newEdu = [...(content.education || [])];
                            newEdu[idx].startDate = e.target.value;
                            setContent({...content, education: newEdu});
                          }} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">End Date</label>
                        <Input 
                          value={edu.endDate || ""} 
                          onChange={(e) => {
                            const newEdu = [...(content.education || [])];
                            newEdu[idx].endDate = e.target.value;
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

            {activeTab === "skills" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Core Skills</label>
                  <p className="text-xs text-muted-foreground mb-4">Add the technologies, tools, and methodologies you are proficient in.</p>
                  
                  <SkillsTagInput 
                    skills={(content.skills || []).map(s => s.name)}
                    onChange={(newSkills) => {
                      setContent({
                        ...content,
                        skills: newSkills.map(name => ({ id: Math.random().toString(), name }))
                      });
                    }}
                    minItems={3}
                  />
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {(content.projects || []).map((proj, idx) => {
                  const hasMinWords = (proj.description?.split(" ").length || 0) >= 15;
                  
                  return (
                    <div key={proj.id || idx} className="p-5 bg-card border border-border rounded-xl space-y-4 relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        onClick={() => {
                          const newProj = [...(content.projects || [])];
                          newProj.splice(idx, 1);
                          setContent({...content, projects: newProj});
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Project Name</label>
                        <Input 
                          value={proj.name} 
                          onChange={(e) => {
                            const newProj = [...(content.projects || [])];
                            newProj[idx].name = e.target.value;
                            setContent({...content, projects: newProj});
                          }} 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">URL</label>
                          <Input 
                            value={proj.url || ""} 
                            placeholder="https://"
                            onChange={(e) => {
                              const newProj = [...(content.projects || [])];
                              newProj[idx].url = e.target.value;
                              setContent({...content, projects: newProj});
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Timeline</label>
                          <Input 
                            value={proj.startDate || ""} 
                            placeholder="e.g. 2023 - 2024"
                            onChange={(e) => {
                              const newProj = [...(content.projects || [])];
                              newProj[idx].startDate = e.target.value;
                              setContent({...content, projects: newProj});
                            }} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <Textarea 
                          value={proj.description || ""} 
                          placeholder="Describe the project..."
                          className={cn(!hasMinWords && proj.description ? "border-warning/50" : "")}
                          onChange={(e) => {
                            const newProj = [...(content.projects || [])];
                            newProj[idx].description = e.target.value;
                            setContent({...content, projects: newProj});
                          }}
                        />
                        {proj.description && !hasMinWords && (
                          <div className="flex items-center gap-1.5 text-xs text-warning">
                            <XCircle className="w-3.5 h-3.5" />
                            Description should be at least 15 words.
                          </div>
                        )}
                        {proj.description && hasMinWords && (
                          <div className="flex items-center gap-1.5 text-xs text-success">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Good description length.
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">Technologies</label>
                        <SkillsTagInput 
                          skills={proj.technologies || []}
                          onChange={(newTechs) => {
                            const newProj = [...(content.projects || [])];
                            newProj[idx].technologies = newTechs;
                            setContent({...content, projects: newProj});
                          }}
                          minItems={2}
                          placeholder="Add technology used..."
                        />
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="outline" className="w-full border-dashed"
                  onClick={() => setContent({
                    ...content, 
                    projects: [...(content.projects || []), { id: Math.random().toString(), name: "", description: "", technologies: [] }]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </div>
            )}

            {activeTab === "certifications" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                {(content.certifications || []).map((cert, idx) => {
                  const [name = "", issuer = ""] = cert.split("|");
                  return (
                    <div key={idx} className="p-5 bg-card border border-border rounded-xl space-y-4 relative group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        onClick={() => {
                          const newCerts = [...(content.certifications || [])];
                          newCerts.splice(idx, 1);
                          setContent({...content, certifications: newCerts});
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Certification Name</label>
                          <Input 
                            value={name.trim()} 
                            onChange={(e) => {
                              const newCerts = [...(content.certifications || [])];
                              newCerts[idx] = `${e.target.value} | ${issuer.trim()}`;
                              setContent({...content, certifications: newCerts});
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Issuer</label>
                          <Input 
                            value={issuer.trim()} 
                            onChange={(e) => {
                              const newCerts = [...(content.certifications || [])];
                              newCerts[idx] = `${name.trim()} | ${e.target.value}`;
                              setContent({...content, certifications: newCerts});
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Button 
                  variant="outline" className="w-full border-dashed"
                  onClick={() => setContent({
                    ...content, 
                    certifications: [...(content.certifications || []), "New Certification | Issuer"]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Certification
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
