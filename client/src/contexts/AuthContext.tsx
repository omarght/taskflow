import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  loggedInUser: any | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any | null>(null);

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/check", { withCredentials: true });
      setIsAuthenticated(response.status === 200);
      if(response.status === 200) {
        setLoggedInUser(response.data.user);
      }
    } catch {
      setIsAuthenticated(false);
      setLoggedInUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", { email, password }, { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setLoggedInUser(response.data.user);
      }
    } catch(error) {
      console.error("Login failed", error);
    }
  }

  const logout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/logout", { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(false);
        setLoggedInUser(null);
      }
    } catch(error) {
      console.error("Logout failed", error);
    }
  }

  useEffect(() => {
    checkAuth(); // Check auth on app load
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, logout, login, loggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
