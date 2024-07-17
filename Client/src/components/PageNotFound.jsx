import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/dmce.png';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img src={logo} alt="Logo" className="w-40 mb-8" />
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mb-8">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
      <button 
        className="px-6 py-2 text-white bg-[#262847] rounded hover:bg-[#262847] focus:outline-none focus:ring-2 focus:ring-[#262847]"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
  );
}

export default PageNotFound;
