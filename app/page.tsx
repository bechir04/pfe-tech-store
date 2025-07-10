"use client";

import Image from "next/image";
import Link from "next/link";
import ProductGrid from "./components/ProductGrid";
import { useAuth } from "./context/AuthContext";

const featuredProducts = [
  {
    id: "001",
    name: "Smartphone Galaxy Pro",
    price: 799.99,
    description: "Écran 6.5 pouces, processeur 8 coeurs, 128GB, caméra 108MP",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop",
    category: "telephones"
  },
  {
    id: "002",
    name: "Ultrabook Zenith X1",
    price: 1299.99,
    description: "Portable fin et léger, Core i7, 16GB RAM, SSD 512GB, écran 14\"",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    category: "ordinateurs"
  },
  {
    id: "003",
    name: "Écouteurs Sans Fil Pulse",
    price: 149.99,
    description: "Réduction de bruit active, autonomie 30h, résistant à l'eau",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop",
    category: "accessoires"
  },
  {
    id: "004",
    name: "Carte Graphique TurboVision",
    price: 549.99,
    description: "8GB GDDR6, ray tracing, ports HDMI 2.1, performance gaming",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
    category: "ordinateurs"
  }
];

const categories = [
  {
    id: "telephones",
    name: "Téléphones",
    image: "/images/category-phones.jpg",
    description: "Smartphones et téléphones de toutes marques",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: "accessoires",
    name: "Accessoires Multimédia",
    image: "/images/category-accessories.jpg",
    description: "Écouteurs, casques, haut-parleurs et plus",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    )
  },
  {
    id: "ordinateurs",
    name: "PC & Composants",
    image: "/images/category-computers.jpg",
    description: "Ordinateurs, portables et pièces détachées",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-0 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
            alt="Background Tech" 
            fill
            style={{objectFit: 'cover'}} 
            priority 
          />
        </div>
        <div className="relative z-10 flex-1 py-12 px-4 md:px-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-white drop-shadow-lg">Bienvenue chez <span className="text-cyan-400">TechStore</span></h1>
          <p className="text-lg md:text-2xl mb-8 text-gray-200 font-medium drop-shadow">Votre destination high-tech pour tous vos besoins informatiques</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/produits">
              <button className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-md px-6 py-2 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95">Découvrir nos produits</button>
            </Link>
            {!user && (
              <>
                <Link href="/auth/login">
                  <button className="rounded-full bg-gray-800 text-cyan-400 font-semibold shadow-md px-6 py-2 text-base border border-cyan-400 hover:bg-cyan-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95">Se connecter</button>
                </Link>
                <Link href="/auth/signup">
                  <button className="rounded-full bg-white text-cyan-600 font-semibold shadow-md px-6 py-2 text-base border border-cyan-400 hover:bg-cyan-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95">Créer un compte</button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="relative z-10 flex-1 flex justify-center py-8 md:py-0">
          <Image 
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
            alt="Background Tech" 
            width={420}
            height={280}
            className="rounded-xl shadow-lg object-cover"
            priority 
          />
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-100 tracking-tight">Nos Catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer border border-gray-800">
              <div className="bg-cyan-600 p-4 flex justify-center items-center text-white rounded-xl mb-3">
                {category.icon}
              </div>
              <h3 className="text-lg font-bold mb-1 text-white">{category.name}</h3>
              <p className="text-gray-400 text-sm leading-snug">{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-100 tracking-tight">Produits en Vedette</h2>
          <Link href="/produits" className="text-cyan-400 hover:underline flex items-center font-semibold text-sm md:text-base">
            Voir tout
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Advantages Section */}
      <section>
        <div className="bg-gray-900 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100 tracking-tight">Pourquoi Choisir TechStore ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="bg-cyan-600 rounded-full p-3 inline-flex mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white">Livraison Rapide</h3>
              <p className="text-gray-400 text-sm">Livraison sous 24h à 48h pour toutes les commandes passées avant 15h.</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-600 rounded-full p-3 inline-flex mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white">Garantie 2 Ans</h3>
              <p className="text-gray-400 text-sm">Tous nos produits sont garantis 2 ans minimum. SAV réactif.</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-600 rounded-full p-3 inline-flex mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1 text-white">Paiement Sécurisé</h3>
              <p className="text-gray-400 text-sm">Paiements sécurisés via PayPal et toutes cartes bancaires.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
