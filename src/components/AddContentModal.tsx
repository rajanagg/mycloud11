import React, { useState } from 'react';
import { X, Plus, Trash2, FileText, Play, HelpCircle, Code } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { MCQOption, SolutionFile } from '../types';

interface AddContentModalProps {
  courseId: string;
  onClose: () => void;
}

const AddContentModal: React.FC<AddContentModalProps> = ({ courseId, onClose }) => {
  const { addCourseItem, uploadFile } = useCourses();
  const [activeTab, setActiveTab] = useState<'video' | 'mcq' | 'coding' | 'pdf'>('video');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Video form state
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    url: '',
    duration: 0,
    thumbnail: '',
    quality: ['720p', '1080p'],
  });

  // MCQ form state
  const [mcqData, setMCQData] = useState({
    title: '',
    question: '',
    questionImage: '',
    options: [
      { id: crypto.randomUUID(), text: '', image: '', isCorrect: false },
      { id: crypto.randomUUID(), text: '', image: '', isCorrect: false },
    ] as (MCQOption & { image?: string })[],
    explanation: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    tags: [] as string[],
  });

  // Coding form state
  const [codingData, setCodingData] = useState({
    title: '',
    description: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    sampleInput: '',
    sampleOutput: '',
    constraints: '',
    solutionFiles: [] as SolutionFile[],
    tags: [] as string[],
  });

  // PDF form state
  const [pdfData, setPDFData] = useState({
    title: '',
    description: '',
    url: '',
    pages: 1,
    size: 0,
  });

  const [tagInput, setTagInput] = useState('');

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    simulateUploadProgress();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      addCourseItem(courseId, {
        title: videoData.title,
        type: 'video',
        content: {
          id: crypto.randomUUID(),
          title: videoData.title,
          description: videoData.description,
          url: videoData.url,
          duration: videoData.duration,
          thumbnail: videoData.thumbnail,
          quality: videoData.quality,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        duration: videoData.duration,
        updatedAt: new Date()
      });
      onClose();
    } catch (error) {
      console.error('Error adding video:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleMCQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      addCourseItem(courseId, {
        title: mcqData.title,
        type: 'mcq',
        content: {
          id: crypto.randomUUID(),
          question: mcqData.question,
          questionImage: mcqData.questionImage,
          options: mcqData.options.map(({ image, ...option }) => option),
          explanation: mcqData.explanation,
          difficulty: mcqData.difficulty,
          tags: mcqData.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        duration: 5,
        updatedAt: new Date()
      });
      onClose();
    } catch (error) {
      console.error('Error adding MCQ:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCodingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      addCourseItem(courseId, {
        title: codingData.title,
        type: 'coding',
        content: {
          id: crypto.randomUUID(),
          title: codingData.title,
          description: codingData.description,
          difficulty: codingData.difficulty,
          sampleInput: codingData.sampleInput,
          sampleOutput: codingData.sampleOutput,
          constraints: codingData.constraints,
          solutionFiles: codingData.solutionFiles,
          tags: codingData.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        duration: 30,
        updatedAt: new Date()
      });
      onClose();
    } catch (error) {
      console.error('Error adding coding question:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePDFSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    simulateUploadProgress();

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
      addCourseItem(courseId, {
        title: pdfData.title,
        type: 'pdf',
        content: {
          id: crypto.randomUUID(),
          title: pdfData.title,
          description: pdfData.description,
          url: pdfData.url,
          pages: pdfData.pages,
          size: pdfData.size,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        duration: pdfData.pages * 2,
        updatedAt: new Date()
      });
      onClose();
    } catch (error) {
      console.error('Error adding PDF:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const addMCQOption = () => {
    setMCQData(prev => ({
      ...prev,
      options: [...prev.options, { id: crypto.randomUUID(), text: '', image: '', isCorrect: false }]
    }));
  };

  const removeMCQOption = (optionId: string) => {
    setMCQData(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== optionId)
    }));
  };

  const updateMCQOption = (optionId: string, updates: Partial<MCQOption & { image?: string }>) => {
    setMCQData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === optionId ? { ...opt, ...updates } : opt
      )
    }));
  };

  const addSolutionFile = () => {
    const newFile: SolutionFile = {
      id: crypto.randomUUID(),
      name: '',
      content: '',
      language: 'javascript',
      type: 'file',
    };
    setCodingData(prev => ({
      ...prev,
      solutionFiles: [...prev.solutionFiles, newFile]
    }));
  };

  const removeSolutionFile = (fileId: string) => {
    setCodingData(prev => ({
      ...prev,
      solutionFiles: prev.solutionFiles.filter(file => file.id !== fileId)
    }));
  };

  const updateSolutionFile = (fileId: string, updates: Partial<SolutionFile>) => {
    setCodingData(prev => ({
      ...prev,
      solutionFiles: prev.solutionFiles.map(file => 
        file.id === fileId ? { ...file, ...updates } : file
      )
    }));
  };

  const handleFileUpload = async (file: File, type: 'video' | 'pdf' | 'solution' | 'image', targetId?: string) => {
    try {
      setIsUploading(true);
      if (type === 'video' || type === 'pdf') {
        simulateUploadProgress();
      }
      
      const url = await uploadFile(file);
      
      if (type === 'video') {
        setVideoData(prev => ({ ...prev, url, thumbnail: url }));
      } else if (type === 'pdf') {
        setPDFData(prev => ({ ...prev, url, size: file.size, pages: Math.ceil(file.size / 50000) }));
      } else if (type === 'image' && targetId) {
        if (targetId === 'question') {
          setMCQData(prev => ({ ...prev, questionImage: url }));
        } else {
          updateMCQOption(targetId, { image: url });
        }
      } else if (type === 'solution' && targetId) {
        updateSolutionFile(targetId, { 
          url, 
          type: file.type.startsWith('image/') ? 'image' : 'file',
          content: file.type.startsWith('image/') ? '' : await file.text()
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFolderUpload = async (files: FileList, solutionFileId: string) => {
    const fileArray = Array.from(files);
    const folderStructure: SolutionFile[] = [];

    setIsUploading(true);
    simulateUploadProgress();

    try {
      for (const file of fileArray) {
        const newFile: SolutionFile = {
          id: crypto.randomUUID(),
          name: file.name,
          content: file.type.startsWith('image/') ? '' : await file.text(),
          language: getLanguageFromExtension(file.name),
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(file)
        };
        folderStructure.push(newFile);
      }

      setCodingData(prev => ({
        ...prev,
        solutionFiles: prev.solutionFiles.map(file => 
          file.id === solutionFileId 
            ? { ...file, type: 'folder', content: JSON.stringify(folderStructure) }
            : file
        )
      }));
    } catch (error) {
      console.error('Error uploading folder:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown'
    };
    return languageMap[ext || ''] || 'text';
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Add Course Content</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { id: 'video', label: 'Video Content', icon: Play, color: 'blue' },
            { id: 'mcq', label: 'MCQ Quiz', icon: HelpCircle, color: 'green' },
            { id: 'coding', label: 'Coding Challenge', icon: Code, color: 'purple' },
            { id: 'pdf', label: 'PDF Document', icon: FileText, color: 'red' },
          ].map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all flex items-center justify-center space-x-3 ${
                activeTab === id
                  ? `text-${color}-600 border-b-2 border-${color}-600 bg-white`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Video Form */}
          {activeTab === 'video' && (
            <form onSubmit={handleVideoSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Video Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={videoData.title}
                      onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter video title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={videoData.duration}
                      onChange={(e) => setVideoData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={videoData.description}
                    onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what this video covers..."
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video File *
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {/* Upload Progress Bar */}
                  {isUploading && uploadProgress > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Uploading video...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isUploading ? 'Adding...' : 'Add Video'}
                </button>
              </div>
            </form>
          )}

          {/* Enhanced MCQ Form */}
          {activeTab === 'mcq' && (
            <form onSubmit={handleMCQSubmit} className="space-y-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Question Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={mcqData.title}
                      onChange={(e) => setMCQData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter a descriptive title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={mcqData.difficulty}
                      onChange={(e) => setMCQData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={mcqData.question}
                    onChange={(e) => setMCQData(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your question here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Image (Optional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image', 'question')}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {mcqData.questionImage && (
                      <img
                        src={mcqData.questionImage}
                        alt="Question"
                        className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-green-900">Answer Options</h3>
                  <button
                    type="button"
                    onClick={addMCQOption}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Option</span>
                  </button>
                </div>
                
                <div className="space-y-4">
                  {mcqData.options.map((option, index) => (
                    <div key={option.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => updateMCQOption(option.id, { isCorrect: e.target.checked })}
                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            required
                            value={option.text}
                            onChange={(e) => updateMCQOption(option.id, { text: e.target.value })}
                            placeholder={`Option ${index + 1}`}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                          
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image', option.id)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            {option.image && (
                              <img
                                src={option.image}
                                alt={`Option ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                              />
                            )}
                          </div>
                        </div>
                        
                        {mcqData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeMCQOption(option.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Explanation</h3>
                <textarea
                  required
                  rows={4}
                  value={mcqData.explanation}
                  onChange={(e) => setMCQData(prev => ({ ...prev, explanation: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Provide a detailed explanation for the correct answer..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isUploading ? 'Adding...' : 'Add MCQ'}
                </button>
              </div>
            </form>
          )}

          {/* Enhanced Coding Form */}
          {activeTab === 'coding' && (
            <form onSubmit={handleCodingSubmit} className="space-y-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">Problem Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={codingData.title}
                      onChange={(e) => setCodingData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter problem title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={codingData.difficulty}
                      onChange={(e) => setCodingData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problem Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={codingData.description}
                    onChange={(e) => setCodingData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe the problem in detail..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Sample Input</h3>
                  <textarea
                    required
                    rows={4}
                    value={codingData.sampleInput}
                    onChange={(e) => setCodingData(prev => ({ ...prev, sampleInput: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter sample input..."
                  />
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Sample Output</h3>
                  <textarea
                    required
                    rows={4}
                    value={codingData.sampleOutput}
                    onChange={(e) => setCodingData(prev => ({ ...prev, sampleOutput: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                    placeholder="Enter expected output..."
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">Constraints</h3>
                <textarea
                  required
                  rows={3}
                  value={codingData.constraints}
                  onChange={(e) => setCodingData(prev => ({ ...prev, constraints: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter problem constraints..."
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Solution Files</h3>
                  <button
                    type="button"
                    onClick={addSolutionFile}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Solution</span>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {codingData.solutionFiles.map((file) => (
                    <div key={file.id} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                          type="text"
                          value={file.name}
                          onChange={(e) => updateSolutionFile(file.id, { name: e.target.value })}
                          placeholder="File name"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <select
                          value={file.language}
                          onChange={(e) => updateSolutionFile(file.id, { language: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="javascript">JavaScript</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="cpp">C++</option>
                          <option value="c">C</option>
                        </select>
                        <select
                          value={file.type}
                          onChange={(e) => updateSolutionFile(file.id, { type: e.target.value as any })}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="file">Single File</option>
                          <option value="folder">Folder</option>
                          <option value="image">Image</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSolutionFile(file.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {file.type === 'folder' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Folder
                          </label>
                          <input
                            type="file"
                            multiple
                            data-webkitdirectory="true"
                            onChange={(e) => e.target.files && handleFolderUpload(e.target.files, file.id)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          {isUploading && uploadProgress > 0 && (
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Uploading folder...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : file.type === 'image' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Image
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'solution', file.id)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          {file.url && (
                            <img src={file.url} alt={file.name} className="mt-4 max-w-full h-auto rounded-lg" />
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code Content
                          </label>
                          <textarea
                            value={file.content}
                            onChange={(e) => updateSolutionFile(file.id, { content: e.target.value })}
                            placeholder="Enter solution code..."
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                          />
                          <div className="mt-2">
                            <input
                              type="file"
                              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'solution', file.id)}
                              className="text-sm text-gray-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isUploading ? 'Adding...' : 'Add Coding Challenge'}
                </button>
              </div>
            </form>
          )}

          {/* PDF Form */}
          {activeTab === 'pdf' && (
            <form onSubmit={handlePDFSubmit} className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Document Details</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={pdfData.title}
                    onChange={(e) => setPDFData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter document title"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={pdfData.description}
                    onChange={(e) => setPDFData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe the document content..."
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF File *
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  
                  {/* Upload Progress Bar */}
                  {isUploading && uploadProgress > 0 && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Uploading PDF...</span>
                        <span>{Math.round(uploadProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {isUploading ? 'Adding...' : 'Add PDF'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContentModal;