import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Save, ArrowLeft, Calendar, MapPin, DollarSign, Users, Clock, Briefcase } from 'lucide-react';

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: [],
    location: '',
    applicationDeadline: '',
    salary: '',
    experienceLevel: 'entry',
    jobType: 'full-time',
    numberOfApplicantsRequired: 1
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const categoryOptions = useMemo(() => [
    "Tutoring",
    "Cleaning",
    "Gardening",
    "Security Guard",
    "Cooking",
    "Pet Care",
    "Elderly Care",
    "Handyman",
    "Delivery",
    "Event Help"
  ], []);

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' }
  ];

  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' }
  ];

  const fetchJob = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/job/get-job/${id}`);
      if (data?.success && data.job) {
        const j = data.job;
        setFormData({
          title: j.title || '',
          description: j.description || '',
          category: Array.isArray(j.category) ? j.category : [],
          location: j.location || '',
          applicationDeadline: j.applicationDeadline ? new Date(j.applicationDeadline).toISOString().slice(0, 16) : '',
          salary: j.salary ?? '',
          experienceLevel: j.experienceLevel || 'entry',
          jobType: j.jobType || 'full-time',
          numberOfApplicantsRequired: j.numberOfApplicantsRequired ?? 1
        });
      } else {
        toast.error(data?.message || 'Failed to load job');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (cat) => {
    setFormData((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        numberOfApplicantsRequired: Number(formData.numberOfApplicantsRequired),
        // applicationDeadline should be ISO string; backend expects Date
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : undefined,
      };
      const { data } = await axiosInstance.put(`/job/update-job/${id}`, payload);
      if (data?.success) {
        toast.success('Job updated successfully');
        navigate(`/dashboard/job/${id}`);
      } else {
        toast.error(data?.message || 'Failed to update job');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Update Job</h1>

          {loading ? (
            <div className="text-gray-600">Loading job...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter job title"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the job"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" /> Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, State or Remote"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><DollarSign className="w-4 h-4 inline mr-1" /> Salary (per hour)</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" /> Application Deadline</label>
                  <input
                    type="datetime-local"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Users className="w-4 h-4 inline mr-1" /> Number of Applicants Required</label>
                  <input
                    type="number"
                    name="numberOfApplicantsRequired"
                    value={formData.numberOfApplicantsRequired}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Briefcase className="w-4 h-4 inline mr-1" /> Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {experienceLevels.map(l => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2"><Clock className="w-4 h-4 inline mr-1" /> Job Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {jobTypes.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoryOptions.map((c) => (
                    <label key={c} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.category.includes(c)}
                        onChange={() => handleCategoryChange(c)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => navigate(`/dashboard/job/${id}`)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateJob;