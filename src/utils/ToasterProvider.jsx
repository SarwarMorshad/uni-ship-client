import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
        },

        // Success toast
        success: {
          duration: 4000,
          style: {
            background: "#caeb66",
            color: "#1e3a4c",
            fontWeight: "bold",
          },
          iconTheme: {
            primary: "#1e3a4c",
            secondary: "#caeb66",
          },
        },

        // Error toast
        error: {
          duration: 4000,
          style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "600",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ef4444",
          },
        },

        // Loading toast
        loading: {
          style: {
            background: "#1e3a4c",
            color: "#caeb66",
            fontWeight: "600",
          },
          iconTheme: {
            primary: "#caeb66",
            secondary: "#1e3a4c",
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
