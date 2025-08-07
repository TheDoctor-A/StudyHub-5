import React from 'react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input type="email" className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input type="password" className="w-full border px-3 py-2 rounded" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
