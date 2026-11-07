
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("baphin-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle authentication failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    // Clear invalid or expired sessions.
    // Do not automatically log out users for ordinary 403 responses.
    if (
      status === 401 &&
      (
        message === "Invalid or expired token" ||
        message === "Authentication required" ||
        message === "User no longer exists"
      )
    ) {
      localStorage.removeItem("baphin-user");
      localStorage.removeItem("baphin-token");

      // Redirect to login only if the user is not already there.
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
