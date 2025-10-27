import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStockEntryReport,
  clearStockEntryReport,
} from "../redux/slices/stockEntryReportSlice";
import { fetchProjects } from "../redux/slices/projectSlice";

const StockEntries = () => {
  const dispatch = useDispatch();
  const {
    reportData,
    loading: reportLoading,
    error: reportError,
  } = useSelector((state) => state.stockEntryReport);
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);

  const [formState, setFormState] = useState({
    projectId: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  useEffect(() => {
    dispatch(fetchProjects());
    return () => dispatch(clearStockEntryReport());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const { projectId, fromDate, toDate } = formState;
    if (!projectId || !fromDate || !toDate) return;

    const payload = new FormData();
    payload.append("project_id", projectId);
    payload.append("from_date", fromDate);
    payload.append("to_date", toDate);

    dispatch(fetchStockEntryReport(payload));
    setCurrentPage(1);
  };

  // Pagination logic
  const totalEntries = reportData.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const paginatedData = reportData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">
      {/* Filter Form */}
      <div className="bg-white rounded-lg shadow-md p-2 mb-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            {projectsLoading ? (
              <p className="text-gray-500">Loading projects...</p>
            ) : projectsError ? (
              <p className="text-red-500">{projectsError}</p>
            ) : (
              <select
                name="projectId"
                value={formState.projectId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Project</option>
                {projects.map((proj) => (
                  <option key={proj.alldata.id} value={proj.alldata.id}>
                    {proj.project}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={formState.fromDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={formState.toDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={reportLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {reportLoading ? "Loading..." : "Search"}
            </button>
          </div>
        </form>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 text-gray-700">
          Report Results
        </h2>
        <div className="overflow-x-auto p-4">
          {reportLoading && <p>Loading report...</p>}
          {reportError && <p className="text-red-500">{reportError}</p>}
          {!reportLoading && reportData.length === 0 && (
            <p>No records found for the selected criteria.</p>
          )}

          {!reportLoading && paginatedData.length > 0 && (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((rec) => (
                    <tr key={rec.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rec.material_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rec.material_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rec.qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(rec.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {Math.min((currentPage - 1) * pageSize + 1, totalEntries)} to{" "}
                  {Math.min(currentPage * pageSize, totalEntries)} of{" "}
                  {totalEntries} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockEntries;
