import React, { useState } from 'react';
import { CourseProvider } from './context/CourseContext';
import { DocumentProvider } from './context/DocumentContext';
import { CodeEditorProvider } from './context/CodeEditorContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <CourseProvider>
      <DocumentProvider>
        <CodeEditorProvider>
          <div className="min-h-screen bg-gray-900">
            <Dashboard />
          </div>
        </CodeEditorProvider>
      </DocumentProvider>
    </CourseProvider>
  );
}

export default App;