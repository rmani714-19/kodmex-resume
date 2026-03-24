import { Link, useLocation } from "wouter";
import { Plus, FileText, Trash2, Edit3, Loader2 } from "lucide-react";
import { useListResumes, useDeleteResume, useCreateResume } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export function Dashboard() {
  const [, navigate] = useLocation();
  const { data: resumes, isLoading } = useListResumes();
  const { mutate: deleteResume } = useDeleteResume();
  const { mutate: createResume, isPending: isCreating } = useCreateResume();

  const handleCreateEmpty = () => {
    createResume({
      data: {
        title: "Untitled Resume",
        template: "modern",
        content: {
          personalInfo: {
            fullName: "",
            email: ""
          }
        }
      }
    }, {
      onSuccess: (data) => {
        navigate(`/resume/${data.id}/edit`);
      }
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            My Resumes
          </h1>
          <p className="text-muted-foreground mt-2">Manage and optimize your professional profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/resume/upload">
            <Button variant="secondary" className="w-full md:w-auto">Import PDF</Button>
          </Link>
          <Button onClick={handleCreateEmpty} isLoading={isCreating} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Blank
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : resumes?.length === 0 ? (
        <div className="bg-surface border border-border/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow opacity-80">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No resumes yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start by creating a blank resume or import your existing LinkedIn PDF to see the magic happen.
          </p>
          <Button onClick={handleCreateEmpty} size="lg">
            Create your first resume
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resumes?.map((resume) => (
            <Card key={resume.id} className="group relative transition-all duration-300 hover:shadow-glow hover:-translate-y-1 bg-surface border border-border/50">
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={() => navigate(`/resume/${resume.id}/edit`)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="danger" 
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this resume?")) {
                      deleteResume({ id: resume.id });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div 
                className="h-48 bg-background border-b border-border/50 p-4 overflow-hidden relative cursor-pointer"
                onClick={() => navigate(`/resume/${resume.id}/edit`)}
              >
                {/* Mock preview skeleton */}
                <div className="w-[120%] transform origin-top-left scale-[0.8] space-y-4 opacity-50 blur-[1px]">
                  <div className="h-6 w-1/2 bg-primary/20 rounded-md"></div>
                  <div className="h-2 w-1/3 bg-muted rounded-full"></div>
                  <div className="space-y-2 mt-6">
                    <div className="h-3 w-3/4 bg-border rounded-full"></div>
                    <div className="h-3 w-full bg-border rounded-full"></div>
                    <div className="h-3 w-5/6 bg-border rounded-full"></div>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              </div>

              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {resume.title}
                  </h3>
                  {resume.lastAtsScore !== null && resume.lastAtsScore !== undefined && (
                    <Badge variant={resume.lastAtsScore >= 75 ? "success" : resume.lastAtsScore >= 50 ? "warning" : "error"}>
                      {resume.lastAtsScore} ATS
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>Edited {formatDate(resume.updatedAt)}</span>
                  <span>•</span>
                  <span className="capitalize">{resume.template}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
