import React from 'react';
import { Star, Users, Award } from 'lucide-react';

interface InstructorCardProps {
  name: string;
  title: string;
  image: string;
  rating: number;
  students: string;
  courses: number;
  specialties: string[];
}

const InstructorCard: React.FC<InstructorCardProps> = ({
  name,
  title,
  image,
  rating,
  students,
  courses,
  specialties
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
      <div className="p-6 text-center">
        <div className="relative inline-block mb-6">
          <img
            src={image}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-100 group-hover:border-gray-300 transition-colors"
          />
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
            <Award className="h-4 w-4 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-black font-medium mb-4">{title}</p>

        <div className="flex items-center justify-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{students}</span>
          </div>
          <div className="text-gray-500">
            {courses} courses
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>

        <button className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg font-medium transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default InstructorCard;