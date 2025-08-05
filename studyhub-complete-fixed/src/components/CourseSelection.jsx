import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Users, GraduationCap, CheckCircle, Award } from 'lucide-react';

const CourseSelection = ({ courses, university, onSelect, selected }) => {
  const [selectedCourse, setSelectedCourse] = useState(selected);

  // Filter courses for the selected university
  const availableCourses = courses.filter(course => 
    course.universityId === university?.id
  );

  const handleSelect = (course) => {
    setSelectedCourse(course);
    if (onSelect) {
      onSelect(course);
    }
  };

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please select a university first</p>
          <Link
            to="/university"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Select University
          </Link>
        </div>
      </div>
    );
  }

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
            <span>Step 2 of 4</span>
            <span>50% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/university"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          Back to University Selection
        </Link>

        {/* University Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Selected University</h3>
              <p className="text-blue-700">{university.name}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Select Your Course
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your specific course to access study materials tailored to your curriculum and examination requirements.
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {availableCourses.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No courses available for this university yet.</p>
              <p className="text-gray-400 mt-2">More courses will be added soon!</p>
            </div>
          ) : (
            availableCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleSelect(course)}
                className={`relative bg-white rounded-xl border-2 p-8 cursor-pointer transition-all hover:shadow-lg ${
                  selectedCourse?.id === course.id
                    ? 'border-blue-600 ring-2 ring-blue-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {selectedCourse?.id === course.id && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award size={16} />
                        <span>{course.level}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Study Materials Available:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {course.availableMaterials.map((material, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{course.materialCount}</span> study materials available
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          {selectedCourse ? (
            <Link
              to="/subscription"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center gap-2"
            >
              Continue to Subscription Plans
              <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed">
              Select a Course to Continue
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-gray-500">
            Don't see your course? <a href="#" className="text-blue-600 hover:underline">Contact us</a> to request it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseSelection;

