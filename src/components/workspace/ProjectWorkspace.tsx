import { useState, useEffect } from "react";
import { FileText, Code, Eye, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProjectStore } from "@/lib/projectStore";
import { useToast } from "@/hooks/use-toast";

export function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState("prd");
  const [viewMode, setViewMode] = useState<{ prd: 'edit' | 'preview'; spec: 'edit' | 'preview' }>({
    prd: 'edit',
    spec: 'edit'
  });
  
  // Use shared project store
  const { getProject, updateProject } = useProjectStore();
  const { toast } = useToast();
  
  const project = getProject(projectId || "");
  
  // Local editing states
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [localTitle, setLocalTitle] = useState(project?.name || "");
  const [localDescription, setLocalDescription] = useState(project?.description || "");
  
  const [content, setContent] = useState({
    prd: project?.prd_content || "",
    spec: project?.spec_content || ""
  });

  // Update content when project changes
  useEffect(() => {
    if (project) {
      setContent({
        prd: project.prd_content,
        spec: project.spec_content
      });
      setLocalTitle(project.name);
      setLocalDescription(project.description);
      // Reset view modes when switching projects
      setViewMode({ prd: 'edit', spec: 'edit' });
    }
  }, [project]);

  const saveContent = (type: 'prd' | 'spec') => {
    if (project) {
      const fieldName = type === 'prd' ? 'prd_content' : 'spec_content';
      updateProject(project.id, { [fieldName]: content[type] });
      console.log(`Auto-saving ${type}:`, content[type]);
    }
  };

  const saveTitle = () => {
    if (project && localTitle.trim()) {
      updateProject(project.id, { name: localTitle.trim() });
      setEditingTitle(false);
      toast({
        title: "Project title updated",
        description: "Title has been saved successfully.",
      });
    }
  };

  const saveDescription = () => {
    if (project) {
      updateProject(project.id, { description: localDescription.trim() });
      setEditingDescription(false);
      toast({
        title: "Project description updated", 
        description: "Description has been saved successfully.",
      });
    }
  };

  const handlePriorityChange = (priority: "P0" | "P1" | "P2" | "P3") => {
    if (project) {
      updateProject(project.id, { priority });
      toast({
        title: "Priority updated",
        description: `Project priority changed to ${priority}.`,
      });
    }
  };

  const handleStatusChange = (status: "planning" | "in-progress" | "completed") => {
    if (project) {
      updateProject(project.id, { status });
      toast({
        title: "Status updated",
        description: `Project status changed to ${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}.`,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "text-destructive font-bold";
      case "P1": return "text-warning font-semibold";  
      case "P2": return "text-primary font-medium";
      case "P3": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning": return "text-muted-foreground";
      case "in-progress": return "text-primary font-medium";
      case "completed": return "text-green-600 font-medium";
      default: return "text-muted-foreground";
    }
  };

  const renderContent = (type: 'prd' | 'spec') => {
    const currentViewMode = viewMode[type];
    const contentText = content[type];

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold capitalize">{type}</h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={currentViewMode === 'edit' ? 'default' : 'outline'}
              onClick={() => setViewMode(prev => ({ ...prev, [type]: 'edit' }))}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              size="sm"
              variant={currentViewMode === 'preview' ? 'default' : 'outline'}
              onClick={() => setViewMode(prev => ({ ...prev, [type]: 'preview' }))}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          {currentViewMode === 'edit' ? (
            <Textarea
              value={contentText}
              onChange={(e) => {
                setContent(prev => ({ ...prev, [type]: e.target.value }));
                setTimeout(() => saveContent(type), 1000);
              }}
              className="h-full w-full font-mono text-sm resize-none border rounded-lg focus:ring-2 focus:ring-primary/20"
              placeholder={`Enter ${type.toUpperCase()} content in Markdown format...`}
            />
          ) : (
            <ScrollArea className="h-full border rounded-lg">
              <div className="p-6">
                {contentText ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: (props) => <h1 className="text-2xl font-bold mb-4 text-foreground" {...props} />,
                        h2: (props) => <h2 className="text-xl font-semibold mb-3 text-foreground" {...props} />,
                        h3: (props) => <h3 className="text-lg font-medium mb-2 text-foreground" {...props} />,
                        p: (props) => <p className="mb-3 text-foreground leading-relaxed" {...props} />,
                        ul: (props) => <ul className="mb-3 ml-4 list-disc text-foreground" {...props} />,
                        ol: (props) => <ol className="mb-3 ml-4 list-decimal text-foreground" {...props} />,
                        li: (props) => <li className="mb-1 text-foreground" {...props} />,
                        code: (props: any) => {
                          const { children, className, ...rest } = props;
                          const isInline = !className?.includes('language-');
                          return isInline ? (
                            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono text-foreground" {...rest}>
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-muted p-4 rounded-lg text-sm font-mono text-foreground overflow-x-auto" {...rest}>
                              {children}
                            </code>
                          );
                        },
                        pre: (props) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                        blockquote: (props) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4" {...props} />,
                      }}
                    >
                      {contentText}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No {type.toUpperCase()} content yet.</p>
                    <p className="text-sm">Switch to Edit mode to start writing.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    );
  };

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="text-muted-foreground">The requested project could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-card">
      {/* Project header */}
      <div className="border-b border-border p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Editable Title */}
            <div className="mb-3">
              {editingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={localTitle}
                    onChange={(e) => setLocalTitle(e.target.value)}
                    className="text-2xl font-bold h-auto py-1 px-2 border-0 shadow-none bg-transparent"
                    onKeyPress={(e) => e.key === "Enter" && saveTitle()}
                    autoFocus
                  />
                  <Button size="sm" onClick={saveTitle} className="shrink-0">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setLocalTitle(project?.name || "");
                      setEditingTitle(false);
                    }}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl font-bold text-foreground">{project?.name}</h1>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingTitle(true)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Editable Description */}
            <div className="mb-3">
              {editingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    value={localDescription}
                    onChange={(e) => setLocalDescription(e.target.value)}
                    className="min-h-[60px] resize-none"
                    placeholder="Enter a brief description for this project..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveDescription}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setLocalDescription(project?.description || "");
                        setEditingDescription(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="group cursor-pointer" onClick={() => setEditingDescription(true)}>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {project?.description || "Click to add a description..."}
                  </p>
                </div>
              )}
            </div>

            {/* Status and Priority */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Select
                  value={project?.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-32 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-md">
                    <SelectItem value="planning">
                      <span className={getStatusColor("planning")}>Planning</span>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <span className={getStatusColor("in-progress")}>In Progress</span>
                    </SelectItem>
                    <SelectItem value="completed">
                      <span className={getStatusColor("completed")}>Completed</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Priority:</span>
                <Select
                  value={project?.priority}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger className="w-20 h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-md">
                    <SelectItem value="P0">
                      <span className={getPriorityColor("P0")}>P0</span>
                    </SelectItem>
                    <SelectItem value="P1">
                      <span className={getPriorityColor("P1")}>P1</span>
                    </SelectItem>
                    <SelectItem value="P2">
                      <span className={getPriorityColor("P2")}>P2</span>
                    </SelectItem>
                    <SelectItem value="P3">
                      <span className={getPriorityColor("P3")}>P3</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <span className="text-sm text-muted-foreground">ID: {projectId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for PRD and Spec */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border px-6">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="prd"
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3"
            >
              <FileText className="w-4 h-4 mr-2" />
              PRD
            </TabsTrigger>
            <TabsTrigger
              value="spec"
              className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3"
            >
              <Code className="w-4 h-4 mr-2" />
              Spec
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="prd" className="h-full m-0 p-6 flex flex-col data-[state=inactive]:hidden">
            {renderContent('prd')}
          </TabsContent>
          <TabsContent value="spec" className="h-full m-0 p-6 flex flex-col data-[state=inactive]:hidden">
            {renderContent('spec')}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}