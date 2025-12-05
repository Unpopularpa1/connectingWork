import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const UpdateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    address: '',
    skills: [],
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    profilePicture: '',
    facebookLink: '',
    instagramLink: '',
    linkedinLink: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
 
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

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/user/profile');
      if (data?.success && data.user) {
        const u = data.user;
        setFormData({
          fullName: u.fullName || '',
          phoneNo: u.phoneNo || '',
          address: u.address || '',
          skills: Array.isArray(u.skills) ? u.skills : [],
          emergencyContactName: u.emergencyContactName || '',
          emergencyContactRelation: u.emergencyContactRelation || '',
          emergencyContactPhone: u.emergencyContactPhone || '',
          profilePicture: u.profilePicture || '',
          facebookLink: u.facebookLink || '',
          instagramLink: u.instagramLink || '',
          linkedinLink: u.linkedinLink || ''
        });
        setPreviewUrl(u.profilePicture || '');
      } else {
        toast.error(data?.message || 'Failed to load profile');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error('User not found');
      return;
    }
    setSaving(true);
    try {
      const endpoint = `/user/update${user._id}`;

      // Build multipart form data
      const form = new FormData();
      form.append('fullName', formData.fullName);
      form.append('phoneNo', formData.phoneNo);
      form.append('address', formData.address);
      form.append('emergencyContactName', formData.emergencyContactName);
      form.append('emergencyContactRelation', formData.emergencyContactRelation);
      form.append('emergencyContactPhone', formData.emergencyContactPhone);
      form.append('facebookLink', formData.facebookLink);
      form.append('instagramLink', formData.instagramLink);
      form.append('linkedinLink', formData.linkedinLink);
      // skills as array
      formData.skills.forEach((s, idx) => form.append(`skills[${idx}]`, s));
      // profile picture: only file upload allowed
      if (selectedFile) {
        form.append('profilePicture', selectedFile);
      }

      const { data } = await axiosInstance.put(endpoint, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data?.success) {
        toast.success('Profile updated');
        navigate('/dashboard/profile');
      } else {
        toast.error(data?.message || 'Failed to update');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/dashboard/profile')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Update Profile</h1>
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar uploader */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                      )}
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                      <Upload className="w-4 h-4" /> Choose file
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skills.map((s) => (
                      <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(s)}
                          onChange={() => handleToggleSkill(s)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                  <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                  <input name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                  <input name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <input name="facebookLink" value={formData.facebookLink} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input name="instagramLink" value={formData.instagramLink} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input name="linkedinLink" value={formData.linkedinLink} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => navigate('/dashboard/profile')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
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

export default UpdateProfile;