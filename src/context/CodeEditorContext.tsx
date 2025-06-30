import React, { createContext, useContext, ReactNode } from 'react';
import { CodeProject, CodeFile, TerminalSession } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CodeEditorContextType {
  projects: CodeProject[];
  activeProject: CodeProject | null;
  terminalSessions: TerminalSession[];
  activeTerminalId: string | null;
  
  // Project management
  createProject: (name: string, description?: string) => string;
  deleteProject: (projectId: string) => void;
  setActiveProject: (projectId: string | null) => void;
  updateProject: (projectId: string, updates: Partial<CodeProject>) => void;
  
  // File management
  createFile: (projectId: string, name: string, content?: string, language?: string) => string;
  updateFile: (projectId: string, fileId: string, content: string) => void;
  deleteFile: (projectId: string, fileId: string) => void;
  setActiveFile: (projectId: string, fileId: string | null) => void;
  renameFile: (projectId: string, fileId: string, newName: string) => void;
  duplicateFile: (projectId: string, fileId: string) => void;
  downloadFile: (projectId: string, fileId: string) => void;
  
  // Folder management
  createFolder: (projectId: string, name: string, parentPath?: string) => string;
  deleteFolder: (projectId: string, folderPath: string) => void;
  
  // Terminal management
  createTerminal: (name?: string) => string;
  deleteTerminal: (terminalId: string) => void;
  setActiveTerminal: (terminalId: string | null) => void;
  addToTerminalHistory: (terminalId: string, command: string) => void;
  clearTerminalHistory: (terminalId: string) => void;
  
  // Search and navigation
  searchFiles: (query: string) => CodeFile[];
  getRecentFiles: () => CodeFile[];
}

const CodeEditorContext = createContext<CodeEditorContextType | undefined>(undefined);

