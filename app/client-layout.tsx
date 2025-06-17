"use client";

import React from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';

// Composant client pour le contenu qui utilise CartProvider et autres fonctionnalités client
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
