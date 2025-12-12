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
import ParcelDetails from "../pages/dashboard/ParcelDetails";
import PaymentPage from "../pages/dashboard/PaymentPage";
import PaymentSuccess from "../pages/dashboard/PaymentSuccess";
import PaymentCancelled from "../pages/dashboard/PaymentCancelled";
import PaymentHistory from "../pages/dashboard/PaymentHistory";
import DashboardOverview from "../pages/dashboard/DashboardOverview";
import ParcelsToPay from "../pages/dashboard/ParcelsToPay";
import AdminRoute from "./Adminroute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

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
        path: "/dashboard",
        element: <DashboardOverview />,
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
        element: <ParcelsToPay />,
      },
      {
        path: "tracking",
        element: <div className="text-2xl font-bold">Tracking - Coming Soon</div>,
      },
      {
        path: "payment-history",
        element: <PaymentHistory />,
      },
      {
        path: "parcel/:id",
        element: <ParcelDetails />,
      },
      {
        path: "pay/:id",
        element: <PaymentPage />,
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancelled/:id",
        element: <PaymentCancelled />,
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
  // Then add admin routes after user dashboard routes:
  {
    path: "admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "parcels",
        element: <div className="p-8 text-2xl font-bold">All Parcels - Coming Soon</div>,
      },
      {
        path: "users",
        element: <div className="p-8 text-2xl font-bold">Users Management - Coming Soon</div>,
      },
      {
        path: "invoices",
        element: <div className="p-8 text-2xl font-bold">Invoices - Coming Soon</div>,
      },
      {
        path: "analytics",
        element: <div className="p-8 text-2xl font-bold">Analytics - Coming Soon</div>,
      },
      {
        path: "riders",
        element: <div className="p-8 text-2xl font-bold">Riders Management - Coming Soon</div>,
      },
      {
        path: "settings",
        element: <div className="p-8 text-2xl font-bold">Settings - Coming Soon</div>,
      },
      {
        path: "change-password",
        element: <div className="p-8 text-2xl font-bold">Change Password - Coming Soon</div>,
      },
      {
        path: "help",
        element: <div className="p-8 text-2xl font-bold">Help - Coming Soon</div>,
      },
    ],
  },
]);
