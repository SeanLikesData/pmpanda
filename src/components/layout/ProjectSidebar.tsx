import { useState } from "react";
import { Plus, Folder, FileText, BarChart3, User, Settings, ChevronRight } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock project data - using a function to get fresh data
const getInitialProjects = () => [
  { id: "1", name: "CLI Version of Olivie", type: "feature", status: "in-progress" },
  { id: "2", name: "Olivie for Browser", type: "feature", status: "planning" },
  { id: "3", name: "API Integration Layer", type: "technical", status: "planning" },
];

const appSections = [
  { title: "Roadmap", url: "/roadmap", icon: BarChart3 },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Templates", url: "/templates", icon: Settings },
];

export function ProjectSidebar() {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState("1");
  const [projects, setProjects] = useState(getInitialProjects());

  const createNewProject = () => {
    const newProjectId = (projects.length + 1).toString();
    const newProject = {
      id: newProjectId,
      name: `New Project ${newProjectId}`,
      type: "feature" as const,
      status: "planning" as const
    };
    
    setProjects(prev => [...prev, newProject]);
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          {open && (
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">PMPanda</h2>
              <p className="text-xs text-sidebar-foreground/60">AI Product Manager</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
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
      </SidebarContent>
    </Sidebar>
  );
}