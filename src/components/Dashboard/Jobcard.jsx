import React from 'react'
import {  MapPin, Briefcase, Clock,  Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Jobcard = ({jobs,loading,error,getStatusBadgeClass}) => {
    const navigate=useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-sm">
    {loading ? (
      <div className="p-8 text-center text-gray-500">Loading jobs...</div>
    ) : error ? (
      <div className="p-8 text-center text-red-600">{error}</div>
    ) : jobs.length === 0 ? (
      <div className="p-8 text-center text-gray-600">No jobs found.</div>
    ) : (
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <li key={job._id} className="p-5 mt-3 hover:shadow-md transition-shadow border border-gray-200 rounded-lg cursor-pointer">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 ">
              <div  onClick={()=>navigate(`/dashboard/job/${job._id}`)} className=''>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  {job.status && (
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${getStatusBadgeClass(job.status)}`}>
                      {job.status}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1 line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {Array.isArray(job.category) && job.category.slice(0, 4).map((c) => (
                    <span key={c} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md">{c}</span>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-2 gap-x-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.experienceLevel}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.jobType}</span>
                  <span className="flex items-center gap-1"><span className="w-4 h-4" />Rs {job.salary}</span>
                  {typeof job.totalNumberOfApplicants === 'number' && typeof job.numberOfApplicantsRequired === 'number' && (
                    <span className="flex items-center gap-1">
                      Applicants: {job.totalNumberOfApplicants}/{job.numberOfApplicantsRequired}
                    </span>
                  )}
                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> Deadline {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Posted by {job.postedBy?.fullName || 'Unknown'} on {new Date(job.datePosted).toLocaleDateString()}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
  )
}

export default Jobcard