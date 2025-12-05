import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const Header = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center" onClick={() => navigate("/")}>
            <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold mr-2">
              <Link to="/">W</Link>
            </div>
            <span className="text-xl font-bold text-gray-900">
              <Link to="/">WorkConnect</Link>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="border border-blue-600 text-blue-600 px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 hover:text-white transition-colors cursor-pointer "
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div
                  className="flex items-center space-x-3"
                  onClick={() => navigate("/dashboard/profile")}
                >
                  {user?.profilePicture && (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  )}
                  <span className="font-medium text-gray-700">
                    {user?.fullName || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="border border-blue-600 text-blue-600 px-3 py-2 rounded-lg font-semibold hover:bg-blue-700 hover:text-white transition-colors cursor-pointer "
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
