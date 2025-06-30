import React, { useState } from 'react';
import { X, FileText, Code, Image, Database, Settings } from 'lucide-react';

interface CreateFileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, type: string) => void;
}

const CreateFileDialog: React.FC<CreateFileDialogProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [fileName, setFileName] = useState('');
  const [selectedType, setSelectedType] = useState('javascript');

  const fileTypes = [
    {
      id: 'javascript',
      name: 'JavaScript',
      extension: '.js',
      icon: Code,
      color: 'bg-yellow-500',
      template: 'console.log("Hello World!");'
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      extension: '.ts',
      icon: Code,
      color: 'bg-blue-500',
      template: 'const message: string = "Hello World!";\nconsole.log(message);'
    },
    {
      id: 'react',
      name: 'React Component',
      extension: '.jsx',
      icon: Code,
      color: 'bg-cyan-500',
      template: 'import React from "react";\n\nconst Component = () => {\n  return <div>Hello World!</div>;\n};\n\nexport default Component;'
    },
    {
      id: 'python',
      name: 'Python',
      extension: '.py',
      icon: Code,
      color: 'bg-green-500',
      template: 'print("Hello World!")'
    },
    {
      id: 'html',
      name: 'HTML',
      extension: '.html',
      icon: FileText,
      color: 'bg-orange-500',
      template: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>'
    },
    {
      id: 'css',
      name: 'CSS',
      extension: '.css',
      icon: FileText,
      color: 'bg-pink-500',
      template: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}'
    },
    {
      id: 'json',
      name: 'JSON',
      extension: '.json',
      icon: Database,
      color: 'bg-gray-500',
      template: '{\n  "name": "example",\n  "version": "1.0.0"\n}'
    },
    {
      id: 'markdown',
      name: 'Markdown',
      extension: '.md',
      icon: FileText,
      color: 'bg-purple-500',
      template: '# Hello World\n\nThis is a markdown file.'
    }
  ];

  const selectedFileType = fileTypes.find(type => type.id === selectedType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileName.trim() && selectedFileType) {
      const fullName = fileName.includes('.') ? fileName : fileName + selectedFileType.extension;
      onConfirm(fullName, selectedType);
      setFileName('');
      setSelectedType('javascript');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-2">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create New File</h2>
                <p className="text-gray-300 text-sm">Choose a file type and start coding</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              File Name *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="filename"
              />
              <span className="text-gray-500 font-mono">
                {selectedFileType?.extension}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              File Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {fileTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedType === type.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`${type.color} rounded-lg p-2 mx-auto mb-2 w-fit`}>
                      <type.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900">{type.name}</h3>
                    <p className="text-xs text-gray-600">{type.extension}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedFileType && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Template Preview
              </label>
              <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto">
                <pre>{selectedFileType.template}</pre>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
            >
              Create File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFileDialog;