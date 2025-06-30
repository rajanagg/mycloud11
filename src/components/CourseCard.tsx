import React from 'react';
import { Star, Clock, Users, BookOpen } from 'lucide-react';

interface CourseCardProps {
  title: string;
  instructor: string;
  image: string;
  rating: number;
  students: string;
  duration: string;
  price: string;
  originalPrice?: string;
  level: string;
  category: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  instructor,
  image,
  rating,
  students,
  duration,
  price,
  originalPrice,
  level,
  category
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">By {instructor}</p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium text-gray-900">{rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{students}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">{price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">{originalPrice}</span>
            )}
          </div>
          <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Enroll</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;