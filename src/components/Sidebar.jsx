import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ sidebarOpen, sidebarRef, setSidebarOpen }) => {
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },

    // {
    // path: "/projects",
    // name: "Projects",
    // icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    // },
    {
      path: "/addstock",
      name: "Add Stock",
      icon: "M12 6v6m0 0v6m0-6h6m-6 0H6", // Plus icon (add symbol)
    },
    {
      path: "/allstock",
      name: "All Stock",
      icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2", // Database/collection icon
    },
    {
      path: "/dayClose",
      name: "DayClose",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", // Calendar with checkmark or clock
    },
    {
      path: "/stockreport",
      name: "Stock Report",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", // Document report icon
    },
    {
      path: "/changepassword",
      name: "Change Password",
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", // Lock/Key icon (already appropriate)
    },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <nav
      ref={sidebarRef}
      className={`fixed md:relative z-20 w-64 bg-gray-900 text-gray-300 flex flex-col transform transition-all duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 h-screen border-r border-gray-800`}
    >
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center py-3 px-4 rounded-md transition-all group ${
                  location.pathname === item.path
                    ? "bg-indigo-800 text-white shadow-lg"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    location.pathname === item.path
                      ? "text-indigo-300"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className="ml-3 font-medium">{item.name}</span>
                {location.pathname === item.path && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-400"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link
          to="/logout"
          onClick={handleLinkClick}
          className="flex items-center py-2 px-4 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md transition-all group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="ml-3 font-medium">Logout</span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
