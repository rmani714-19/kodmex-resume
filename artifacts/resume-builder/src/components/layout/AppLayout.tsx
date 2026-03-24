import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex text-foreground selection:bg-primary/30">
      <Sidebar />
      
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-xl z-50 flex items-center justify-between px-4">
        <div className="font-bold text-lg tracking-tight">ElevateCV</div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-muted-foreground">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <main className="flex-1 w-full max-w-[100vw] md:max-w-[calc(100vw-256px)] pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
