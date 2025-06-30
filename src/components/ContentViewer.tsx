import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  FileText, 
  Download, 
  Copy, 
  CheckCircle, 
  X, 
  RotateCcw,
  SkipBack,
  SkipForward,
  Settings,
  Subtitles,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Minimize,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Search,
  Bookmark,
  Share,
  Printer,
  FolderOpen,
  Folder,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';
import { CourseItem, UserProgress, VideoContent, MCQQuestion, CodingQuestion, PDFContent, SolutionFile } from '../types';
import { useCourses } from '../context/CourseContext';

interface ContentViewerProps {
  courseId: string;
  item: CourseItem;
  progress?: UserProgress;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ courseId, item, progress }) => {
  const { markItemComplete, recordMCQAttempt } = useCourses();

  const renderVideoPlayer = (content: VideoContent) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [quality, setQuality] = useState('1080p');
    const [showSubtitles, setShowSubtitles] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleComplete = () => {
      markItemComplete(courseId, item.id);
    };

    const togglePlay = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const handleSeek = (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    };

    const skipTime = (seconds: number) => {
      if (videoRef.current) {
        const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
        handleSeek(newTime);
      }
    };

    const toggleFullscreen = () => {
      if (videoRef.current) {
        if (!isFullscreen) {
          videoRef.current.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
      }
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative bg-black aspect-video group">
          <video
            ref={videoRef}
            className="w-full h-full"
            poster={content.thumbnail}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={handleComplete}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <source src={content.url} type="video/mp4" />
          </video>
          
          {/* Enhanced Video Controls */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-all"
              >
                {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white ml-1" />}
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </button>
                  
                  <button
                    onClick={() => skipTime(-10)}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <SkipBack className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => skipTime(10)}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <SkipForward className="h-5 w-5" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="bg-black/50 text-white text-sm rounded px-2 py-1 border-none"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                  
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="bg-black/50 text-white text-sm rounded px-2 py-1 border-none"
                  >
                    {content.quality.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={`text-white hover:text-gray-300 transition-colors ${showSubtitles ? 'bg-white/20 rounded' : ''} p-1`}
                  >
                    <Subtitles className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
          <p className="text-gray-600 mb-4">{content.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Duration: {formatTime(content.duration)}</span>
            <div className="flex items-center space-x-2">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                <Bookmark className="h-4 w-4" />
                <span>Bookmark</span>
              </button>
              <button
                onClick={handleComplete}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark Complete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdvancedPDFViewer = (content: PDFContent) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [viewMode, setViewMode] = useState<'portrait' | 'landscape'>('portrait');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [showThumbnails, setShowThumbnails] = useState(false);

    const handleComplete = () => {
      markItemComplete(courseId, item.id);
    };

    const downloadPDF = () => {
      const link = document.createElement('a');
      link.href = content.url;
      link.download = `${content.title}.pdf`;
      link.click();
    };

    const printPDF = () => {
      window.open(content.url, '_blank');
    };

    const sharePDF = () => {
      if (navigator.share) {
        navigator.share({
          title: content.title,
          url: content.url
        });
      }
    };

    const rotatePDF = (direction: 'left' | 'right') => {
      setRotation(prev => {
        const newRotation = direction === 'left' ? prev - 90 : prev + 90;
        return newRotation >= 360 ? 0 : newRotation < 0 ? 270 : newRotation;
      });
    };

    const goToPage = (page: number) => {
      setCurrentPage(Math.max(1, Math.min(content.pages, page)));
    };

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
              <p className="text-sm text-gray-600">{content.description}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className={`p-2 rounded-lg transition-colors ${
                  showThumbnails ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Thumbnails"
              >
                <Folder className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('portrait')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'portrait' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'
                  }`}
                  title="Portrait View"
                >
                  📄
                </button>
                <button
                  onClick={() => setViewMode('landscape')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'landscape' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'
                  }`}
                  title="Landscape View"
                >
                  📃
                </button>
              </div>

              <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => rotatePDF('left')}
                  className="p-2 hover:bg-gray-300 rounded transition-colors"
                  title="Rotate Left"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => rotatePDF('right')}
                  className="p-2 hover:bg-gray-300 rounded transition-colors"
                  title="Rotate Right"
                >
                  <RotateCw className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-300 rounded transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={content.pages}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 text-center text-sm border-none bg-transparent"
                />
                <span className="text-sm text-gray-600">/ {content.pages}</span>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === content.pages}
                  className="p-2 hover:bg-gray-300 rounded transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  className="p-2 hover:bg-gray-300 rounded transition-colors"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-3 py-2 text-sm font-medium w-16 text-center">{zoom}%</span>
                <button
                  onClick={() => setZoom(Math.min(300, zoom + 25))}
                  className="p-2 hover:bg-gray-300 rounded transition-colors"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {showSearch && (
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in document..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex">
          {/* Thumbnails Sidebar */}
          {showThumbnails && (
            <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 max-h-96 overflow-y-auto">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Pages</h4>
              <div className="space-y-2">
                {Array.from({ length: content.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-full p-2 text-left text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Page {page}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PDF Viewer */}
          <div className={`flex-1 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-96'} flex items-center justify-center bg-gray-100`}>
            <div 
              className={`bg-white shadow-lg ${viewMode === 'landscape' ? 'w-full max-w-6xl' : 'max-w-2xl'}`}
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            >
              <iframe
                src={`${content.url}#page=${currentPage}&zoom=${zoom}`}
                className={`w-full border-0 ${viewMode === 'landscape' ? 'h-96' : 'h-[500px]'}`}
                title={content.title}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Size: {(content.size / 1024 / 1024).toFixed(2)} MB • {content.pages} pages
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={sharePDF}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
              
              <button
                onClick={printPDF}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              
              <button
                onClick={downloadPDF}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              
              <button
                onClick={handleComplete}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark Complete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMCQViewer = (content: MCQQuestion) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [showSolution, setShowSolution] = useState(false);
    const [hasAttempted, setHasAttempted] = useState(false);

    const handleOptionSelect = (optionId: string) => {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    };

    const handleSubmit = () => {
      const correctOptions = content.options.filter(opt => opt.isCorrect).map(opt => opt.id);
      const isCorrect = selectedOptions.length === correctOptions.length && 
                       selectedOptions.every(id => correctOptions.includes(id));
      
      recordMCQAttempt(courseId, item.id, selectedOptions, isCorrect);
      setHasAttempted(true);
      setShowSolution(true);
      
      if (isCorrect) {
        markItemComplete(courseId, item.id);
      }
    };

    const handleReset = () => {
      setSelectedOptions([]);
      setShowSolution(false);
      setHasAttempted(false);
    };

    const correctOptions = content.options.filter(opt => opt.isCorrect).map(opt => opt.id);
    const isCorrect = hasAttempted && selectedOptions.length === correctOptions.length && 
                     selectedOptions.every(id => correctOptions.includes(id));

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{content.question}</h3>
          
          {content.questionImage && (
            <div className="mb-6">
              <img
                src={content.questionImage}
                alt="Question"
                className="max-w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
          )}
          
          <div className="space-y-3">
            {content.options.map((option, index) => (
              <div
                key={option.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedOptions.includes(option.id)
                    ? 'border-black bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  showSolution && option.isCorrect
                    ? 'border-green-500 bg-green-50'
                    : showSolution && selectedOptions.includes(option.id) && !option.isCorrect
                    ? 'border-red-500 bg-red-50'
                    : ''
                }`}
                onClick={() => !showSolution && handleOptionSelect(option.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedOptions.includes(option.id)
                      ? 'border-black bg-black'
                      : 'border-gray-300'
                  }`}>
                    {selectedOptions.includes(option.id) && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option.text}</span>
                  {showSolution && option.isCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                  )}
                  {showSolution && selectedOptions.includes(option.id) && !option.isCorrect && (
                    <X className="h-5 w-5 text-red-600 ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showSolution && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
            <p className="text-blue-800">{content.explanation}</p>
            {hasAttempted && (
              <div className={`mt-3 p-2 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isCorrect ? '✅ Correct! Well done.' : '❌ Incorrect. Review the explanation above.'}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              content.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              content.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {content.difficulty}
            </span>
          </div>
          
          <div className="flex space-x-3">
            {showSolution && (
              <button
                onClick={handleReset}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
            )}
            {!showSolution ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={() => setShowSolution(false)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Hide Solution
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAdvancedCodeViewer = (content: CodingQuestion) => {
    const [copiedFile, setCopiedFile] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<SolutionFile | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

    const handleCopyContent = (fileContent: string, fileName: string) => {
      navigator.clipboard.writeText(fileContent);
      setCopiedFile(fileName);
      setTimeout(() => setCopiedFile(null), 2000);
    };

    const handleComplete = () => {
      markItemComplete(courseId, item.id);
    };

    const renderFileTree = (files: SolutionFile[], level = 0) => {
      return files.map((file) => {
        if (file.type === 'folder') {
          const folderFiles = JSON.parse(file.content || '[]') as SolutionFile[];
          const isExpanded = expandedFolders.has(file.id);
          
          return (
            <div key={file.id} style={{ marginLeft: `${level * 20}px` }}>
              <button
                onClick={() => {
                  const newExpanded = new Set(expandedFolders);
                  if (isExpanded) {
                    newExpanded.delete(file.id);
                  } else {
                    newExpanded.add(file.id);
                  }
                  setExpandedFolders(newExpanded);
                }}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg w-full text-left"
              >
                {isExpanded ? <FolderOpen className="h-4 w-4 text-blue-600" /> : <Folder className="h-4 w-4 text-blue-600" />}
                <span className="font-medium">{file.name}</span>
              </button>
              {isExpanded && renderFileTree(folderFiles, level + 1)}
            </div>
          );
        }
        
        return (
          <button
            key={file.id}
            onClick={() => setSelectedFile(file)}
            className={`flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg w-full text-left ${
              selectedFile?.id === file.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
            }`}
            style={{ marginLeft: `${level * 20}px` }}
          >
            {file.type === 'image' ? (
              <Image className="h-4 w-4 text-green-600" />
            ) : (
              <FileText className="h-4 w-4 text-gray-600" />
            )}
            <span>{file.name}</span>
          </button>
        );
      });
    };

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{content.title}</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Problem Description:</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{content.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Sample Input:</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{content.sampleInput}</pre>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Sample Output:</h4>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <pre>{content.sampleOutput}</pre>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Constraints:</h4>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-yellow-800 whitespace-pre-wrap">{content.constraints}</p>
          </div>
        </div>

        {content.solutionFiles.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Solution Files:</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* File Tree */}
              <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <h5 className="font-medium text-gray-700 mb-3">Files</h5>
                <div className="space-y-1">
                  {renderFileTree(content.solutionFiles)}
                </div>
              </div>

              {/* Code Viewer */}
              <div className="lg:col-span-2">
                {selectedFile ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b">
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{selectedFile.name}</span>
                        <span className="text-sm text-gray-500">({selectedFile.language})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyContent(selectedFile.content, selectedFile.name)}
                          className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-gray-200"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="text-sm">
                            {copiedFile === selectedFile.name ? 'Copied!' : 'Copy'}
                          </span>
                        </button>
                        {selectedFile.url && (
                          <a
                            href={selectedFile.url}
                            download={selectedFile.name}
                            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-gray-200"
                          >
                            <Download className="h-4 w-4" />
                            <span className="text-sm">Download</span>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {selectedFile.type === 'image' && selectedFile.url ? (
                      <div className="p-4">
                        <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full h-auto rounded" />
                      </div>
                    ) : (
                      <div className="bg-gray-900 text-gray-100 p-4 overflow-x-auto max-h-96">
                        <pre className="text-sm font-mono whitespace-pre-wrap">{selectedFile.content}</pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-8 text-center">
                    <Code className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a file to view its content</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              content.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              content.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {content.difficulty}
            </span>
            {content.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          
          <button
            onClick={handleComplete}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Mark Complete</span>
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (item.type) {
      case 'video':
        return renderVideoPlayer(item.content as VideoContent);
      case 'mcq':
        return renderMCQViewer(item.content as MCQQuestion);
      case 'coding':
        return renderAdvancedCodeViewer(item.content as CodingQuestion);
      case 'pdf':
        return renderAdvancedPDFViewer(item.content as PDFContent);
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-500">Unsupported content type</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default ContentViewer;