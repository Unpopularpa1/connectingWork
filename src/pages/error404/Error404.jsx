import React from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center ">
      {/* Error Code */}
      <h1 className="text-9xl font-extrabold text-indigo-600">404</h1>

      {/* Message */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
        >
          Go Home
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg shadow hover:bg-gray-200 transition duration-300"
        >
          Go Back
        </button>
      </div>

      {/* Decorative Image */}
      
    </div>
  );
};

export default Error404;
