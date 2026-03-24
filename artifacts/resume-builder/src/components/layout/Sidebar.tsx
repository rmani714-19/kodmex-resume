import { Link, useLocation } from "wouter";
import { FileText, LayoutDashboard, PlusCircle, UploadCloud, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume/new", label: "Create Resume", icon: PlusCircle },
  { href: "/resume/upload", label: "Import Resume", icon: UploadCloud },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col hidden md:flex z-40">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-muted-foreground">
          ElevateCV
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 font-medium",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_20px_rgba(108,92,231,0.1)]"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-surface rounded-2xl p-4 border border-border">
          <h4 className="text-sm font-semibold mb-1">Pro Plan Active</h4>
          <p className="text-xs text-muted-foreground mb-3">Unlimited AI Enhancements</p>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-primary"></div>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 mt-2 w-full rounded-xl text-muted-foreground hover:bg-surface hover:text-foreground transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
