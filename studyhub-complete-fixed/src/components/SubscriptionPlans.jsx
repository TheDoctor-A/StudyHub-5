import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Star, GraduationCap, Crown } from 'lucide-react';

const SubscriptionPlans = ({ plans, university, course, onSelect, selected }) => {
  const [selectedPlan, setSelectedPlan] = useState(selected);

  const handleSelect = (plan) => {
    setSelectedPlan(plan);
    if (onSelect) {
      onSelect(plan);
    }
  };

  if (!university || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please select university and course first</p>
          <Link
            to="/university"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Over
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step 3 of 4</span>
            <span>75% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/course"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Course Selection
        </Link>

        {/* Selection Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Your Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">University</p>
                <p className="font-medium text-blue-900">{university.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-blue-700">Course</p>
                <p className="font-medium text-blue-900">{course.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the subscription plan that works best for you. All plans include full access to study materials for your course.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg">
            <div className="flex">
              <button className="px-6 py-2 rounded-md bg-white text-gray-900 font-medium shadow-sm">
                Monthly
              </button>
              <button className="px-6 py-2 rounded-md text-gray-600 font-medium">
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handleSelect(plan)}
              className={`relative bg-white rounded-2xl border-2 p-8 cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan?.id === plan.id
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300'
              } ${plan.popular ? 'ring-2 ring-blue-200' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Crown size={14} />
                    Most Popular
                  </div>
                </div>
              )}

              {selectedPlan?.id === plan.id && (
                <div className="absolute top-6 right-6">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">£{plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                {plan.discount && (
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <span>Save {plan.discount}</span>
                  </div>
                )}
                <p className="text-gray-600 mt-4">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  selectedPlan?.id === plan.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {selectedPlan?.id === plan.id ? 'Selected' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          {selectedPlan ? (
            <Link
              to="/payment"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center gap-2"
            >
              Continue to Payment
              <ArrowRight size={20} />
            </Link>
          ) : (
            <div className="bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed">
              Select a Plan to Continue
            </div>
          )}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full">
            <Check size={16} />
            <span className="font-medium">30-day money-back guarantee</span>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-white rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            What's Included in All Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Comprehensive Notes</h4>
              <p className="text-gray-600">Detailed study notes covering all course topics</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Interactive Flashcards</h4>
              <p className="text-gray-600">Smart flashcards for effective memorization</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Past Papers & Practice</h4>
              <p className="text-gray-600">Real exam papers and practice questions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;

