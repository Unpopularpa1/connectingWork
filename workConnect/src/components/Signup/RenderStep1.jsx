import { useState } from "react";
import InputField from "./InputField";

const SelectField = ({ label, name, value, options, onChange, errors }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const RenderStep1 = ({ User, Mail, formData, handleInputChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Basic Information
      </h2>
      <div>
        <InputField
          label="Full Name"
          icon={User}
          name="fullName"
          value={formData.fullName}
          placeholder="Enter your full name"
          onChange={handleInputChange}
        />
        {errors.fullName && (
          <p className="text-red-600 text-sm pl-2">{errors.fullName}</p>
        )}
      </div>
      <div>
        <InputField
          label="Email Address"
          icon={Mail}
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleInputChange}
        />
        {errors.email && (
          <p className="text-red-600 text-sm pl-2">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Create password"
            onChange={handleInputChange}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />

          {errors.password && (
            <p className="text-red-600 text-sm pl-2">{errors.password}</p>
          )}
        </div>

        <div>
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm password"
            onChange={handleInputChange}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm pl-2">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <SelectField
        label="I want to"
        name="workGoal"
        value={formData.workGoal}
        options={["Find work opportunities", "Hire workers", "Both"]}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default RenderStep1;
