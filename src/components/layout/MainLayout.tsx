import { SidebarProvider } from "@/components/ui/sidebar";
import { ProjectSidebar } from "./ProjectSidebar";
import { ChatSidebar } from "./ChatSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ProjectSidebar />
        
        <div className="flex-1 flex min-h-0">
          <main className="flex-1 overflow-hidden flex flex-col">
            {children}
          </main>
          
          <ChatSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
}