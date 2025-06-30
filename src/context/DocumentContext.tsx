import React, { createContext, useContext, ReactNode } from 'react';
import { Document } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocument: (id: string) => Document | undefined;
  duplicateDocument: (id: string) => void;
  toggleStar: (id: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useLocalStorage<Document[]>('documents', []);

  const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument: Document = {
      ...documentData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(document => 
      document.id === id 
        ? { ...document, ...updates, updatedAt: new Date() }
        : document
    ));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(document => document.id !== id));
  };

  const getDocument = (id: string) => documents.find(document => document.id === id);

  const duplicateDocument = (id: string) => {
    const document = getDocument(id);
    if (document) {
      const newDocument: Document = {
        ...document,
        id: crypto.randomUUID(),
        title: `${document.title} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDocuments(prev => [...prev, newDocument]);
    }
  };

  const toggleStar = (id: string) => {
    setDocuments(prev => prev.map(document => 
      document.id === id 
        ? { ...document, isStarred: !document.isStarred, updatedAt: new Date() }
        : document
    ));
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      addDocument,
      updateDocument,
      deleteDocument,
      getDocument,
      duplicateDocument,
      toggleStar,
    }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}