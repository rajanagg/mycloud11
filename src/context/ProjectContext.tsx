import React, { createContext, useContext, ReactNode } from 'react';
import { Project, ProjectFile } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addProjectFile: (projectId: string, file: Omit<ProjectFile, 'id'>) => void;
  deleteProjectFile: (projectId: string, fileId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const getProject = (id: string) => projects.find(project => project.id === id);

  const addProjectFile = (projectId: string, fileData: Omit<ProjectFile, 'id'>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const newFile: ProjectFile = {
          ...fileData,
          id: crypto.randomUUID(),
        };
        return {
          ...project,
          files: [...project.files, newFile],
          updatedAt: new Date(),
        };
      }
      return project;
    }));
  };

  const deleteProjectFile = (projectId: string, fileId: string) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          files: project.files.filter(file => file.id !== fileId),
          updatedAt: new Date(),
        };
      }
      return project;
    }));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      getProject,
      addProjectFile,
      deleteProjectFile,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}