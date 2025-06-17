import React from 'react';
import ProductGrid from '../../components/ProductGrid';
import Link from 'next/link';
import Image from 'next/image';

// Données de démo pour les téléphones
const telephones = [
  {
    id: "001",
    name: "Smartphone Galaxy Pro",
    price: 799.99,
    description: "Écran 6.5 pouces, processeur 8 coeurs, 128GB, caméra 108MP",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop",
    category: "telephones"
  },
  {
    id: "005",
    name: "Smartphone EcoX Mini",
    price: 399.99,
    description: "Compact, 5.4 pouces, 64GB, double caméra, autonomie 2 jours",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=2081&auto=format&fit=crop",
    category: "telephones"
  },
  {
    id: "009",
    name: "Smartphone UltraPixel",
    price: 899.99,
    description: "Caméra professionnelle 200MP, zoom 10x, écran AMOLED 120Hz",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=2129&auto=format&fit=crop",
    category: "telephones"
  },
  {
    id: "010",
    name: "Smartphone Pliable X-Fold",
    price: 1299.99,
    description: "Écran pliable de 7.6 pouces, résistant à l'eau, dual SIM",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=2036&auto=format&fit=crop",
    category: "telephones"
  }
];

export default function TelephonesPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl overflow-hidden mb-8 relative">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=2070&auto=format&fit=crop" 
            alt="Téléphones" 
            fill 
            style={{objectFit: 'cover'}} 
          />
        </div>
        <div className="relative p-8 md:p-12 text-white z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Téléphones</h1>
          <p className="max-w-2xl text-lg md:text-xl text-blue-100 mb-6">
            Découvrez notre gamme de smartphones de dernière génération, offrant les meilleures technologies et performances pour tous vos besoins.
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
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Téléphones
            </Link>
            <Link 
              href="/produits/accessoires"
              className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
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

      <ProductGrid products={telephones} />
    </div>
  );
}
