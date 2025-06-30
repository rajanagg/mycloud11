import React, { useState } from 'react';
import { Play, FileText, Code, HelpCircle, Plus, List, Settings } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import CoursePlaylist from './CoursePlaylist';
import ContentViewer from './ContentViewer';
import AddContentModal from './AddContentModal';

interface CourseViewerProps {
  courseId: string;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ courseId }) => {
  const { getCourse, getUserProgress } = useCourses();
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [showAddContent, setShowAddContent] = useState(false);
  const [activeTab, setActiveTab] = useState<'playlist' | 'content'>('playlist');

  const course = getCourse(courseId);
  const progress = getUserProgress(courseId);

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  const activeItem = activeItemId ? course.items.find(item => item.id === activeItemId) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen max-h-screen">
      {/* Course Info & Playlist */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <h1 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 text-sm mb-4">{course.description}</p>
          
          {/* Progress */}
          {progress && progress.progressPercentage > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress.progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-black h-2 rounded-full"
                  style={{ width: `${progress.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-1 mb-4">
            <button
              onClick={() => setActiveTab('playlist')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'playlist'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="h-4 w-4 inline mr-2" />
              Playlist
            </button>
            <button
              onClick={() => setShowAddContent(true)}
              className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Playlist */}
        <div className="flex-1 overflow-y-auto">
          <CoursePlaylist
            course={course}
            activeItemId={activeItemId}
            onItemSelect={setActiveItemId}
            progress={progress}
          />
        </div>
      </div>

      {/* Content Viewer */}
      <div className="lg:col-span-2">
        {activeItem ? (
          <ContentViewer
            courseId={courseId}
            item={activeItem}
            progress={progress}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center h-full flex items-center justify-center">
            <div>
              <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select content to view
              </h3>
              <p className="text-gray-500">
                Choose an item from the playlist to start learning
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Content Modal */}
      {showAddContent && (
        <AddContentModal
          courseId={courseId}
          onClose={() => setShowAddContent(false)}
        />
      )}
    </div>
  );
};

export default CourseViewer;