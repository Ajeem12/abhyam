import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, Boxes, FileText, CalendarCheck } from "lucide-react"; // added Home icon

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/", label: "Home", icon: <Home size={20} /> },
    { path: "/addstock", label: "Add Stock", icon: <Package size={20} /> },
    { path: "/allstock", label: "All Stock", icon: <Boxes size={20} /> },
    { path: "/stockreport", label: "Report", icon: <FileText size={20} /> },
    {
      path: "/dayclose",
      label: "Day Close",
      icon: <CalendarCheck size={20} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md">
      <div className="flex justify-around">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`flex flex-col items-center justify-center py-2 w-full text-xs ${isActive(item.path) ? "text-blue-600 font-bold" : "text-gray-600"
              }`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Footer;
