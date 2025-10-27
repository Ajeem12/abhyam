import React from "react";
import { Link, useLocation, useParams, matchPath } from "react-router-dom";
import { routes } from "../App";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-gray-600 my-4">
      <ul className="flex space-x-2">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Dashboard
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Find matching route
          const match = routes.find((route) =>
            matchPath({ path: route.path, end: true }, to)
          );

          // If it's a dynamic param route (like /plotlist/:id)
          let breadcrumbLabel = match?.breadcrumb || value;

          // Show ID if no breadcrumb name is defined
          if (match?.path?.includes(":") && !match?.breadcrumb) {
            breadcrumbLabel = value;
          }

          return (
            <li key={to} className="flex items-center space-x-2">
              <span>/</span>
              {isLast ? (
                <span className="text-gray-500 capitalize">{breadcrumbLabel}</span>
              ) : (
                <Link
                  to={to}
                  className="text-blue-600 hover:underline capitalize"
                >
                  {breadcrumbLabel}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
