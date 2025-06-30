import React, { useState, useRef } from 'react';
import { X, Upload, File, Folder, Image, Code, FileText, Download } from 'lucide-react';

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[], uploadType: 'files' | 'folder') => void;
  acceptedTypes?: string;
  title?: string;
  description?: string;
}

const UploadDialog: React.FC<UploadDialogProps> = ({
  isOpen,
  onClose,
  onUpload,
  acceptedTypes = '*',
  title = 'Upload Files',
  description = 'Choose files or folders to upload'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState<'files' | 'folder'>('files');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (file.type.includes('text') || file.name.endsWith('.md')) return <FileText className="h-5 w-5 text-green-500" />;
    if (file.name.match(/\.(js|jsx|ts|tsx|py|java|cpp|c|html|css)$/)) return <Code className="h-5 w-5 text-purple-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles, uploadType);
      setSelectedFiles([]);
      onClose();
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-2">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-green-100 text-sm">{description}</p>
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

        <div className="p-6">
          {/* Upload Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Type
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setUploadType('files')}
                className={`flex-1 p-3 border-2 rounded-xl transition-all ${
                  uploadType === 'files'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <File className="h-5 w-5" />
                  <span className="font-semibold">Files</span>
                </div>
              </button>
              <button
                onClick={() => setUploadType('folder')}
                className={`flex-1 p-3 border-2 rounded-xl transition-all ${
                  uploadType === 'folder'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Folder className="h-5 w-5" />
                  <span className="font-semibold">Folder</span>
                </div>
              </button>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Drop {uploadType} here or click to browse
            </p>
            <p className="text-gray-500 mb-4">
              {uploadType === 'files' ? 'Select multiple files' : 'Select an entire folder'}
            </p>
            <div className="space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Files
              </button>
              {uploadType === 'folder' && (
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Browse Folder
                </button>
              )}
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file)}
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}</span>
            </button>
          </div>
        </div>

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={folderInputRef}
          type="file"
          webkitdirectory=""
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadDialog;