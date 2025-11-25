import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  ClipboardList,
  FileText,
  MessageCircle,
  DollarSign,
  Star,
  User,
  Settings,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/auth-context";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard />, to: "/dashboard" },
  { label: "Browse Jobs", icon: <Briefcase />, to: "/dashboard/browse-jobs" },
  { label: "Recommendations", icon: <Sparkles />, to: "/dashboard/recommendations" },
  { label: "Post Job", icon: <PlusCircle />, to: "/dashboard/postjob" },
  { label: "My Jobs", icon: <ClipboardList />, to: "/dashboard/myjobs" },
  // { label: "Applications", icon: <FileText />, to: "/dashboard/applications" },
  // { label: "Messages", icon: <MessageCircle />, to: "/dashboard/messages" },
  // { label: "Earnings", icon: <DollarSign />, to: "/dashboard/earnings" },
  // { label: "Reviews", icon: <Star />, to: "/dashboard/reviews" },
  { label: "Profile", icon: <User />, to: "/dashboard/profile" },
  // { label: "Settings", icon: <Settings />, to: "/dashboard/settings" },
];

const DashboardSideNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ").filter(Boolean);
    return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "U";
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
    setOpen(false); // Close mobile menu if open
  };

  return (
    <div>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow"
        onClick={() => setOpen(!open)}
        aria-label="Open sidebar"
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 min-h-screen h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-2xl font-bold text-gray-900">WorkConnect
          </span>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors
                ${
                  location.pathname === item.to
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              onClick={() => setOpen(false)}
            >
              <span className="w-5 h-5">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Profile (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <button 
            onClick={handleProfileClick} 
            className="w-full flex items-center gap-3 text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user?.fullName || "User"} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                {getInitials(user?.fullName)}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || "User"}</div>
              <div className="text-xs text-gray-500 truncate">View profile</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {/* {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )} */}
   </div>
  );
};

export default DashboardSideNavbar;