import React, { useState } from 'react';
import { Upload, X, Plus, Star, Globe, Lock, Image, Tag, User, BookOpen, Clock, Target } from 'lucide-react';
import { useCourses } from '../context/CourseContext';

interface CourseFormProps {
  onComplete: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ onComplete }) => {
  const { addCourse } = useCourses();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tags: [] as string[],
    isPublished: false,
  });
  const [thumbnail, setThumbnail] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Info', icon: BookOpen },
    { id: 2, title: 'Details', icon: Target },
    { id: 3, title: 'Customize', icon: Star },
    { id: 4, title: 'Review', icon: Globe }
  ];

  const difficulties = [
    { 
      id: 'beginner', 
      label: 'Beginner', 
      color: 'bg-green-500',
      description: 'Perfect for newcomers with no prior experience',
      icon: '🌱'
    },
    { 
      id: 'intermediate', 
      label: 'Intermediate', 
      color: 'bg-yellow-500',
      description: 'For those with some basic knowledge',
      icon: '🚀'
    },
    { 
      id: 'advanced', 
      label: 'Advanced', 
      color: 'bg-red-500',
      description: 'For experienced learners seeking mastery',
      icon: '⚡'
    }
  ];

  const suggestedThumbnails = [
    'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseId = addCourse({
      ...formData,
      thumbnail: thumbnail || suggestedThumbnails[0],
    });
    
    onComplete();
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnail(url);
    }
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

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Let's start with the basics</h3>
              <p className="text-gray-600">Tell us about your course</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Course Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                placeholder="e.g., Complete JavaScript Masterclass"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Instructor Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  placeholder="Your name"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Course Details</h3>
              <p className="text-gray-600">Describe what students will learn</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Course Description
              </label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                placeholder="Describe what students will learn, what skills they'll gain, and what makes your course unique..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Difficulty Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((difficulty) => (
                  <div
                    key={difficulty.id}
                    onClick={() => setFormData(prev => ({ ...prev, difficulty: difficulty.id as any }))}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.difficulty === difficulty.id
                        ? 'border-black bg-gray-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">{difficulty.icon}</div>
                      <div className={`${difficulty.color} rounded-lg p-2 mx-auto mb-3 w-fit`}>
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{difficulty.label}</h3>
                      <p className="text-sm text-gray-600">{difficulty.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Course</h3>
              <p className="text-gray-600">Add visual appeal and organize with tags</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Course Thumbnail
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Thumbnail preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                    />
                  )}
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-3">Or choose from suggested images:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {suggestedThumbnails.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Suggested ${index + 1}`}
                        onClick={() => setThumbnail(url)}
                        className={`w-full h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                          thumbnail === url ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Add a tag (e.g., JavaScript, Web Development)"
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-black text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-gray-700 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Publish</h3>
              <p className="text-gray-600">Everything looks good? Let's create your course!</p>
            </div>

            {/* Course Preview */}
            <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-start space-x-6">
                <img
                  src={thumbnail || suggestedThumbnails[0]}
                  alt="Course thumbnail"
                  className="w-32 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title || 'Course Title'}</h4>
                  <p className="text-gray-600 mb-3">{formData.instructor || 'Instructor Name'}</p>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      formData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formData.difficulty}
                    </span>
                    {formData.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-2">{formData.description}</p>
                </div>
              </div>
            </div>

            {/* Publish Status */}
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                {formData.isPublished ? (
                  <Globe className="h-6 w-6 text-green-600" />
                ) : (
                  <Lock className="h-6 w-6 text-gray-600" />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {formData.isPublished ? 'Publish Immediately' : 'Save as Draft'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formData.isPublished 
                      ? 'Course will be visible to students right away' 
                      : 'You can publish later when ready'
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Create New Course</h2>
              <p className="text-gray-300">Step {currentStep} of 4</p>
            </div>
            <button
              onClick={onComplete}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  currentStep >= step.id 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'text-gray-400'
                }`}>
                  <step.icon className="h-5 w-5" />
                  <span className="font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-white bg-opacity-40' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
              >
                Create Course
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;