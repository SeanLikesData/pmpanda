import { useState, useEffect } from "react";
import { FileText, Code, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Mock project data - more flexible structure
const getProjectData = (projectId: string) => {
  const defaultData = {
    name: `New Project ${projectId}`,
    status: "planning" as const,
    prd: `# Product Requirements Document: New Project ${projectId}

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
    spec: `# Technical Specification: New Project ${projectId}

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

  const projectData: Record<string, any> = {
    "1": {
      name: "CLI Version of Olivie",
      status: "in-progress",
      prd: `# Product Requirements Document: CLI Version of Olivie

## Problem Statement
Users need a command-line interface to interact with Olivie's core functionality for automation and scripting purposes.

## Objectives
- Provide a comprehensive CLI tool for power users
- Enable automation and batch processing
- Maintain feature parity with the web interface

## User Stories
- As a developer, I want to run Olivie commands from my terminal
- As a DevOps engineer, I want to integrate Olivie into my CI/CD pipeline
- As a power user, I want to script repetitive tasks

## Requirements
### Functional Requirements
1. Command parsing and validation
2. Authentication system
3. Progress indicators
4. Error handling and logging

### Non-Functional Requirements
- Response time < 2 seconds for most commands
- Cross-platform compatibility (Windows, macOS, Linux)
- Memory usage < 100MB`,
      spec: `# Technical Specification: CLI Version of Olivie

## Architecture Overview
The CLI will be built as a Node.js application with TypeScript for type safety and better developer experience.

## Core Components

### 1. Command Parser
- Uses Commander.js for argument parsing
- Supports subcommands and options
- Validates input parameters

### 2. Authentication Module
- Token-based authentication
- Secure credential storage
- Session management

### 3. API Client
- HTTP client for backend communication
- Request/response handling
- Error management

## Implementation Details

### Command Structure
\`\`\`
olivie <command> [options]
olivie auth login
olivie process --file input.txt --output result.json
\`\`\`

### Error Handling
- Graceful error messages
- Exit codes for automation
- Logging to file system

## Testing Strategy
- Unit tests for all modules
- Integration tests with mock API
- End-to-end testing in CI/CD`
    },
    "2": {
      name: "Olivie for Browser",
      status: "planning",
      prd: "# PRD for Olivie Browser Extension\n\nComing soon...",
      spec: "# Technical Spec for Browser Extension\n\nComing soon..."
    },
    "3": {
      name: "API Integration Layer",
      status: "planning", 
      prd: "# PRD for API Integration Layer\n\nComing soon...",
      spec: "# Technical Spec for API Integration\n\nComing soon..."
    }
  };

  return projectData[projectId] || defaultData;
};

export function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState("prd");
  const [viewMode, setViewMode] = useState<{ prd: 'edit' | 'preview'; spec: 'edit' | 'preview' }>({
    prd: 'edit',
    spec: 'edit'
  });
  
  const project = getProjectData(projectId || "");
  const [content, setContent] = useState({
    prd: project.prd,
    spec: project.spec
  });

  // Update content when project changes
  useEffect(() => {
    const currentProject = getProjectData(projectId || "");
    setContent({
      prd: currentProject.prd,
      spec: currentProject.spec
    });
    // Reset view modes when switching projects
    setViewMode({ prd: 'edit', spec: 'edit' });
  }, [projectId]);

  const saveContent = (type: 'prd' | 'spec') => {
    // TODO: Save to backend
    console.log(`Auto-saving ${type}:`, content[type]);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={project.status === "in-progress" ? "default" : "secondary"}>
                {project.status}
              </Badge>
              <span className="text-sm text-muted-foreground">Project ID: {projectId}</span>
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