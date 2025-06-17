"use client";

import React, { useState } from 'react';
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

// Fonction pour récupérer un produit par son ID
function getProductById(id: string) {
  return productsDatabase.find(product => product.id === id);
}

// Fonction pour récupérer des produits similaires
function getSimilarProducts(category: string, currentId: string) {
  return productsDatabase
    .filter(product => product.category === category && product.id !== currentId)
    .slice(0, 4);
}

export default function ProductDetail({ params }: ProductDetailParams) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addToCart } = useCart();
  
  // Récupérer le produit à partir de l'ID
  const product = getProductById(params.id);
  
  // Si le produit n'existe pas, renvoyer une page 404
  if (!product) {
    notFound();
  }
  
  // Vérifier que le produit est bien dans la catégorie demandée
  if (product.category !== params.category) {
    notFound();
  }
  
  // Produits similaires
  const similarProducts = getSimilarProducts(params.category, params.id);

  // Gérer l'ajout au panier
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      category: product.category
    });
    
    // Afficher notification
    setIsAddedToCart(true);
    
    // Masquer la notification après 3 secondes
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 3000);
  };

  // Gérer le changement de quantité
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div>
      {/* Notification d'ajout au panier */}
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
          Retour aux {product.category === 'telephones' ? 'téléphones' : 
                     product.category === 'accessoires' ? 'accessoires' : 'PC & composants'}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image du produit */}
        <div className="relative h-96 md:h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            className="p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        
        {/* Informations produit */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {product.price.toFixed(2)}€
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {product.description}
          </p>
          
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className={`h-3 w-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Livraison 24-48h</span>
              </div>
              
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm">Garantie 2 ans</span>
              </div>
            </div>
          </div>
          
          {/* Sélecteur de couleurs si disponible */}
          {product.specifications?.couleurs && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Couleur</h3>
              <div className="flex space-x-2">
                {product.specifications.couleurs.map((couleur) => (
                  <button 
                    key={couleur}
                    className={`border-2 ${selectedColor === couleur ? 'border-blue-500 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'} hover:border-blue-500 dark:hover:border-blue-500 rounded-full px-4 py-2 text-sm`}
                    onClick={() => setSelectedColor(couleur)}
                  >
                    {couleur}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Sélecteur de quantité */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Quantité</h3>
            <div className="flex items-center">
              <button 
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-l-lg"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600 px-4 py-1">
                {quantity}
              </span>
              <button 
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-r-lg"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Options d'achat */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
              disabled={product.stock === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ajouter au panier
            </button>
            
            <Link href="/panier" className="w-full md:w-auto border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 px-6 rounded-lg font-semibold text-center">
              Voir le panier
            </Link>
          </div>
        </div>
      </div>
      
      {/* Caractéristiques et spécifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Caractéristiques */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            Caractéristiques principales
          </h2>
          
          <ul className="space-y-2">
            {product.features?.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Spécifications techniques */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">
            Spécifications techniques
          </h2>
          
          <div className="space-y-4">
            {product.specifications?.dimensions && (
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">Dimensions</dt>
                <dd className="mt-1">{product.specifications.dimensions}</dd>
              </div>
            )}
            
            {product.specifications?.poids && (
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">Poids</dt>
                <dd className="mt-1">{product.specifications.poids}</dd>
              </div>
            )}
            
            {product.specifications?.connectivité && (
              <div>
                <dt className="font-medium text-gray-700 dark:text-gray-300">Connectivité</dt>
                <dd className="mt-1">{product.specifications.connectivité}</dd>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Produits similaires */}
      {similarProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <Link href={`/produits/${item.category}/${item.id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
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
                    {item.price.toFixed(2)}€
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
