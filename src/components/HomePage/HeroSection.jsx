import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/auth-context";

const HeroSection = () => {
  const navigate=useNavigate();
  const {token}=useAuth();
  return (
    <>
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Connect. Work. <span className="text-blue-600">Earn.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            The trusted platform where people find meaningful work opportunities
            and get tasks done by verified professionals in their community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
              <button onClick={()=>navigate(token?"/dashboard":"/login")} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700  cursor-pointer hover:scale-105 transition-[colors,transform] duration-300">
                Find Work Opportunities
              </button>
           
            
              <button onClick={()=>navigate(token?"/dashboard":"/login")} className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:text-white transition-colors cursor-pointer ">
                Post a Job
              </button>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
