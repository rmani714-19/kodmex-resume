import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AtsProgress } from "./AtsProgress";
import { useGetAtsScore } from "@workspace/api-client-react";
import { Target, CheckCircle2, XCircle, AlertTriangle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AtsScorePanelProps {
  resumeId: number;
}

export function AtsScorePanel({ resumeId }: AtsScorePanelProps) {
  const [jobDescription, setJobDescription] = useState("");
  
  const { mutate: getScore, data: result, isPending } = useGetAtsScore();

  const handleScore = () => {
    if (!jobDescription.trim()) return;
    getScore({ id: resumeId, data: { jobDescription } });
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

              {/* Suggestions */}
              {result.improvementSuggestions.length > 0 && (
                <div className="space-y-3 bg-warning/10 border border-warning/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-4 h-4" />
                    How to improve
                  </h4>
                  <ul className="space-y-2 text-xs text-foreground/80">
                    {result.improvementSuggestions.map((sug, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-warning mt-0.5">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}
