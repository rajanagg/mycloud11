import React, { useState, useRef, useEffect } from 'react';
import { FileText, Plus, Save, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link, Image, Type, Palette, Download, Upload, Search, Star, Trash2, Edit3, Undo, Redo, Copy, Scissors, Clipboard, Eye, EyeOff, ZoomIn, ZoomOut, Printer, Share, Settings, MoreHorizontal, Table, Quote, Code, Highlighter, Subscript, Superscript, Strikethrough, PaintBucket, Columns, Indent, Outdent, Mic, MicOff, Languages, SpellCheck as Spellcheck, FileImage, Video, Music, Paperclip, Hash, AtSign, Calendar, MapPin, Smile, Zap, Layers, Grid3X3, BarChart, PieChart } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import DeleteDialog from './DeleteDialog';

const DocumentEditor = () => {
  const { documents, addDocument, updateDocument, deleteDocument, toggleStar } = useDocuments();
  const [activeDocument, setActiveDocument] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(true);
  const [documentLanguage, setDocumentLanguage] = useState('en');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState('left');
  const [showWordCount, setShowWordCount] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; documentId: string | null }>({
    isOpen: false,
    documentId: null
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentDocument = activeDocument ? documents.find(doc => doc.id === activeDocument) : null;

  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 
    'Calibri', 'Cambria', 'Trebuchet MS', 'Comic Sans MS', 'Impact',
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }
  ];

  const createNewDocument = () => {
    const newTitle = `Document ${documents.length + 1}`;
    addDocument({
      title: newTitle,
      content: '',
      type: 'text',
      tags: [],
      isStarred: false
    });
    
    setTimeout(() => {
      const newDoc = documents[documents.length];
      if (newDoc) {
        setActiveDocument(newDoc.id);
        setTitle(newTitle);
        setContent('');
      }
    }, 100);
  };

  const saveDocument = () => {
    if (activeDocument && title.trim()) {
      updateDocument(activeDocument, {
        title: title.trim(),
        content
      });
    }
  };

  const loadDocument = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc) {
      setActiveDocument(documentId);
      setTitle(doc.title);
      setContent(doc.content);
      if (editorRef.current) {
        editorRef.current.innerHTML = doc.content;
      }
    }
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      
      const textContent = editorRef.current.textContent || '';
      setWordCount(textContent.trim().split(/\s+/).filter(word => word.length > 0).length);
      setCharacterCount(textContent.length);
    }
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ccc; min-width: 100px;">Cell</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      document.execCommand('insertHTML', false, tableHTML);
      updateContent();
    }
  };

  const insertChart = (type: 'bar' | 'pie' | 'line') => {
    const chartHTML = `
      <div style="border: 2px dashed #ccc; padding: 20px; margin: 10px 0; text-align: center; background: #f9f9f9;">
        <${type === 'bar' ? 'BarChart' : type === 'pie' ? 'PieChart' : 'LineChart'} className="h-6 w-6 mx-auto mb-2" />
        <p>📊 ${type.charAt(0).toUpperCase() + type.slice(1)} Chart Placeholder</p>
        <small>Click to edit chart data</small>
      </div>
    `;
    document.execCommand('insertHTML', false, chartHTML);
    updateContent();
  };

  const insertEmoji = () => {
    const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💡', '🎉', '📚', '💻', '🚀', '⭐', '✅'];
    const selectedEmoji = prompt(`Choose an emoji:\n${emojis.join(' ')}\n\nOr enter any emoji:`);
    if (selectedEmoji) {
      document.execCommand('insertText', false, selectedEmoji);
      updateContent();
    }
  };

  const insertDate = () => {
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    document.execCommand('insertText', false, dateString);
    updateContent();
  };

  const toggleVoiceRecording = () => {
    if (!isVoiceRecording) {
      // Start voice recording (mock implementation)
      setIsVoiceRecording(true);
      setTimeout(() => {
        setIsVoiceRecording(false);
        document.execCommand('insertText', false, ' [Voice recording transcribed] ');
        updateContent();
      }, 3000);
    } else {
      setIsVoiceRecording(false);
    }
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = `<img src="${e.target?.result}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" />`;
        document.execCommand('insertHTML', false, img);
        updateContent();
      };
      reader.readAsDataURL(file);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    if (url && text) {
      const link = `<a href="${url}" target="_blank" style="color: #3b82f6; text-decoration: underline;">${text}</a>`;
      document.execCommand('insertHTML', false, link);
      updateContent();
    }
  };

  const exportDocument = () => {
    if (currentDocument) {
      const element = document.createElement('a');
      const file = new Blob([currentDocument.content], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `${currentDocument.title}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const printDocument = () => {
    if (currentDocument) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${currentDocument.title}</title>
              <style>
                body { 
                  font-family: ${fontFamily}; 
                  font-size: ${fontSize}px; 
                  color: ${textColor}; 
                  line-height: ${lineHeight};
                  letter-spacing: ${letterSpacing}px;
                  text-align: ${textAlign};
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                @media print { 
                  body { margin: 0; } 
                  @page { margin: 1in; }
                }
              </style>
            </head>
            <body>${currentDocument.content}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setDeleteDialog({ isOpen: true, documentId });
  };

  const confirmDelete = () => {
    if (deleteDialog.documentId) {
      deleteDocument(deleteDialog.documentId);
      if (activeDocument === deleteDialog.documentId) {
        setActiveDocument(null);
        setTitle('');
        setContent('');
      }
      setDeleteDialog({ isOpen: false, documentId: null });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          saveDocument();
          break;
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
        case 'u':
          e.preventDefault();
          formatText('underline');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            formatText('redo');
          } else {
            formatText('undo');
          }
          break;
      }
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && activeDocument && content) {
      const timer = setTimeout(() => {
        saveDocument();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, autoSave, activeDocument]);

  useEffect(() => {
    updateContent();
  }, []);

  const editorStyles = {
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    textAlign: textAlign as any,
    zoom: `${zoom}%`,
    direction: 'ltr' as const,
    unicodeBidi: 'normal' as const,
    writingMode: 'horizontal-tb' as const,
    backgroundColor: darkMode ? '#1f2937' : backgroundColor,
    color: darkMode ? '#f9fafb' : textColor,
    minHeight: '500px',
    padding: focusMode ? '40px' : '24px',
    border: focusMode ? 'none' : '1px solid #e5e7eb',
    borderRadius: focusMode ? '0' : '8px',
    outline: 'none'
  };

  return (
    <div className={`h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Enhanced Sidebar */}
      <div className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Documents</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Toggle Dark Mode"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
              <button
                onClick={createNewDocument}
                className="bg-black hover:bg-gray-800 text-white p-2 rounded-lg transition-colors"
                title="New Document"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => loadDocument(doc.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  activeDocument === doc.id
                    ? 'bg-black text-white'
                    : darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-medium truncate ${
                    activeDocument === doc.id ? 'text-white' : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {doc.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(doc.id);
                      }}
                      className={`p-1 rounded ${
                        doc.isStarred 
                          ? 'text-yellow-500' 
                          : activeDocument === doc.id ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-500'
                      }`}
                    >
                      <Star className="h-4 w-4" fill={doc.isStarred ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDocument(doc.id);
                      }}
                      className={`p-1 rounded ${
                        activeDocument === doc.id ? 'text-gray-300 hover:text-red-300' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className={`text-sm truncate ${
                  activeDocument === doc.id ? 'text-gray-300' : darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {doc.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
                <p className={`text-xs mt-2 ${
                  activeDocument === doc.id ? 'text-gray-400' : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {activeDocument ? (
          <>
            {/* Enhanced Header */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`text-2xl font-bold bg-transparent border-none outline-none flex-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  placeholder="Document title..."
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFocusMode(!focusMode)}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      focusMode ? 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Zap className="h-4 w-4" />
                    <span>Focus</span>
                  </button>
                  <button
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      isPreviewMode ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
                  </button>
                  <button
                    onClick={saveDocument}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <div className="relative group">
                    <button className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    <div className={`absolute right-0 top-full mt-2 w-48 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg shadow-lg py-2 hidden group-hover:block z-10`}>
                      <button
                        onClick={exportDocument}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${darkMode ? 'hover:bg-gray-700 text-white' : ''}`}
                      >
                        <Download className="h-4 w-4" />
                        <span>Export HTML</span>
                      </button>
                      <button
                        onClick={printDocument}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${darkMode ? 'hover:bg-gray-700 text-white' : ''}`}
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print</span>
                      </button>
                      <button className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 ${darkMode ? 'hover:bg-gray-700 text-white' : ''}`}>
                        <Share className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Toolbar */}
              {!isPreviewMode && !focusMode && (
                <div className="space-y-3">
                  {/* First Row - Basic Formatting */}
                  <div className="flex items-center space-x-1 flex-wrap gap-2">
                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={() => formatText('undo')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Undo"
                      >
                        <Undo className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('redo')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Redo"
                      >
                        <Redo className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={() => formatText('bold')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('italic')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('underline')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Underline"
                      >
                        <Underline className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('strikeThrough')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Strikethrough"
                      >
                        <Strikethrough className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={() => formatText('subscript')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Subscript"
                      >
                        <Subscript className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('superscript')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Superscript"
                      >
                        <Superscript className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => {
                          setTextColor(e.target.value);
                          formatText('foreColor', e.target.value);
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                        title="Text Color"
                      />
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => {
                          setBackgroundColor(e.target.value);
                          formatText('hiliteColor', e.target.value);
                        }}
                        className="w-8 h-8 rounded border-none cursor-pointer"
                        title="Highlight Color"
                      />
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={toggleVoiceRecording}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${
                          isVoiceRecording ? 'text-red-500' : darkMode ? 'text-white' : ''
                        }`}
                        title="Voice Recording"
                      >
                        {isVoiceRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setIsSpellCheckEnabled(!isSpellCheckEnabled)}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${
                          isSpellCheckEnabled ? 'text-green-500' : darkMode ? 'text-white' : ''
                        }`}
                        title="Spell Check"
                      >
                        <Spellcheck className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Second Row - Alignment and Lists */}
                  <div className="flex items-center space-x-1 flex-wrap gap-2">
                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={() => {
                          formatText('justifyLeft');
                          setTextAlign('left');
                        }}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Align Left"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          formatText('justifyCenter');
                          setTextAlign('center');
                        }}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Align Center"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          formatText('justifyRight');
                          setTextAlign('right');
                        }}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Align Right"
                      >
                        <AlignRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={() => formatText('insertUnorderedList')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Bullet List"
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('insertOrderedList')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Numbered List"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={() => formatText('outdent')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Decrease Indent"
                      >
                        <Outdent className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('indent')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Increase Indent"
                      >
                        <Indent className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={insertLink}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Insert Link"
                      >
                        <Link className="h-4 w-4" />
                      </button>
                      <button
                        onClick={insertImage}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Insert Image"
                      >
                        <Image className="h-4 w-4" />
                      </button>
                      <button
                        onClick={insertTable}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Insert Table"
                      >
                        <Table className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => formatText('formatBlock', 'blockquote')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Quote"
                      >
                        <Quote className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-1`}>
                      <button
                        onClick={() => insertChart('bar')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Insert Bar Chart"
                      >
                        <BarChart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => insertChart('pie')}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Insert Pie Chart"
                      >
                        <PieChart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={insertEmoji}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Insert Emoji"
                      >
                        <Smile className="h-4 w-4" />
                      </button>
                      <button
                        onClick={insertDate}
                        className={`p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors ${darkMode ? 'text-white' : ''}`}
                        title="Insert Date"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Third Row - Font and Advanced Controls */}
                  <div className="flex items-center space-x-3 flex-wrap gap-2">
                    <select
                      value={fontFamily}
                      onChange={(e) => {
                        setFontFamily(e.target.value);
                        formatText('fontName', e.target.value);
                      }}
                      className={`px-3 py-2 border-none rounded-lg focus:ring-2 focus:ring-black ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                      }`}
                    >
                      {fontFamilies.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>

                    <select
                      value={fontSize}
                      onChange={(e) => {
                        setFontSize(parseInt(e.target.value));
                        formatText('fontSize', '3');
                        if (editorRef.current) {
                          editorRef.current.style.fontSize = e.target.value + 'px';
                        }
                      }}
                      className={`px-3 py-2 border-none rounded-lg focus:ring-2 focus:ring-black ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                      }`}
                    >
                      {fontSizes.map(size => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>

                    <select
                      value={documentLanguage}
                      onChange={(e) => setDocumentLanguage(e.target.value)}
                      className={`px-3 py-2 border-none rounded-lg focus:ring-2 focus:ring-black ${
                        darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'
                      }`}
                    >
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>

                    <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg px-3 py-2`}>
                      <button
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                        className={`p-1 hover:bg-gray-200 rounded ${darkMode ? 'hover:bg-gray-600 text-white' : ''}`}
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </button>
                      <span className={`text-sm font-medium w-12 text-center ${darkMode ? 'text-white' : ''}`}>{zoom}%</span>
                      <button
                        onClick={() => setZoom(Math.min(200, zoom + 10))}
                        className={`p-1 hover:bg-gray-200 rounded ${darkMode ? 'hover:bg-gray-600 text-white' : ''}`}
                        title="Zoom In"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </button>
                    </div>

                    <div className={`flex items-center space-x-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg px-3 py-2`}>
                      <span className={`text-sm ${darkMode ? 'text-white' : ''}`}>Line Height:</span>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                        className="w-16"
                      />
                      <span className={`text-sm w-8 ${darkMode ? 'text-white' : ''}`}>{lineHeight}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Editor/Preview Area */}
            <div className={`flex-1 p-8 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-white'} ${focusMode ? 'px-20' : ''}`}>
              {isPreviewMode ? (
                <div 
                  className="max-w-4xl mx-auto"
                  style={editorStyles}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={updateContent}
                  onKeyDown={handleKeyDown}
                  spellCheck={isSpellCheckEnabled}
                  className="w-full h-full min-h-96 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  style={editorStyles}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>

            {/* Enhanced Status Bar */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t px-6 py-3 flex items-center justify-between text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className="flex items-center space-x-6">
                {showWordCount && (
                  <>
                    <span>Words: {wordCount}</span>
                    <span>Characters: {characterCount}</span>
                  </>
                )}
                <span>Zoom: {zoom}%</span>
                <span>Language: {languages.find(l => l.code === documentLanguage)?.name}</span>
                <span className="flex items-center space-x-1">
                  <span>Auto-save:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-3 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <span>Spell Check:</span>
                  <span className={isSpellCheckEnabled ? 'text-green-500' : 'text-red-500'}>
                    {isSpellCheckEnabled ? '✓' : '✗'}
                  </span>
                </span>
                <span className="flex items-center space-x-2">
                  <span>Saved</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="text-center">
              <Edit3 className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome to Hunt Document Editor
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Create and edit documents with powerful formatting tools
              </p>
              <button
                onClick={createNewDocument}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Document</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, documentId: null })}
      />
    </div>
  );
};

export default DocumentEditor;