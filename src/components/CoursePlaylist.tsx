import React, { useState } from 'react';
import { 
  Play, 
  FileText, 
  Code, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  Edit3, 
  Trash2, 
  MoreVertical,
  Star,
  Download,
  Share,
  Bookmark,
  Eye,
  Lock,
  Users,
  TrendingUp,
  Award,
  Filter,
  Search,
  SortAsc,
  Grid,
  List,
  PlayCircle,
  PauseCircle,
  SkipForward,
  Volume2,
  Settings,
  Maximize,
  Heart,
  MessageCircle,
  ThumbsUp,
  Flag
} from 'lucide-react';
import { Course, CourseItem, UserProgress } from '../types';
import { useCourses } from '../context/CourseContext';
import DeleteDialog from './DeleteDialog';

interface CoursePlaylistProps {
  course: Course;
  activeItemId: string | null;
  onItemSelect: (itemId: string) => void;
  progress?: UserProgress;
}

const CoursePlaylist: React.FC<CoursePlaylistProps> = ({
  course,
  activeItemId,
  onItemSelect,
  progress
}) => {
  const { deleteCourseItem, updateCourseItem } = useCourses();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; itemId: string } | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; itemId: string | null; itemTitle?: string }>({
    isOpen: false,
    itemId: null
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'mcq' | 'coding' | 'pdf'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'duration' | 'type' | 'completion'>('order');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4 text-blue-600" />;
      case 'mcq': return <HelpCircle className="h-4 w-4 text-green-600" />;
      case 'coding': return <Code className="h-4 w-4 text-purple-600" />;
      case 'pdf': return <FileText className="h-4 w-4 text-red-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video';
      case 'mcq': return 'Quiz';
      case 'coding': return 'Coding';
      case 'pdf': return 'Document';
      default: return 'Content';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isItemCompleted = (itemId: string) => {
    return progress?.completedItems.includes(itemId) || false;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const filteredAndSortedItems = course.items
    .filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (!showCompleted && isItemCompleted(item.id)) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'completion':
          const aCompleted = isItemCompleted(a.id);
          const bCompleted = isItemCompleted(b.id);
          return aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
        default:
          return a.order - b.order;
      }
    });

  const completionPercentage = (progress?.completedItems.length || 0) / course.items.length * 100;

  const handleContextMenu = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, itemId });
  };

  const handleRename = (itemId: string) => {
    const item = course.items.find(i => i.id === itemId);
    if (item) {
      setEditingItem(itemId);
      setEditTitle(item.title);
    }
    setContextMenu(null);
  };

  const handleSaveRename = (itemId: string) => {
    if (editTitle.trim()) {
      updateCourseItem(course.id, itemId, { title: editTitle.trim() });
    }
    setEditingItem(null);
    setEditTitle('');
  };

  const handleDelete = (itemId: string) => {
    const item = course.items.find(i => i.id === itemId);
    setDeleteDialog({ 
      isOpen: true, 
      itemId,
      itemTitle: item?.title 
    });
    setContextMenu(null);
  };

  const confirmDelete = () => {
    if (deleteDialog.itemId) {
      deleteCourseItem(course.id, deleteDialog.itemId);
      setDeleteDialog({ isOpen: false, itemId: null });
    }
  };

  React.useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (course.items.length === 0) {
    return (
      <div className="p-6 text-center">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No content added yet</p>
        <p className="text-gray-400 text-xs">Add videos, quizzes, or documents to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Enhanced Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">Course Content</h3>
            <p className="text-sm text-gray-600">{course.items.length} items • {formatDuration(course.totalDuration)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
            >
              {viewMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(completionPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="video">Videos</option>
              <option value="mcq">Quizzes</option>
              <option value="coding">Coding</option>
              <option value="pdf">Documents</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="order">Default Order</option>
              <option value="duration">Duration</option>
              <option value="type">Type</option>
              <option value="completion">Completion</option>
            </select>

            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Show completed</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredAndSortedItems.map((item, index) => {
              const isActive = item.id === activeItemId;
              const isCompleted = isItemCompleted(item.id);
              const isEditing = editingItem === item.id;
              const isBookmarked = bookmarkedItems.has(item.id);
              const isLiked = likedItems.has(item.id);
              
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group relative border-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-blue-500'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 flex items-center space-x-3">
                      <span className={`text-sm font-medium w-8 text-center ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
                        {index + 1}
                      </span>
                      {getItemIcon(item.type)}
                      {isCompleted && (
                        <CheckCircle className={`h-5 w-5 ${isActive ? 'text-green-300' : 'text-green-600'}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0" onClick={() => !isEditing && onItemSelect(item.id)}>
                      <div className="flex items-center justify-between mb-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveRename(item.id)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveRename(item.id)}
                            className="flex-1 px-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        ) : (
                          <h4 className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                            {item.title}
                          </h4>
                        )}
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {item.duration && (
                            <div className="flex items-center space-x-1">
                              <Clock className={`h-4 w-4 ${isActive ? 'text-gray-300' : 'text-gray-400'}`} />
                              <span className={`text-sm ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                                {formatDuration(item.duration)}
                              </span>
                            </div>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(item.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              isBookmarked 
                                ? 'text-yellow-500' 
                                : isActive ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <Bookmark className="h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(item.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              isLiked 
                                ? 'text-red-500' 
                                : isActive ? 'text-gray-300 hover:text-red-300' : 'text-gray-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
                          </button>
                          
                          <button
                            onClick={(e) => handleContextMenu(e, item.id)}
                            className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                              isActive ? 'hover:bg-white hover:bg-opacity-20' : 'hover:bg-gray-200'
                            }`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            isActive 
                              ? 'bg-white bg-opacity-20 text-gray-200' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {getItemTypeLabel(item.type)}
                          </span>
                          
                          {item.content && 'difficulty' in item.content && (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(item.content.difficulty)}`}>
                              {item.content.difficulty}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className={`p-1 rounded transition-colors ${isActive ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                            <Share className="h-3 w-3" />
                          </button>
                          <button className={`p-1 rounded transition-colors ${isActive ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                            <Download className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAndSortedItems.map((item, index) => {
              const isActive = item.id === activeItemId;
              const isCompleted = isItemCompleted(item.id);
              const isBookmarked = bookmarkedItems.has(item.id);
              
              return (
                <div
                  key={item.id}
                  onClick={() => onItemSelect(item.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group border-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-blue-500'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getItemIcon(item.type)}
                      <span className={`text-sm font-medium ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {isCompleted && (
                        <CheckCircle className={`h-4 w-4 ${isActive ? 'text-green-300' : 'text-green-600'}`} />
                      )}
                      {isBookmarked && (
                        <Bookmark className="h-4 w-4 text-yellow-500" fill="currentColor" />
                      )}
                    </div>
                  </div>
                  
                  <h4 className={`font-semibold mb-2 line-clamp-2 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isActive 
                        ? 'bg-white bg-opacity-20 text-gray-200' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getItemTypeLabel(item.type)}
                    </span>
                    
                    {item.duration && (
                      <div className="flex items-center space-x-1">
                        <Clock className={`h-3 w-3 ${isActive ? 'text-gray-300' : 'text-gray-400'}`} />
                        <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                          {formatDuration(item.duration)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleRename(contextMenu.itemId)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Rename</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <Flag className="h-4 w-4" />
            <span>Report</span>
          </button>
          <hr className="my-2 border-gray-200" />
          <button 
            onClick={() => handleDelete(contextMenu.itemId)}
            className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors flex items-center space-x-2 text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Content"
        message={`Are you sure you want to delete "${deleteDialog.itemTitle}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, itemId: null })}
      />
    </div>
  );
};

export default CoursePlaylist;