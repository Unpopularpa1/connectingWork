import InputField from "./InputField";

const RenderStep3 = ({
  skills,
  formData,
  handleInputChange,
  handleSkillToggle,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Skills & Emergency Contact
      </h2>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Skills</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSkillToggle(skill)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                formData.skills.includes(skill)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
        {errors.skills && (
          <p className="text-red-500 text-sm pl-2">{errors.skills}</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Emergency Contact
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputField
                label="Contact Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                placeholder="Emergency contact name"
                onChange={handleInputChange}
              />
              {errors.emergencyContactName && (
                <p className="text-red-500 text-sm pl-2">
                  {errors.emergencyContactName}
                </p>
              )}
            </div>

            <div>
              <InputField
                label="Relationship"
                name="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                placeholder="e.g. Sister, Friend"
                onChange={handleInputChange}
              />
              {errors.emergencyContactRelation && (
                <p className="text-red-500 text-sm pl-2">
                  {errors.emergencyContactRelation}
                </p>
              )}
            </div>
          </div>

          <div>
            <InputField
              label="Contact Phone"
              type="tel"
              name="emergencyContactPhone"
              value={formData.emergencyContactPhone}
              placeholder="Emergency contact phone"
              onChange={handleInputChange}
            />
            {errors.emergencyContactPhone && (
              <p className="text-red-500 text-sm pl-2">
                {errors.emergencyContactPhone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderStep3;
