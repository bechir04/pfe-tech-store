import React from 'react';
import ProductGrid from '../../components/ProductGrid';
import Link from 'next/link';
import Image from 'next/image';

// Données de démo pour les ordinateurs et composants
const ordinateurs = [
  {
    id: "002",
    name: "Ultrabook Zenith X1",
    price: 1299.99,
    description: "Portable fin et léger, Core i7, 16GB RAM, SSD 512GB, écran 14\"",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop"],
    category: "ordinateurs"
  },
  {
    id: "004",
    name: "Carte Graphique TurboVision",
    price: 549.99,
    description: "8GB GDDR6, ray tracing, ports HDMI 2.1, performance gaming",
    images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop"],
    category: "ordinateurs"
  },
  {
    id: "007",
    name: "Moniteur UltraWide 34\"",
    price: 499.99,
    description: "34 pouces incurvé, 3440x1440, 144Hz, temps de réponse 1ms",
    images: ["https://images.unsplash.com/photo-1527443195645-1133f7f28990?q=80&w=2070&auto=format&fit=crop"],
    category: "ordinateurs"
  },
  {
    id: "012",
    name: "PC Gamer TurboX",
    price: 1899.99,
    description: "Ryzen 9, RTX 4080, 32GB RAM, SSD 1TB, refroidissement liquide",
    images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2070&auto=format&fit=crop"],
    category: "ordinateurs"
  }
];

export default function OrdinateursPage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-xl overflow-hidden mb-8 relative">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop" 
            alt="PC et Composants" 
            fill 
            style={{objectFit: 'cover'}} 
          />
        </div>
        <div className="relative p-8 md:p-12 text-white z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">PC & Composants</h1>
          <p className="max-w-2xl text-lg md:text-xl text-blue-100 mb-6">
            Des ordinateurs puissants aux composants de pointe, trouvez tout ce dont vous avez besoin pour votre setup informatique idéal.
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
              className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Accessoires
            </Link>
            <Link 
              href="/produits/ordinateurs"
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              PC & Composants
            </Link>
          </div>
        </div>
      </div>

      <ProductGrid products={ordinateurs} />
    </div>
  );
}
