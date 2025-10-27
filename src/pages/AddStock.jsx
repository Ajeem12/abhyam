
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addStockEntry,
  fetchVendorList,
  clearStockSuccess,
  clearStockError,
  clearVendorError,
} from "../redux/slices/stockEntrySlice";
import { fetchMaterials } from "../redux/slices/materialSlice";
import Breadcrumbs from "../components/Breadcrumbs";
import { IndianRupee } from "lucide-react";

const StockEntryForm = () => {
  const dispatch = useDispatch();
  const { vendors, vendorLoading, vendorError, success, error, loading } =
    useSelector((state) => state.stock);

  const { materials } = useSelector((state) => state.materials);
  const material = materials.data

  // Get project_id from localStorage
  const project_id = localStorage.getItem("site_id");

  const [formData, setFormData] = useState({
    material_id: "",
    qty: "",
    date: new Date().toISOString().split("T")[0],
    vendor_id: "",
    amount: "",
    bill: [],
    remark: "",
  });

  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(fetchVendorList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Stock entry added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form on successful submission
      setFormData({
        material_id: "",
        qty: "",
        date: new Date().toISOString().split("T")[0],
        vendor_id: "",
        amount: "",
        bill: [],
        remark: "",
      });
      setFileName("");
      dispatch(clearStockSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      dispatch(clearStockError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (vendorError) {
      toast.error(`Failed to load vendors: ${vendorError}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      dispatch(clearVendorError());
    }
  }, [vendorError, dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "bill") {
      const files = Array.from(e.target.files);
      setFormData({
        ...formData,
        bill: files,
      });
      setFileName(files.map((file) => file.name))
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.material_id) {
      setFormError("Please select a material.");
      toast.error("Please select a material.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.qty) {
      setFormError("Please enter quantity.");
      toast.error("Please enter quantity.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.vendor_id) {
      setFormError("Please select a vendor.");
      toast.error("Please select a vendor.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!formData.bill) {
      setFormError("Please upload a bill.");
      toast.error("Please upload a bill.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }


    // Create FormData object for file upload
    const submitData = new FormData();

    // Append all form fields including project_id from localStorage
    submitData.append("project_id", project_id);
    submitData.append("material_id", formData.material_id);
    submitData.append("qty", formData.qty);
    submitData.append("date", formData.date);
    submitData.append("vendor_id", formData.vendor_id);
    submitData.append("remark", formData.remark);
    submitData.append("added_by", "staff");

    // Append amount if available
    if (formData.amount) {
      submitData.append("amount", formData.amount);
    }


    if (formData.bill && formData.bill.length > 0) {
      formData.bill.forEach((file) => {
        submitData.append("bill[]", file);
      });
    }

    dispatch(addStockEntry(submitData));
    setFormError("");
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Breadcrumbs />
      <div className="min-h-screen flex items-center justify-center to-blue-100 mb-20 p-2 ">
        <div className="w-full ">
          {/* Header */}


          {formError && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {formError}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white  overflow-hidden ">
            <div className="p-1">
              <form onSubmit={handleSubmit}>
                {/* First row of fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {/* Material Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Material
                    </label>
                    <div className="relative">
                      <select
                        name="material_id"
                        value={formData.material_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">Select Material</option>
                        {material?.map((material, idx) => (
                          <option
                            key={idx}
                            value={material.id}
                          >
                            {material.material_name}
                          </option>
                        ))}
                      </select>

                    </div>
                  </div>

                  {/* Quantity Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="qty"
                      value={formData.qty}
                      onChange={handleChange}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                      min="1"
                    />
                  </div>
                </div>

                {/* Second row of fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Vendor Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vendor
                    </label>
                    <div className="relative">
                      <select
                        name="vendor_id"
                        value={formData.vendor_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:
                       outline-none transition-all appearance-none bg-white"
                        required
                        disabled={vendorLoading}
                      >
                        <option value="">Select Vendor</option>
                        {vendors.length > 0 ? (
                          vendors.map((vendor, idx) => (
                            <option key={idx} value={vendor.id}>
                              {vendor.vendor_name} - {vendor.vendor_mobile}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            {vendorLoading
                              ? "Loading vendors..."
                              : "No vendors available"}
                          </option>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {vendorLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        ) : (
                          <svg
                            className="h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414
                            l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Amount Field */}
                  <div>
                    <label className=" flex  items-center  text-sm font-semibold text-gray-700 mb-2">
                      Amount (<IndianRupee size={12} className="ml-1" />)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Third row of fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Entry Date Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Entry Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                        required
                        readOnly
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {/* Calendar icon can be added here if needed */}
                      </div>
                    </div>
                  </div>

                  {/* Upload Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Documents
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        name="bill"
                        multiple
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="fileInput"
                      />
                      <div className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center justify-between bg-white">
                        <span className="text-gray-500 truncate mr-2">
                          {fileName.length > 0 ? fileName.join(", ") : "Choose files..."}
                        </span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                          Browse
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: PDF, JPG, PNG (Max 5MB each)
                    </p>
                  </div>

                </div>
                {/* Remark Field (full width) */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remark
                  </label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    placeholder="Add any additional notes or remarks"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  ></textarea>
                </div>
                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white py-4 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none
                 flex items-center justify-center font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Add Stock"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockEntryForm;
