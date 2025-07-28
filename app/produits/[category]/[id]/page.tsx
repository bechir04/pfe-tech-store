"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { notFound } from 'next/navigation';

// Types pour les paramètres
type ProductDetailParams = {
  params: {
    category: string;
    id: string;
  };
};

// Base de données temporaire de produits
const productsDatabase = [
  {
    id: "001",
    name: "Smartphone Galaxy Pro",
    price: 799.99,
    description: "Écran 6.5 pouces, processeur 8 coeurs, 128GB, caméra 108MP",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop",
    category: "telephones",
    stock: 15,
    features: [
      "Écran AMOLED 120Hz",
      "Processeur Snapdragon 888",
      "Batterie 5000mAh",
      "Charge rapide 45W",
      "Android 12",
      "Résistant à l'eau IP68"
    ],
    specifications: {
      dimensions: "165 x 76 x 8.9 mm",
      poids: "228g",
      couleurs: ["Noir", "Bleu", "Argent"],
      connectivité: "5G, WiFi 6, Bluetooth 5.2, NFC"
    }
  },
  {
    id: "002",
    name: "Ultrabook Zenith X1",
    price: 1299.99,
    description: "Portable fin et léger, Core i7, 16GB RAM, SSD 512GB, écran 14\"",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    category: "ordinateurs",
    stock: 8,
    features: [
      "Processeur Intel Core i7 12ème génération",
      "16GB RAM DDR4",
      "SSD NVMe 512GB",
      "Écran 14\" IPS Full HD",
      "Windows 11 Pro",
      "Batterie 10h d'autonomie"
    ],
    specifications: {
      dimensions: "320 x 220 x 15 mm",
      poids: "1.2kg",
      couleurs: ["Gris", "Argent"],
      connectivité: "Wi-Fi 6, Bluetooth 5.2, 2x USB-C, 1x USB-A, HDMI"
    }
  },
  {
    id: "003",
    name: "Écouteurs Sans Fil Pulse",
    price: 149.99,
    description: "Réduction de bruit active, autonomie 30h, résistant à l'eau",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop",
    category: "accessoires",
    stock: 22,
    features: [
      "Réduction de bruit active",
      "Autonomie 30h avec boîtier",
      "Résistant à l'eau IPX4",
      "Contrôles tactiles",
      "Assistant vocal compatible",
      "Mode transparence"
    ],
    specifications: {
      dimensions: "Écouteurs: 22 x 31 x 24mm, Boîtier: 60 x 60 x 30mm",
      poids: "Écouteurs: 5.4g chacun, Boîtier: 48g",
      couleurs: ["Noir", "Blanc", "Bleu"],
      connectivité: "Bluetooth 5.2, USB-C"
    }
  },
  // Autres produits ajoutés
  {
    id: "004",
    name: "Carte Graphique TurboVision",
    price: 549.99,
    description: "8GB GDDR6, ray tracing, ports HDMI 2.1, performance gaming",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
    category: "ordinateurs",
    stock: 5,
    features: [
      "8GB GDDR6",
      "Ray tracing en temps réel",
      "3x DisplayPort, 1x HDMI 2.1",
      "Ventilateurs à double roulement à billes",
      "Overclocking d'usine",
      "Construction premium"
    ],
    specifications: {
      dimensions: "267 x 150 x 46 mm",
      poids: "1.5kg",
      couleurs: ["Noir"],
      connectivité: "PCIe 4.0 x16, 3x DisplayPort 1.4a, 1x HDMI 2.1"
    }
  },
  {
    id: "005",
    name: "Smartphone EcoX Mini",
    price: 399.99,
    description: "Compact, 5.4 pouces, 64GB, double caméra, autonomie 2 jours",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?q=80&w=2081&auto=format&fit=crop",
    category: "telephones",
    stock: 25,
    features: [
      "Écran 5.4\" compact",
      "Double caméra arrière",
      "64GB stockage extensible",
      "Batterie longue durée 4000mAh",
      "Android 12",
      "Scanner d'empreintes latéral"
    ],
    specifications: {
      dimensions: "132 x 64 x 8.2 mm",
      poids: "135g",
      couleurs: ["Noir", "Vert", "Rouge"],
      connectivité: "4G, WiFi 5, Bluetooth 5.0, NFC"
    }
  }
];