export function CodeEditorProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useLocalStorage<CodeProject[]>('codeProjects', []);
  const [activeProjectId, setActiveProjectId] = useLocalStorage<string | null>('activeCodeProject', null);
  const [terminalSessions, setTerminalSessions] = useLocalStorage<TerminalSession[]>('terminalSessions', []);
  const [activeTerminalId, setActiveTerminalId] = useLocalStorage<string | null>('activeTerminal', null);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  const createProject = (name: string, description = '') => {
    const newProject: CodeProject = {
      id: crypto.randomUUID(),
      name,
      description,
      files: [],
      activeFileId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    return newProject.id;
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
    }
  };

  const setActiveProject = (projectId: string | null) => {
    setActiveProjectId(projectId);
  };

  const updateProject = (projectId: string, updates: Partial<CodeProject>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
  };

  const createFile = (projectId: string, name: string, content = '', language = 'javascript') => {
    const newFile: CodeFile = {
      id: crypto.randomUUID(),
      name,
      content,
      language,
      path: name,
      isModified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            files: [...project.files, newFile],
            activeFileId: newFile.id,
            updatedAt: new Date()
          }
        : project
    ));

    return newFile.id;
  };

  const updateFile = (projectId: string, fileId: string, content: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            files: project.files.map(file => 
              file.id === fileId 
                ? { ...file, content, isModified: true, updatedAt: new Date() }
                : file
            ),
            updatedAt: new Date()
          }
        : project
    ));
  };

  const deleteFile = (projectId: string, fileId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            files: project.files.filter(file => file.id !== fileId),
            activeFileId: project.activeFileId === fileId ? null : project.activeFileId,
            updatedAt: new Date()
          }
        : project
    ));
  };

  const setActiveFile = (projectId: string, fileId: string | null) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, activeFileId: fileId }
        : project
    ));
  };

  const renameFile = (projectId: string, fileId: string, newName: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            files: project.files.map(file => 
              file.id === fileId 
                ? { ...file, name: newName, path: newName, updatedAt: new Date() }
                : file
            ),
            updatedAt: new Date()
          }
        : project
    ));
  };

  const duplicateFile = (projectId: string, fileId: string) => {
    const project = projects.find(p => p.id === projectId);
    const file = project?.files.find(f => f.id === fileId);
    
    if (file) {
      const newFile: CodeFile = {
        ...file,
        id: crypto.randomUUID(),
        name: `${file.name.split('.')[0]}_copy.${file.name.split('.').pop()}`,
        path: `${file.path.split('.')[0]}_copy.${file.path.split('.').pop()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              files: [...project.files, newFile],
              updatedAt: new Date()
            }
          : project
      ));
    }
  };

  const downloadFile = (projectId: string, fileId: string) => {
    const project = projects.find(p => p.id === projectId);
    const file = project?.files.find(f => f.id === fileId);
    
    if (file) {
      const element = document.createElement('a');
      const fileBlob = new Blob([file.content], { type: 'text/plain' });
      element.href = URL.createObjectURL(fileBlob);
      element.download = file.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const createFolder = (projectId: string, name: string, parentPath = '') => {
    const folderPath = parentPath ? `${parentPath}/${name}` : name;
    const folderId = crypto.randomUUID();
    
    // Create a folder marker
    const folderMarker: CodeFile = {
      id: folderId,
      name: '.folder',
      content: '',
      language: 'text',
      path: `${folderPath}/.folder`,
      isModified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            files: [...project.files, folderMarker],
            updatedAt: new Date()
          }
        : project
    ));

    return folderId;
  };

  const deleteFolder = (projectId: string, folderPath: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? {
            ...project,
            files: project.files.filter(file => !file.path.startsWith(folderPath)),
            updatedAt: new Date()
          }
        : project
    ));
  };

  const createTerminal = (name?: string) => {
    const newTerminal: TerminalSession = {
      id: crypto.randomUUID(),
      name: name || `Terminal ${terminalSessions.length + 1}`,
      history: [`Welcome to Hunt Terminal`],
      isActive: true,
    };

    setTerminalSessions(prev => [...prev, newTerminal]);
    setActiveTerminalId(newTerminal.id);
    return newTerminal.id;
  };

  const deleteTerminal = (terminalId: string) => {
    setTerminalSessions(prev => prev.filter(t => t.id !== terminalId));
    if (activeTerminalId === terminalId) {
      const remaining = terminalSessions.filter(t => t.id !== terminalId);
      setActiveTerminalId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const setActiveTerminal = (terminalId: string | null) => {
    setActiveTerminalId(terminalId);
  };

  const addToTerminalHistory = (terminalId: string, command: string) => {
    setTerminalSessions(prev => prev.map(terminal => 
      terminal.id === terminalId 
        ? { ...terminal, history: [...terminal.history, command] }
        : terminal
    ));
  };

  const clearTerminalHistory = (terminalId: string) => {
    setTerminalSessions(prev => prev.map(terminal => 
      terminal.id === terminalId 
        ? { ...terminal, history: ['Terminal cleared'] }
        : terminal
    ));
  };

  const searchFiles = (query: string) => {
    if (!activeProject || !query.trim()) return [];
    
    return activeProject.files.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getRecentFiles = () => {
    if (!activeProject) return [];
    
    return activeProject.files
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  };

  return (
    <CodeEditorContext.Provider value={{
      projects,
      activeProject,
      terminalSessions,
      activeTerminalId,
      createProject,
      deleteProject,
      setActiveProject,
      updateProject,
      createFile,
      updateFile,
      deleteFile,
      setActiveFile,
      renameFile,
      duplicateFile,
      downloadFile,
      createFolder,
      deleteFolder,
      createTerminal,
      deleteTerminal,
      setActiveTerminal,
      addToTerminalHistory,
      clearTerminalHistory,
      searchFiles,
      getRecentFiles,
    }}>
      {children}
    </CodeEditorContext.Provider>
  );
}

export function useCodeEditor() {
  const context = useContext(CodeEditorContext);
  if (context === undefined) {
    throw new Error('useCodeEditor must be used within a CodeEditorProvider');
  }
  return context;
}