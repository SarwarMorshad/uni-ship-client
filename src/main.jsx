import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { router } from "./routes/router.jsx";
import { RouterProvider } from "react-router";
import AuthProvider from "./provider/AuthProvider.jsx";
import ToasterProvider from "./utils/ToasterProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToasterProvider />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
