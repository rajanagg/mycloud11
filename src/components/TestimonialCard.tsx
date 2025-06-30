import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  rating: number;
  testimonial: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  image,
  rating,
  testimonial
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
      <Quote className="absolute top-6 right-6 h-8 w-8 text-gray-100" />
      
      <div className="flex items-center mb-6">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-100"
        />
        <div>
          <h4 className="text-lg font-bold text-gray-900">{name}</h4>
          <p className="text-black font-medium">{role}</p>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>
      </div>

      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      <p className="text-gray-700 leading-relaxed italic">"{testimonial}"</p>
    </div>
  );
};

export default TestimonialCard;