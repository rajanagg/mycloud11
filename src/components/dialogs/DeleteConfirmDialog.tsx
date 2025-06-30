import React from 'react';
import { AlertTriangle, X, Trash2, Shield, Clock } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  itemType?: 'project' | 'file' | 'course' | 'document' | 'folder';
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  itemName,
  itemType = 'file',
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDangerous = true
}) => {
  const getItemIcon = () => {
    switch (itemType) {
      case 'project': return '📁';
      case 'file': return '📄';
      case 'course': return '🎓';
      case 'document': return '📝';
      case 'folder': return '📂';
      default: return '📄';
    }
  };

  const getWarningLevel = () => {
    if (itemType === 'project' || itemType === 'course') {
      return {
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        level: 'High Risk'
      };
    }
    return {
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      level: 'Medium Risk'
    };
  };

  const warning = getWarningLevel();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className={`${warning.bgColor} ${warning.borderColor} border-b p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${warning.color} rounded-xl p-2`}>
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Shield className={`h-4 w-4 ${warning.textColor}`} />
                  <span className={`text-sm font-medium ${warning.textColor}`}>
                    {warning.level}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {itemName && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getItemIcon()}</span>
                <div>
                  <p className="font-semibold text-gray-900">{itemName}</p>
                  <p className="text-sm text-gray-600 capitalize">{itemType}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  This action cannot be undone
                </p>
                <p className="text-sm text-gray-600">
                  All associated data will be permanently removed from the system.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 ${warning.color} text-white rounded-xl hover:opacity-90 transition-all font-semibold flex items-center justify-center space-x-2`}
            >
              <Trash2 className="h-4 w-4" />
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;