import React from 'react';
import ProductGrid from '../../components/ProductGrid';
import Link from 'next/link';
import Image from 'next/image';

// Données de démo pour les accessoires
const accessoires = [
  {
    id: "003",
    name: "Écouteurs Sans Fil Pulse",
    price: 149.99,
    description: "Réduction de bruit active, autonomie 30h, résistant à l'eau",
    images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop"],
    category: "accessoires"
  },
  {
    id: "006",
    name: "Casque Gaming RGBFury",
    price: 99.99,
    description: "Son surround 7.1, micro rétractable, éclairage RGB, confortable",
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop"],
    category: "accessoires"
  },
  {
    id: "008",
    name: "Clavier Mécanique RGB",
    price: 129.99,
    description: "Switches bleues, rétroéclairage RGB personnalisable, anti-ghosting",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1965&auto=format&fit=crop"],
    category: "accessoires"
  },
  {
    id: "011",
    name: "Souris Gaming Ultra",
    price: 69.99,
    description: "12000 DPI, 8 boutons programmables, éclairage RVB personnalisable",
    images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965&auto=format&fit=crop"],
    category: "accessoires"
  }
];

export default function AccessoiresPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl overflow-hidden mb-8 relative">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1563770660941-10a2b36e9e66?q=80&w=2070&auto=format&fit=crop" 
            alt="Accessoires" 
            fill 
            style={{objectFit: 'cover'}} 
          />
        </div>
        <div className="relative p-8 md:p-12 text-white z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Accessoires Multimédia</h1>
          <p className="max-w-2xl text-lg md:text-xl text-blue-100 mb-6">
            Augmentez votre expérience tech avec notre gamme d'accessoires de qualité : casques, claviers, souris et bien plus.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link 
              href="/produits"
              className="bg-white text-blue-900 hover:bg-blue-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Tous les produits
            </Link>
            <Link 
              href="/produits/telephones"
              className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Téléphones
            </Link>
            <Link 
              href="/produits/accessoires"
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Accessoires
            </Link>
            <Link 
              href="/produits/ordinateurs"
              className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              PC & Composants
            </Link>
          </div>
        </div>
      </div>

      <ProductGrid products={accessoires} />
    </div>
  );
}
