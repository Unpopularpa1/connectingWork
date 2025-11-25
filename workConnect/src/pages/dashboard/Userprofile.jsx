import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Phone, MapPin, User2, Facebook, Instagram, Linkedin } from 'lucide-react';

const getInitials = (fullName) => {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(' ').filter(Boolean);
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'U';
};

const Userprofile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get('/user/profile');
      if (data?.success) {
        setProfile(data.user);
      } else {
        setError(data?.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const canEdit = !!user && !!profile && String(user._id) === String(profile._id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="text-gray-600">Loading profile...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : !profile ? (
            <div className="text-gray-600">No profile data.</div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-4">
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.fullName || 'User'} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                    {getInitials(profile.fullName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">{profile.fullName || 'User'}</h1>
                  <div className="text-sm text-gray-600">{profile.role}</div>
                </div>
                {canEdit && (
                  <button onClick={() => navigate('/dashboard/profile/edit')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>

              {/* Details */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {profile.email || '—'}</div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile.phoneNo || '—'}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile.address || '—'}</div>
                <div className="flex items-center gap-2"><User2 className="w-4 h-4" /> Citizenship: {profile.citizenshipCardNO || '—'}</div>
              </div>

              {/* Skills */}
              {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(profile.facebookLink || profile.instagramLink || profile.linkedinLink) && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Social Links</h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {profile.facebookLink && (
                      <a href={profile.facebookLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline">
                        <Facebook className="w-4 h-4" /> 
                      </a>
                    )}
                    {profile.instagramLink && (
                      <a href={profile.instagramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-pink-700 hover:underline">
                        <Instagram className="w-4 h-4" /> 
                      </a>
                    )}
                    {profile.linkedinLink && (
                      <a href={profile.linkedinLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {(profile.emergencyContactName || profile.emergencyContactPhone) && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                  <div className="text-sm text-gray-700">{profile.emergencyContactName || '—'} ({profile.emergencyContactRelation || '—'})</div>
                  <div className="text-sm text-gray-700">{profile.emergencyContactPhone || '—'}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userprofile;