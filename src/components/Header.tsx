import React, { useState } from 'react';
import { Menu, X, Search, User, BookOpen, Code, Trophy, Users } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-black rounded-lg p-2">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CodingNinjas</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors">Courses</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors">Practice</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors">Contests</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors">Jobs</a>
            <a href="#" className="text-gray-600 hover:text-black font-medium transition-colors">Mentorship</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-64"
              />
            </div>
            <button className="text-gray-600 hover:text-black transition-colors">
              <User className="h-5 w-5" />
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-600 hover:text-black font-medium">Courses</a>
              <a href="#" className="text-gray-600 hover:text-black font-medium">Practice</a>
              <a href="#" className="text-gray-600 hover:text-black font-medium">Contests</a>
              <a href="#" className="text-gray-600 hover:text-black font-medium">Jobs</a>
              <a href="#" className="text-gray-600 hover:text-black font-medium">Mentorship</a>
              <div className="pt-4 border-t border-gray-100">
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent mb-4"
                />
                <button className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;