import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../redux/slices/projectSlice";

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // SVG Icons
  const Icons = {
    Project: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    Money: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M6 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1H13v2h2.5a.5.5 0 0 1 0 1H13v.341c1.157.207 2 1.201 2 2.409 0 1.38-1.12 2.5-2.5 2.5H8.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 .354-.854H12.5a1.5 1.5 0 0 0 0-3H9a.5.5 0 0 1 0-1h3.5a.5.5 0 0 0 0-1H9a.5.5 0 0 1 0-1h4V6H6.5a.5.5 0 0 1-.5-.5z" />
      </svg>
    ),
    Calendar: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    Client: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    ArrowRight: (
      <svg
        className="w-4 h-4 ml-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    ),
    Loading: (
      <svg
        className="animate-spin h-6 w-6 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    ),
    Error: (
      <svg
        className="h-6 w-6 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    Empty: (
      <svg
        className="h-10 w-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  const decodeBase64 = (str) => {
    try {
      return atob(str);
    } catch {
      return str;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "1": // completed
        return "bg-green-100 text-green-800";
      case "0": // pending
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "1":
        return (
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "0":
        return (
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center items-center">
        {Icons.Loading}
        <div className="mt-4 text-lg font-medium text-gray-700">
          Loading your projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col justify-center items-center">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          {Icons.Error}
        </div>
        <div className="text-lg font-medium text-red-600">
          Error loading projects
        </div>
        <p className="mt-2 text-sm text-gray-600 max-w-md text-center">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-lg bg-blue-100 text-blue-600">
              {Icons.Project}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Your Projects
            </h1>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              {Icons.Empty}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No projects found
            </h3>
            <p className="text-gray-500">
              Get started by creating a new project
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const p = project.alldata; // shortcut for cleaner code
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {decodeBase64(p.project_name)}
                      </h2>
                      <span
                        className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                          p.status
                        )}`}
                      >
                        {getStatusIcon(p.status)}
                        {p.status === "1"
                          ? "Completed"
                          : p.status === "0"
                          ? "In Progress"
                          : "Unknown"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2 text-gray-400">
                          {Icons.Money}
                        </span>
                        <span>Fees: ₹{p.project_fees}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2 text-gray-400">
                          {Icons.Money}
                        </span>
                        <span>Amount: ₹{p.amount}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2 text-gray-400">
                          {Icons.Calendar}
                        </span>
                        <span>Date: {p.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{Icons.Client}</span>
                        <span>Client ID: {p.client_id}</span>
                      </div>
                      <Link
                        to={`/projects/${p.id}/stock`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Stock
                        {Icons.ArrowRight}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
