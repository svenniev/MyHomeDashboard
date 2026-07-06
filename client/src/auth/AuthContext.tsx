import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { ApplicationUser } from '../types';

interface AuthContextType {
  user: ApplicationUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ApplicationUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await authApi.getMe();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (credentials: any) => {
    const { data } = await authApi.login(credentials);
    setUser(data);
  };

  const register = async (data: any) => {
    const { data: newUser } = await authApi.register(data);
    setUser(newUser);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const contextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
