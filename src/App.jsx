
import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import StockPage from "./pages/StockPage";
import ChangePassword from "./pages/ChangePassword";
import UpdateProfile from "./pages/UpdateProfile";
import StockEntries from "./pages/StockEntries";
import SitePage from "./pages/SitePage";
import ProtectedRoute from "./components/ProtectedRoute";
import DayClose from "./pages/DayClose";
import AddStock from "./pages/AddStock";
import StockReport from "./pages/StockReport";
import AllStock from "./pages/AllStock";
import Location from "./pages/Location";
import Home from "./pages/Home";
import PlotsList from "./components/PlotsList";
import Plot from "./pages/Plot";
import BillDetail from "./pages/BillDetail";

// // Define custom breadcrumb names for routes
const routes = [
  { path: "/login", breadcrumb: "Login" },
  { path: "/site", breadcrumb: "Sites" },
  { path: "/", breadcrumb: "Home" },
  { path: "/projects", breadcrumb: "Projects" },
  { path: "/addstock", breadcrumb: "Add Stock" },
  { path: "/projects/:projectId/stock", breadcrumb: "Project Stock" },
  { path: "/stockentries", breadcrumb: "Stock Entries" },
  { path: "/changepassword", breadcrumb: "Change Password" },
  { path: "/updateprofile", breadcrumb: "Update Profile" },
  { path: "/dayclose", breadcrumb: "Day Close" },
  { path: "/stockreport", breadcrumb: "Stock Report" },
  { path: "/allstock", breadcrumb: "All Stocks" },
  { path: "/location", breadcrumb: "Location" },
  { path: "/plotlist", breadcrumb: "Plot List" },
  { path: "/plotlist/:id", breadcrumb: "" },
];

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/site",
    element: <SitePage />,
  },
  {
    path: "location",
    element: <Location />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "addstock",
        element: <AddStock />,
      },
      {
        path: "projects/:projectId/stock",
        element: <StockPage />,
      },
      {
        path: "stockentries",
        element: <StockEntries />,
      },
      {
        path: "changepassword",
        element: <ChangePassword />,
      },
      {
        path: "plotlist",
        element: <PlotsList />
      },
      {
        path: "updateprofile",
        element: <UpdateProfile />,
      },
      {
        path: "dayclose",
        element: <DayClose />,
      },
      {
        path: "stockreport",
        element: <StockReport />,
      },
      {
        path: "allstock",
        element: <AllStock />,
      },
      {
        path: "bill-detail",
        element: <BillDetail />
      },
      {
        path: "plotlist/:id",
        element: <Plot />,
      }
    ],
  },
]);

// Export routes for use in Breadcrumbs component
export { routes };

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
