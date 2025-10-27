import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlotById } from "../redux/slices/plotByIdSlice";
import {
    MapPin,
    AlertCircle,

} from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";

const Plot = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { data: plot, loading, error } = useSelector((state) => state.plotById);

    useEffect(() => {
        if (id) {
            dispatch(fetchPlotById(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center">
                <AlertCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-red-700">Error</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={() => dispatch(fetchPlotById(id))}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!plot || !plot.data || plot.data.length === 0) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center">
                <MapPin className="h-14 w-14 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700">
                    No Plot Found
                </h2>
                <p className="text-gray-500">There are no details available.</p>
            </div>
        );
    }

    return (
        <>
            <div className="p-2">
                <Breadcrumbs />
            </div>
            <div className="p-2 grid grid-cols-4 gap-2 mb-20">
                {plot?.data?.map((item, idx) => (
                    <div
                        key={idx}
                        className={`rounded-lg p-3 w-20 shadow-sm text-center text-white ${item.status === "1" ? "bg-[#0e6f0e91]" : "bg-gray-400"
                            }`}
                    >
                        {/* Project Name OR Booking ID fallback */}
                        <h2 className="text-base font-semibold mb-1">
                            {item.plot_name}
                        </h2>

                        {/* Address (from booking if project_address is null) */}
                        <p className="text-xs">
                            {item.plot_area} sqft
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};




export default Plot;
