import React, { useState } from 'react';
import { Plus, BookOpen, Play, FileText, Code, HelpCircle, Edit, Trash2 } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import CourseList from './CourseList';
import CourseForm from './CourseForm';
import CourseViewer from './CourseViewer';
import DeleteDialog from './DeleteDialog';

const CourseManagement = () => {
  const { courses, deleteCourse } = useCourses();
  const [activeView, setActiveView] = useState<'list' | 'create' | 'view'>('list');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; courseId: string | null }>({
    isOpen: false,
    courseId: null
  });

  const handleCreateCourse = () => {
    setActiveView('create');
    setSelectedCourseId(null);
  };

  const handleViewCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveView('view');
  };

  const handleBackToList = () => {
    setActiveView('list');
    setSelectedCourseId(null);
  };

  const handleDeleteCourse = (courseId: string) => {
    setDeleteDialog({ isOpen: true, courseId });
  };

  const confirmDelete = () => {
    if (deleteDialog.courseId) {
      deleteCourse(deleteDialog.courseId);
      setDeleteDialog({ isOpen: false, courseId: null });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-8 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-xl p-3">
              <BookOpen className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Course Management</h1>
              <p className="text-gray-300 text-lg">{courses.length} courses created</p>
            </div>
          </div>
          
          {activeView === 'list' && (
            <button
              onClick={handleCreateCourse}
              className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Create Course</span>
            </button>
          )}
          
          {activeView !== 'list' && (
            <button
              onClick={handleBackToList}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Back to Courses
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {activeView === 'list' && (
          <CourseList 
            onViewCourse={handleViewCourse} 
            onDeleteCourse={handleDeleteCourse}
          />
        )}
        
        {activeView === 'create' && (
          <CourseForm onComplete={handleBackToList} />
        )}
        
        {activeView === 'view' && selectedCourseId && (
          <CourseViewer courseId={selectedCourseId} />
        )}
      </div>

      {/* Stats Footer */}
      {activeView === 'list' && courses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl mt-8 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-4">
                <Play className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.items.filter(item => item.type === 'video').length, 0)}
              </p>
              <p className="text-sm text-gray-600 font-medium">Videos</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-xl mx-auto mb-4">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.items.filter(item => item.type === 'mcq').length, 0)}
              </p>
              <p className="text-sm text-gray-600 font-medium">MCQs</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-500 rounded-xl mx-auto mb-4">
                <Code className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.items.filter(item => item.type === 'coding').length, 0)}
              </p>
              <p className="text-sm text-gray-600 font-medium">Coding</p>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-xl">
              <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-xl mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.items.filter(item => item.type === 'pdf').length, 0)}
              </p>
              <p className="text-sm text-gray-600 font-medium">PDFs</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will remove all associated content."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, courseId: null })}
      />
    </div>
  );
};

export default CourseManagement;