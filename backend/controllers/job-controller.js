const User = require("../models/UserSchema");
const Job = require("../models/JobSchema");
const mongoose =require('mongoose');
// Create a new job

// ["worker", "hirer", "both", "admin"],
const createjob = async (req, res) => {
    try {
        const { title, description, category, location,applicationDeadline, salary, experienceLevel, jobType, numberOfApplicantsRequired } = req.body;
        if (!title || !description || !category || !location || !applicationDeadline || !salary || !experienceLevel || !jobType || !numberOfApplicantsRequired) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }
            if (req.userInfo.role !== 'hirer' && req.userInfo.role !== 'both' && req.userInfo.role !== 'admin') {
            return res.status(403).json({ success:false, message: 'Only users with hirer or both role can post jobs.' });
        }

        const job = new Job({
            title,
            description,
            category,
            location,
            postedBy:req.userInfo.id,
            applicationDeadline,
            salary,
            experienceLevel,
            jobType,
            numberOfApplicantsRequired
        });
        await job.save();
        res.status(201).json({ 
            success:true,
            message: 'Job created successfully', job });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({
            success:false,
             message: 'Server error' });
    }
}
// Get all jobs with pagination and filtering
const getAllJobs = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, location, experienceLevel, jobType, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (location) filter.location = location;
        if (experienceLevel) filter.experienceLevel = experienceLevel;
        if (jobType) filter.jobType = jobType;
        if (search) filter.$text = { $search: search };
        const jobs = await Job.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('postedBy', 'fullName email');
        const totalJobs = await Job.countDocuments(filter);
        res.status(200).json({
            success:true,
            message:"Jobs fetched successfully",
            jobs,
            totalPages: Math.ceil(totalJobs / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ success:false, message: 'Server error' });
    }
}
// Get a job by ID
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success:false, message: 'Invalid job ID' });
        }
        const job = await Job.findById(id)
        .populate('postedBy', 'fullName email profilePicture')
        .populate('selectedApplicants', 'fullName email profilePicture')
        .populate('applicants', 'fullName email profilePicture');
        if (!job) {
            return res.status(404).json({ success:false, message: 'Job not found' });
        }
        // console.log(job);
        
        res.status(200).json({ success:true, message:"Job fetched successfully", job });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ success:false, message: 'Server error' });
    }
}
// Update a job
const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success:false, message: 'Invalid job ID' });
        }
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ success:false, message: 'Job not found' });
        }
        if (job.postedBy.toString() !== req.userInfo.id && req.userInfo.role !== 'admin') {
            return res.status(403).json({ success:false, message: 'Unauthorized' });
        }
        if(req.userInfo.role !== 'hirer' && req.userInfo.role !== 'both' && req.userInfo.role !== 'admin'){
            return res.status(403).json({ success:false, message: 'Only users with hirer or both role can update jobs.' });
        }
        const UpdatedJob = await Job.findByIdAndUpdate(id, updates, { new: true });
          res.status(200).json({ success:true, message: 'Job updated successfully', UpdatedJob});
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ success:false, message: 'Server error' });
    }
}
// Delete a job
const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success:false, message: 'Invalid job ID' });
        }
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ success:false, message: 'Job not found' });
        }
        if ( req.userInfo.role !== 'admin' && job.postedBy.toString() !== req.userInfo.id ) {
            return res.status(403).json({ success:false, message: 'Unauthorized' });
        }
        if(req.userInfo.role !== 'hirer' && req.userInfo.role !== 'both' && req.userInfo.role !== 'admin'){
            return res.status(403).json({ success:false, message: 'Only users with hirer or both role can delete jobs.' });
        }
        await Job.findByIdAndDelete(id);
        res.status(200).json({ success:true, message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ success:false, message: 'Server error' });
    }
}
// Apply for a job
const applyForJob = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success:false, message: 'Invalid job ID' });
        }
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ success:false, message: 'Job not found' });
        }
        if (job.postedBy.toString() === req.userInfo.id) {
            return res.status(400).json({ success:false, message: 'Cannot apply to your own job' });
        }
        if (job.status === 'closed') {
            return res.status(400).json({ success:false, message: 'Job is closed' });
        }
        if (new Date(job.applicationDeadline) < new Date()) {
            return res.status(400).json({ success:false, message: 'Application deadline has passed' });
        }
        if (job.applicants.includes(req.userInfo.id)) {
            return res.status(400).json({ success:false, message: 'Already applied for this job' });
        }
            
            if(req.userInfo.role !== 'worker' && req.userInfo.role !== 'both'){
                return res.status(403).json({ success:false, message: 'Only users with worker or both role can apply for jobs.' });
            }
       

        job.applicants.push(req.userInfo.id);
        job.totalNumberOfApplicants += 1;
        await job.save();
        res.status(200).json({ success:true, message: 'Applied for job successfully' });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ success:false, message: 'Server error' });
    }

}
const leaveJob = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success:false, message: 'Invalid job ID' });
        }
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ success:false, message: 'Job not found' });
        }
        if (!job.applicants.includes(req.userInfo.id)) {
            return res.status(400).json({ success:false, message: 'Not applied for this job' });
        }

        // Remove user from applicants
        job.applicants = job.applicants.filter(applicantId => applicantId.toString() !== req.userInfo.id);
        job.totalNumberOfApplicants -= 1;

        // Also remove user from selectedApplicants if present
        if (Array.isArray(job.selectedApplicants)) {
            const wasSelected = job.selectedApplicants.some(applicantId => applicantId.toString() === req.userInfo.id);
            if (wasSelected) {
                job.selectedApplicants = job.selectedApplicants.filter(applicantId => applicantId.toString() !== req.userInfo.id);
            }
        }
        if (job.selectedApplicants.length >= job.numberOfApplicantsRequired) {
            job.status = "closed";
          } else {
            job.status = "open";
          }

        await job.save();
        res.status(200).json({ success:true, message: 'Left job application successfully' });
    } catch (error) {
        console.error('Error leaving job:', error);
        res.status(500).json({ success:false, message: 'Server error' });
    }
}
const selectApplicants = async (req, res) => {
    try {
      const { id } = req.params;
      const { applicantIds } = req.body; // Array of applicant IDs to toggle
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid job ID" });
      }
  
      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
  
      // Authorization checks
      if (job.postedBy.toString() !== req.userInfo.id) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }
  
      const toggledApplicants = [];
  
      for (const applicantId of applicantIds) {
        // Ensure applicant actually applied for this job
        if (!job.applicants.includes(applicantId)) continue;
  
        if (job.selectedApplicants.includes(applicantId)) {
          // Already selected → remove (toggle off)
          job.selectedApplicants = job.selectedApplicants.filter(
            (id) => id.toString() !== applicantId.toString()
          );
          toggledApplicants.push({ applicantId, action: "removed" });
        } else {
          // Not selected → add (toggle on)
          job.selectedApplicants.push(applicantId);
          toggledApplicants.push({ applicantId, action: "added" });
        }
      }
  
      // Update job status based on numberOfApplicantsRequired
      if (job.selectedApplicants.length >= job.numberOfApplicantsRequired) {
        job.status = "closed";
      } else {
        job.status = "open";
      }
  
      await job.save();
  
      res.status(200).json({
        success: true,
        message: "Applicants toggled successfully",
        toggledApplicants,
        selectedApplicants: job.selectedApplicants,
      });
    } catch (error) {
      console.error("Error selecting applicants:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  // Controller to get all jobs the user has created or applied for
 

  const getMyJobs = async (req, res) => {
    try {
      const userId = req.userInfo.id;

      // Jobs created by the user
      const [createdJobs, appliedJobs] = await Promise.all([
        Job.find({ postedBy: userId })
          .populate("postedBy", "fullName email profilePicture"),
          
        Job.find({ applicants: userId, postedBy: { $ne: userId } })
          .populate("postedBy", "fullName email profilePicture")
      ]);
      

      res.status(200).json({
        success: true,
        createdJobs,
        appliedJobs,
      });
    } catch (error) {
      console.error("Error fetching user's jobs:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
// Recommendation controller based on past joined jobs
const recommendationJobs = async (req, res) => {
    try {
        const userId = req.userInfo.id;
        const { limit = 10 } = req.query;

        // Get user's past job history (jobs they were selected for)
        const pastJobs = await Job.find({
            selectedApplicants: userId,
            status: 'closed'
        }).populate('postedBy', 'fullName email');

        if (pastJobs.length === 0) {
            // If no past jobs, return recent open jobs
            const recentJobs = await Job.find({ 
                status: 'open',
                postedBy: { $ne: userId },
                applicants: { $nin: [userId] }
            })
            .populate('postedBy', 'fullName email profilePicture')
            .sort({ datePosted: -1 })
            .limit(parseInt(limit));

            return res.status(200).json({
                success: true,
                message: "No past job history found. Showing recent jobs.",
                recommendations: recentJobs,
                totalRecommendations: recentJobs.length
            });
        }

        // Analyze user's job preferences from past jobs
        const preferences = analyzeJobPreferences(pastJobs);
        
        // Find similar jobs based on preferences
        const recommendations = await findSimilarJobs(userId, preferences, parseInt(limit));
       
        
        res.status(200).json({
            success: true,
            message: "Job recommendations generated successfully",
            recommendations,
            totalRecommendations: recommendations.length,
            userPreferences: {
                topCategories: preferences.categories.slice(0, 3),
                preferredLocations: preferences.locations.slice(0, 3),
                preferredJobTypes: preferences.jobTypes.slice(0, 3),
                averageSalary: preferences.averageSalary
            }
        });
        

    } catch (error) {
        console.error('Error generating job recommendations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while generating recommendations' 
        });
    }
};

// Helper function to analyze user's job preferences
const analyzeJobPreferences = (pastJobs) => {
    const categoryCount = {};
    const locationCount = {};
    const jobTypeCount = {};
    const experienceLevelCount = {};
    let totalSalary = 0;
    let salaryCount = 0;

    pastJobs.forEach(job => {
        // Count categories
        if (Array.isArray(job.category)) {
            job.category.forEach(cat => {
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            });
        }

        // Count locations
        locationCount[job.location] = (locationCount[job.location] || 0) + 1;

        // Count job types
        jobTypeCount[job.jobType] = (jobTypeCount[job.jobType] || 0) + 1;

        // Count experience levels
        experienceLevelCount[job.experienceLevel] = (experienceLevelCount[job.experienceLevel] || 0) + 1;

        // Calculate average salary
        if (job.salary) {
            totalSalary += job.salary;
            salaryCount++;
        }
    });

    // Sort by frequency and return top preferences
    const categories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .map(([category]) => category);

    const locations = Object.entries(locationCount)
        .sort(([,a], [,b]) => b - a)
        .map(([location]) => location);

    const jobTypes = Object.entries(jobTypeCount)
        .sort(([,a], [,b]) => b - a)
        .map(([jobType]) => jobType);

    const experienceLevels = Object.entries(experienceLevelCount)
        .sort(([,a], [,b]) => b - a)
        .map(([level]) => level);

    return {
        categories,
        locations,
        jobTypes,
        experienceLevels,
        averageSalary: salaryCount > 0 ? Math.round(totalSalary / salaryCount) : 0
    };
};

// Helper function to find similar jobs based on preferences
const findSimilarJobs = async (userId, preferences, limit) => {
    const { categories, locations, jobTypes, experienceLevels, averageSalary } = preferences;

    // Build aggregation pipeline for job recommendations
    const pipeline = [
        // Match open jobs that user hasn't applied to and didn't post
        {
            $match: {
                status: 'open',
                postedBy: { $ne: new mongoose.Types.ObjectId(userId) },
                applicants: { $nin: [new mongoose.Types.ObjectId(userId)] },
                applicationDeadline: { $gt: new Date() }
            }
        },
        // Add scoring fields
        {
            $addFields: {
                score: {
                    $add: [
                        // Category match score (highest weight)
                        {
                            $multiply: [
                                {
                                    $size: {
                                        $setIntersection: ['$category', categories]
                                    }
                                },
                                10
                            ]
                        },
                        // Location match score
                        {
                            $cond: [
                                { $in: ['$location', locations] },
                                5,
                                0
                            ]
                        },
                        // Job type match score
                        {
                            $cond: [
                                { $in: ['$jobType', jobTypes] },
                                3,
                                0
                            ]
                        },
                        // Experience level match score
                        {
                            $cond: [
                                { $in: ['$experienceLevel', experienceLevels] },
                                2,
                                0
                            ]
                        },
                        // Salary proximity score (within 20% of average)
                        {
                            $cond: [
                                {
                                    $and: [
                                        { $gt: ['$salary', averageSalary * 0.8] },
                                        { $lt: ['$salary', averageSalary * 1.2] }
                                    ]
                                },
                                2,
                                0
                            ]
                        },
                        // Recency bonus (newer jobs get slight boost)
                        {
                            $multiply: [
                                {
                                    $divide: [
                                        { $subtract: [new Date(), '$datePosted'] },
                                        86400000 // milliseconds in a day
                                    ]
                                },
                                -0.1 // negative to give newer jobs higher scores
                            ]
                        }
                    ]
                }
            }
        },
        // Sort by score (highest first)
        { $sort: { score: -1, datePosted: -1 } },
        // Limit results
        { $limit: limit },
        // Populate postedBy field
        {
            $lookup: {
                from: 'users',
                localField: 'postedBy',
                foreignField: '_id',
                as: 'postedBy',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            email: 1,
                            profilePicture: 1
                        }
                    }
                ]
            }
        },
        {
            $unwind: '$postedBy'
        }
    ];

    const recommendations = await Job.aggregate(pipeline);
    return recommendations;
};




module.exports = { createjob, getAllJobs, getJobById, updateJob, deleteJob, applyForJob, leaveJob, selectApplicants, getMyJobs, recommendationJobs };
