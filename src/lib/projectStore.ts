import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  description: string;
  type: "feature" | "technical" | "improvement";
  status: "planning" | "in-progress" | "completed";
  priority: "P0" | "P1" | "P2" | "P3";
  quarter: string;
  prd_content: string;
  spec_content: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'display_order'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  reorderProjects: (fromIndex: number, toIndex: number) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      set({ projects: data as Project[] });
    }
    set({ loading: false });
  },
  
  addProject: async (projectData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const maxOrder = Math.max(...get().projects.map(p => p.display_order), -1);
    
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        user_id: user.id,
        display_order: maxOrder + 1,
      })
      .select()
      .single();

    if (!error && data) {
      set((state) => ({
        projects: [...state.projects, data as Project]
      }));
    }
  },
  
  updateProject: async (id, updates) => {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);

    if (!error) {
      set((state) => ({
        projects: state.projects.map(project =>
          project.id === id ? { ...project, ...updates } : project
        )
      }));
    }
  },
  
  deleteProject: async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (!error) {
      set((state) => ({
        projects: state.projects.filter(project => project.id !== id)
      }));
    }
  },
  
  getProject: (id) => {
    return get().projects.find(project => project.id === id);
  },
  
  reorderProjects: async (fromIndex, toIndex) => {
    const newProjects = [...get().projects];
    const [movedItem] = newProjects.splice(fromIndex, 1);
    newProjects.splice(toIndex, 0, movedItem);

    // Update display_order for all affected projects
    const updates = newProjects.map((project, index) => ({
      id: project.id,
      display_order: index,
    }));

    // Update in database
    for (const update of updates) {
      await supabase
        .from('projects')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }

    set({ projects: newProjects });
  }
}));