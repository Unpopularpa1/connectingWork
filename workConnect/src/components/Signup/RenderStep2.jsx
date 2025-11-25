import InputField from "./InputField";


const TextareaField = ({
  label,
  icon: Icon,
  name,
  value,
  placeholder,
  onChange,
  rows = 4,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-4 text-gray-400 w-5 h-5" />}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        rows={rows}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  </div>
);

const IconUpload = ({ icon: Icon, handleFileChange,handelFileToggle,fileRef, previewUrl }) => (

  <div >
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Profile Photo
    </label>
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt="Profile preview" className="w-16 h-16 object-cover" />
        ) : (
          <Icon className="w-8 h-8 text-gray-400"/>
        )}
      </div>
        <input type="file" name="profilePicture" onChange={handleFileChange}  className="hidden" ref={fileRef}   />
        <label htmlFor="profilePicture" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors" onClick={handelFileToggle}>
          Upload Photo
        </label>
    </div>
  </div>
);

const RenderStep2 = ({
  Phone,
  MapPin,
  CreditCard,
  Camera,
  handleInputChange,
  formData,
  errors,
  handleFileChange,
  handelFileToggle,
  fileRef,
  profilePhotoPreview,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Personal Details
      </h2>
      <div>
        <InputField
          label="Phone Number"
          icon={Phone}
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          placeholder="Enter your phone number"
          onChange={handleInputChange}
        />
        {errors.phoneNumber && (
          <p className="text-red-600 text-sm pl-2">{errors.phoneNumber}</p>
        )}
      </div>

      <div>
        <TextareaField
          label="Address"
          icon={MapPin}
          name="address"
          value={formData.address}
          placeholder="Enter your full address"
          onChange={handleInputChange}
        />
        {errors.address && (
          <p className="text-red-600 text-sm pl-2">{errors.address}</p>
        )}
      </div>

      <div>
        <InputField
          label="Citizenship Card Number"
          icon={CreditCard}
          name="citizenshipCard"
          value={formData.citizenshipCard}
          placeholder="Enter citizenship card number"
          onChange={handleInputChange}
        />
        {errors.citizenshipCard && ( 
          <p className="text-red-600 text-sm pl-2">{errors.citizenshipCard}</p>
        )}
      </div>

      <IconUpload icon={Camera} handleFileChange={handleFileChange} handelFileToggle={handelFileToggle} fileRef={fileRef} previewUrl={profilePhotoPreview} />
    </div>
  );
};

export default RenderStep2;
