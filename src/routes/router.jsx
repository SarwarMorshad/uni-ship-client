import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Coverage from "../pages/Coverage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ErrorPage from "../pages/ErrorPage";
import BeARider from "../pages/BeARider";
import PrivateRoute from "./PrivateRoute";
import SendParcel from "../pages/SendParcel";

export const router = createBrowserRouter([
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
        element: <Coverage></Coverage>,
      },
      {
        path: "/be-a-rider",
        element: (
          <PrivateRoute>
            <BeARider></BeARider>
          </PrivateRoute>
        ),
      },
      {
        path: "/sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
    ],
  },
]);
