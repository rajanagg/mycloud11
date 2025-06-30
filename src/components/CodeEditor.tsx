import React, { useState, useRef, useEffect } from 'react';
import { 
  Code, 
  Plus, 
  Save, 
  Play, 
  Terminal as TerminalIcon, 
  FileText, 
  Folder, 
  FolderOpen,
  X,
  Download,
  Upload,
  Search,
  Settings,
  Trash2,
  Edit3,
  Copy,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  GitBranch,
  Bug,
  Package,
  Zap,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,
  Archive,
  FolderPlus,
  FilePlus,
  Scissors,
  Clipboard,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Command,
  Layers,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Activity
} from 'lucide-react';
import { useCodeEditor } from '../context/CodeEditorContext';
import DeleteDialog from './DeleteDialog';

const CodeEditor = () => {
  const { 
    projects, 
    activeProject, 
    terminalSessions, 
    activeTerminalId,
    createProject, 
    deleteProject, 
    setActiveProject,
    createFile, 
    updateFile, 
    deleteFile, 
    setActiveFile,
    createTerminal,
    deleteTerminal,
    setActiveTerminal,
    addToTerminalHistory
  } = useCodeEditor();

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [terminalInput, setTerminalInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; type: string; id?: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ 
    isOpen: boolean; 
    type: 'project' | 'file' | 'folder' | null; 
    id: string | null;
    name?: string;
  }>({
    isOpen: false,
    type: null,
    id: null
  });
  const [commandPalette, setCommandPalette] = useState(false);
  const [minimap, setMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = activeProject?.files.find(f => f.id === activeProject.activeFileId);
  const activeTerminal = terminalSessions.find(t => t.id === activeTerminalId);

  // Enhanced language configurations
  const languageConfig = {
    javascript: { 
      extensions: ['.js', '.jsx', '.mjs'], 
      icon: '🟨',
      keywords: ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch'],
      snippets: {
        'func': 'function ${1:name}(${2:params}) {\n\t${3:// code}\n}',
        'arrow': '(${1:params}) => {\n\t${2:// code}\n}',
        'class': 'class ${1:ClassName} {\n\tconstructor(${2:params}) {\n\t\t${3:// constructor}\n\t}\n}',
        'try': 'try {\n\t${1:// code}\n} catch (error) {\n\t${2:// handle error}\n}',
        'async': 'async function ${1:name}(${2:params}) {\n\t${3:// async code}\n}'
      }
    },
    typescript: { 
      extensions: ['.ts', '.tsx'], 
      icon: '🔷',
      keywords: ['interface', 'type', 'enum', 'namespace', 'declare', 'abstract', 'implements', 'extends', 'public', 'private', 'protected'],
      snippets: {
        'interface': 'interface ${1:InterfaceName} {\n\t${2:property}: ${3:type};\n}',
        'type': 'type ${1:TypeName} = ${2:type};',
        'enum': 'enum ${1:EnumName} {\n\t${2:VALUE} = "${3:value}"\n}'
      }
    },
    python: { 
      extensions: ['.py', '.pyw'], 
      icon: '🐍',
      keywords: ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'return', 'try', 'except', 'with', 'as'],
      snippets: {
        'def': 'def ${1:function_name}(${2:params}):\n\t${3:pass}',
        'class': 'class ${1:ClassName}:\n\tdef __init__(self${2:, params}):\n\t\t${3:pass}',
        'if': 'if ${1:condition}:\n\t${2:pass}',
        'for': 'for ${1:item} in ${2:iterable}:\n\t${3:pass}'
      }
    },
    java: { 
      extensions: ['.java'], 
      icon: '☕',
      keywords: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'abstract'],
      snippets: {
        'class': 'public class ${1:ClassName} {\n\t${2:// class body}\n}',
        'method': 'public ${1:void} ${2:methodName}(${3:params}) {\n\t${4:// method body}\n}',
        'main': 'public static void main(String[] args) {\n\t${1:// code}\n}'
      }
    },
    cpp: { 
      extensions: ['.cpp', '.cc', '.cxx', '.h', '.hpp'], 
      icon: '⚡',
      keywords: ['#include', 'using', 'namespace', 'class', 'struct', 'public', 'private', 'protected', 'virtual', 'const'],
      snippets: {
        'main': 'int main() {\n\t${1:// code}\n\treturn 0;\n}',
        'class': 'class ${1:ClassName} {\npublic:\n\t${2:// public members}\nprivate:\n\t${3:// private members}\n};',
        'include': '#include <${1:iostream}>'
      }
    },
    html: { 
      extensions: ['.html', '.htm'], 
      icon: '🌐',
      keywords: ['<!DOCTYPE', 'html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style'],
      snippets: {
        'html5': '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<title>${1:Title}</title>\n</head>\n<body>\n\t${2:content}\n</body>\n</html>',
        'div': '<div class="${1:class}">\n\t${2:content}\n</div>'
      }
    },
    css: { 
      extensions: ['.css', '.scss', '.sass', '.less'], 
      icon: '🎨',
      keywords: ['color', 'background', 'margin', 'padding', 'border', 'font', 'display', 'position', 'flex', 'grid'],
      snippets: {
        'flex': 'display: flex;\njustify-content: ${1:center};\nalign-items: ${2:center};',
        'grid': 'display: grid;\ngrid-template-columns: ${1:repeat(3, 1fr)};\ngap: ${2:1rem};'
      }
    },
    json: { 
      extensions: ['.json'], 
      icon: '📄',
      keywords: [],
      snippets: {
        'object': '{\n\t"${1:key}": "${2:value}"\n}'
      }
    },
    markdown: { 
      extensions: ['.md', '.markdown'], 
      icon: '📝',
      keywords: ['#', '##', '###', '**', '*', '`', '```', '[]', '()'],
      snippets: {
        'heading': '# ${1:Heading}',
        'code': '```${1:language}\n${2:code}\n```',
        'link': '[${1:text}](${2:url})'
      }
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    for (const [lang, config] of Object.entries(languageConfig)) {
      if (config.extensions.some(e => e.slice(1) === ext)) {
        return config.icon;
      }
    }
    return '📄';
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = '.' + filename.split('.').pop()?.toLowerCase();
    for (const [lang, config] of Object.entries(languageConfig)) {
      if (config.extensions.includes(ext)) {
        return lang;
      }
    }
    return 'text';
  };

  const createNewProject = () => {
    const name = prompt('Enter project name:');
    if (name?.trim()) {
      createProject(name.trim(), 'New project');
    }
  };

  const createNewFile = () => {
    if (!activeProject) return;
    const name = prompt('Enter file name (with extension):');
    if (name?.trim()) {
      const language = getLanguageFromExtension(name);
      createFile(activeProject.id, name.trim(), '', language);
    }
  };

  const createNewFolder = () => {
    if (!activeProject) return;
    const name = prompt('Enter folder name:');
    if (name?.trim()) {
      createFile(activeProject.id, `${name.trim()}/.folder`, '', 'text');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !activeProject) return;

    Array.from(files).forEach(async (file) => {
      const content = await file.text();
      const language = getLanguageFromExtension(file.name);
      createFile(activeProject.id, file.name, content, language);
    });
  };

  const downloadFile = (fileId: string) => {
    if (!activeProject) return;
    const file = activeProject.files.find(f => f.id === fileId);
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

  const downloadProject = () => {
    if (!activeProject) return;
    
    const zip = activeProject.files.map(file => ({
      name: file.name,
      content: file.content
    }));
    
    const element = document.createElement('a');
    const fileBlob = new Blob([JSON.stringify(zip, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `${activeProject.name}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveCurrentFile = () => {
    if (activeProject && activeFile && editorRef.current) {
      updateFile(activeProject.id, activeFile.id, editorRef.current.value);
    }
  };

  const runCode = () => {
    if (activeFile) {
      const terminal = activeTerminal || createTerminalSession();
      addToTerminalHistory(terminal.id, `Running ${activeFile.name}...`);
      
      setTimeout(() => {
        const lang = activeFile.language;
        switch (lang) {
          case 'javascript':
            addToTerminalHistory(terminal.id, `node ${activeFile.name}`);
            addToTerminalHistory(terminal.id, `✓ Execution completed successfully`);
            break;
          case 'python':
            addToTerminalHistory(terminal.id, `python ${activeFile.name}`);
            addToTerminalHistory(terminal.id, `✓ Script executed successfully`);
            break;
          case 'java':
            addToTerminalHistory(terminal.id, `javac ${activeFile.name}`);
            addToTerminalHistory(terminal.id, `java ${activeFile.name.replace('.java', '')}`);
            addToTerminalHistory(terminal.id, `✓ Java program executed`);
            break;
          case 'cpp':
            addToTerminalHistory(terminal.id, `g++ ${activeFile.name} -o output`);
            addToTerminalHistory(terminal.id, `./output`);
            addToTerminalHistory(terminal.id, `✓ C++ program compiled and executed`);
            break;
          default:
            addToTerminalHistory(terminal.id, `✓ ${activeFile.name} executed successfully`);
        }
      }, 500);
    }
  };

  const createTerminalSession = () => {
    const terminalId = createTerminal();
    return terminalSessions.find(t => t.id === terminalId)!;
  };

  const executeTerminalCommand = () => {
    if (!activeTerminal || !terminalInput.trim()) return;
    
    const command = terminalInput.trim();
    addToTerminalHistory(activeTerminal.id, `$ ${command}`);
    
    // Add to history
    setTerminalHistory(prev => [...prev.filter(cmd => cmd !== command), command]);
    setHistoryIndex(-1);
    
    // Enhanced command simulation
    setTimeout(() => {
      const cmd = command.toLowerCase();
      
      if (cmd === 'clear' || cmd === 'cls') {
        // Clear terminal
        terminalSessions.forEach(t => {
          if (t.id === activeTerminal.id) {
            t.history = ['Terminal cleared'];
          }
        });
      } else if (cmd.startsWith('ls') || cmd.startsWith('dir')) {
        const files = activeProject?.files.map(f => f.name).join('  ') || 'No files';
        addToTerminalHistory(activeTerminal.id, files);
      } else if (cmd === 'pwd') {
        addToTerminalHistory(activeTerminal.id, `/workspace/${activeProject?.name || 'untitled'}`);
      } else if (cmd.startsWith('cd ')) {
        const dir = cmd.substring(3);
        addToTerminalHistory(activeTerminal.id, `Changed directory to ${dir}`);
      } else if (cmd.startsWith('mkdir ')) {
        const dir = cmd.substring(6);
        addToTerminalHistory(activeTerminal.id, `Directory '${dir}' created`);
      } else if (cmd.startsWith('touch ')) {
        const file = cmd.substring(6);
        addToTerminalHistory(activeTerminal.id, `File '${file}' created`);
      } else if (cmd.startsWith('rm ')) {
        const file = cmd.substring(3);
        addToTerminalHistory(activeTerminal.id, `File '${file}' removed`);
      } else if (cmd.startsWith('cat ')) {
        const file = cmd.substring(4);
        const foundFile = activeProject?.files.find(f => f.name === file);
        if (foundFile) {
          addToTerminalHistory(activeTerminal.id, foundFile.content);
        } else {
          addToTerminalHistory(activeTerminal.id, `cat: ${file}: No such file or directory`);
        }
      } else if (cmd.startsWith('npm ')) {
        if (cmd.includes('install')) {
          addToTerminalHistory(activeTerminal.id, '📦 Installing dependencies...');
          setTimeout(() => {
            addToTerminalHistory(activeTerminal.id, '✓ Dependencies installed successfully!');
          }, 1000);
        } else if (cmd.includes('start') || cmd.includes('run')) {
          addToTerminalHistory(activeTerminal.id, '🚀 Starting development server...');
          setTimeout(() => {
            addToTerminalHistory(activeTerminal.id, '✓ Server running on http://localhost:3000');
          }, 800);
        } else {
          addToTerminalHistory(activeTerminal.id, 'npm command executed');
        }
      } else if (cmd.startsWith('git ')) {
        if (cmd.includes('status')) {
          addToTerminalHistory(activeTerminal.id, 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean');
        } else if (cmd.includes('add')) {
          addToTerminalHistory(activeTerminal.id, 'Files staged for commit');
        } else if (cmd.includes('commit')) {
          addToTerminalHistory(activeTerminal.id, '[main 1a2b3c4] Commit message\n 1 file changed, 10 insertions(+)');
        } else if (cmd.includes('push')) {
          addToTerminalHistory(activeTerminal.id, 'Enumerating objects: 3, done.\nCounting objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 280 bytes | 280.00 KiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo origin\n   abc123..def456  main -> main');
        } else {
          addToTerminalHistory(activeTerminal.id, 'Git command executed');
        }
      } else if (cmd === 'whoami') {
        addToTerminalHistory(activeTerminal.id, 'hunt-user');
      } else if (cmd === 'date') {
        addToTerminalHistory(activeTerminal.id, new Date().toString());
      } else if (cmd.startsWith('echo ')) {
        const text = cmd.substring(5);
        addToTerminalHistory(activeTerminal.id, text);
      } else if (cmd === 'help') {
        addToTerminalHistory(activeTerminal.id, 'Available commands:\n  ls, dir - List files\n  pwd - Print working directory\n  cd - Change directory\n  mkdir - Create directory\n  touch - Create file\n  rm - Remove file\n  cat - Display file content\n  npm - Node package manager\n  git - Git version control\n  clear, cls - Clear terminal\n  whoami - Current user\n  date - Current date\n  echo - Display text');
      } else if (cmd === 'ps') {
        addToTerminalHistory(activeTerminal.id, 'PID  TTY          TIME CMD\n1234 pts/0    00:00:01 bash\n5678 pts/0    00:00:00 node');
      } else if (cmd === 'top' || cmd === 'htop') {
        addToTerminalHistory(activeTerminal.id, 'System Monitor:\nCPU: 15.2%\nMemory: 2.1GB / 8GB\nProcesses: 142');
      } else {
        addToTerminalHistory(activeTerminal.id, `Command not found: ${command}\nType 'help' for available commands`);
      }
    }, 100);
    
    setTerminalInput('');
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < terminalHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setTerminalInput('');
      }
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setDeleteDialog({ 
      isOpen: true, 
      type: 'project', 
      id: projectId,
      name: project?.name 
    });
  };

  const handleDeleteFile = (fileId: string) => {
    const file = activeProject?.files.find(f => f.id === fileId);
    setDeleteDialog({ 
      isOpen: true, 
      type: 'file', 
      id: fileId,
      name: file?.name 
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.type === 'project' && deleteDialog.id) {
      deleteProject(deleteDialog.id);
    } else if (deleteDialog.type === 'file' && deleteDialog.id && activeProject) {
      deleteFile(activeProject.id, deleteDialog.id);
    }
    setDeleteDialog({ isOpen: false, type: null, id: null });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          saveCurrentFile();
          break;
        case 'n':
          e.preventDefault();
          createNewFile();
          break;
        case 'o':
          e.preventDefault();
          fileInputRef.current?.click();
          break;
        case '=':
          e.preventDefault();
          setFontSize(prev => Math.min(prev + 2, 24));
          break;
        case '-':
          e.preventDefault();
          setFontSize(prev => Math.max(prev - 2, 10));
          break;
        case 'p':
          e.preventDefault();
          setCommandPalette(true);
          break;
        case '`':
          e.preventDefault();
          setIsTerminalVisible(!isTerminalVisible);
          break;
      }
    }
    
    // Enhanced auto-completion
    if (e.key === 'Tab' && activeFile && editorRef.current) {
      e.preventDefault();
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const currentLine = text.substring(lineStart, start);
      const word = currentLine.split(/\s+/).pop() || '';
      
      const lang = activeFile.language;
      const config = languageConfig[lang as keyof typeof languageConfig];
      
      if (config?.snippets[word]) {
        const snippet = config.snippets[word];
        const newText = text.substring(0, start - word.length) + snippet + text.substring(end);
        textarea.value = newText;
        updateFile(activeProject!.id, activeFile.id, newText);
      } else {
        const newText = text.substring(0, start) + '  ' + text.substring(end);
        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateFile(activeProject!.id, activeFile.id, newText);
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  const sidebarClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-gray-50 border-gray-200';

  const editorClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [activeTerminal?.history]);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && activeProject && activeFile && editorRef.current) {
      const timer = setTimeout(() => {
        saveCurrentFile();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeFile?.content, autoSave]);

  return (
    <div className={`h-screen flex ${themeClasses}`}>
      {/* Enhanced Activity Bar */}
      <div className={`w-12 ${sidebarClasses} border-r flex flex-col items-center py-4 space-y-4`}>
        <button
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className={`p-2 rounded hover:bg-gray-700 transition-colors ${isSidebarVisible ? 'bg-gray-700' : ''}`}
          title="Explorer"
        >
          <Folder className="h-5 w-5" />
        </button>
        <button 
          onClick={() => setCommandPalette(true)}
          className="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button className="p-2 rounded hover:bg-gray-700 transition-colors" title="Source Control">
          <GitBranch className="h-5 w-5" />
        </button>
        <button 
          onClick={runCode}
          className="p-2 rounded hover:bg-gray-700 transition-colors" 
          title="Run and Debug"
        >
          <Bug className="h-5 w-5" />
        </button>
        <button className="p-2 rounded hover:bg-gray-700 transition-colors" title="Extensions">
          <Package className="h-5 w-5" />
        </button>
        <button className="p-2 rounded hover:bg-gray-700 transition-colors" title="Live Share">
          <Layers className="h-5 w-5" />
        </button>
        <div className="flex-1"></div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-700 transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="p-2 rounded hover:bg-gray-700 transition-colors" title="Settings">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Enhanced Sidebar */}
      {isSidebarVisible && (
        <div 
          className={`${sidebarClasses} border-r flex flex-col`}
          style={{ width: sidebarWidth }}
        >
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Explorer</h2>
              <div className="flex items-center space-x-1">
                <button
                  onClick={createNewFile}
                  disabled={!activeProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                  title="New File"
                >
                  <FilePlus className="h-4 w-4" />
                </button>
                <button
                  onClick={createNewFolder}
                  disabled={!activeProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                  title="New Folder"
                >
                  <FolderPlus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!activeProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                  title="Upload Files"
                >
                  <Upload className="h-4 w-4" />
                </button>
                <button
                  onClick={createNewProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="New Project"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {projects.map((project) => (
                <div key={project.id} className="mb-2">
                  <div
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      activeProject?.id === project.id 
                        ? isDarkMode ? 'bg-gray-700' : 'bg-gray-200' 
                        : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveProject(project.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setContextMenu({ x: e.clientX, y: e.clientY, type: 'project', id: project.id });
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium">{project.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadProject();
                        }}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="Download Project"
                      >
                        <Download className="h-3 w-3 text-gray-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id);
                        }}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  {activeProject?.id === project.id && (
                    <div className="ml-6 mt-1 space-y-1">
                      {project.files
                        .filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                            activeProject.activeFileId === file.id 
                              ? isDarkMode ? 'bg-blue-600' : 'bg-blue-500 text-white'
                              : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setActiveFile(project.id, file.id)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({ x: e.clientX, y: e.clientY, type: 'file', id: file.id });
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{getFileIcon(file.name)}</span>
                            <span className="text-sm">{file.name}</span>
                            {file.isModified && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(file.id);
                              }}
                              className="p-1 hover:bg-gray-600 rounded transition-colors"
                              title="Download File"
                            >
                              <Download className="h-3 w-3 text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file.id);
                              }}
                              className="p-1 hover:bg-gray-600 rounded transition-colors"
                              title="Delete File"
                            >
                              <Trash2 className="h-3 w-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Tab Bar */}
        <div className={`${sidebarClasses} border-b flex items-center justify-between px-4 py-2`}>
          <div className="flex items-center space-x-4">
            {activeFile && (
              <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded">
                <span className="text-sm">{getFileIcon(activeFile.name)}</span>
                <span className="text-sm">{activeFile.name}</span>
                {activeFile.isModified && <div className="w-2 h-2 bg-orange-400 rounded-full" />}
                <button
                  onClick={() => setActiveFile(activeProject!.id, null)}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-700 rounded px-2 py-1">
              <button
                onClick={() => setWordWrap(!wordWrap)}
                className={`p-1 rounded transition-colors ${wordWrap ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                title="Toggle Word Wrap"
              >
                <RotateCw className="h-3 w-3" />
              </button>
              <button
                onClick={() => setMinimap(!minimap)}
                className={`p-1 rounded transition-colors ${minimap ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                title="Toggle Minimap"
              >
                <Monitor className="h-3 w-3" />
              </button>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`p-1 rounded transition-colors ${autoSave ? 'bg-gray-600' : 'hover:bg-gray-600'}`}
                title="Toggle Auto Save"
              >
                <Save className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center space-x-1 bg-gray-700 rounded px-2 py-1">
              <button
                onClick={() => setFontSize(prev => Math.max(prev - 2, 10))}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Decrease Font Size"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              <span className="text-xs px-2">{fontSize}px</span>
              <button
                onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Increase Font Size"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
            </div>
            
            <button
              onClick={saveCurrentFile}
              disabled={!activeFile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button
              onClick={runCode}
              disabled={!activeFile}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>Run</span>
            </button>
            <button
              onClick={() => setIsTerminalVisible(!isTerminalVisible)}
              className={`px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1 ${
                isTerminalVisible ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <TerminalIcon className="h-4 w-4" />
              <span>Terminal</span>
            </button>
          </div>
        </div>

        {/* Enhanced Editor */}
        <div className="flex-1 relative flex">
          {activeFile ? (
            <>
              <div className="flex-1 relative">
                <textarea
                  ref={editorRef}
                  value={activeFile.content}
                  onChange={(e) => {
                    if (activeProject) {
                      updateFile(activeProject.id, activeFile.id, e.target.value);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className={`w-full h-full ${editorClasses} p-4 pl-16 font-mono resize-none outline-none border-none`}
                  style={{ 
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.5',
                    tabSize: 2,
                    whiteSpace: wordWrap ? 'pre-wrap' : 'pre'
                  }}
                  placeholder="Start coding..."
                  spellCheck={false}
                />
                
                {/* Enhanced Line numbers */}
                <div className={`absolute left-0 top-0 bottom-0 w-14 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} text-gray-400 text-xs font-mono flex flex-col overflow-hidden`}>
                  {activeFile.content.split('\n').map((_, index) => (
                    <div key={index} className="px-2 py-0 text-right hover:bg-gray-700 cursor-pointer" style={{ lineHeight: '1.5', fontSize: `${fontSize}px` }}>
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Minimap */}
              {minimap && (
                <div className={`w-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} overflow-hidden`}>
                  <div className="p-2 text-xs text-gray-500 font-mono leading-none">
                    {activeFile.content.split('\n').slice(0, 50).map((line, index) => (
                      <div key={index} className="truncate opacity-60 hover:opacity-100 cursor-pointer" style={{ fontSize: '6px' }}>
                        {line || ' '}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Code className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Welcome to Hunt Code Editor
                </h3>
                <p className="text-gray-500 mb-6">
                  Create a project and start coding
                </p>
                <div className="space-y-3">
                  <button
                    onClick={createNewProject}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Project</span>
                  </button>
                  <div className="text-sm text-gray-500">
                    <p>Keyboard shortcuts:</p>
                    <p>Ctrl+S: Save • Ctrl+N: New File • Ctrl+O: Open File</p>
                    <p>Ctrl+P: Command Palette • Ctrl+`: Toggle Terminal</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Terminal */}
        {isTerminalVisible && (
          <div 
            className={`${isDarkMode ? 'bg-black' : 'bg-gray-100'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
            style={{ height: terminalHeight }}
          >
            <div className={`flex items-center justify-between px-4 py-2 ${sidebarClasses} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <TerminalIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Terminal</span>
                </div>
                
                {terminalSessions.map((terminal) => (
                  <button
                    key={terminal.id}
                    onClick={() => setActiveTerminal(terminal.id)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      activeTerminalId === terminal.id
                        ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {terminal.name}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Cpu className="h-3 w-3" />
                  <span>CPU: 15%</span>
                  <HardDrive className="h-3 w-3 ml-2" />
                  <span>2.1GB</span>
                  <Wifi className="h-3 w-3 ml-2" />
                  <Activity className="h-3 w-3" />
                </div>
                <button
                  onClick={createTerminalSession}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="New Terminal"
                >
                  <Plus className="h-4 w-4" />
                </button>
                {activeTerminal && (
                  <button
                    onClick={() => deleteTerminal(activeTerminal.id)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Close Terminal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsTerminalVisible(false)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  title="Hide Terminal"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              <div 
                ref={terminalRef}
                className="flex-1 overflow-y-auto p-4 font-mono text-sm"
              >
                {activeTerminal?.history.map((line, index) => (
                  <div key={index} className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} whitespace-pre-wrap`}>
                    {line}
                  </div>
                ))}
              </div>
              
              <div className={`flex items-center px-4 py-2 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-300'}`}>
                <span className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} mr-2`}>
                  hunt@workspace:~$
                </span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeTerminalCommand()}
                  onKeyDown={handleTerminalKeyDown}
                  className={`flex-1 bg-transparent outline-none font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  placeholder="Enter command... (type 'help' for available commands)"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Context Menu */}
      {contextMenu && (
        <div
          className={`fixed z-50 ${sidebarClasses} border rounded-lg shadow-lg py-2 min-w-48`}
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.type === 'file' && (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <Scissors className="h-4 w-4" />
                <span>Cut</span>
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>Rename</span>
              </button>
              <button 
                onClick={() => contextMenu.id && downloadFile(contextMenu.id)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <hr className="my-2 border-gray-700" />
              <button 
                onClick={() => contextMenu.id && handleDeleteFile(contextMenu.id)}
                className="w-full text-left px-4 py-2 hover:bg-red-600 transition-colors flex items-center space-x-2 text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </>
          )}
          {contextMenu.type === 'project' && (
            <>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>Rename</span>
              </button>
              <button 
                onClick={downloadProject}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <Archive className="h-4 w-4" />
                <span>Export</span>
              </button>
              <hr className="my-2 border-gray-700" />
              <button 
                onClick={() => contextMenu.id && handleDeleteProject(contextMenu.id)}
                className="w-full text-left px-4 py-2 hover:bg-red-600 transition-colors flex items-center space-x-2 text-red-400"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Command Palette */}
      {commandPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
          <div className={`${sidebarClasses} rounded-lg shadow-2xl w-full max-w-2xl`}>
            <div className="p-4 border-b border-gray-700">
              <input
                type="text"
                placeholder="Type a command..."
                className={`w-full px-4 py-3 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                autoFocus
                onKeyDown={(e) => e.key === 'Escape' && setCommandPalette(false)}
              />
            </div>
            <div className="p-4 space-y-2">
              <div className="text-sm text-gray-400 mb-2">Quick Actions</div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition-colors">
                New File
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition-colors">
                New Project
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition-colors">
                Toggle Terminal
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded transition-colors">
                Toggle Theme
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        title={`Delete ${deleteDialog.type === 'project' ? 'Project' : 'File'}`}
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, type: null, id: null })}
      />
    </div>
  );
};

export default CodeEditor;