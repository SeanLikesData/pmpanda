import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: "feature" | "technical" | "improvement";
  status: "planning" | "in-progress" | "completed";
  priority: "P0" | "P1" | "P2" | "P3";
  quarter: string;
  prd: string;
  spec: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
}

// Initial mock data with expanded structure
const initialProjects: Project[] = [
  {
    id: "1",
    name: "CLI Version of Olivie",
    description: "Command-line interface for power users and automation. Enable developers and DevOps teams to integrate Olivie into their workflows.",
    type: "feature",
    status: "in-progress",
    priority: "P0",
    quarter: "Q1 2024",
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
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
  {
    id: "2",
    name: "Olivie for Browser",
    description: "Browser extension for seamless web integration. Allow users to access Olivie functionality directly from web pages.",
    type: "feature",
    status: "planning",
    priority: "P1",
    quarter: "Q2 2024",
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    prd: "# PRD for Olivie Browser Extension\n\nComing soon...",
    spec: "# Technical Spec for Browser Extension\n\nComing soon..."
  },
  {
    id: "3",
    name: "API Integration Layer",
    description: "Robust API for third-party integrations. Enable external applications to leverage Olivie's capabilities through a well-documented REST API.",
    type: "technical",
    status: "planning",
    priority: "P2",
    quarter: "Q2 2024",
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    prd: "# PRD for API Integration Layer\n\nComing soon...",
    spec: "# Technical Spec for API Integration\n\nComing soon..."
  }
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: initialProjects,
  
  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: (get().projects.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      projects: [...state.projects, newProject]
    }));
  },
  
  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date() }
          : project
      )
    }));
  },
  
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter(project => project.id !== id)
    }));
  },
  
  getProject: (id) => {
    return get().projects.find(project => project.id === id);
  },
  
  reorderProjects: (fromIndex, toIndex) => {
    set((state) => {
      const newProjects = [...state.projects];
      const [movedItem] = newProjects.splice(fromIndex, 1);
      newProjects.splice(toIndex, 0, movedItem);
      return { projects: newProjects };
    });
  }
}));