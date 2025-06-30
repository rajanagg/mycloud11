import React, { useState } from 'react';
import { X, BookOpen, User, Tag, Globe, Lock, Star } from 'lucide-react';

interface CourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (courseData: any) => void;
  mode: 'create' | 'edit';
  initialData?: any;
}

const CourseDialog: React.FC<CourseDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  mode,
  initialData = {}
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    difficulty: 'beginner',
    tags: [],
    isPublished: false,
    thumbnail: '',
    ...initialData
  });
  const [tagInput, setTagInput] = useState('');

  const difficulties = [
    { id: 'beginner', label: 'Beginner', color: 'bg-green-500', description: 'Perfect for newcomers' },
    { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500', description: 'Some experience required' },
    { id: 'advanced', label: 'Advanced', color: 'bg-red-500', description: 'For experienced learners' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-xl p-2">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {mode === 'create' ? 'Create New Course' : 'Edit Course'}
                </h2>
                <p className="text-purple-100 text-sm">
                  {mode === 'create' ? 'Share your knowledge with the world' : 'Update course information'}
                </p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter course title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Instructor Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter instructor name"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Describe what students will learn in this course..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: difficulty.id }))}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.difficulty === difficulty.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className={`${difficulty.color} rounded-lg p-2 mx-auto mb-2 w-fit`}>
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{difficulty.label}</h3>
                    <p className="text-xs text-gray-600">{difficulty.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Thumbnail URL
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
            />
            {formData.thumbnail && (
              <div className="mt-3">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="w-32 h-20 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex items-center space-x-2 mb-3">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Add a tag"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-purple-200 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              {formData.isPublished ? (
                <Globe className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-gray-600" />
              )}
              <div>
                <h4 className="font-semibold text-gray-900">
                  {formData.isPublished ? 'Published' : 'Draft'}
                </h4>
                <p className="text-sm text-gray-600">
                  {formData.isPublished 
                    ? 'Course is visible to students' 
                    : 'Course is saved as draft'
                  }
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              {mode === 'create' ? 'Create Course' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseDialog;