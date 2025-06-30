import React, { useState } from 'react';
import { 
  Target, 
  BookOpen, 
  Code, 
  FileText, 
  Settings, 
  User, 
  Search,
  Plus,
  TrendingUp,
  Clock,
  Award,
  Users,
  Play,
  Edit3,
  Terminal,
  MessageCircle,
  Zap,
  Database,
  BarChart,
  PieChart,
  Activity,
  Globe,
  Layers,
  Grid,
  List,
  Filter,
  Star,
  Heart,
  Bookmark,
  Share,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Calendar,
  Map,
  Compass,
  Lightbulb,
  Rocket,
  Shield,
  Wifi,
  Battery,
  Volume2,
  Camera,
  Mic,
  Video,
  Image,
  Music,
  Headphones,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  Mouse,
  Keyboard,
  Gamepad2,
  Tv,
  Radio,
  Watch,
  Glasses,
  Briefcase,
  Coffee,
  Home,
  Car,
  Plane,
  Train,
  Bike,
  Ship,
  Bus,
  Truck,
  Taxi,
  Fuel,
  MapPin,
  Navigation,
  Anchor,
  Flag,
  Mountain,
  Trees,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Umbrella,
  Thermometer,
  Wind,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  CreditCard,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Bitcoin,
  TrendingDown,
  BarChart2,
  LineChart,
  PieChart as PieChartIcon,
  Percent,
  Calculator,
  Hash,
  AtSign,
  Phone,
  Mail,
  MessageSquare,
  Send,
  Inbox,
  Archive,
  Trash,
  Edit,
  Copy,
  Cut,
  Clipboard,
  Save,
  FolderOpen,
  Folder,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FilePlus,
  FolderPlus,
  HardDrive,
  Cpu,
  Memory,
  Wifi as WifiIcon,
  Bluetooth,
  Usb,
  Power,
  PowerOff,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Scissors,
  PaintBucket,
  Brush,
  Palette,
  Pipette,
  Ruler,
  Move,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Maximize2,
  Minimize2,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ChevronsUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Menu,
  X,
  Plus as PlusIcon,
  Minus,
  Equal,
  Slash,
  Asterisk,
  Dot,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Diamond,
  Pentagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  Angry,
  Surprised,
  Confused,
  Sleepy,
  Wink,
  Kiss,
  Laugh,
  Cry,
  Dizzy,
  Sick,
  Cool,
  Nerd,
  Sunglasses,
  Mask,
  Robot,
  Alien,
  Ghost,
  Skull,
  Poop,
  Fire,
  Snowflake,
  Droplet,
  Leaf,
  Flower,
  Cactus,
  Seedling,
  Evergreen,
  Deciduous,
  Palm,
  Herb,
  Shamrock,
  Tulip,
  Rose,
  Sunflower,
  Blossom,
  Cherry,
  Grapes,
  Strawberry,
  Orange,
  Lemon,
  Banana,
  Pineapple,
  Apple,
  Pear,
  Peach,
  Cherries,
  Tomato,
  Eggplant,
  Avocado,
  Broccoli,
  Lettuce,
  Cucumber,
  Pepper,
  Corn,
  Carrot,
  Potato,
  SweetPotato,
  Croissant,
  Bread,
  Pretzel,
  Bagel,
  Pancakes,
  Waffle,
  Cheese,
  Meat,
  Poultry,
  Bacon,
  Hamburger,
  Fries,
  Pizza,
  Hotdog,
  Sandwich,
  Taco,
  Burrito,
  Salad,
  Soup,
  Sushi,
  Bento,
  Rice,
  Curry,
  Ramen,
  Spaghetti,
  Bread as BreadIcon,
  Cookie,
  Cake,
  Cupcake,
  Pie,
  Chocolate,
  Candy,
  Lollipop,
  Honey,
  Milk,
  Baby,
  Bottle,
  Glass,
  Cup,
  Teacup,
  Sake,
  Wine,
  Cocktail,
  Tropical,
  Beer,
  Beers,
  Champagne,
  Tumbler,
  Popcorn,
  Nut,
  Coconut,
  Chestnut,
  Peanut,
  Almond,
  Walnut,
  Hazelnut,
  Pistachio,
  Cashew,
  Macadamia
} from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { useDocuments } from '../context/DocumentContext';
import { useCodeEditor } from '../context/CodeEditorContext';
import CourseManagement from './CourseManagement';
import DocumentEditor from './DocumentEditor';
import CodeEditor from './CodeEditor';
import JupyterNotebook from './JupyterNotebook';
import AIAssistant from './AIAssistant';

