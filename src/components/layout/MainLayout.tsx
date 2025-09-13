import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProjectSidebar } from "./ProjectSidebar";
import { ChatSidebar } from "./ChatSidebar";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [chatVisible, setChatVisible] = useState(true);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ProjectSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border bg-gradient-muted flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatVisible(!chatVisible)}
              className="flex items-center gap-2"
            >
              {chatVisible ? (
                <>
                  <X className="w-4 h-4" />
                  Hide Chat
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Show Chat
                </>
              )}
            </Button>
          </header>

          {/* Main content area */}
          <div className="flex-1 flex">
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
            
            {chatVisible && <ChatSidebar />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}