export const validateStep1 = (formData, setErrors) => {
  const newErrors = {};

  // Full Name (must include space)
  const trimmedName = formData.fullName.trim();
  if (!trimmedName) {
    newErrors.fullName = "Full Name is required";
  } else if (!trimmedName.includes(" ")) {
    newErrors.fullName = "Please enter first and last name";
  }

  // Email
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }

  // Password
  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  // Confirm Password
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = "Confirm your password";
  } else if (formData.confirmPassword !== formData.password) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  // Role
  if (!formData.workGoal) {
    newErrors.workGoal = "Please select a role";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

export const validateStep2 = (formData, setErrors) => {
  const newErrors = {};

  // Phone Number
  if (!formData.phoneNumber.trim()) {
    newErrors.phoneNumber = "Phone number is required";
  } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
    newErrors.phoneNumber = "Phone number must be 10 digits";
  }

  // Address
  if (!formData.address.trim()) {
    newErrors.address = "Address is required";
  } else if (formData.address.trim().length < 5) {
    newErrors.address = "Address must be at least 5 characters";
  }

  // Citizenship Card Number
  if (!formData.citizenshipCard.trim()) {
    newErrors.citizenshipCard = "Citizenship number is required";
  } else if (!/^\d{2}-\d{2}-\d{2}-\d{5}$/.test(formData.citizenshipCard)) {
    newErrors.citizenshipCard = "Format must be xx-xx-xx-xxxxx";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const validateStep3 = (formData, setErrors) => {
  const newErrors = {};

  // 1. Emergency Contact Name
  if (!formData.emergencyContactName.trim()) {
    newErrors.emergencyContactName = "Contact Name is required";
  }

  // 2. Relationship
  if (!formData.emergencyContactRelation.trim()) {
    newErrors.emergencyContactRelation = "Relationship is required";
  }

  // 3. Contact Phone
  if (!formData.emergencyContactPhone.trim()) {
    newErrors.emergencyContactPhone = "Contact Phone is required";
  } else if (!/^\d{7,15}$/.test(formData.emergencyContactPhone)) {
    newErrors.emergencyContactPhone = "Enter a valid phone number (7–15 digits)";
  }

  // 4. Skills
  if (!formData.skills || formData.skills.length === 0) {
    newErrors.skills = "Please select at least one skill";
  }
setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
