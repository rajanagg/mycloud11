import React from 'react';
import { Play, Star, Users, Award } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-orange-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gray-300 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Master
                <span className="text-orange-400"> Coding Skills</span>
                <br />
                From Zero to Hero
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Join over 1M+ students learning programming, data structures, algorithms, 
                and system design from industry experts.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-400" />
                <span className="text-sm font-medium">1M+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm font-medium">4.8/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">Expert Instructors</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Start Learning Free
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">What do you want to learn?</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search for courses, topics..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Students learning coding"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white text-gray-900 p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Course Completed</p>
                    <p className="text-xs text-gray-500">Python Basics</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Certificate Earned</p>
                    <p className="text-xs text-gray-500">Data Structures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;