import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Jobcard from '../../components/Dashboard/Jobcard';

const Myjobs = () => {
  const [createdJobs, setCreatedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'applied'

  const getStatusBadgeClass = (status) => {
    if (status === 'open') return 'bg-green-100 text-green-700';
    if (status === 'closed') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const fetchMyJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get('/job/myjobs');
      if (data?.success) {
        setCreatedJobs(data.createdJobs || []);
        setAppliedJobs(data.appliedJobs || []);
      } else {
        setError(data?.message || 'Failed to fetch my jobs');
        setCreatedJobs([]);
        setAppliedJobs([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Server error');
      setCreatedJobs([]);
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const tabs = [
    { key: 'created', label: `Created Jobs (${createdJobs.length})` },
    { key: 'applied', label: `Applied Jobs (${appliedJobs.length})` },
  ];

  const renderActiveList = () => {
    if (activeTab === 'created') {
      return <Jobcard jobs={createdJobs} loading={loading} error={error} getStatusBadgeClass={getStatusBadgeClass} />;
    }
    return <Jobcard jobs={appliedJobs} loading={loading} error={error} getStatusBadgeClass={getStatusBadgeClass} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === t.key
                    ? 'border-blue-600 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderActiveList()}
      </div>
    </div>
  );
};

export default Myjobs;