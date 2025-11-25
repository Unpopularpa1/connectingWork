const User = require("../models/UserSchema");
const Job = require("../models/jobSchema");

// Dashboard Controller with flat chart data
const getDashboard = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Base response
    let dashboardData = { user, charts: {} };

    // ========================
    // Worker Dashboard
    // ========================
    if (user.role === "worker" || user.role === "both") {
      const appliedJobs = await Job.find({ applicants: userId });
      const selectedJobs = await Job.find({ selectedApplicants: userId });

      dashboardData.appliedJobs = appliedJobs;
      dashboardData.selectedJobs = selectedJobs;

      // Jobs applied per category
      const categoryCount = {};
      appliedJobs.forEach(job => {
        job.category.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
      });

      // Flatten into `charts`
      dashboardData.charts.appliedPerCategory = Object.entries(categoryCount).map(
        ([name, value]) => ({ name, value })
      );
      dashboardData.charts.appliedVsSelected = [
        { name: "Applied", value: appliedJobs.length },
        { name: "Selected", value: selectedJobs.length }
      ];
    }

    // ========================
    // Hirer Dashboard
    // ========================
    if (user.role === "hirer" || user.role === "both") {
      const postedJobs = await Job.find({ postedBy: userId });

      dashboardData.postedJobs = postedJobs;

      // Applicants per job
      const applicantsPerJob = postedJobs.map(job => ({
        name: job.title,
        value: job.applicants.length
      }));

      // Jobs per category
      const catCount = {};
      postedJobs.forEach(job => {
        job.category.forEach(cat => {
          catCount[cat] = (catCount[cat] || 0) + 1;
        });
      });

      // Flatten into `charts`
      dashboardData.charts.applicantsPerJob = applicantsPerJob;
      dashboardData.charts.jobsPerCategory = Object.entries(catCount).map(
        ([name, value]) => ({ name, value })
      );
    }

    // ========================
    // Admin Dashboard
    // ========================
    if (user.role === "admin") {
      const totalUsers = await User.countDocuments();
      const totalJobs = await Job.countDocuments();

      const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]);

      const jobsByStatus = await Job.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);

      dashboardData.adminStats = { totalUsers, totalJobs };

      // Flatten into `charts`
      dashboardData.charts.usersByRole = usersByRole.map(r => ({
        name: r._id,
        value: r.count
      }));
      dashboardData.charts.jobsByStatus = jobsByStatus.map(j => ({
        name: j._id,
        value: j.count
      }));
    }

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getDashboard };
