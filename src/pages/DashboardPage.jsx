import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaList, FaTimes, FaChartBar, FaLock } from "react-icons/fa";
import { LandPlot } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center m-4">
      <div className="w-full max-w-md grid grid-cols-3 gap-2 mb-4">
        {/* Add Stock */}
        <button
          onClick={() => navigate("/addstock")}
          className="aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ">
            <FaPlus className="text-blue-600 text-sm" />
          </div>
          <span className="text-xs font-medium text-gray-800 text-center">
            Add Stock
          </span>
        </button>

        {/* All Stock */}
        <button
          onClick={() => navigate("/allstock")}
          className="aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center ">
            <FaList className="text-green-600 text-sm" />
          </div>
          <span className="text-xs font-medium text-gray-800 text-center">
            All Stock
          </span>
        </button>

        {/* Day Close */}
        <button
          onClick={() => navigate("/dayclose")}
          className="aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center ">
            <FaTimes className="text-red-600 text-sm" />
          </div>
          <span className="text-xs font-medium text-gray-800 text-center">
            Day Close
          </span>
        </button>

        {/* Stock Report */}
        <button
          onClick={() => navigate("/stockreport")}
          className="aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center ">
            <FaChartBar className="text-purple-600 text-sm" />
          </div>
          <span className="text-xs font-medium text-gray-800 text-center">
            Stock Report
          </span>
        </button>
        {/* Password Change */}
        <button
          onClick={() => navigate("/changepassword")}
          className="aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center ">
            <FaLock className="text-amber-600 text-sm" />
          </div>
          <span className="text-xs font-medium text-gray-800 text-center">
            Change Password
          </span>
        </button>
        <button
          onClick={() => navigate("/plotlist")}
          className="aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center ">
            <LandPlot className="text-amber-600 text-sm" />
          </div>
          <span className="text-xs font-medium text-gray-800 text-center">
            All Plots
          </span>
        </button>
      </div>
    </div >
  );
};

export default Dashboard;
