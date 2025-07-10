"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { app } from '../firebaseConfig';

export type User = {
  name: string;
  email: string;
  photoURL?: string;
  uid: string;
};

interface AuthContextType {
  user: User | null;
  signup: (user: { name: string; email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Utilisateur',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || undefined,
          uid: firebaseUser.uid,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signup = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      return { success: true, message: 'Compte créé avec succès.' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true, message: 'Connexion réussie.' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    const auth = getAuth(app);
    signOut(auth);
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