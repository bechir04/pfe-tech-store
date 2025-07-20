"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const notifVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
};

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [newFavoriteProducts, setNewFavoriteProducts] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [profileNotifications, setProfileNotifications] = useState<any[]>([]);

  // Reset carousel index when user changes (so new features show immediately)
  useEffect(() => {
    setCarouselIndex(0);
  }, [user]);

  useEffect(() => {
    const notif = JSON.parse(localStorage.getItem('newProductsFromFollowed') || '[]');
    setNewProducts(notif);
    // Check for new favorite products
    const favNotif = JSON.parse(localStorage.getItem('newFavoriteProducts') || '[]');
    setNewFavoriteProducts(favNotif);
    // Load profile notifications
    const profileNotif = JSON.parse(localStorage.getItem('profileNotifications') || '[]');
    setProfileNotifications(profileNotif);

    // Listen for localStorage changes (from other tabs/windows)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'profileNotifications') {
        const updated = JSON.parse(localStorage.getItem('profileNotifications') || '[]');
        setProfileNotifications(updated);
      }
      if (event.key === 'newProductsFromFollowed') {
        const updated = JSON.parse(localStorage.getItem('newProductsFromFollowed') || '[]');
        setNewProducts(updated);
      }
      if (event.key === 'newFavoriteProducts') {
        const updated = JSON.parse(localStorage.getItem('newFavoriteProducts') || '[]');
        setNewFavoriteProducts(updated);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleNotifClick = () => {
    // Always re-read notifications before showing
    const notif = JSON.parse(localStorage.getItem('newProductsFromFollowed') || '[]');
    setNewProducts(notif);
    const favNotif = JSON.parse(localStorage.getItem('newFavoriteProducts') || '[]');
    setNewFavoriteProducts(favNotif);
    const profileNotif = JSON.parse(localStorage.getItem('profileNotifications') || '[]');
    setProfileNotifications(profileNotif);
    setShowNotif((v) => !v);
    // Clear notifications when opened
    if (notif.length > 0) {
      localStorage.setItem('newProductsFromFollowed', '[]');
      setNewProducts([]);
    }
    if (favNotif.length > 0) {
      localStorage.setItem('newFavoriteProducts', '[]');
      setNewFavoriteProducts([]);
    }
    if (profileNotif.length > 0) {
      localStorage.setItem('profileNotifications', '[]');
      setProfileNotifications([]);
    }
  };

  // Split navLinks into always-visible and auth-only
  const alwaysVisibleLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/produits/telephones', label: 'Téléphones' },
    { href: '/produits/accessoires', label: 'Accessoires' },
    { href: '/produits/ordinateurs', label: 'PC & Composants' },
  ];
  const authOnlyLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/dashboard/loyalty', label: 'Points & Badges' },
    { href: '/profile/verify', label: 'Vérification' },
  ];
  // Carousel logic: combine alwaysVisibleLinks and authOnlyLinks if logged in
  const navLinks = user ? [...alwaysVisibleLinks, ...authOnlyLinks] : alwaysVisibleLinks;

  // Carousel logic
  const visibleLinks = navLinks.slice(carouselIndex, carouselIndex + 3);
  const canScrollLeft = carouselIndex > 0;
  const canScrollRight = carouselIndex < navLinks.length - 3;

  console.log('Header user:', user);

  return (
    <motion.header
      className="bg-gray-950/90 backdrop-blur shadow-lg sticky top-0 z-30"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo */}
          <Link href="/">
            <div className="text-3xl font-extrabold text-cyan-400 flex items-center cursor-pointer tracking-tight">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              TechStore
            </div>
          </Link>

          {/* Center: Carousel Nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 flex-1 justify-center">
            <button
              className={`p-2 rounded-full transition-colors ${canScrollLeft ? 'hover:bg-cyan-900/70 text-cyan-400' : 'text-gray-600 cursor-not-allowed'}`}
              onClick={() => canScrollLeft && setCarouselIndex(carouselIndex - 1)}
              disabled={!canScrollLeft}
              aria-label="Précédent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-5 py-2 rounded-full font-bold text-lg transition-colors text-gray-100 hover:bg-cyan-900/70 hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ))}
            <button
              className={`p-2 rounded-full transition-colors ${canScrollRight ? 'hover:bg-cyan-900/70 text-cyan-400' : 'text-gray-600 cursor-not-allowed'}`}
              onClick={() => canScrollRight && setCarouselIndex(carouselIndex + 1)}
              disabled={!canScrollRight}
              aria-label="Suivant"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right: Panier, Login, Signup, User */}
          <div className="flex items-center gap-2 lg:gap-4">
            {user && (
              <Link href="/marketplace/post" className="hidden md:inline bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-base font-bold transition shadow">
                Vendre un article
              </Link>
            )}
            <Link href="/panier" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            {/* Notification Bell */}
            <div className="relative">
              <button onClick={handleNotifClick} className="p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400" aria-label="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {(newProducts.length + newFavoriteProducts.length + profileNotifications.length) > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{newProducts.length + newFavoriteProducts.length + profileNotifications.length}</span>
                )}
              </button>
              <AnimatePresence>
                {showNotif && (
                  <motion.div
                    key="notif-dropdown"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={notifVariants}
                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50 p-4"
                  >
                    <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Notifications</h4>
                    <ul className="space-y-2">
                      {profileNotifications.length > 0 && profileNotifications.map((notif, i) => (
                        <li key={i} className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400">{notif.message}</span>
                          <span className="block text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleString()}</span>
                        </li>
                      ))}
                      {newProducts.length > 0 && (
                        <li className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                            <svg className="h-5 w-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z"/></svg>
                            Nouveaux produits de vos vendeurs suivis :
                          </span>
                          <ul className="list-none ml-0 mt-2 space-y-2">
                            {newProducts.map((prod, i) => (
                              <li key={i} className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/30 rounded p-2">
                                {prod.productImage && (
                                  <img src={prod.productImage} alt={prod.productName} className="w-8 h-8 rounded object-cover border border-cyan-300" />
                                )}
                                <span>
                                  <span className="font-bold text-cyan-700 dark:text-cyan-300">{prod.sellerName}</span>
                                  {" "}a ajouté :{" "}
                                  <span className="font-semibold">{prod.productName}</span>
                                </span>
                                <span className="ml-auto text-xs text-gray-400">{new Date(prod.timestamp).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        </li>
                      )}
                      {newFavoriteProducts.length > 0 && (
                        <li className="text-sm text-gray-800 dark:text-gray-200">
                          <span className="font-semibold text-pink-600 dark:text-pink-400">Nouveaux articles favoris :</span>
                          <ul className="list-disc ml-5 mt-1">
                            {newFavoriteProducts.map((prod, i) => (
                              <li key={i}>{prod.name || prod.id}</li>
                            ))}
                          </ul>
                        </li>
                      )}
                      {profileNotifications.length === 0 && newProducts.length === 0 && newFavoriteProducts.length === 0 && (
                        <li className="text-sm text-gray-500">Aucune notification.</li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                {/* Profile avatar */}
                <Link href="/profile" className="w-9 h-9 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold text-lg hover:bg-cyan-600 transition-colors cursor-pointer">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </Link>
                <span className="font-semibold text-cyan-400 text-base">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-base font-bold transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-cyan-400 hover:underline font-bold text-base">Login</Link>
                <Link href="/auth/signup" className="text-cyan-400 hover:underline font-bold text-base">Sign Up</Link>
              </>
            )}
            {/* Hamburger for mobile */}
            <button
              className="md:hidden ml-2 p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 left-0 w-4/5 max-w-xs h-full bg-gray-950 shadow-2xl p-6 flex flex-col gap-4 animate-slide-in">
            <button
              className="self-end mb-4 p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Fermer le menu"
              onClick={() => setMobileOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 rounded-full font-bold text-lg transition-colors text-gray-100 hover:bg-cyan-900/70 hover:text-cyan-400"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link href="/marketplace/post" className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full text-base font-bold transition shadow mt-2" onClick={() => setMobileOpen(false)}>
                Vendre un article
              </Link>
            )}
            <div className="flex gap-2 mt-4">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-base font-bold transition w-full"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/auth/login" className="text-cyan-400 hover:underline font-bold text-base w-full text-center" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link href="/auth/signup" className="text-cyan-400 hover:underline font-bold text-base w-full text-center" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
