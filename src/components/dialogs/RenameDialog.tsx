import React, { useState, useEffect } from 'react';
import { X, Edit3, Check } from 'lucide-react';

interface RenameDialogProps {
  isOpen: boolean;
  currentName: string;
  itemType: string;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

const RenameDialog: React.FC<RenameDialogProps> = ({
  isOpen,
  currentName,
  itemType,
  onClose,
  onConfirm
}) => {
  const [newName, setNewName] = useState(currentName);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
      setError('');
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }
    
    if (newName.trim() === currentName) {
      onClose();
      return;
    }
    
    onConfirm(newName.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-2">
                <Edit3 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Rename {itemType}</h2>
                <p className="text-blue-100 text-sm">Enter a new name</p>
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Name
            </label>
            <div className="bg-gray-50 px-4 py-3 rounded-xl text-gray-600 font-mono">
              {currentName}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Name *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setError('');
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder={`Enter new ${itemType} name`}
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Rename</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameDialog;