import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addStockEntry,
  fetchStockEntries,
  fetchStockList,
} from "../redux/slices/stockEntrySlice";
import { fetchMaterials } from "../redux/slices/materialSlice";

const PAGE_SIZE = 5;

const StockPage = () => {
  const dispatch = useDispatch();
  // const { projectId } = useParams();
  const { projectId } = localStorage.getItem("site_id");

  // Redux state
  const {
    entries,
    stockList,
    loading: stockLoading,
    error: stockError,
    stockListLoading,
    stockListError,
  } = useSelector((state) => state.stock);

  const {
    materials,
    loading: materialLoading,
    error: materialError,
  } = useSelector((state) => state.materials);

  // Local state
  const [formData, setFormData] = useState({
    materialId: "",
    quantity: "",
    entryDate: new Date().toISOString().split("T")[0],
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch materials and stock list
  useEffect(() => {
    dispatch(fetchMaterials());

    if (projectId) {
      const payload = new FormData();
      payload.append("project_id", projectId);
      dispatch(fetchStockList(payload));
    }
  }, [dispatch, projectId]);

  // Form input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("project_id", projectId);
    payload.append("material_id", formData.materialId);
    payload.append("qty", formData.quantity);
    payload.append("date", formData.entryDate);

    const result = await dispatch(addStockEntry(payload));

    if (addStockEntry.fulfilled.match(result)) {
      // Reset form
      setFormData({
        materialId: "",
        quantity: "",
        entryDate: new Date().toISOString().split("T")[0],
      });

      // Reset to first page
      setCurrentPage(1);

      // Refetch stock list
      const refreshPayload = new FormData();
      refreshPayload.append("project_id", projectId);
      dispatch(fetchStockList(refreshPayload));

      // Optional: fetch detailed entries if needed
      dispatch(fetchStockEntries());
    }
  };

  // Pagination
  const totalEntries = stockList?.length || 0;
  const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedEntries =
    stockList?.slice(startIndex, startIndex + PAGE_SIZE) || [];

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Get material name
  const getMaterialName = (id) => {
    const mat = materials?.data?.find((m) => m.id === id);
    return mat ? mat.material_name : `Material ID: ${id}`;
  };

  return (
    <div className="p-2 md:p-2 flex flex-col lg:flex-row gap-4 md:gap-8">
      {/* Stock Table */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-4 md:p-4 overflow-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Stock Entries
        </h2>

        {stockListLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : stockListError ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{stockListError}</p>
          </div>
        ) : stockList?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No stock entries found for this project.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm md:text-base">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Material
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">
                      Entry Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getMaterialName(entry.material_id)}
                      </td>
                      <td className="px-4 py-3">{entry.qty}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Form */}
      <div className="w-full lg:w-96 bg-white rounded-xl shadow-md p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Add Stock Entry
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Add new stock items to your project inventory
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Material Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="materialId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Material
            </label>
            {materialLoading ? (
              <div className="animate-pulse h-10 bg-gray-100 rounded-lg"></div>
            ) : materialError ? (
              <p className="text-red-500 text-sm">{materialError}</p>
            ) : (
              <select
                id="materialId"
                name="materialId"
                value={formData.materialId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Material</option>
                {materials?.data?.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.material_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          {/* Entry Date */}
          <div className="mb-6">
            <label
              htmlFor="entryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Entry Date
            </label>
            <input
              type="date"
              id="entryDate"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm disabled:opacity-50"
            disabled={stockLoading}
          >
            {stockLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
                Adding...
              </>
            ) : (
              <>Add Stock</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockPage;
