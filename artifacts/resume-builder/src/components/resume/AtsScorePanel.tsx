import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AtsProgress } from "./AtsProgress";
import { useGetAtsScore } from "@workspace/api-client-react";
import { Target, CheckCircle2, AlertTriangle, Sparkles, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AtsScorePanelProps {
  resumeId: number;
}

export function AtsScorePanel({ resumeId }: AtsScorePanelProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const { mutate: getScore, data: result, isPending } = useGetAtsScore();

  const handleScore = () => {
    if (!jobDescription.trim()) return;
    getScore({ id: resumeId, data: { jobDescription } });
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Card className="h-full flex flex-col border-none shadow-none rounded-none bg-surface/50">
      <CardHeader className="border-b border-border/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          ATS Optimizer
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Job Description Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Target Job Description</label>
          <Textarea 
            placeholder="Paste the job description here to see how well your resume matches..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[120px] text-xs bg-background/50 border-border/50"
          />
          <Button 
            className="w-full" 
            onClick={handleScore} 
            disabled={!jobDescription.trim()}
            isLoading={isPending}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Calculate Match Score
          </Button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pt-4 border-t border-border/50"
            >
              
              {/* Overall Score */}
              <div className="flex flex-col items-center">
                <AtsProgress score={result.overallScore} size={140} strokeWidth={12} />
                <h3 className="mt-4 text-xl font-bold tracking-tight">
                  Grade: <span className={
                    result.overallScore >= 75 ? "text-success" : result.overallScore >= 50 ? "text-warning" : "text-destructive"
                  }>{result.grade}</span>
                </h3>
              </div>

              {/* Sections Progress Bars */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Section Scores
                </h4>
                {result.sections?.map((section, i) => {
                  const percent = (section.score / section.maxScore) * 100;
                  const colorClass = percent >= 70 ? "bg-success" : percent >= 40 ? "bg-warning" : "bg-destructive";
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{section.name}</span>
                        <span className="text-muted-foreground">{section.score}/{section.maxScore}</span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${colorClass}`} 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Strengths */}
              {result.strengths && result.strengths.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-success" />
                    Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-foreground/80">
                    {result.strengths.map((strength, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  Keyword Matches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordMatches.map((kw, i) => (
                    <Badge key={i} variant={kw.found ? "success" : "error"} className="text-[10px] px-2 py-1">
                      {kw.keyword}
                      {!kw.found && <span className="ml-1 opacity-70">- Missing</span>}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Suggestions with One-Click Fix */}
              {result.improvementSuggestions.length > 0 && (
                <div className="space-y-4 bg-warning/5 border border-warning/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-4 h-4" />
                    How to improve
                  </h4>
                  <div className="space-y-4">
                    {result.improvementSuggestions.map((sug, i) => (
                      <div key={i} className="space-y-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                        <div className="flex gap-2 text-xs text-foreground/90">
                          <span className="text-warning mt-0.5">•</span>
                          <span className="leading-relaxed">{sug}</span>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-7 text-[10px] ml-4 bg-background"
                          onClick={() => handleCopy(sug, i)}
                        >
                          {copiedId === i ? (
                            <><Check className="w-3 h-3 mr-1.5 text-success" /> Copied!</>
                          ) : (
                            <><Copy className="w-3 h-3 mr-1.5" /> One-Click Fix</>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}
