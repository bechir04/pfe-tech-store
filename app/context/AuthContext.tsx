"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type User = {
  name: string;
  email: string;
  password: string;
};

interface AuthContextType {
  user: User | null;
  signup: (user: User) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (newUser: User) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: User) => u.email === newUser.email)) {
      return { success: false, message: 'Email déjà utilisé.' };
    }
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true, message: 'Compte créé avec succès.' };
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u: User) => u.email === email && u.password === password);
    if (!found) {
      return { success: false, message: 'Email ou mot de passe incorrect.' };
    }
    localStorage.setItem('loggedInUser', JSON.stringify(found));
    setUser(found);
    return { success: true, message: 'Connexion réussie.' };
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 