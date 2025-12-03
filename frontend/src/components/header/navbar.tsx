"use client";

import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Add effect to check auth state changes
  useEffect(() => {
    console.log('Auth State Changed:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Debug function to check localStorage
  useEffect(() => {
    const authData = localStorage.getItem('auth-storage');
    console.log('LocalStorage Auth Data:', authData ? JSON.parse(authData) : null);
  }, []);

  return (
    <div className="flex flex-col min-h-content w-full">
      {/* Top Banner */}
      <div className="bg-[#ff9500] text-white py-3 px-4 flex items-center justify-center w-full">
        <p className="text-center flex items-center gap-2">
          Free Courses <span className="text-lg">✦</span> Sale Ends Soon, Get It
          Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </p>
      </div>

      {/* Navigation */}
      <header className="border-b border-gray-200 w-full">
        <div className="w-full px-4 flex items-center justify-between h-16">
          {/* Logo and Nav Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="bg-[#ff9500] w-10 h-10 flex items-center justify-center rounded">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3C16.982 3 21 7.018 21 12C21 16.982 16.982 21 12 21C7.018 21 3 16.982 3 12C3 7.018 7.018 3 12 3ZM12 5C8.134 5 5 8.134 5 12C5 15.866 8.134 19 12 19C15.866 19 19 15.866 19 12C19 8.134 15.866 5 12 5ZM9.414 11.586L12 9L14.586 11.586C14.977 11.977 14.977 12.61 14.586 13C14.195 13.391 13.562 13.391 13.172 13L12 11.828L10.828 13C10.438 13.391 9.805 13.391 9.414 13C9.024 12.61 9.024 11.977 9.414 11.586Z"
                    fill="white"
                  />
                </svg>
              </div>
            </Link>

            <nav className="hidden md:flex items-center ml-8 space-x-6">
              <Link to="/" className="text-[#262626] font-medium hover:bg-[#f1f1f3] px-4 py-2 rounded transition-colors">
                Home
              </Link>
              <Link to="/course-explore" className="text-[#262626] font-medium hover:bg-[#f1f1f3] px-4 py-2 rounded transition-colors">
                Courses
              </Link>
              <Link
                to="/about"
                className="text-[#262626] font-medium hover:bg-[#f1f1f3] px-4 py-2 rounded transition-colors"
              >
                About Us
              </Link>
              <Link to="/pricing" className="text-[#262626] font-medium hover:bg-[#f1f1f3] px-4 py-2 rounded transition-colors">
                Pricing
              </Link>
              <Link to="/contact" className="text-[#262626] font-medium hover:bg-[#f1f1f3] px-4 py-2 rounded transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.role === 'student'
                      ? '/student-dashboard'
                      : user?.role === 'teacher'
                      ? '/teacher-dashboard'
                      : user?.role === 'admin'
                      ? '/admin-dashboard'
                      : '/unauthorized'
                  }
                  className="flex items-center gap-2 text-[#262626] font-medium"
                >
                  <User className="h-4 w-4" />
                  {user?.name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-[#ff9500] text-white font-medium px-6 py-2 rounded"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signup" className="text-[#262626] font-medium">
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-[#ff9500] text-white font-medium px-6 py-2 rounded"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden px-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-[#262626] font-medium">
                Home
              </Link>
              <Link to="/courses-explore" className="text-[#262626] font-medium">
                Courses
              </Link>
              <Link
                to="/about"
                className="bg-[#f1f1f3] text-[#262626] font-medium px-4 py-2 rounded w-fit"
              >
                About Us
              </Link>
              <Link to="/pricing" className="text-[#262626] font-medium">
                Pricing
              </Link>
              <Link to="/contact" className="text-[#262626] font-medium">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={user?.role === 'student' 
                        ? '/student-dashboard' 
                        : user?.role === 'teacher'
                        ? '/teacher-dashboard'
                        : user?.role === 'admin'
                        ? '/admin-dashboard'
                        : '/unauthorized'}
                      className="flex items-center gap-2 text-[#262626] font-medium"
                    >
                      <User className="h-4 w-4" />
                      {user?.name || "Profile"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-[#ff9500] text-white font-medium px-6 py-2 rounded w-fit"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="text-[#262626] font-medium">
                      Sign Up
                    </Link>
                    <Link
                      to="/login"
                      className="bg-[#ff9500] text-white font-medium px-6 py-2 rounded w-fit"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content (empty for now) */}
      <main className="flex-1">{/* Content would go here */}</main>
    </div>
  );
}
