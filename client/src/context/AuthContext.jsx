
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // VERIFY SESSION WHEN APP LOADS
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("baphin-token");

      if (!token) {
        localStorage.removeItem("baphin-user");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const authenticatedUser = response.data.user;

        localStorage.setItem(
          "baphin-user",
          JSON.stringify(authenticatedUser)
        );

        setUser(authenticatedUser);
      } catch (error) {
        console.error(
          "Session verification failed:",
          error.response?.data?.message || error.message
        );

        localStorage.removeItem("baphin-user");
        localStorage.removeItem("baphin-token");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // LOGIN
  const login = (userData, token) => {
    if (!userData || !token) {
      console.error("Login requires both user data and a token.");
      return;
    }

    localStorage.setItem("baphin-user", JSON.stringify(userData));
    localStorage.setItem("baphin-token", token);

    setUser(userData);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);

    localStorage.removeItem("baphin-user");
    localStorage.removeItem("baphin-token");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
