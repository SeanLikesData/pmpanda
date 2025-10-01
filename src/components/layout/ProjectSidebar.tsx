import { useState, useEffect } from "react";
import { Plus, Folder, BarChart3, User, Settings, ChevronRight, Zap, Building2, LogOut } from "lucide-react";
import pandaLogo from "@/assets/panda-logo-final.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useProjectStore } from "@/lib/projectStore";
import { useAuth } from "@/hooks/useAuth";

const appSections = [
  { title: "Roadmap", url: "/roadmap", icon: BarChart3 },
  { title: "Company Info", url: "/company-info", icon: Building2 },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Templates", url: "/templates", icon: Settings },
  { title: "Integrations", url: "/integrations", icon: Zap },
];

export function ProjectSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState("1");
  const { signOut, user } = useAuth();
  
  // Use the shared project store
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const addProject = useProjectStore((state) => state.addProject);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/auth");
  };

  const createNewProject = () => {
    const newProjectId = (projects.length + 1).toString();
    const newProject = {
      name: `New Project ${newProjectId}`,
      description: "Enter a brief description for this project...",
      type: "feature" as const,
      status: "planning" as const,
      priority: "P2" as const,
      quarter: "Q1 2024",
      prd_content: `# Product Requirements Document: New Project ${newProjectId}

## Problem Statement
Define the problem this project aims to solve.

## Objectives
- Primary goal 1
- Primary goal 2
- Primary goal 3

## User Stories
- As a user, I want...
- As a stakeholder, I need...

## Requirements
### Functional Requirements
1. Requirement 1
2. Requirement 2

### Non-Functional Requirements
- Performance targets
- Security requirements
- Scalability needs

## Success Metrics
- Metric 1: [Target]
- Metric 2: [Target]

## Timeline
- Phase 1: Planning
- Phase 2: Development
- Phase 3: Launch`,
      spec_content: `# Technical Specification: New Project ${newProjectId}

## Architecture Overview
High-level technical approach for this project.

## Core Components
1. Component 1: Description
2. Component 2: Description
3. Component 3: Description

## API Design
### Endpoints
\`\`\`
GET /api/resource
POST /api/resource
PUT /api/resource/:id
DELETE /api/resource/:id
\`\`\`

## Data Models
\`\`\`typescript
interface ProjectData {
  id: string;
  name: string;
  status: string;
}
\`\`\`

## Implementation Plan
1. Setup development environment
2. Implement core functionality
3. Add testing suite
4. Deploy to staging
5. Production release`
    };
    
    addProject(newProject);
    setSelectedProject(newProjectId);
    navigate(`/project/${newProjectId}`);
    
    toast({
      title: "Project created!",
      description: `${newProject.name} has been created successfully.`,
    });
  };

  const getNavCls = (isActive: boolean) =>
    cn(
      "w-full justify-start text-sm font-medium transition-colors",
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    );

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <img src={pandaLogo} alt="PMPanda Logo" className="w-8 h-8 object-contain rounded-lg" />
            </div>
            {open && (
              <div>
                <h2 className="text-sm font-semibold text-sidebar-foreground">PMPanda</h2>
                <p className="text-xs text-sidebar-foreground/60">AI Product Manager</p>
              </div>
            )}
          </div>
          {open && <SidebarTrigger />}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Projects section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide px-2 flex items-center justify-between">
            {open && "Projects"}
            {open && (
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 hover:bg-sidebar-accent"
                onClick={createNewProject}
                title="Create new project"
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/project/${project.id}`}
                      className={({ isActive }) => getNavCls(isActive)}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <Folder className="w-4 h-4" />
                        {open && (
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{project.name}</p>
                            <p className="text-xs text-sidebar-foreground/50 capitalize">
                              {project.status}
                            </p>
                          </div>
                        )}
                      </div>
                      {open && <ChevronRight className="w-3 h-3 opacity-50" />}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* App-level sections */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wide px-2">
            {open ? "Navigate" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSections.map((section) => (
                <SidebarMenuItem key={section.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={section.url}
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <section.icon className="w-4 h-4" />
                      {open && <span>{section.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {open && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}