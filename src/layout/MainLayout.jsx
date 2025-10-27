import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendLocationData } from "../redux/slices/locationSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!navigator.geolocation) {
      navigate("/location");
      return;
    }
    let intervalId;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const newLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocation(newLocation);
      },
      (err) => {
        console.error("Location error:", err.message);
        navigate("/location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Send location immediately on first load
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const initialLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        dispatch(sendLocationData(initialLocation));
      },
      (err) => {
        console.error("Initial location error:", err.message);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
    );

    // Then send location every 10 minutes
    intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const periodicLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          dispatch(sendLocationData(periodicLocation));
        },
        (err) => {
          console.error("Periodic location error:", err.message);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
    }, 600000);

    return () => {
      navigator.geolocation.clearWatch(watcher);
      clearInterval(intervalId);
    };
  }, [navigate, dispatch]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div>
        <Outlet context={{ location }} />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;



