import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BillDetail = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const ImgUrl = import.meta.env.VITE_IMAGE_BASE_URL;

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        No Bill Data Found
                    </h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    return (
        <div className="min-h-screen bg-white p-4 md:p-6 mb-20">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
                ← Back
            </button>

            {/* Bill Info Card */}
            <div className="border rounded-lg shadow-md p-4">
                <h2 className="text-lg font-bold mb-3 border-b pb-2">Bill Details</h2>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Material:</span>
                        <span>{state.material_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Quantity (Tons):</span>
                        <span>{state.qty || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Amount:</span>
                        <span className="text-green-600 font-semibold">
                            {formatCurrency(state.amount || 0)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Added By:</span>
                        <span>{state.added_by || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">Date:</span>
                        <span>{formatDate(state.date)}</span>
                    </div>

                    {state.remark && (
                        <div className="mt-3">
                            <span className="font-medium text-gray-700">Remark:</span>
                            <p className="text-gray-800 mt-1 p-2 bg-gray-50 rounded-md border">
                                {state.remark}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Images Section */}
            <div className="mt-6">
                <h3 className="text-lg font-bold mb-3 border-b pb-2">Bill Files</h3>

                {state.images && state.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {state.images.map((file, index) => {
                            const fileUrl = `${ImgUrl}/bill/${file.image}`;
                            const isPdf = file.image.toLowerCase().endsWith(".pdf");

                            return (
                                <div
                                    key={index}
                                    className="border rounded-md p-3 flex flex-col items-center justify-center text-center bg-gray-50"
                                >
                                    {isPdf ? (
                                        <>
                                            <p className="font-medium text-gray-700 mb-2">
                                                {file.image}
                                            </p>
                                            <a
                                                href={fileUrl}
                                                download
                                                className="bg-amber-600 text-white px-4 py-1 rounded-md text-sm hover:bg-amber-700 transition"
                                            >
                                                Download PDF
                                            </a>
                                        </>
                                    ) : (
                                        <img
                                            src={fileUrl}
                                            alt={`Bill ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-md"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No files available</p>
                )}
            </div>

        </div>
    );
};

export default BillDetail;
