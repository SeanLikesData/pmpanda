import { useState } from "react";
import { FileText, Code, Eye, Edit, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";

// Mock project data
const mockProjectData = {
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
  }
};

export function ProjectWorkspace() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState("prd");
  const [editMode, setEditMode] = useState<{ prd: boolean; spec: boolean }>({
    prd: false,
    spec: false
  });
  const [content, setContent] = useState({
    prd: mockProjectData[projectId as keyof typeof mockProjectData]?.prd || "",
    spec: mockProjectData[projectId as keyof typeof mockProjectData]?.spec || ""
  });

  const project = mockProjectData[projectId as keyof typeof mockProjectData];

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

  const toggleEditMode = (type: 'prd' | 'spec') => {
    setEditMode(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const saveContent = (type: 'prd' | 'spec') => {
    // TODO: Save to backend
    console.log(`Saving ${type}:`, content[type]);
    setEditMode(prev => ({ ...prev, [type]: false }));
  };

  const renderContent = (type: 'prd' | 'spec') => {
    const isEditing = editMode[type];
    const contentText = content[type];

    if (isEditing) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold capitalize">{type} Editor</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleEditMode(type)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => saveContent(type)}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          <Textarea
            value={contentText}
            onChange={(e) => setContent(prev => ({ ...prev, [type]: e.target.value }))}
            className="flex-1 font-mono text-sm resize-none"
            placeholder={`Enter ${type.toUpperCase()} content in Markdown format...`}
          />
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold capitalize">{type}</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleEditMode(type)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-foreground bg-muted/30 p-4 rounded-lg">
              {contentText || `No ${type.toUpperCase()} content yet. Click Edit to add content.`}
            </pre>
          </div>
        </ScrollArea>
      </div>
    );
  };

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

        <div className="flex-1 p-6">
          <TabsContent value="prd" className="h-full m-0">
            {renderContent('prd')}
          </TabsContent>
          <TabsContent value="spec" className="h-full m-0">
            {renderContent('spec')}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}