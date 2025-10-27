import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const Location = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    localStorage.setItem(
                        "userLocation",
                        JSON.stringify({ latitude, longitude })
                    );
                    setLoading(false);
                    navigate("/", { replace: true });
                },
                (err) => {
                    setError("Location permission denied. Please allow location access.");
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
        }
    }, [navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-80 text-center">
                <div className="flex justify-center mb-4">
                    <MapPin className="w-10 h-10 text-blue-600" />
                </div>
                {loading ? (
                    <>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Detecting Location...
                        </h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Please allow access to your location
                        </p>
                        <div className="mt-4 animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    </>
                ) : error ? (
                    <>
                        <h2 className="text-lg font-semibold text-red-600">Error</h2>
                        <p className="text-sm text-gray-500 mt-2">{error}</p>
                    </>
                ) : (
                    <p className="text-gray-600">Redirecting...</p>
                )}
            </div>
        </div>
    );
};

export default Location;
