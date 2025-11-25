import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Search, MapPin, Briefcase, Clock, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Jobcard from '../../components/Dashboard/Jobcard';

const PAGE_SIZE = 10;

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobType, setJobType] = useState("");

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
    { value: '', label: 'Any Level' },
    { value: 'entry', label: 'Entry' },
    { value: 'mid', label: 'Mid' },
    { value: 'senior', label: 'Senior' }
  ];

  const jobTypes = [
    { value: '', label: 'Any Type' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'internship', label: 'Internship' }
  ];

  const fetchJobs = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page: pageNum,
        limit: PAGE_SIZE,
      };
      if (category) params.category = category;
      if (location) params.location = location;
      if (experienceLevel) params.experienceLevel = experienceLevel;
      if (jobType) params.jobType = jobType;
      if (search) params.search = search;

      const { data } = await axiosInstance.get('/job/jobs', { params });
      if (data?.success) {
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 1);
        setPage(data.currentPage || pageNum);
      } else {
        setJobs([]);
        setTotalPages(1);
        toast.error(data?.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setJobs([]);
      setTotalPages(1);
      setError(err?.response?.data?.message || 'Server error');
      toast.error(err?.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  const onApplyFilters = () => {
    fetchJobs(1);
  };

  const onClearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setExperienceLevel("");
    setJobType("");
    fetchJobs(1);
  };

  const goToPrev = () => {
    if (page > 1) fetchJobs(page - 1);
  };
  const goToNext = () => {
    if (page < totalPages) fetchJobs(page + 1);
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'open') return 'bg-green-100 text-green-700';
    if (status === 'closed') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title or description"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Category</option>
                {categoryOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State or Remote"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {experienceLevels.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {jobTypes.map((jt) => (
                  <option key={jt.value} value={jt.value}>{jt.label}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="md:col-span-6 flex flex-wrap gap-3 mt-2">
              <button onClick={onApplyFilters} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Apply</button>
              <button onClick={onClearFilters} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">Clear</button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
       <Jobcard jobs={jobs} loading={loading} error={error} getStatusBadgeClass={getStatusBadgeClass}/>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={goToPrev}
              disabled={page === 1}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
              
            </button>
            <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
            <button
              onClick={goToNext}
              disabled={page === totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;