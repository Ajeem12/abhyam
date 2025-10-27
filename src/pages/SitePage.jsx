import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../redux/slices/projectSlice";

const ProjectCard = ({ project, onClick, isHovered, onHover }) => {
  // Decode base64 project name
  const decodeBase64 = (str) => {
    try {
      return atob(str);
    } catch (e) {
      return str; // Return original if not base64
    }
  };

  const projectName = decodeBase64(project.alldata.project_name);
  const projectData = project.alldata;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={`w-full p-8 bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 flex flex-col text-left overflow-hidden relative ${
        isHovered ? "transform scale-105 shadow-xl" : ""
      }`}
      style={{
        background: isHovered
          ? "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)"
          : "#ffffff",
      }}
    >
      {/* Decorative elements */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-all duration-300 ${
          isHovered ? "bg-blue-100 opacity-50" : "bg-gray-100 opacity-30"
        }`}
      ></div>

      <div className="relative z-10">
        <div className="text-xl font-bold text-gray-800 mb-2">
          {projectName}
        </div>

        {/* Project details */}
        {/* <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Project ID:</span>
            <span className="text-sm font-medium text-gray-800">
              #{projectData.id}
            </span>
          </div> */}

        {/* <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                projectData.status === "1"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {projectData.status === "1" ? "Active" : "Inactive"}
            </span>
          </div> */}

        {/* <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Total Amount:</span>
            <span className="text-sm font-bold text-blue-600">
              ₹{projectData.amount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Created:</span>
            <span className="text-sm text-gray-600">{projectData.date}</span>
          </div>
        </div> */}

        {/* Financial breakdown */}
        {/* <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Financial Breakdown
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-500">Fees</div>
              <div className="font-medium">₹{projectData.project_fees}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Consultancy</div>
              <div className="font-medium">₹{projectData.consultancy}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Turn Key</div>
              <div className="font-medium">₹{projectData.turn_key_basis}</div>
            </div>
          </div>
        </div> */}

        {/* Animated arrow */}
        <div
          className={`flex items-center text-blue-600 font-medium transition-all duration-300 ${
            isHovered ? "translate-x-2" : ""
          }`}
        >
          View project details
          <svg
            className={`w-5 h-5 ml-2 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </button>
  );
};

const SitePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hoveredProject, setHoveredProject] = useState(null);

  // Get projects from Redux store
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    // Fetch projects when component mounts
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleProjectClick = (projectId) => {
    localStorage.setItem("site_id", projectId);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Projects
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchProjects())}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-2xl font-bold text-gray-900 mb-4">
            Select Site
          </h1>
        </div>

        {/* Projects grid */}
        {projects && projects.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.alldata.id || index}
                  project={project}
                  onClick={() => handleProjectClick(project.alldata.id)}
                  isHovered={hoveredProject === index}
                  onHover={() => setHoveredProject(index)}
                />
              ))}
            </div>

            {/* Stats summary */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-lg mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Projects Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {projects.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {projects.filter((p) => p.alldata.status === "1").length}
                  </div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">
                    {projects.filter((p) => p.alldata.status === "0").length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive Projects</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    ₹
                    {projects
                      .reduce(
                        (total, p) => total + parseInt(p.alldata.amount || 0),
                        0
                      )
                      .toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </div> */}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Projects Assigned
            </h2>
            <p className="text-gray-500 mb-6">
              You don't have any projects assigned to you yet.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Browse All Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SitePage;
