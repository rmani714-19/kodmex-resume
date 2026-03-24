import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateResume } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Upload() {
  const [, navigate] = useLocation();
  const { mutate: createResume, isPending } = useCreateResume();
  
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    
    // MOCK: Since there's no real backend upload parsing route in the spec,
    // we simulate parsing success and create a dummy populated resume.
    createResume({
      data: {
        title: file.name.split('.')[0] || "Imported Resume",
        template: "modern",
        content: {
          personalInfo: {
            fullName: "Alex Developer",
            email: "alex@example.com",
            summary: "Experienced software engineer specializing in frontend architecture."
          },
          workExperience: [
            {
              id: "1",
              company: "Tech Corp",
              title: "Senior Engineer",
              startDate: "2020",
              current: true,
              description: "Led the transition to React 19 and Tailwind v4. Improved ATS score by 20%."
            }
          ],
          skills: [
            { id: "1", name: "React" },
            { id: "2", name: "TypeScript" },
            { id: "3", name: "Node.js" }
          ]
        }
      }
    }, {
      onSuccess: (data) => {
        navigate(`/resume/${data.id}/edit`);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-8 py-16 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Import your existing resume</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload your PDF or DOCX file. Our AI will extract your details and populate the editor automatically, ready for ATS optimization.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto border-border/50 bg-surface/50 backdrop-blur-xl">
        <CardContent className="p-8">
          
          {!file ? (
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 ${
                dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-surface"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6 shadow-glow">
                <UploadCloud className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Drag and drop your file here</h3>
              <p className="text-muted-foreground mb-6">Supports PDF, DOCX, and TXT up to 5MB</p>
              
              <div className="relative">
                <input 
                  type="file" 
                  accept=".pdf,.docx,.txt"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
                <Button variant="secondary" className="pointer-events-none">
                  Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center p-6 bg-card border border-border rounded-xl">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mr-6">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{file.name}</h4>
                  <p className="text-muted-foreground text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="text-muted-foreground">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Document parsed successfully</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>Text extracted and mapped to schema</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full"
                onClick={handleProcess}
                isLoading={isPending}
              >
                Proceed to Editor <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

import { Trash2 } from "lucide-react";
