import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { MapPin, Briefcase, Clock, Calendar, Users, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/auth-context';



const getUserInitials = (fullName) => {
  if (!fullName) return 'U';
  const parts = fullName.trim().split(' ').filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return letters || 'U';
};

const SingleJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const isOwner = !!(user && job && job.postedBy && (user._id === job.postedBy._id));
  const canSelectApplicants = isOwner;

  const fetchJob = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get(`/job/get-job/${id}`);
      if (data?.success) {
        setJob(data.job);
      } else {
        setError(data?.message || 'Failed to fetch job');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJob();
    
  }, [id]);

  const handleApply = async () => {
    setActionLoading(true);
    try {
    
      await axiosInstance.post(`/job/apply/${id}`);
      toast.success('Applied successfully');
      fetchJob();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to apply');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setActionLoading(true);
    try {
      
      await axiosInstance.post(`/job/leave/${id}`);
      toast.success('Left application successfully');
      fetchJob();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to leave');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if ( !user.role==="admin" && !isOwner) return;
    if (!confirm('Are you sure you want to delete this job?')) return;
    setActionLoading(true);
    try {

      await axiosInstance.delete(`/job/delete-job/${id}`);
      toast.success('Job deleted');
      navigate('/dashboard/browse-jobs');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = () => {
    if ( !user.role==="admin" && !isOwner) return;
    navigate(`/dashboard/job/${id}/edit`);
  };

  // Determine if current user has already applied
  const hasApplied = Array.isArray(job?.applicants) && user && job.applicants.some((a) => {
    const idA = (a && a._id) ? String(a._id) : String(a);
    const idU = String(user._id || '');
    return idA === idU;
  });

  const isApplicantSelected = (applicantId) => {
    if (!Array.isArray(job?.selectedApplicants)) return false;
    return job.selectedApplicants.some((sa) => {
      const idS = (sa && sa._id) ? String(sa._id) : String(sa);
      return idS === String(applicantId);
    });
  };

  const handleToggleSelect = async (applicantId) => {
    if (!canSelectApplicants) return;
    setActionLoading(true);
    try {
      await axiosInstance.post(`/job/select-applicants/${id}`, { applicantIds: [applicantId] });
      toast.success('Selection updated');
      fetchJob();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update selection');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : !job ? (
            <div className="text-center text-gray-600">Job not found.</div>
          ) : (
            <div>
              {/* Header with title and status */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    {job.status && (
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {job.status}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{job.description}</p>
                </div>
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {!isOwner && (user.role==="both" || user.role==="worker") && (
                    <>
                      {!hasApplied && (
                        <button disabled={actionLoading} onClick={handleApply} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">Apply</button>
                      )}
                      {hasApplied && (
                        <button disabled={actionLoading} onClick={handleLeave} className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50">Leave</button>
                      )}
                    </>
                  )}
                  {(isOwner || user.role==="admin") && (
                    <>
                      <button disabled={actionLoading} onClick={handleUpdate} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">Update</button>
                      <button disabled={actionLoading} onClick={handleDelete} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">Delete</button>
                    </>
                  )}
                </div>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700 mb-6">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {job.experienceLevel}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {job.jobType}</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Applicants: {job.totalNumberOfApplicants}/{job.numberOfApplicantsRequired}</span>
                {job.salary !== undefined && (
                  <span className="flex items-center gap-2">Rs {job.salary}</span>
                )}
                {job.applicationDeadline && (
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Deadline {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                )}
              </div>

              {/* Posted By */}
              {job.postedBy && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Posted By</h3>
                  <div className="flex items-center gap-3">
                    {job.postedBy.profilePicture ? (
                      <img src={job.postedBy.profilePicture} alt={job.postedBy.fullName || 'User'} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                        {getUserInitials(job.postedBy.fullName)}
                      </div>
                    )}
                    <div>
                      <div className="text-gray-900 font-medium">{job.postedBy.fullName || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Applicants */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Applicants ({job.applicants?.length || 0})</h3>
                {Array.isArray(job.applicants) && job.applicants.length > 0 ? (
                  <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                    {job.applicants.map((app) => {
                      const appId = app._id || app;
                      const selected = isApplicantSelected(appId);
                      return (
                        <li key={appId} className="p-3 flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3" onClick={()=>navigate(`/dashboard/profile/${app._id}`)}>
                            {app.profilePicture ? (
                              <img src={app.profilePicture} alt={app.fullName || 'Applicant'} className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-semibold">
                                {getUserInitials(app.fullName)}
                              </div>
                            )}
                            <div>
                              <div className="text-gray-900 text-sm font-medium">{app.fullName || 'Unknown'}</div>
                              {selected && <div className="text-xs text-green-600">Selected</div>}
                            </div>
                          </div>
                          {canSelectApplicants && (
                            <button
                              disabled={actionLoading}
                              onClick={() => handleToggleSelect(appId)}
                              className={`${selected ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'} px-3 py-1 rounded-md text-sm border ${selected ? 'border-red-200' : 'border-green-200'}`}
                            >
                              {selected ? 'Unselect' : 'Select'}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-600">No applicants yet.</div>
                )}
              </div>

              {/* Selected Applicants */}
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Selected Applicants ({job.selectedApplicants?.length || 0})</h3>
                {Array.isArray(job.selectedApplicants) && job.selectedApplicants.length > 0 ? (
                  <ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
                    {job.selectedApplicants.map((app) => (
                      <li key={app._id || app} className="p-3 flex items-center gap-3" onClick={()=>navigate(`/dashboard/profile/${app._id}`)}>
                        {app.profilePicture ? (
                          <img src={app.profilePicture} alt={app.fullName || 'Applicant'} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-semibold">
                            {getUserInitials(app.fullName)} 
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-gray-900 text-sm font-medium">{app.fullName || 'Unknown'}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-600">No one selected yet.</div>
                )}
              </div>

              
          
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleJob;