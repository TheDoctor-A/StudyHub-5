import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, Users, GraduationCap, CheckCircle } from 'lucide-react';

const UniversitySelection = ({ universities, onSelect, selected }) => {
  const [selectedUniversity, setSelectedUniversity] = useState(selected);

  const handleSelect = (university) => {
    setSelectedUniversity(university);
    if (onSelect) {
      onSelect(university);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">StudyHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step 1 of 4</span>
            <span>25% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your University
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your university to access study materials specifically tailored to your institution's curriculum and requirements.
          </p>
        </div>

        {/* University Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {universities.map((university) => (
            <div
              key={university.id}
              onClick={() => handleSelect(university)}
              className={`relative bg-white rounded-xl border-2 p-8 cursor-pointer transition-all hover:shadow-lg ${
                selectedUniversity?.id === university.id
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {selectedUniversity?.id === university.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {university.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {university.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{university.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{university.studentCount} students</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Available Courses:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {university.availableCourses.map((course, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          {selectedUniversity ? (
            <Link
              to="/course"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center gap-2"
            >
              Continue to Course Selection
              <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed">
              Select a University to Continue
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-gray-500">
            Don't see your university? <a href="#" className="text-blue-600 hover:underline">Contact us</a> to request it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UniversitySelection;

