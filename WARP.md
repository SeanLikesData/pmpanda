# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

- Install dependencies (uses package-lock.json):
  ```sh
  npm ci
  ```
- Start dev server (Vite, port 8080, bound to all interfaces):
  ```sh
  npm run dev
  # open http://localhost:8080
  ```
- Lint:
  ```sh
  npm run lint
  ```
- Build (production) and development-mode build:
  ```sh
  npm run build
  npm run build:dev
  ```
- Preview built app locally (serves dist/):
  ```sh
  npm run preview
  ```
- Testing:
  - No test runner is configured in this repo (no Jest/Vitest/Playwright). If tests are added later (e.g., Vitest), running a single test typically looks like:
    ```sh
    npx vitest run path/to/file.test.ts
    # or filter by name
    npx vitest run -t "name of test"
    ```

## High-level architecture

This is a Vite + React + TypeScript single-page app with Tailwind CSS and shadcn/ui components. State is managed locally via Zustand. Routing is handled by React Router. There is no backend; persistence is in-memory (Zustand) and, for selected forms, localStorage.

Key pieces:

- App bootstrap
  - src/main.tsx mounts <App /> and pulls in global styles (src/index.css).
  - src/App.tsx sets global providers: QueryClientProvider (React Query), TooltipProvider, two toaster systems (Radix Toast and Sonner), and BrowserRouter routes.

- Routing and layout
  - Routes (src/App.tsx):
    - "/" -> pages/Index
    - "/project/:projectId" -> components/workspace/ProjectWorkspace
    - "/roadmap", "/company-info", "/profile", "/templates", "/integrations"
    - Catch-all -> pages/NotFound
  - Main shell: components/layout/MainLayout wraps every route (except NotFound). It composes:
    - Left navigation: components/layout/ProjectSidebar (project list + app sections)
    - Right panel: components/layout/ChatSidebar (mock chat UI)
    - Center content: route element
  - The sidebar system is implemented in components/ui/sidebar.tsx (a shadcn-style composite). Notable behaviors:
    - Collapsible with keyboard shortcut Cmd/Ctrl + b (see SIDEBAR_KEYBOARD_SHORTCUT).
    - A floating SidebarTrigger button appears when collapsed.

- Domain state and models
  - src/lib/projectStore.ts defines a Project interface and a Zustand store that holds an initialProjects array and actions: addProject, updateProject, deleteProject, getProject, reorderProjects.
  - Consumers:
    - components/layout/ProjectSidebar: lists projects, creates a new project (seeds default PRD/spec markdown), navigates.
    - pages/Roadmap: organizes projects by quarter (Q1–Q4 2024), supports DnD-like moving between quarters and priority up/down controls, updates the store.
    - components/workspace/ProjectWorkspace: PRD/Spec editor with Edit/Preview tabs and Markdown rendering. Saves edits back to the store (simple autosave via updateProject). No server persistence.

- Pages with local persistence
  - pages/CompanyInfo: form data saved to localStorage under key "companyInfo".
  - pages/Templates: in-memory editable templates for PRD and Spec (copy/reset/save are local only).
  - pages/Integrations: static catalog describing potential MCP integrations; purely presentational.

- UI system
  - Tailwind tokens and design system live in src/index.css and tailwind.config.ts (custom HSL CSS variables for themes, gradients, shadows, and a sidebar color namespace). Dark mode styles are provided via CSS variables; there is no dedicated theme provider beyond next-themes usage inside the Sonner toaster.
  - shadcn/ui-style components under src/components/ui (button, card, tabs, select, sidebar, toast, sheet, etc.). Prefer reusing these rather than raw HTML.
  - Notifications: two mechanisms are available
    - Radix Toast via hooks/use-toast + components/ui/toaster
    - Sonner via components/ui/sonner (uses next-themes to pick theme)

- Tooling and config
  - Vite (vite.config.ts): React SWC plugin; dev server on port 8080; alias "@" -> src; includes lovable-tagger plugin only in development.
  - TypeScript paths (tsconfig.json): "@/*" -> "src/*".
  - ESLint (eslint.config.js): modern flat config, TypeScript + react-hooks + react-refresh rules; lint script is `eslint .`.

## Conventions and notes for future changes

- Path alias: import from "@/..." instead of relative paths.
- Adding routes: declare in src/App.tsx and, if you want navigation, add a link in components/layout/ProjectSidebar.
- Project data is ephemeral (Zustand). If persistence is required, introduce a backend or local persistence layer and adapt useProjectStore accordingly.
- The dev server binds to host "::" (IPv6 all-interfaces). Use http://localhost:8080 locally.

## README highlights

The README is Lovable-centric and covers:
- Local development via Node + npm: `npm i && npm run dev`.
- Publishing from the Lovable UI (Share → Publish).

This WARP.md focuses on code-level commands and architecture to complement that overview.
