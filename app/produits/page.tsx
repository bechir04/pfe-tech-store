import React from 'react';
import ProductGrid from '../components/ProductGrid';
import Link from 'next/link';

// Données de démo pour les produits
// Dans un environnement réel, ces données viendraient d'une API ou d'une base de données
const products = [
  {
    id: "001",
    name: "Smartphone Galaxy Pro",
    price: 799.99,
    description: "Écran 6.5 pouces, processeur 8 coeurs, 128GB, caméra 108MP",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop",
    category: "telephones",
    seller: {
      id: "s001",
      name: "Jean Dupont",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      badges: ["verified", "top-seller"],
      rating: 4.8,
      verified: true
    }
  },
  {
    id: "002",
    name: "Ultrabook Zenith X1",
    price: 1299.99,
    description: "Portable fin et léger, Core i7, 16GB RAM, SSD 512GB, écran 14\"",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    category: "ordinateurs",
    seller: {
      id: "s002",
      name: "Marie Martin",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      badges: ["verified"],
      rating: 4.6,
      verified: true
    }
  },
  {
    id: "003",
    name: "Écouteurs Sans Fil Pulse",
    price: 149.99,
    description: "Réduction de bruit active, autonomie 30h, résistant à l'eau",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop",
    category: "accessoires",
    seller: {
      id: "s003",
      name: "Pierre Durand",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      badges: ["loyalty"],
      rating: 4.4,
      verified: false
    }
  },
  {
    id: "004",
    name: "Carte Graphique TurboVision",
    price: 549.99,
    description: "8GB GDDR6, ray tracing, ports HDMI 2.1, performance gaming",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
    category: "ordinateurs",
    seller: {
      id: "s004",
      name: "Admin Bechir",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      badges: ["verified", "admin"],
      rating: 5.0,
      verified: true
    }
  },
  {
    id: "005",
    name: "Smartphone EcoX Mini",
    price: 399.99,
    description: "Compact, 5.4 pouces, 64GB, double caméra, autonomie 2 jours",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=2081&auto=format&fit=crop",
    category: "telephones",
    seller: {
      id: "s005",
      name: "Sophie Laurent",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      badges: ["verified"],
      rating: 4.2,
      verified: true
    }
  },
  {
    id: "006",
    name: "Casque Gaming RGBFury",
    price: 99.99,
    description: "Son surround 7.1, micro rétractable, éclairage RGB, confortable",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1976&auto=format&fit=crop",
    category: "accessoires",
    seller: {
      id: "s006",
      name: "Lucas Bernard",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      badges: [],
      rating: 4.0,
      verified: false
    }
  },
  {
    id: "007",
    name: "Moniteur UltraWide 34\"",
    price: 499.99,
    description: "34 pouces incurvé, 3440x1440, 144Hz, temps de réponse 1ms",
    image: "https://images.unsplash.com/photo-1527443195645-1133f7f28990?q=80&w=2070&auto=format&fit=crop",
    category: "ordinateurs",
    seller: {
      id: "s007",
      name: "Emma Petit",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      badges: ["verified"],
      rating: 4.7,
      verified: true
    }
  },
  {
    id: "008",
    name: "Clavier Mécanique RGB",
    price: 129.99,
    description: "Switches bleues, rétroéclairage RGB personnalisable, anti-ghosting",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1965&auto=format&fit=crop",
    category: "accessoires",
    seller: {
      id: "s008",
      name: "Paul Girard",
      avatar: "https://randomuser.me/api/portraits/men/8.jpg",
      badges: [],
      rating: 3.9,
      verified: false
    }
  }
];

export default function ProductsPage() {
  return (
    <div>
      <div className="pb-6 mb-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Tous nos produits</h1>
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/produits"
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            Tous
          </Link>
          <Link 
            href="/produits/telephones"
            className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Téléphones
          </Link>
          <Link 
            href="/produits/accessoires"
            className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            Accessoires
          </Link>
          <Link 
            href="/produits/ordinateurs"
            className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-blue-600 hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            PC & Composants
          </Link>
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
