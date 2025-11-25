import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";


const InputField = ({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  placeholder,
  onChange,showPassword,setShowPassword
  
}) => {
  
  
  
  

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          type={type==="password"?showPassword ? "text" : "password":type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
        {type==="password" && (
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
            ) : (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default InputField;
