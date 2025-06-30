import React from 'react';
import { Users, BookOpen, Award, Globe } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: '1M+',
      label: 'Active Students',
      color: 'bg-black'
    },
    {
      icon: BookOpen,
      number: '500+',
      label: 'Expert Courses',
      color: 'bg-green-500'
    },
    {
      icon: Award,
      number: '100K+',
      label: 'Certificates Issued',
      color: 'bg-orange-500'
    },
    {
      icon: Globe,
      number: '50+',
      label: 'Countries Reached',
      color: 'bg-gray-700'
    }
  ];

  return (
    <section className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join a global community of learners and transform your career with our proven educational platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`${stat.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;