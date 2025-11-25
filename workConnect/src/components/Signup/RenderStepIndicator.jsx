import React from "react";

const RenderStepIndicator = ({ currentStep }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
              step <= currentStep ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-8 h-0.5 ${
                step < currentStep ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default RenderStepIndicator;