// Add a type for user products with optional fields
// (place this near the top, after productsDatabase)
type UserProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  images?: string[];
  category: string;
  stock?: number;
  features?: string[];
  specifications?: any;
  seller?: any;
  condition?: string;
  warranty?: string;
  videoUrl?: string;
};

// Fonction pour récupérer un produit par son ID et catégorie
function getProductById(id: string, category: string) {
  // 1. Check hardcoded DB
  let product = productsDatabase.find(product => product.id === id && product.category === category);
  if (product) return product;

  // 2. Check localStorage (if running in browser)
  if (typeof window !== "undefined") {
    const userProducts = JSON.parse(localStorage.getItem("userProducts") || "[]");
    const adminProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
    product = userProducts.find((p: any) => p.id === id && p.category === category);
    if (product) return product;
    product = adminProducts.find((p: any) => p.id === id && p.category === category);
    if (product) return product;
  }
  return null;
}

// Fonction pour récupérer des produits similaires
function getSimilarProducts(category: string, currentId: string) {
  return productsDatabase
    .filter(product => product.category === category && product.id !== currentId)
    .slice(0, 4);
}

// Helper to get images array from product
function getProductImages(product: any): string[] {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  if (typeof product.image === 'string' && product.image.length > 0) {
    return [product.image];
  }
  return ['/public/file.svg'];
}

