import{ useEffect, useState } from "react";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import axiosInstance from '../../api/axiosInstance';

// Tailwind colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#DC2626", "#9333EA"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
       
        const res = await axiosInstance.get("/dashboard/get")
        setDashboardData(res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (!dashboardData) return <p className="text-center mt-10 text-red-500">No data available.</p>;

  const { user, appliedJobs, selectedJobs, postedJobs, adminStats, charts } = dashboardData;

  return (
    <div className="p-6 space-y-8">
      {/* User Info */}
      <div className="bg-white p-6 shadow rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome, {user.fullName}</h2>
        <p className="text-gray-600">Role: <span className="font-semibold capitalize">{user.role}</span></p>
      </div>

      {/* Worker Dashboard */}
      {(user.role === "worker" || user.role === "both") && (
        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Worker Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Applied vs Selected Chart */}
            <div>
              <h4 className="font-semibold mb-2">Applied vs Selected</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={charts.appliedVsSelected} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {charts.appliedVsSelected.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Jobs Applied Per Category */}
            <div>
              <h4 className="font-semibold mb-2">Jobs Applied Per Category</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.appliedPerCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Hirer Dashboard */}
      {(user.role === "hirer" || user.role === "both") && (
        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Hirer Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Applicants per Job */}
            <div>
              <h4 className="font-semibold mb-2">Applicants per Job</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.applicantsPerJob}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22C55E" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Jobs per Category */}
            <div>
              <h4 className="font-semibold mb-2">Jobs per Category</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={charts.jobsPerCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {charts.jobsPerCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {user.role === "admin" && (
        <div className="bg-white p-6 shadow rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Admin Dashboard</h3>
          <div className="mb-4">
            <p>Total Users: <span className="font-bold">{adminStats.totalUsers}</span></p>
            <p>Total Jobs: <span className="font-bold">{adminStats.totalJobs}</span></p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Users by Role */}
            <div>
              <h4 className="font-semibold mb-2">Users by Role</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={charts.usersByRole} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {charts.usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Jobs by Status */}
            <div>
              <h4 className="font-semibold mb-2">Jobs by Status</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.jobsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