const Dashboard = () => {
  const { courses } = useCourses();
  const { documents } = useDocuments();
  const { projects } = useCodeEditor();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'documents' | 'code' | 'jupyter'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New course 'Advanced React' is now available!", time: '2 min ago', type: 'info' },
    { id: 2, message: "You've completed 5 courses this month! 🎉", time: '1 hour ago', type: 'success' },
    { id: 3, message: "Don't forget to practice coding today!", time: '3 hours ago', type: 'reminder' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Documents',
      value: documents.length,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Code Projects',
      value: projects.length,
      icon: Code,
      color: 'bg-purple-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Total Items',
      value: courses.reduce((sum, course) => sum + course.items.length, 0),
      icon: Target,
      color: 'bg-orange-500',
      change: '+23%',
      trend: 'up'
    }
  ];

  const recentActivity = [
    { type: 'course', title: 'JavaScript Fundamentals', action: 'Created', time: '2 hours ago', icon: BookOpen },
    { type: 'document', title: 'Project Notes', action: 'Edited', time: '4 hours ago', icon: FileText },
    { type: 'code', title: 'React App', action: 'Updated', time: '1 day ago', icon: Code },
    { type: 'jupyter', title: 'Data Analysis', action: 'Executed', time: '1 day ago', icon: BarChart },
    { type: 'course', title: 'Python Basics', action: 'Published', time: '2 days ago', icon: BookOpen },
  ];

  const quickActions = [
    { 
      title: 'Create Course', 
      description: 'Start a new learning journey',
      icon: BookOpen, 
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => setActiveTab('courses')
    },
    { 
      title: 'New Document', 
      description: 'Write and organize notes',
      icon: Edit3, 
      color: 'bg-green-600 hover:bg-green-700',
      action: () => setActiveTab('documents')
    },
    { 
      title: 'Code Project', 
      description: 'Build something awesome',
      icon: Terminal, 
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => setActiveTab('code')
    },
    { 
      title: 'Jupyter Notebook', 
      description: 'Data science & analysis',
      icon: Database, 
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => setActiveTab('jupyter')
    },
    { 
      title: 'AI Assistant', 
      description: 'Get personalized help',
      icon: MessageCircle, 
      color: 'bg-pink-600 hover:bg-pink-700',
      action: () => setIsAIAssistantOpen(true)
    },
    { 
      title: 'Analytics', 
      description: 'Track your progress',
      icon: TrendingUp, 
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => {}
    }
  ];

  const learningPaths = [
    {
      title: 'Full Stack Development',
      description: 'Master frontend and backend technologies',
      progress: 65,
      courses: 8,
      duration: '120 hours',
      difficulty: 'Intermediate',
      icon: Globe,
      color: 'bg-blue-500'
    },
    {
      title: 'Data Science & AI',
      description: 'Learn machine learning and data analysis',
      progress: 40,
      courses: 6,
      duration: '90 hours',
      difficulty: 'Advanced',
      icon: BarChart,
      color: 'bg-green-500'
    },
    {
      title: 'Mobile Development',
      description: 'Build iOS and Android applications',
      progress: 25,
      courses: 5,
      duration: '80 hours',
      difficulty: 'Intermediate',
      icon: Smartphone,
      color: 'bg-purple-500'
    }
  ];

  const achievements = [
    { title: 'First Course', description: 'Created your first course', icon: BookOpen, earned: true },
    { title: 'Code Master', description: 'Completed 10 coding challenges', icon: Code, earned: true },
    { title: 'Writer', description: 'Written 50 documents', icon: FileText, earned: false },
    { title: 'Data Scientist', description: 'Analyzed data in Jupyter', icon: BarChart, earned: true },
    { title: 'Consistent Learner', description: '30-day learning streak', icon: Calendar, earned: false },
    { title: 'Community Helper', description: 'Helped 10 other learners', icon: Users, earned: false }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back to Hunt! 🚀</h1>
              <p className="text-gray-300 text-xl">Ready to create something amazing today?</p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  <span className="text-sm">Learning streak: 7 days</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-3">
                    <Target className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Your Progress</p>
                    <p className="text-3xl font-bold">87%</p>
                    <p className="text-xs text-gray-400">This month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} rounded-xl p-3 shadow-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-lg"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-4 shadow-lg hover:shadow-xl`}
            >
              <action.icon className="h-8 w-8" />
              <div className="text-left">
                <p className="font-semibold text-lg">{action.title}</p>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {learningPaths.map((path, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`${path.color} rounded-lg p-2`}>
                  <path.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{path.title}</h3>
                  <p className="text-sm text-gray-600">{path.difficulty}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{path.description}</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{path.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${path.color}`}
                    style={{ width: `${path.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{path.courses} courses</span>
                  <span>{path.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'course' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'document' ? 'bg-green-100 text-green-600' :
                  activity.type === 'jupyter' ? 'bg-orange-100 text-orange-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.action} • {activity.time}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <achievement.icon className={`h-6 w-6 ${
                    achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                  {achievement.earned && <Award className="h-4 w-4 text-yellow-500" />}
                </div>
                <h3 className={`font-semibold ${
                  achievement.earned ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm ${
                  achievement.earned ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Course Completion</span>
                <span>78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Content Created</span>
                <span>92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Code Quality</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive charts coming soon!</p>
                <p className="text-sm text-gray-400">Track your learning progress over time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Header */}
      <header className="bg-black shadow-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg p-2">
                <Target className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Hunt</h1>
                <p className="text-xs text-gray-400">Master Your Skills</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Target },
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'code', label: 'Code Editor', icon: Code },
                { id: 'jupyter', label: 'Jupyter', icon: Database },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === id
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {/* Search & Profile */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-transparent w-64"
                />
              </div>
              
              <button
                onClick={() => setIsAIAssistantOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-2 rounded-lg transition-all duration-300 shadow-lg"
                title="AI Assistant"
              >
                <MessageCircle className="h-5 w-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-300 hover:text-white transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    {notifications.map((notification) => (
                      <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="p-2 text-gray-300 hover:text-white transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-300 hover:text-white transition-colors">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'courses' && <CourseManagement />}
        {activeTab === 'documents' && <DocumentEditor />}
        {activeTab === 'code' && <CodeEditor />}
        {activeTab === 'jupyter' && <JupyterNotebook />}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-30">
        <div className="grid grid-cols-5 gap-1 p-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Target },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'documents', label: 'Docs', icon: FileText },
            { id: 'code', label: 'Code', icon: Code },
            { id: 'jupyter', label: 'Jupyter', icon: Database },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex flex-col items-center space-y-1 p-3 rounded-lg transition-all ${
                activeTab === id
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        onClose={() => setIsAIAssistantOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;