export default function ProductDetail({ params }: ProductDetailParams) {
  // Next.js migration note:
  // In future Next.js versions, params may be a Promise and should be unwrapped with use(params):
  //   const { category, id } = use(params);
  // For now, direct access is supported and works:
  const { category, id } = params;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const findProduct = () => {
      let found = productsDatabase.find(
        (p) => p.id === id && p.category === category
      );
      if (!found && typeof window !== 'undefined') {
        const userProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
        const userArticles = JSON.parse(localStorage.getItem('userArticles') || '[]');
        const allUserProducts = userProducts.concat(userArticles);
        found = allUserProducts.find((p: any) => p.id === id && p.category === category);
        // Normalize user product fields for display (only for user products)
        if (found) {
          const userProduct = found as UserProduct;
          found = {
            ...userProduct,
            image: userProduct.image || (userProduct.images && userProduct.images[0]) || '/public/file.svg',
            features: userProduct.features || [],
            specifications: userProduct.specifications || {},
            stock: userProduct.stock ?? 99,
            // Remove seller, condition, warranty, videoUrl from here
          };
        }
        setSimilarProducts(
          allUserProducts.filter((p: any) => p.category === category && p.id !== id).slice(0, 4)
        );
      } else if (found) {
        setSimilarProducts(
          productsDatabase.filter((p) => p.category === category && p.id !== id).slice(0, 4)
        );
      }
      setProduct(found || null);
      setLoading(false);
    };
    findProduct();
  }, [id, category]);

  if (loading) return <div>Chargement...</div>;
  if (!product) return <div>Produit introuvable.</div>;

  // Carousel logic for images
  const images: string[] = getProductImages(product);
  const showArrows = images.length > 1;
  const prevImg = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx((idx) => (idx - 1 + images.length) % images.length); };
  const nextImg = (e: React.MouseEvent) => { e.stopPropagation(); setImgIdx((idx) => (idx + 1) % images.length); };

  // Vérifier que le produit est bien dans la catégorie demandée
  if (product.category !== category) {
    notFound();
  }
  
  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image || (product.images && product.images[0]) || '',
      category: product.category
    });
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  // Gérer le changement de quantité
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  // Defensive rendering for all product fields
  return (
    <div>
      {isAddedToCart && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Produit ajouté au panier</span>
          </div>
        </div>
      )}
      <div className="mb-6">
        <Link href={`/produits/${product.category}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Retour aux {product.category === 'telephones' ? 'téléphones' : product.category === 'accessoires' ? 'accessoires' : 'PC & composants'}
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Carousel images */}
        <div className="relative h-96 md:h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <Image
            src={images[imgIdx]}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            className="p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {showArrows && (
            <>
              <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 shadow hover:bg-cyan-100 dark:hover:bg-cyan-900/80 z-10">
                <svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 shadow hover:bg-cyan-100 dark:hover:bg-cyan-900/80 z-10">
                <svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>
        {/* Informations produit */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {product.price?.toFixed(3)} TND
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {product.description}
          </p>
          {product.condition && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">État : <span className="font-semibold">{product.condition}</span></div>
          )}
          {product.warranty && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Garantie : <span className="font-semibold">{product.warranty}</span></div>
          )}
          {product.specs && product.specs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1">
              {product.specs.slice(0,2).map((spec: any, i: number) => (
                <span key={i} className="bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200 px-2 py-1 rounded text-xs font-medium">{spec.key}: {spec.value}</span>
              ))}
            </div>
          )}
          {product.seller && (
            <div className="flex items-center gap-2 mt-1">
              <Link href={`/profile/${product.seller.id}`} className="flex items-center gap-1 group">
                <Image
                  src={product.seller.avatar}
                  alt={product.seller.name}
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-cyan-400 group-hover:border-blue-500"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 text-sm">
                  {product.seller.name}
                </span>
                {product.seller.verified && <span className="ml-1 bg-cyan-200 text-cyan-800 px-2 py-0.5 rounded text-xs font-semibold">Vérifié</span>}
                {product.seller.badges && product.seller.badges.filter((b: string) => b !== 'verified').map((badge: string) => (
                  <span key={badge} className="ml-1 bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">{badge}</span>
                ))}
              </Link>
              <span className="flex items-center ml-2 text-yellow-400 text-xs font-semibold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-4 w-4 ${i < Math.round(product.seller.rating) ? 'fill-yellow-400' : 'fill-gray-300 dark:fill-gray-600'}`} viewBox="0 0 20 20"><polygon points="9.9,1.1 12.3,6.6 18.2,7.3 13.7,11.3 15,17.1 9.9,14.1 4.8,17.1 6.1,11.3 1.6,7.3 7.5,6.6" /></svg>
                ))}
                <span className="ml-1">{product.seller.rating?.toFixed(1)}</span>
              </span>
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm flex items-center"
              disabled={(product.stock || 0) === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ajouter au panier
            </button>
            <Link href="/panier" className="border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1 rounded-full text-sm flex items-center">
              Voir le panier
            </Link>
          </div>
        </div>
      </div>
      {/* Caractéristiques et spécifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Caractéristiques */}
        {(product.features && product.features.length > 0) && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              Caractéristiques principales
            </h2>
            <ul className="space-y-2">
              {product.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Spécifications techniques */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
              Spécifications techniques
            </h2>
            <div className="space-y-4">
              {product.specifications.dimensions && (
                <div>
                  <dt className="font-medium text-gray-700 dark:text-gray-300">Dimensions</dt>
                  <dd className="mt-1">{product.specifications.dimensions}</dd>
                </div>
              )}
              {product.specifications.poids && (
                <div>
                  <dt className="font-medium text-gray-700 dark:text-gray-300">Poids</dt>
                  <dd className="mt-1">{product.specifications.poids}</dd>
                </div>
              )}
              {product.specifications.connectivité && (
                <div>
                  <dt className="font-medium text-gray-700 dark:text-gray-300">Connectivité</dt>
                  <dd className="mt-1">{product.specifications.connectivité}</dd>
                </div>
              )}
              {product.specifications.couleurs && (
                <div>
                  <dt className="font-medium text-gray-700 dark:text-gray-300">Couleurs</dt>
                  <dd className="mt-1">{product.specifications.couleurs.join(', ')}</dd>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Produits similaires */}
      {similarProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((item: any) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <Link href={`/produits/${item.category}/${item.id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image || (item.images && item.images[0]) || '/public/file.svg'}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/produits/${item.category}/${item.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-blue-600 dark:text-blue-400 font-bold">
                    {item.price?.toFixed(3)} TND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
