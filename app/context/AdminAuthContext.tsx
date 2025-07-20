"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminAuth = () => {
      const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
      const username = localStorage.getItem('adminUsername');

      if (isAuthenticated && username) {
        setAdminUser({
          username,
          isAuthenticated: true
        });
      }
    };

    checkAdminAuth();
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Multiple hardcoded admin credentials
    const adminCredentials = [
      { username: 'bechir', password: '123' },
      { username: 'hbib', password: '123' } // New admin added
    ];
  
    const matchedAdmin = adminCredentials.find(
      (admin) => admin.username === username && admin.password === password
    );
  
    if (matchedAdmin) {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminUsername', matchedAdmin.username);
  
      setAdminUser({
        username: matchedAdmin.username,
        isAuthenticated: true
      });
  
      return true;
    }
  
    return false;
  };
  

  const logout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
    setAdminUser(null);
    router.push('/admin/login');
  };

  const value = {
    adminUser,
    login,
    logout,
    isLoading
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 