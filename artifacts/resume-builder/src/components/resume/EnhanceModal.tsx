import { useState } from "react";
import { useEnhanceResume } from "@workspace/api-client-react";
import type { EnhanceResumeRequestSection } from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhanceModalProps {
  resumeId: number;
  section: EnhanceResumeRequestSection;
  currentContent: string;
  onApply: (newContent: string) => void;
  onClose: () => void;
}

export function EnhanceModal({ resumeId, section, currentContent, onApply, onClose }: EnhanceModalProps) {
  const [jobDescription, setJobDescription] = useState("");
  const { mutate: enhance, data: result, isPending } = useEnhanceResume();

  const handleEnhance = () => {
    enhance({
      id: resumeId,
      data: {
        section,
        currentContent,
        jobDescription: jobDescription || undefined,
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-surface">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Enhance: <span className="capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Make your content more impactful and ATS-friendly.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-background grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Job Description (Optional)</label>
              <Textarea 
                placeholder="Paste the job description to tailor the content..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="h-32"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Original Content</label>
              <div className="bg-surface border border-border rounded-xl p-4 text-sm text-foreground/80 min-h-[200px] whitespace-pre-wrap">
                {currentContent || <span className="italic opacity-50">No content provided.</span>}
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleEnhance} 
              isLoading={isPending}
              disabled={!currentContent.trim()}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Magic
            </Button>
          </div>

          {/* Right: Output */}
          <div className="bg-surface/50 border border-primary/20 rounded-xl p-6 relative flex flex-col">
            <h3 className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
              Enhanced Version
              {isPending && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>}
            </h3>
            
            <div className="flex-1 overflow-y-auto">
              {!result && !isPending && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Sparkles className="w-12 h-12 mb-4" />
                  <p>Click Generate Magic to see the enhanced version here.</p>
                </div>
              )}
              
              {result && (
                <div className="space-y-6">
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {result.enhancedContent}
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Why this is better:</h4>
                    <p className="text-xs text-accent italic">{result.explanation}</p>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="pt-4 mt-auto border-t border-border/50 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Discard
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => {
                    onApply(result.enhancedContent);
                    onClose();
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply to Resume
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
