import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Home from "../pages/Home";
import Coverage from "../pages/Coverage";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ErrorPage from "../pages/ErrorPage";
import BeARider from "../pages/BeARider";
import SendParcel from "../pages/SendParcel";
import MyParcels from "../pages/dashboard/MyParcels";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../pages/DashboardLayout";

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/coverage",
        element: <Coverage />,
      },
      {
        path: "/be-a-rider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
      },
      {
        path: "/sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Auth Routes
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  // Dashboard Routes (Protected)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <div className="text-2xl font-bold">Dashboard Home - Coming Soon</div>,
      },
      {
        path: "add-parcel",
        element: <SendParcel />,
      },
      {
        path: "my-parcels",
        element: <MyParcels />,
      },
      {
        path: "parcels-to-pay",
        element: <div className="text-2xl font-bold">Parcels To Pay - Coming Soon</div>,
      },
      {
        path: "tracking",
        element: <div className="text-2xl font-bold">Tracking - Coming Soon</div>,
      },
      {
        path: "payment-history",
        element: <div className="text-2xl font-bold">Payment History - Coming Soon</div>,
      },
      {
        path: "parcel/:id",
        element: <div className="text-2xl font-bold">Parcel Details - Coming Soon</div>,
      },
      {
        path: "pay/:id",
        element: <div className="text-2xl font-bold">Payment Page - Coming Soon</div>,
      },
      {
        path: "track/:trackingNo",
        element: <div className="text-2xl font-bold">Track Parcel - Coming Soon</div>,
      },
      {
        path: "settings",
        element: <div className="text-2xl font-bold">Settings - Coming Soon</div>,
      },
      {
        path: "change-password",
        element: <div className="text-2xl font-bold">Change Password - Coming Soon</div>,
      },
      {
        path: "help",
        element: <div className="text-2xl font-bold">Help - Coming Soon</div>,
      },
    ],
  },
]);
