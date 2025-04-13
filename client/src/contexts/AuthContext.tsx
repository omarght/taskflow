import React, { createContext, useState, useEffect, useContext } from "react";
import axios, { AxiosError } from "axios";
import { useLocation } from "react-router-dom";

interface LoginResponse {
  status: number;
  success: boolean;
  error: LoginError | null;
}
interface LoginError {
  message: string;
}
interface AuthContextType {
  isAuthenticated: boolean;
  loggedInUser: any | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (password: string, passwordConfirmation: string, token: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const EXCLUDED_ROUTES = ["/reset-password", "/login"]; // Add other routes if needed
  const BASE_URL = 'http://localhost:3000/api';
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

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post("http://localhost:3000/api/login", { email, password }, { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setLoggedInUser(response.data.user);
        return { status: response.status, success: true, error: null };
      } 
  
      if (response.status === 401) {
        return { status: response.status, success: false, error: { message: response.data.error } };
      }
  
      // Default return if response status is something unexpected
      return { status: response.status, success: false, error: { message: "Unexpected response status" } };
  
    } catch (error) {
      if(axios.isAxiosError(error)) {
        return { status: error.response?.status || 500, success: false, error: { message: error.response?.data?.error || "Request failed" } };
      }
      
      console.error("Login failed", error);
      return { status: 500, success: false, error: { message: "Login failed" } };
    }
  };
  

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

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/create-user", { user: { name, email, password } }, { withCredentials: true });
      if (response.status === 201) {
        setIsAuthenticated(true);
        setLoggedInUser(response.data.user);
        return response;
      }
    }
    catch(error) {
      console.error("Signup failed", error);
    }
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await axios.post(`${BASE_URL}/password_resets`, { email });
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // You can access AxiosError properties here
        const errorMessage = error.response?.data?.message || 'Something went wrong.';
        return { success: false, error: errorMessage };
      } else if (error instanceof Error) {
        return { success: false, error: error.message };
      } else {
        return { success: false, error: 'Unknown error occurred' };
      }
    }
  };

  const resetPassword = async (password: string, passwordConfirmation: string, token: string) => {
    console.log('here33')
    try {
      await axios.put(`${BASE_URL}/password_resets/${token}`, { password, password_confirmation: passwordConfirmation });
      return { success: true };
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // You can access AxiosError properties here
        const errorMessage = error.response?.data?.error || 'Something went wrong.';
        return { success: false, error: errorMessage };
      } else if (error instanceof Error) {
        return { success: false, error: error.message };
      } else {
        return { success: false, error: 'Unknown error occurred' };
      }
    }
  };

  useEffect(() => {
    if(!EXCLUDED_ROUTES.includes(location.pathname)) {
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, logout, login, loggedInUser, signup, requestPasswordReset, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
