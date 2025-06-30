import React from 'react';
import { Code, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-black rounded-lg p-2">
                <Code className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CodingNinjas</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering millions of students worldwide to master programming and build successful tech careers through expert-led courses and hands-on projects.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-black p-2 rounded-lg transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-black p-2 rounded-lg transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-black p-2 rounded-lg transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-black p-2 rounded-lg transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-black p-2 rounded-lg transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Popular Courses</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Data Structures & Algorithms</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Machine Learning</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">System Design</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Competitive Programming</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Android Development</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Partnership</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Affiliate Program</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">support@codingninjas.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-black text-white"
                />
                <button className="bg-black hover:bg-gray-800 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 CodingNinjas. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;