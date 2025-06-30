import React, { useState } from 'react';
import { X, Folder, Code, FileText, Zap } from 'lucide-react';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, description: string, template: string) => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');

  const templates = [
    {
      id: 'blank',
      name: 'Blank Project',
      description: 'Start with an empty project',
      icon: Folder,
      color: 'bg-gray-500'
    },
    {
      id: 'react',
      name: 'React App',
      description: 'React application with TypeScript',
      icon: Code,
      color: 'bg-blue-500'
    },
    {
      id: 'node',
      name: 'Node.js API',
      description: 'Express.js backend application',
      icon: Zap,
      color: 'bg-green-500'
    },
    {
      id: 'html',
      name: 'HTML Website',
      description: 'Static HTML, CSS, and JavaScript',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim(), description.trim(), selectedTemplate);
      setName('');
      setDescription('');
      setSelectedTemplate('blank');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-2">
                <Code className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Create New Project</h2>
                <p className="text-gray-300 text-sm">Start building something amazing</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="My Awesome Project"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Brief description..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Choose Template
            </label>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${template.color} rounded-lg p-2`}>
                      <template.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectDialog;