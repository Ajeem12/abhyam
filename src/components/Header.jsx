
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { fetchProjects } from "../redux/slices/projectSlice";

const Header = ({ sidebarOpen, setSidebarOpen, menuButtonRef }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get projects from Redux store
  const { projects, loading, error } = useSelector((state) => state.projects);

  // Get current site ID from localStorage
  const siteId = localStorage.getItem("site_id");

  // Get current project from store or use first project as default
  const currentProject =
    useSelector((state) => state.projects?.currentProject) ||
    (projects.length > 0
      ? projects.find((project) => project.alldata?.id == siteId) || {
        id: projects[0].alldata?.id,
        name: projects[0].project,
      }
      : { id: null, name: "No Projects" });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProjectSelect = (projectId) => {
    if (!projectId) return;

    const selectedProject = projects.find((p) => p.alldata.id == projectId);
    if (!selectedProject) return;

    // Save selected site ID to localStorage
    localStorage.setItem("site_id", selectedProject.alldata.id);

    // You might want to add a setCurrentProject action to your slice
    // For now, we'll just navigate to a project page
    // ....................................................this is important line......................
    // navigate(`/project/${selectedProject.alldata.id}`);
    navigate(`/`);

    // Refresh the page to apply the new site selection
    window.location.reload();
  };

  return (
    <>
      <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-15 px-4 md:px-6 mx-auto">
          {/* Left - Menu + Logo */}
          <div className="flex items-center">
            {/* <button
              ref={menuButtonRef}
              className="mr-3 md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button> */}

            <Link to="/" className="flex items-center">
              <img
                src="/images/logo1(2).png"
                alt="ABHYAM DEVELOPERS Logo"
                className="w-[180px] md:w-[215px] object-contain h-auto"
              />
            </Link>

            {/* Desktop Project Selector - Hidden on mobile */}
            <div className="hidden md:block ml-6 relative">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                {loading ? (
                  <span className="font-medium text-gray-800">Loading...</span>
                ) : projects.length === 0 ? (
                  <span className="font-medium text-gray-800">No Projects</span>
                ) : (
                  <select
                    value={siteId || projects[0]?.alldata?.id || ""}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                    className="bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 transition-colors duration-200 font-medium text-gray-800 truncate max-w-[180px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {projects.map((project) => (
                      <option
                        key={project.alldata.id}
                        value={project.alldata.id}
                      >
                        {project.project}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Right - Profile Dropdown */}
          <div className="flex items-center space-x-4 md:space-x-5">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 md:space-x-3 focus:outline-none"
              >
                <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">AU</span>
                </div>
                <span className="hidden md:inline-block font-medium text-gray-700">
                  Admin
                </span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {/* <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    Signed in as{" "}
                    <span className="font-medium">admin@abhyam.com</span>
                  </div> */}
                  {/* <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link> */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Mobile Project Selector - Visible only on mobile */}
        <div className="md:hidden border-t border-gray-100 px-4 py-2 ">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 mr-2 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            {loading ? (
              <span className="text-sm font-medium text-gray-700">
                Loading...
              </span>
            ) : projects.length === 0 ? (
              <span className="text-sm font-medium text-gray-700">
                No Projects
              </span>
            ) : (
              <select
                value={siteId || projects[0]?.alldata?.id || ""}
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-gray-700"
              >
                {projects.map((project) => (
                  <option key={project.alldata.id} value={project.alldata.id}>
                    {project.project}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
