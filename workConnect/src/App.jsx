import WorkConnect from "./components/HomePage/WorkConnect";
import WorkConnectDashboard from "./components/Dashboard/WorkConnectDashboard";
import WorkConnectLogin from "./components/Login/WorkConnectLogin";
import WorkConnectRegistration from "./components/Signup/WorkConnectRegistration";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/auth-context";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/HomePage/Header";
import Error404 from "./pages/error404/Error404";
import DashboardSideNavbar from "./components/sidenavbar/DashboardSideNavbar";
import CreateJob from "./pages/dashboard/CreateJob";
import BrowseJobs from "./pages/dashboard/BrowseJobs";
import SingleJob from "./pages/dashboard/SingleJob";
import Myjobs from "./pages/dashboard/Myjobs";
import UpdateJob from "./pages/dashboard/UpdateJob";
import Userprofile from "./pages/dashboard/Userprofile";
import UpdateProfile from "./pages/dashboard/UpdateProfile";
import UserprofilebyId from "./pages/dashboard/UserprofilebyId";
import RecommendationJob from "./pages/dashboard/RecommendationJob";

function App() {
  const { token } = useAuth();
  const location = useLocation();
  const showSidebar = location.pathname.includes("/dashboard");

  return (
    <>
      {/* Show Header on non-dashboard routes */}
      {!showSidebar && <Header />}

      <div className="min-h-screen">
        {showSidebar ? (
          <div className="flex">
            {/* Sidebar on the left */}
            <DashboardSideNavbar />

            {/* Main content on the right */}
            <div className="flex-1">
              <Routes>
                <Route
                  path="/dashboard"
                  element={token ? <WorkConnectDashboard /> : <Navigate to="/login" replace />}
                />
                  <Route
                  path="/dashboard/postjob"
                  element={token ? <CreateJob /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/dashboard/browse-jobs"
                  element={token ? <BrowseJobs /> : <Navigate to="/login" replace />}
                />
                 <Route
                  path="/dashboard/job/:id"
                  element={token ? <SingleJob /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/dashboard/job/:id/edit"
                  element={token ? <UpdateJob /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/dashboard/myjobs"
                  element={token ? <Myjobs /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/dashboard/profile"
                  element={token ? <Userprofile /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/dashboard/profile/edit"
                  element={token ? <UpdateProfile /> : <Navigate to="/login" replace />}
                />
                   <Route
                  path="/dashboard/profile/:id"
                  element={token ? <UserprofilebyId /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/dashboard/recommendations"
                  element={token ? <RecommendationJob /> : <Navigate to="/login" replace />}
                />
                <Route path="*" element={<Error404 />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<WorkConnect />} />
            <Route
              path="/login"
              element={!token ? <WorkConnectLogin /> : <Navigate to="/" replace />}
            />
            <Route
              path="/signup"
              element={!token ? <WorkConnectRegistration /> : <Navigate to="/" replace />}
            />
            <Route path="*" element={<Error404 />} />
            
          </Routes>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
    </>
  );
}

export default App;
