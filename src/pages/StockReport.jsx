import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  fetchStockEntryReport,
  clearStockEntryReport,
} from "../redux/slices/stockEntryReportSlice";

const StockReport = () => {
  const dispatch = useDispatch();
  const { reportData, loading, error } = useSelector(
    (state) => state.stockEntryReport
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectId, setProjectId] = useState("");

  // Get project_id from localStorage on component mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem("site_id");
    if (storedProjectId) {
      setProjectId(storedProjectId);
    }
  }, []);

  // Handle filter submission
  const handleFilter = () => {
    if (projectId) {
      const formData = {
        project_id: projectId,
        from_date: startDate,
        to_date: endDate,
        search: searchTerm,
      };

      dispatch(fetchStockEntryReport(formData));
    }
  };

  // Fetch initial data when component mounts
  useEffect(() => {
    if (projectId) {
      handleFilter();
    }

    // Cleanup on component unmount
    return () => {
      dispatch(clearStockEntryReport());
    };
  }, [projectId]); // Only run when projectId changes

  // Handle clear filters
  const handleClear = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    // After clearing filters, fetch data with empty filters
    if (projectId) {
      dispatch(
        fetchStockEntryReport({
          project_id: projectId,
          from_date: "",
          to_date: "",
          search: "",
        })
      );
    }
  };

  // Flatten the nested array structure from the API response
  const flattenedData =
    reportData && Array.isArray(reportData) ? reportData.flat() : [];

  return (
    <div className="mb-20">
      <Breadcrumbs />
      <div className="max-w-6xl mx-auto">


        {/* Search and Filter Section */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
          <div className="flex flex-col gap-3">
            {/* Search Input */}
            {/* <div>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search by material name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                />
              </div>
            </div> */}

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  className="block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <span className="text-gray-400 mt-5">-</span>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  className="block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                onClick={handleFilter}
                disabled={loading || !projectId}
              >
                {loading ? "Loading..." : "Filter"}
              </button>
              <button
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-4">Loading report data...</div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-4 text-red-500">Error: {error}</div>
        )}

        {/* Show message if project_id is not available */}
        {!projectId && !loading && (
          <div className="text-center py-4 text-red-500">
            Project ID is not available. Please select a project first.
          </div>
        )}

        {/* Table Section */}
        {!loading && !error && projectId && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                      Material
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                      Stock
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                      Consume
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flattenedData.length > 0 ? (
                    flattenedData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="font-medium text-blue-800 text-xs">
                                {item.material_name?.charAt(0) || "M"}
                              </span>
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900">
                                {item.material_name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.stock !== null ? item.stock : "N/A"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {item.consume || 0}
                        </td>
                        <td
                          className={`px-3 py-2 whitespace-nowrap text-sm font-medium ${item.balance < 0 ? "text-red-600" : "text-green-600"
                            }`}
                        >
                          {item.balance || 0}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-3 py-4 text-center text-sm text-gray-500"
                      >
                        No materials found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockReport;
