import React, { useState,useRef } from "react";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Camera,
  ArrowRight,
} from "lucide-react";
import RenderStepIndicator from "./RenderStepIndicator";
import RenderStep1 from "./RenderStep1";
import RenderStep2 from "./RenderStep2";
import RenderStep3 from "./RenderStep3";
import { Link, useNavigate } from "react-router-dom";
import { validateStep1,validateStep2,validateStep3} from "./validate";
import axiosInstance from "../../api/axiosInstance";
import { toast } from 'react-toastify';

const WorkConnectRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    workGoal: "Find work opportunities",
    phoneNumber: "",
    address: "",
    citizenshipCard: "",
    profilePhoto: null,
    skills: [],
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    

  });

  const skills = [
    "Tutoring",
    "Cleaning",
    "Gardening",
    "Security Guard",
    "Cooking",
    "Pet Care",
    "Elderly Care",
    "Handyman",
    "Delivery",
    "Event Help",
  ];
  const fileRef=useRef(null);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const nextStep = () => {
    if(currentStep===1&&!validateStep1(formData,setErrors))
    {
      return;
    }
     if(currentStep===2&&!validateStep2(formData,setErrors))
    {
      return;
    }
   
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const mapWorkGoalToRole = (workGoal) => {
    if (workGoal === "Find work opportunities") return "worker";
    if (workGoal === "Hire workers") return "hirer";
    if (workGoal === "Both") return "both";
    return "worker";
  };

  const registerSubmission = async () => {
    setApiError("");
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("role", mapWorkGoalToRole(formData.workGoal));
      form.append("phoneNo", formData.phoneNumber);
      form.append("address", formData.address);
      form.append("citizenshipCardNO", formData.citizenshipCard);
      form.append("emergencyContactName", formData.emergencyContactName);
      form.append("emergencyContactRelation", formData.emergencyContactRelation);
      form.append("emergencyContactPhone", formData.emergencyContactPhone);
      // append skills as repeated field entries
      (formData.skills || []).forEach((skill) => form.append("skills", skill));
      // optional profile picture
      if (formData.profilePhoto) {
        form.append("profilePicture", formData.profilePhoto);
      }

      await axiosInstance.post("/user/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Registration successful! Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed. Please try again.";
      setApiError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const completeRegistration = async () => {
    if (!validateStep3(formData, setErrors)) {
      return;
    }
    await registerSubmission();
  };

  const handleFileChange=(e)=>{
    const file=e.target.files[0];
    setFormData((prev)=>(
      {
        ...prev,
        profilePhoto:file
      }
    ));
    if (file) {
      if (profilePhotoPreview) URL.revokeObjectURL(profilePhotoPreview);
      const previewUrl = URL.createObjectURL(file);
      setProfilePhotoPreview(previewUrl);
    }
  }
  const handelFileToggle=()=>{
   
    fileRef.current.click();
  }
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">W</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Join WorkConnect
            </h1>
            <p className="text-gray-600 mt-2">
              Create your account and start earning
            </p>
          </div>

          {/* Step Indicator */}

          <RenderStepIndicator currentStep={currentStep} />

          {/* Form Content */}
          <div className="mb-8">
            {currentStep === 1 && (
              <RenderStep1
                User={User}
                Mail={Mail}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <RenderStep2
                formData={formData}
                Camera={Camera}
                Phone={Phone}
                MapPin={MapPin}
                CreditCard={CreditCard}
                handleInputChange={handleInputChange}
                errors={errors}
                handleFileChange={handleFileChange}
                handelFileToggle={handelFileToggle}
                fileRef={fileRef}
                profilePhotoPreview={profilePhotoPreview}
              />
            )}
            {currentStep === 3 && (
              <RenderStep3
                formData={formData}
                handleInputChange={handleInputChange}
                skills={skills}
                handleSkillToggle={handleSkillToggle}
                errors={errors}

              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={
                currentStep === 3
                  ? completeRegistration
                  : nextStep
              }
              className={` flex items-center px-8 py-3 ml-5  bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
              disabled={submitting}
            >
              {currentStep === 3 ? (submitting ? "Submitting..." : "Complete Registration") : "Next"}
              {currentStep < 3 && <ArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            {apiError && (
              <p className="text-red-600 mb-4">{apiError}</p>
            )}
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkConnectRegistration;
