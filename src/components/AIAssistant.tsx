import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  BookOpen,
  Code,
  FileText,
  Play,
  Search,
  Filter,
  Star,
  Heart,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Users,
  Globe,
  Smile,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Download,
  Bookmark
} from 'lucide-react';
import { useCourses } from '../context/CourseContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
  }>;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { courses } = useCourses();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentMood, setCurrentMood] = useState<'happy' | 'focused' | 'curious' | 'motivated'>('happy');
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Comprehensive AI responses database
  const aiResponses = {
    greetings: [
      "Hello! I'm your AI learning assistant. How can I help you today? 🎓",
      "Hi there! Ready to dive into some amazing courses? What are you interested in learning?",
      "Welcome back! I'm here to help you master new skills. What's on your learning agenda today?",
      "Hey! I'm excited to help you on your learning journey. What would you like to explore?"
    ],
    
    courseRecommendations: {
      beginner: [
        "For beginners, I recommend starting with our 'Programming Fundamentals' course. It covers the basics in an easy-to-understand way!",
        "If you're new to coding, try our 'Web Development Basics' - it's perfect for getting your feet wet!",
        "Our 'Python for Beginners' course is fantastic for first-time programmers. Want me to open it for you?"
      ],
      intermediate: [
        "Ready for the next level? Check out our 'Advanced JavaScript' or 'Data Structures & Algorithms' courses!",
        "For intermediate learners, I suggest 'React Development' or 'Database Design' - both are excellent next steps!",
        "You might enjoy our 'Machine Learning Fundamentals' course - it's challenging but very rewarding!"
      ],
      advanced: [
        "For advanced learners, our 'System Design' and 'Advanced Algorithms' courses are top-notch!",
        "Consider diving into 'Microservices Architecture' or 'Advanced Machine Learning' - both are cutting-edge!",
        "Our 'DevOps Mastery' course is perfect for experienced developers looking to expand their skills!"
      ]
    },

    moodResponses: {
      happy: [
        "I love your positive energy! 😊 Let's channel that into some exciting learning!",
        "Your enthusiasm is contagious! What subject makes you happiest to learn about?",
        "Great mood for learning! Happy students learn 40% faster. What shall we explore?"
      ],
      focused: [
        "Perfect mindset for deep learning! 🎯 Let's tackle something challenging today.",
        "I can sense your focus - that's the key to mastering complex topics. What's your target?",
        "Focused energy is powerful! Let's use it to conquer a difficult concept."
      ],
      curious: [
        "Curiosity is the best learning fuel! 🔍 What's sparking your interest today?",
        "I love curious minds! They're the ones who make the biggest breakthroughs. What are you wondering about?",
        "Your curiosity is inspiring! Let's explore something that will blow your mind."
      ],
      motivated: [
        "That motivation is going to take you far! 🚀 Let's set some ambitious learning goals!",
        "I can feel your drive! Motivated learners achieve 3x more. What's your big goal?",
        "Your motivation is powerful! Let's harness it to master something amazing."
      ]
    },

    courseFiltering: {
      byDifficulty: "I can help you find courses by difficulty! We have beginner, intermediate, and advanced levels. Which suits you best?",
      byDuration: "Looking for quick wins or deep dives? I can show you courses from 30 minutes to 50+ hours!",
      byTopic: "What topic interests you? Programming, Design, Business, Data Science, or something else?",
      byRating: "Want only the best? I can filter courses with 4.5+ star ratings!"
    },

    motivationalQuotes: [
      "💡 'The expert in anything was once a beginner.' - Helen Hayes",
      "🌟 'Learning never exhausts the mind.' - Leonardo da Vinci",
      "🚀 'The beautiful thing about learning is that no one can take it away from you.' - B.B. King",
      "⭐ 'Education is the most powerful weapon which you can use to change the world.' - Nelson Mandela",
      "🎯 'Live as if you were to die tomorrow. Learn as if you were to live forever.' - Mahatma Gandhi"
    ],

    studyTips: [
      "📚 Pro tip: Take breaks every 25 minutes (Pomodoro technique) for better retention!",
      "🧠 Did you know? Teaching someone else what you learned improves your own understanding by 90%!",
      "⏰ Best learning times are typically 10 AM - 2 PM and 4 PM - 10 PM when your brain is most alert!",
      "🎵 Instrumental music can boost focus by 13% - try some lo-fi beats while studying!",
      "💧 Stay hydrated! Even 2% dehydration can reduce cognitive performance by 23%!"
    ],

    progressEncouragement: [
      "🎉 You're making fantastic progress! Every step forward is an achievement!",
      "💪 Keep going! You're building skills that will last a lifetime!",
      "🌟 I'm proud of your dedication! Consistency is the key to mastery!",
      "🚀 You're on fire! This momentum will take you places!",
      "⭐ Amazing work! You're proving that persistence pays off!"
    ]
  };

  const quickActions = [
    { label: "Find Courses", action: "find_courses", icon: <Search className="h-4 w-4" /> },
    { label: "My Progress", action: "show_progress", icon: <TrendingUp className="h-4 w-4" /> },
    { label: "Study Tips", action: "study_tips", icon: <Lightbulb className="h-4 w-4" /> },
    { label: "Motivate Me", action: "motivate", icon: <Zap className="h-4 w-4" /> },
    { label: "Course Recommendations", action: "recommend", icon: <Star className="h-4 w-4" /> },
    { label: "Learning Goals", action: "goals", icon: <Target className="h-4 w-4" /> }
  ];

  const moodOptions = [
    { mood: 'happy', emoji: '😊', label: 'Happy' },
    { mood: 'focused', emoji: '🎯', label: 'Focused' },
    { mood: 'curious', emoji: '🔍', label: 'Curious' },
    { mood: 'motivated', emoji: '🚀', label: 'Motivated' }
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        type: 'bot',
        content: aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)],
        timestamp: new Date(),
        suggestions: ["Show me courses", "I'm feeling motivated!", "Help me learn", "What's trending?"]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userInput: string): Message => {
    const input = userInput.toLowerCase();
    let response = "";
    let suggestions: string[] = [];
    let actions: Array<{ label: string; action: string; icon?: React.ReactNode }> = [];

    // Context-aware responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      response = aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
      suggestions = ["Show me courses", "I need motivation", "Help me study", "What's new?"];
    }
    
    else if (input.includes('course') || input.includes('learn') || input.includes('study')) {
      if (input.includes('beginner') || input.includes('start') || input.includes('new')) {
        response = aiResponses.courseRecommendations.beginner[Math.floor(Math.random() * aiResponses.courseRecommendations.beginner.length)];
      } else if (input.includes('advanced') || input.includes('expert')) {
        response = aiResponses.courseRecommendations.advanced[Math.floor(Math.random() * aiResponses.courseRecommendations.advanced.length)];
      } else {
        response = aiResponses.courseRecommendations.intermediate[Math.floor(Math.random() * aiResponses.courseRecommendations.intermediate.length)];
      }
      
      suggestions = ["Show me more", "Filter by difficulty", "What's popular?", "Quick courses"];
      actions = [
        { label: "Browse All Courses", action: "browse_courses", icon: <BookOpen className="h-4 w-4" /> },
        { label: "Filter Courses", action: "filter_courses", icon: <Filter className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('mood') || input.includes('feel')) {
      const moodResponse = aiResponses.moodResponses[currentMood];
      response = moodResponse[Math.floor(Math.random() * moodResponse.length)];
      suggestions = ["Change my mood", "Study tips", "Motivate me", "Set goals"];
    }
    
    else if (input.includes('motivat') || input.includes('inspire') || input.includes('encourage')) {
      response = aiResponses.motivationalQuotes[Math.floor(Math.random() * aiResponses.motivationalQuotes.length)];
      suggestions = ["More motivation", "Study tips", "Set goals", "Track progress"];
      actions = [
        { label: "Daily Motivation", action: "daily_motivation", icon: <Heart className="h-4 w-4" /> },
        { label: "Success Stories", action: "success_stories", icon: <Award className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('tip') || input.includes('help') || input.includes('how to study')) {
      response = aiResponses.studyTips[Math.floor(Math.random() * aiResponses.studyTips.length)];
      suggestions = ["More tips", "Study schedule", "Focus techniques", "Memory tricks"];
    }
    
    else if (input.includes('progress') || input.includes('achievement')) {
      const completedCourses = courses.length;
      response = `🎯 You've created ${completedCourses} courses! ${aiResponses.progressEncouragement[Math.floor(Math.random() * aiResponses.progressEncouragement.length)]}`;
      suggestions = ["Show details", "Set new goals", "Celebrate", "Next milestone"];
      actions = [
        { label: "View Progress", action: "view_progress", icon: <TrendingUp className="h-4 w-4" /> },
        { label: "Certificates", action: "certificates", icon: <Award className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('filter') || input.includes('search') || input.includes('find')) {
      response = aiResponses.courseFiltering.byTopic;
      suggestions = ["By difficulty", "By duration", "By rating", "By topic"];
      actions = [
        { label: "Advanced Search", action: "advanced_search", icon: <Search className="h-4 w-4" /> },
        { label: "Popular Courses", action: "popular_courses", icon: <TrendingUp className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('javascript') || input.includes('js')) {
      response = "🟨 JavaScript is an excellent choice! I recommend starting with 'JavaScript Fundamentals' then moving to 'Modern ES6+' and 'React Development'. Want me to open the first course?";
      actions = [
        { label: "Open JS Course", action: "open_js_course", icon: <Play className="h-4 w-4" /> },
        { label: "JS Learning Path", action: "js_path", icon: <BookOpen className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('python')) {
      response = "🐍 Python is perfect for beginners and powerful for experts! Our Python track covers basics, data science, web development, and AI. Which area interests you most?";
      suggestions = ["Python basics", "Data science", "Web development", "AI with Python"];
    }
    
    else if (input.includes('web development') || input.includes('html') || input.includes('css')) {
      response = "🌐 Web development is in high demand! I suggest this learning path: HTML/CSS → JavaScript → React → Node.js → Full-stack projects. Ready to start?";
      actions = [
        { label: "Start Web Dev Path", action: "web_dev_path", icon: <Code className="h-4 w-4" /> },
        { label: "Frontend Focus", action: "frontend_path", icon: <Globe className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('time') || input.includes('schedule') || input.includes('when')) {
      response = "⏰ Great question! I recommend studying for 25-50 minutes with 5-15 minute breaks. Your peak learning times are typically 10 AM - 2 PM and 4 PM - 10 PM. Want me to help create a study schedule?";
      actions = [
        { label: "Create Schedule", action: "create_schedule", icon: <Calendar className="h-4 w-4" /> },
        { label: "Study Reminders", action: "study_reminders", icon: <Clock className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('certificate') || input.includes('completion')) {
      response = "🏆 Certificates are a great way to showcase your skills! Complete all course modules, pass the final assessment, and you'll earn a verified certificate. Want to see your certificate progress?";
      actions = [
        { label: "View Certificates", action: "view_certificates", icon: <Award className="h-4 w-4" /> },
        { label: "Certificate Guide", action: "cert_guide", icon: <FileText className="h-4 w-4" /> }
      ];
    }
    
    else if (input.includes('difficult') || input.includes('hard') || input.includes('struggling')) {
      response = "💪 Don't worry, everyone struggles sometimes! Here are some strategies: break complex topics into smaller parts, practice regularly, join study groups, and don't hesitate to revisit fundamentals. You've got this!";
      suggestions = ["Study techniques", "Get help", "Easier courses", "Practice more"];
      actions = [
        { label: "Study Help", action: "study_help", icon: <Users className="h-4 w-4" /> },
        { label: "Easier Alternatives", action: "easier_courses", icon: <Lightbulb className="h-4 w-4" /> }
      ];
    }
    
    else {
      // Default intelligent response
      response = "🤔 That's an interesting question! I'm here to help you with courses, learning tips, motivation, and tracking your progress. What specific area would you like assistance with?";
      suggestions = ["Show courses", "Study tips", "Motivate me", "My progress"];
    }

    return {
      id: crypto.randomUUID(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions,
      actions
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationContext(prev => [...prev, inputValue]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleActionClick = (action: string) => {
    let responseMessage = "";
    
    switch (action) {
      case 'browse_courses':
        responseMessage = "🎓 Here are all available courses! I can help you filter by difficulty, duration, or topic. What interests you most?";
        break;
      case 'filter_courses':
        responseMessage = "🔍 Let's filter courses! You can search by: Difficulty (Beginner/Intermediate/Advanced), Duration (Quick/Medium/Comprehensive), Topic (Programming/Design/Business), or Rating (4+ stars). What's your preference?";
        break;
      case 'view_progress':
        responseMessage = `📊 Your learning stats: ${courses.length} courses created, great progress! Keep up the momentum!`;
        break;
      case 'daily_motivation':
        responseMessage = aiResponses.motivationalQuotes[Math.floor(Math.random() * aiResponses.motivationalQuotes.length)];
        break;
      case 'create_schedule':
        responseMessage = "📅 Let's create your perfect study schedule! I recommend: 1) Set specific times, 2) Start with 25-minute sessions, 3) Include breaks, 4) Track your progress. When do you prefer to study?";
        break;
      default:
        responseMessage = "✨ Action completed! How else can I help you today?";
    }

    const actionResponse: Message = {
      id: crypto.randomUUID(),
      type: 'bot',
      content: responseMessage,
      timestamp: new Date(),
      suggestions: ["More help", "Different topic", "Study tips", "My progress"]
    };

    setMessages(prev => [...prev, actionResponse]);
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInputValue("Show me programming courses");
        setIsListening(false);
      }, 3000);
    }
  };

  const handleMoodChange = (mood: 'happy' | 'focused' | 'curious' | 'motivated') => {
    setCurrentMood(mood);
    const moodMessage: Message = {
      id: crypto.randomUUID(),
      type: 'bot',
      content: `Great! I can sense you're feeling ${mood} today! ${aiResponses.moodResponses[mood][0]}`,
      timestamp: new Date(),
      suggestions: ["Find courses", "Study tips", "Set goals", "Track progress"]
    };
    setMessages(prev => [...prev, moodMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-80' : 'w-96'} ${isMinimized ? 'h-16' : 'h-[600px]'} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="h-8 w-8" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold">AI Learning Assistant</h3>
            <p className="text-xs opacity-90">Always here to help you learn!</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Mood Selector */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">How are you feeling today?</p>
            <div className="flex space-x-2">
              {moodOptions.map(({ mood, emoji, label }) => (
                <button
                  key={mood}
                  onClick={() => handleMoodChange(mood as any)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-colors ${
                    currentMood === mood 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick Actions</p>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleActionClick(action.action)}
                  className="flex flex-col items-center space-y-1 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {action.icon}
                  <span className="text-xs text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-500 to-blue-500'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                    </div>
                    <div className={`rounded-2xl p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-50 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action.action)}
                          className="flex items-center space-x-2 w-full text-left bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about learning..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={toggleVoiceInput}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                    isListening ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title="Voice Input"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-full transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;