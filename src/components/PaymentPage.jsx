import React from 'react';
import { Link } from 'react-router-dom';

const PaymentPage = ({ university, course, onSubscribe }) => {
  const handlePayment = () => {
    // Dummy subscription data
    const subscription = {
      id: 'sub-123',
      planName: 'Monthly Plan',
      price: 10,
      interval: 'month',
      features: ['Full access to notes', 'Flashcards', 'Practice exams']
    };

    // Call the subscription handler
    if (onSubscribe) {
      onSubscribe(subscription);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Page</h2>
        <p className="text-gray-700 mb-6">
          You are subscribing to the course <strong>{course?.name}</strong> at <strong>{university?.name}</strong>.
        </p>

        <div className="mb-6">
          <p className="text-lg text-gray-800 mb-2">Plan: Monthly</p>
          <p className="text-lg text-gray-800 mb-2">Price: £10/month</p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Confirm Payment
        </button>

        <Link to="/" className="block text-center text-blue-600 mt-4 hover:underline">
          Cancel and return to homepage
        </Link>
      </div>
    </div>
  );
};

export default PaymentPage;
