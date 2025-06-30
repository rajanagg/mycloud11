import React from 'react';
import { Play, Clock, BookOpen, Eye, Trash2, Edit } from 'lucide-react';
import { useCourses } from '../context/CourseContext';

interface CourseListProps {
  onViewCourse: (courseId: string) => void;
  onDeleteCourse: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ onViewCourse, onDeleteCourse }) => {
  const { courses, getUserProgress } = useCourses();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">No courses yet</h3>
        <p className="text-gray-500 text-lg mb-8">Create your first course to get started on your learning journey</p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-sm text-gray-600">
            💡 Tip: Start with a simple course structure and add content gradually
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Courses</h2>
          <p className="text-gray-600 mt-2">
            {courses.length} course{courses.length !== 1 ? 's' : ''} • 
            {courses.reduce((sum, course) => sum + course.items.length, 0)} total items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          const progress = getUserProgress(course.id);
          const progressPercentage = progress?.progressPercentage || 0;
          
          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group border border-gray-100"
            >
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    course.isPublished 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-black transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{course.items.length} items</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{formatDuration(course.totalDuration)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {progressPercentage > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                    {course.tags.length > 3 && (
                      <span className="text-gray-500 text-xs font-medium">+{course.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onViewCourse(course.id)}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Course</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCourse(course.id)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseList;