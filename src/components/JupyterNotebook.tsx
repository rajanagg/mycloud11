import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Save, Download, Upload, Trash2, Copy, Nut as Cut, Clipboard, ArrowUp, ArrowDown, Code, Type, BarChart, Image, FileText, Settings, Terminal, RefreshCw, Square, SkipForward, Zap, Database, Globe, Cpu, MemoryStick as Memory, HardDrive, Wifi, Activity, Clock, User, Folder, Search, Filter, Eye, EyeOff, Maximize2, Minimize2, MoreHorizontal, BookOpen, Lightbulb, Target, TrendingUp, Award, Share, GitBranch, Package, Layers, Grid, List, Hash, AtSign, DollarSign, Percent } from 'lucide-react';

interface NotebookCell {
  id: string;
  type: 'code' | 'markdown' | 'raw';
  content: string;
  output?: string;
  executionCount?: number;
  isExecuting?: boolean;
  metadata?: {
    collapsed?: boolean;
    scrolled?: boolean;
    tags?: string[];
  };
}

interface NotebookKernel {
  id: string;
  name: string;
  language: string;
  status: 'idle' | 'busy' | 'starting' | 'dead';
  lastActivity: Date;
}

const JupyterNotebook: React.FC = () => {
  const [cells, setCells] = useState<NotebookCell[]>([]);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [notebookName, setNotebookName] = useState('Untitled Notebook');
  const [kernel, setKernel] = useState<NotebookKernel>({
    id: 'python3',
    name: 'Python 3',
    language: 'python',
    status: 'idle',
    lastActivity: new Date()
  });
  const [isKernelMenuOpen, setIsKernelMenuOpen] = useState(false);
  const [executionCount, setExecutionCount] = useState(1);
  const [variables, setVariables] = useState<Record<string, any>>({});
  const [isVariableInspectorOpen, setIsVariableInspectorOpen] = useState(false);
  const [notebookMetadata, setNotebookMetadata] = useState({
    author: 'Hunt User',
    created: new Date(),
    modified: new Date(),
    kernelspec: {
      display_name: 'Python 3',
      language: 'python',
      name: 'python3'
    }
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [viewMode, setViewMode] = useState<'edit' | 'presentation'>('edit');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableKernels = [
    { id: 'python3', name: 'Python 3', language: 'python' },
    { id: 'javascript', name: 'JavaScript (Node.js)', language: 'javascript' },
    { id: 'r', name: 'R', language: 'r' },
    { id: 'julia', name: 'Julia', language: 'julia' },
    { id: 'scala', name: 'Scala', language: 'scala' },
    { id: 'sql', name: 'SQL', language: 'sql' }
  ];

  const sampleCode = {
    python: `# Welcome to Hunt Jupyter Notebook!
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Create sample data
data = np.random.randn(100)
print(f"Generated {len(data)} random numbers")
print(f"Mean: {np.mean(data):.2f}")
print(f"Std: {np.std(data):.2f}")

# Plot the data
plt.figure(figsize=(10, 6))
plt.hist(data, bins=20, alpha=0.7, color='blue')
plt.title('Random Data Distribution')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.grid(True, alpha=0.3)
plt.show()`,

    javascript: `// JavaScript in Jupyter!
console.log("Hello from Node.js!");

// Create some data
const data = Array.from({length: 100}, () => Math.random());
const mean = data.reduce((a, b) => a + b) / data.length;
const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2)) / data.length;

console.log(\`Generated \${data.length} random numbers\`);
console.log(\`Mean: \${mean.toFixed(2)}\`);
console.log(\`Variance: \${variance.toFixed(2)}\`);

// Display first 10 values
console.log("First 10 values:", data.slice(0, 10));`,

    r: `# R Programming in Jupyter
library(ggplot2)

# Generate sample data
data <- rnorm(100)
cat("Generated", length(data), "random numbers\\n")
cat("Mean:", round(mean(data), 2), "\\n")
cat("SD:", round(sd(data), 2), "\\n")

# Create a plot
df <- data.frame(values = data)
ggplot(df, aes(x = values)) +
  geom_histogram(bins = 20, fill = "steelblue", alpha = 0.7) +
  labs(title = "Random Data Distribution",
       x = "Value", y = "Frequency") +
  theme_minimal()`,

    markdown: `# Welcome to Hunt Jupyter Notebook! 🚀

This is a **Markdown cell** where you can write formatted text, equations, and documentation.

## Features

- 📊 **Data Analysis**: Run Python, R, Julia, and more
- 📈 **Visualizations**: Create beautiful plots and charts  
- 🧮 **Mathematical Equations**: $E = mc^2$
- 📝 **Rich Text**: Format your analysis with Markdown

## Code Example

\`\`\`python
import pandas as pd
df = pd.read_csv('data.csv')
print(df.head())
\`\`\`

## Mathematical Formulas

Inline math: $\\alpha + \\beta = \\gamma$

Block math:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

## Lists

1. First item
2. Second item
   - Nested item
   - Another nested item

## Links and Images

[Hunt Learning Platform](https://hunt.dev)

> This is a blockquote with important information!

---

Happy coding! 🎉`
  };

  useEffect(() => {
    // Initialize with sample cells
    if (cells.length === 0) {
      const initialCells: NotebookCell[] = [
        {
          id: crypto.randomUUID(),
          type: 'markdown',
          content: sampleCode.markdown
        },
        {
          id: crypto.randomUUID(),
          type: 'code',
          content: sampleCode.python
        }
      ];
      setCells(initialCells);
      setActiveCellId(initialCells[0].id);
    }
  }, []);

  const addCell = (type: 'code' | 'markdown' | 'raw', afterCellId?: string) => {
    const newCell: NotebookCell = {
      id: crypto.randomUUID(),
      type,
      content: type === 'markdown' ? '# New Markdown Cell\n\nEdit this cell to add content.' : 
               type === 'code' ? '# New code cell\nprint("Hello, World!")' : 
               'Raw text cell',
      metadata: {}
    };

    setCells(prev => {
      if (afterCellId) {
        const index = prev.findIndex(cell => cell.id === afterCellId);
        const newCells = [...prev];
        newCells.splice(index + 1, 0, newCell);
        return newCells;
      }
      return [...prev, newCell];
    });

    setActiveCellId(newCell.id);
  };

  const deleteCell = (cellId: string) => {
    setCells(prev => prev.filter(cell => cell.id !== cellId));
    if (activeCellId === cellId) {
      setActiveCellId(cells.length > 1 ? cells[0].id : null);
    }
  };

  const updateCell = (cellId: string, content: string) => {
    setCells(prev => prev.map(cell => 
      cell.id === cellId ? { ...cell, content } : cell
    ));
  };

  const executeCell = async (cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell || cell.type !== 'code') return;

    setKernel(prev => ({ ...prev, status: 'busy', lastActivity: new Date() }));
    
    setCells(prev => prev.map(c => 
      c.id === cellId 
        ? { ...c, isExecuting: true, executionCount: executionCount }
        : c
    ));

    // Simulate code execution
    setTimeout(() => {
      const output = simulateCodeExecution(cell.content, kernel.language);
      
      setCells(prev => prev.map(c => 
        c.id === cellId 
          ? { 
              ...c, 
              isExecuting: false, 
              output,
              executionCount: executionCount
            }
          : c
      ));

      setExecutionCount(prev => prev + 1);
      setKernel(prev => ({ ...prev, status: 'idle', lastActivity: new Date() }));
      
      // Update variables (mock)
      updateVariables(cell.content);
    }, 1000 + Math.random() * 2000);
  };

  const simulateCodeExecution = (code: string, language: string): string => {
    const lines = code.split('\n').filter(line => line.trim());
    
    if (language === 'python') {
      if (code.includes('print(')) {
        const printMatches = code.match(/print\((.*?)\)/g);
        if (printMatches) {
          return printMatches.map(match => {
            const content = match.replace(/print\(|\)/g, '').replace(/['"]/g, '');
            return content.includes('f"') || content.includes("f'") 
              ? 'Generated 100 random numbers\nMean: 0.05\nStd: 0.98'
              : content;
          }).join('\n');
        }
      }
      
      if (code.includes('plt.show()')) {
        return '[Matplotlib Plot]\n📊 Histogram: Random Data Distribution\n✓ Plot displayed successfully';
      }
      
      if (code.includes('import')) {
        return '✓ Modules imported successfully';
      }
      
      if (code.includes('=') && !code.includes('print')) {
        return '✓ Variables assigned';
      }
    }
    
    if (language === 'javascript') {
      if (code.includes('console.log')) {
        return 'Hello from Node.js!\nGenerated 100 random numbers\nMean: 0.52\nVariance: 0.25\nFirst 10 values: [0.23, 0.87, 0.45, 0.12, 0.78, 0.34, 0.91, 0.56, 0.29, 0.83]';
      }
    }
    
    if (language === 'r') {
      if (code.includes('ggplot')) {
        return 'Generated 100 random numbers\nMean: -0.03\nSD: 1.02\n[R Plot]\n📊 ggplot2: Random Data Distribution\n✓ Plot rendered successfully';
      }
    }
    
    return `✓ Code executed successfully\n${lines.length} lines processed`;
  };

  const updateVariables = (code: string) => {
    // Mock variable extraction
    const newVars: Record<string, any> = {};
    
    if (code.includes('data = ')) {
      newVars.data = { type: 'ndarray', shape: '[100]', dtype: 'float64' };
    }
    if (code.includes('mean')) {
      newVars.mean = { type: 'float', value: '0.05' };
    }
    if (code.includes('std')) {
      newVars.std = { type: 'float', value: '0.98' };
    }
    
    setVariables(prev => ({ ...prev, ...newVars }));
  };

  const moveCellUp = (cellId: string) => {
    setCells(prev => {
      const index = prev.findIndex(cell => cell.id === cellId);
      if (index > 0) {
        const newCells = [...prev];
        [newCells[index - 1], newCells[index]] = [newCells[index], newCells[index - 1]];
        return newCells;
      }
      return prev;
    });
  };

  const moveCellDown = (cellId: string) => {
    setCells(prev => {
      const index = prev.findIndex(cell => cell.id === cellId);
      if (index < prev.length - 1) {
        const newCells = [...prev];
        [newCells[index], newCells[index + 1]] = [newCells[index + 1], newCells[index]];
        return newCells;
      }
      return prev;
    });
  };

  const duplicateCell = (cellId: string) => {
    const cell = cells.find(c => c.id === cellId);
    if (cell) {
      const newCell: NotebookCell = {
        ...cell,
        id: crypto.randomUUID(),
        output: undefined,
        executionCount: undefined
      };
      
      setCells(prev => {
        const index = prev.findIndex(c => c.id === cellId);
        const newCells = [...prev];
        newCells.splice(index + 1, 0, newCell);
        return newCells;
      });
    }
  };

  const changeKernel = (kernelId: string) => {
    const newKernel = availableKernels.find(k => k.id === kernelId);
    if (newKernel) {
      setKernel({
        ...newKernel,
        status: 'starting',
        lastActivity: new Date()
      });
      
      setTimeout(() => {
        setKernel(prev => ({ ...prev, status: 'idle' }));
      }, 2000);
    }
    setIsKernelMenuOpen(false);
  };

  const saveNotebook = () => {
    const notebook = {
      cells: cells.map(cell => ({
        cell_type: cell.type,
        source: cell.content.split('\n'),
        metadata: cell.metadata || {},
        ...(cell.type === 'code' && {
          execution_count: cell.executionCount || null,
          outputs: cell.output ? [{
            output_type: 'stream',
            name: 'stdout',
            text: cell.output.split('\n')
          }] : []
        })
      })),
      metadata: {
        ...notebookMetadata,
        modified: new Date()
      },
      nbformat: 4,
      nbformat_minor: 4
    };

    const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${notebookName.replace(/\s+/g, '_')}.ipynb`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadNotebook = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const notebook = JSON.parse(e.target?.result as string);
          const loadedCells: NotebookCell[] = notebook.cells.map((cell: any) => ({
            id: crypto.randomUUID(),
            type: cell.cell_type,
            content: Array.isArray(cell.source) ? cell.source.join('') : cell.source,
            output: cell.outputs?.[0]?.text ? 
              (Array.isArray(cell.outputs[0].text) ? cell.outputs[0].text.join('') : cell.outputs[0].text) : 
              undefined,
            executionCount: cell.execution_count,
            metadata: cell.metadata || {}
          }));
          
          setCells(loadedCells);
          setNotebookName(file.name.replace('.ipynb', ''));
          if (loadedCells.length > 0) {
            setActiveCellId(loadedCells[0].id);
          }
        } catch (error) {
          console.error('Error loading notebook:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const runAllCells = () => {
    cells.filter(cell => cell.type === 'code').forEach((cell, index) => {
      setTimeout(() => executeCell(cell.id), index * 1000);
    });
  };

  const clearAllOutputs = () => {
    setCells(prev => prev.map(cell => ({
      ...cell,
      output: undefined,
      executionCount: undefined
    })));
  };

  const restartKernel = () => {
    setKernel(prev => ({ ...prev, status: 'starting' }));
    setVariables({});
    setExecutionCount(1);
    clearAllOutputs();
    
    setTimeout(() => {
      setKernel(prev => ({ ...prev, status: 'idle', lastActivity: new Date() }));
    }, 2000);
  };

  const getKernelStatusColor = () => {
    switch (kernel.status) {
      case 'idle': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'starting': return 'bg-blue-500';
      case 'dead': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCell = (cell: NotebookCell, index: number) => {
    const isActive = cell.id === activeCellId;
    
    return (
      <div
        key={cell.id}
        className={`border-l-4 transition-all ${
          isActive ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
        }`}
        onClick={() => setActiveCellId(cell.id)}
      >
        <div className="flex">
          {/* Cell Controls */}
          <div className="w-16 flex flex-col items-center py-2 bg-gray-50 border-r">
            <div className="text-xs text-gray-500 mb-2">
              {cell.type === 'code' ? `[${cell.executionCount || ' '}]` : ''}
            </div>
            
            {isActive && (
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => moveCellUp(cell.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Move Up"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => moveCellDown(cell.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Move Down"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  onClick={() => duplicateCell(cell.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                  title="Duplicate"
                >
                  <Copy className="h-3 w-3" />
                </button>
                <button
                  onClick={() => deleteCell(cell.id)}
                  className="p-1 hover:bg-red-200 rounded text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Cell Content */}
          <div className="flex-1">
            {/* Cell Type Indicator */}
            <div className="flex items-center justify-between px-4 py-1 bg-gray-100 border-b">
              <div className="flex items-center space-x-2">
                {cell.type === 'code' && <Code className="h-4 w-4 text-blue-600" />}
                {cell.type === 'markdown' && <Type className="h-4 w-4 text-green-600" />}
                {cell.type === 'raw' && <FileText className="h-4 w-4 text-gray-600" />}
                <span className="text-xs font-medium capitalize">{cell.type}</span>
              </div>
              
              {isActive && (
                <div className="flex items-center space-x-1">
                  {cell.type === 'code' && (
                    <button
                      onClick={() => executeCell(cell.id)}
                      disabled={cell.isExecuting}
                      className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-2 py-1 rounded text-xs"
                    >
                      {cell.isExecuting ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                      <span>Run</span>
                    </button>
                  )}
                  
                  <select
                    value={cell.type}
                    onChange={(e) => {
                      setCells(prev => prev.map(c => 
                        c.id === cell.id 
                          ? { ...c, type: e.target.value as any }
                          : c
                      ));
                    }}
                    className="text-xs border border-gray-300 rounded px-1 py-0.5"
                  >
                    <option value="code">Code</option>
                    <option value="markdown">Markdown</option>
                    <option value="raw">Raw</option>
                  </select>
                </div>
              )}
            </div>

            {/* Cell Input */}
            <div className="p-4">
              <textarea
                value={cell.content}
                onChange={(e) => updateCell(cell.id, e.target.value)}
                className={`w-full min-h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
                  cell.type === 'code' ? 'font-mono text-sm bg-gray-50' : ''
                }`}
                placeholder={
                  cell.type === 'code' ? 'Enter your code here...' :
                  cell.type === 'markdown' ? 'Enter Markdown text...' :
                  'Enter raw text...'
                }
                style={{ direction: 'ltr' }}
              />
            </div>

            {/* Cell Output */}
            {cell.output && (
              <div className="mx-4 mb-4 border-t border-gray-200 pt-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
                  {cell.output}
                </div>
              </div>
            )}

            {/* Markdown Rendered Output */}
            {cell.type === 'markdown' && !isActive && (
              <div className="mx-4 mb-4 prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: cell.content
                    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/\n/g, '<br>')
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={notebookName}
              onChange={(e) => setNotebookName(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none outline-none"
            />
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getKernelStatusColor()}`}></div>
              <button
                onClick={() => setIsKernelMenuOpen(!isKernelMenuOpen)}
                className="text-sm text-gray-600 hover:text-gray-900 relative"
              >
                {kernel.name} | {kernel.status}
                {isKernelMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-10 min-w-48">
                    {availableKernels.map(k => (
                      <button
                        key={k.id}
                        onClick={() => changeKernel(k.id)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          k.id === kernel.id ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        {k.name}
                      </button>
                    ))}
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarVisible(!sidebarVisible)}
              className="p-2 hover:bg-gray-200 rounded"
              title="Toggle Sidebar"
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsVariableInspectorOpen(!isVariableInspectorOpen)}
              className="p-2 hover:bg-gray-200 rounded"
              title="Variable Inspector"
            >
              <Database className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-200 rounded"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-300 px-4 py-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={saveNotebook}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
          >
            <Upload className="h-4 w-4" />
            <span>Load</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            onClick={() => addCell('code')}
            className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Code</span>
          </button>
          
          <button
            onClick={() => addCell('markdown')}
            className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Markdown</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            onClick={runAllCells}
            className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm"
          >
            <SkipForward className="h-4 w-4" />
            <span>Run All</span>
          </button>
          
          <button
            onClick={restartKernel}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Restart</span>
          </button>
          
          <button
            onClick={clearAllOutputs}
            className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
          >
            <Square className="h-4 w-4" />
            <span>Clear</span>
          </button>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Cells: {cells.length}</span>
            <span>•</span>
            <span>Execution Count: {executionCount - 1}</span>
            <span>•</span>
            <span>Last Activity: {kernel.lastActivity.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarVisible && (
          <div className="w-64 bg-gray-50 border-r border-gray-300 flex flex-col">
            <div className="p-4 border-b border-gray-300">
              <h3 className="font-semibold text-gray-900 mb-2">Notebook Outline</h3>
              <div className="space-y-1">
                {cells.map((cell, index) => (
                  <button
                    key={cell.id}
                    onClick={() => setActiveCellId(cell.id)}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      cell.id === activeCellId ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {cell.type === 'code' && <Code className="h-3 w-3" />}
                      {cell.type === 'markdown' && <Type className="h-3 w-3" />}
                      {cell.type === 'raw' && <FileText className="h-3 w-3" />}
                      <span>Cell {index + 1} ({cell.type})</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2">Kernel Info</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Language: {kernel.language}</div>
                <div>Status: {kernel.status}</div>
                <div>Memory: 45.2 MB</div>
                <div>CPU: 2.3%</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-none">
              {cells.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Welcome to Hunt Jupyter Notebook
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Create your first cell to start coding and analyzing data
                    </p>
                    <div className="space-x-2">
                      <button
                        onClick={() => addCell('code')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Add Code Cell
                      </button>
                      <button
                        onClick={() => addCell('markdown')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                      >
                        Add Markdown Cell
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {cells.map((cell, index) => renderCell(cell, index))}
                </div>
              )}
            </div>
          </div>

          {/* Variable Inspector */}
          {isVariableInspectorOpen && (
            <div className="w-80 bg-white border-l border-gray-300 flex flex-col">
              <div className="p-4 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Variable Inspector</h3>
                  <button
                    onClick={() => setIsVariableInspectorOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {Object.keys(variables).length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Database className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No variables defined</p>
                    <p className="text-sm">Run code cells to see variables</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(variables).map(([name, info]) => (
                      <div key={name} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-mono text-sm font-semibold text-blue-600">{name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Type: {info.type}
                          {info.shape && <div>Shape: {info.shape}</div>}
                          {info.value && <div>Value: {info.value}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".ipynb"
        onChange={loadNotebook}
        className="hidden"
      />
    </div>
  );
};

export default JupyterNotebook;