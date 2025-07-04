"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-blue-400 flex items-center cursor-pointer">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              TechStore
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white">
              Accueil
            </Link>
            <Link href="/produits/telephones" className="text-gray-300 hover:text-white">
              Téléphones
            </Link>
            <Link href="/produits/accessoires" className="text-gray-300 hover:text-white">
              Accessoires
            </Link>
            <Link href="/produits/ordinateurs" className="text-gray-300 hover:text-white">
              PC & Composants
            </Link>
            <Link href="/marketplace" className="text-gray-300 hover:text-white">
              Marketplace
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/marketplace/post" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold transition">
              Vendre un article
            </Link>
            <Link href="/panier" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-cyan-400">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm font-semibold transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-cyan-400 hover:underline font-semibold">Login</Link>
                <Link href="/auth/signup" className="text-cyan-400 hover:underline font-semibold">Sign Up</Link>
              </>
            )}
            <button className="md:hidden" aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
