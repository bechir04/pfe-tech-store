"use client";

import React, { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import TawkTo chat widget
const TawkToChat = dynamic(() => import('@/components/TawkToChat'), { ssr: false });

// Animation variants for page transitions
import type { Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.4, 0, 0.2, 1] // cubic-bezier equivalent for 'easeOut'
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { 
      duration: 0.3, 
      ease: [0.4, 0, 1, 1] // cubic-bezier equivalent for 'easeIn'
    } 
  },
};

// Composant client pour le contenu qui utilise CartProvider et autres fonctionnalités client
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    const check = () => {
      setMaintenance(localStorage.getItem('maintenanceMode') === 'true');
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, []);

  // Maintenance overlay (simple, can be improved)
  // Only show overlay if not on admin or dashboard routes
  if (maintenance && !pathname.startsWith('/admin') && !pathname.startsWith('/dashboard')) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white text-center">
        <div className="text-4xl font-bold mb-4">🚧 Site en maintenance</div>
        <div className="text-lg mb-8">Le site sera bientôt disponible. Merci de votre patience !</div>
        <div className="fixed bottom-8 right-8 animate-bounce">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16zm0 0v-2m0-8V8" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            className="flex-1 w-full max-w-[100vw] overflow-x-hidden"
          >
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
        <Footer />
        <TawkToChat />
      </div>
    </CartProvider>
  );
}
