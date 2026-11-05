import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import { router } from "./Routes/Routes.jsx";
import AuthProvider from "./Authentication/AuthProvider.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import { useTheme } from "./context/useTheme.js";
import ConfirmProvider from "./Components/ui/ConfirmProvider.jsx";

const Toasts = () => {
  const { theme } = useTheme();
  return <ToastContainer position="top-right" theme={theme} autoClose={4000} newestOnTop />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ConfirmProvider>
          <RouterProvider router={router} />
          <Toasts />
        </ConfirmProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
