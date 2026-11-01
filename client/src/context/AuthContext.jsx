
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("baphin-user");
    const storedToken = localStorage.getItem("baphin-token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid stored user:", error);

        localStorage.removeItem("baphin-user");
        localStorage.removeItem("baphin-token");
      }
    } else {
      localStorage.removeItem("baphin-user");
      localStorage.removeItem("baphin-token");
    }

    setLoading(false);
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
