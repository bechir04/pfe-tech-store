'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import React, { useState } from 'react';
import ReviewSection from '../../components/ReviewSection';
import { useAuth } from '../../context/AuthContext';
import type { User as MarketplaceUser } from '../../types/marketplace';

// Mock data for user products (updated for new Product type)
const userProducts: Array<{
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  videoUrl?: string;
  category: string;
  condition?: string;
  warranty?: string;
  specs?: { key: string; value: string }[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    badges: string[];
    rating: number;
    sales: number;
    phone?: string; // Added phone number
  };
}> = [
  {
    id: 'u001',
    name: 'Casque Gamer Pro',
    price: 89.99,
    description: 'Casque gaming avec micro antibruit, compatible PC et consoles.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'accessoires',
    condition: 'new',
    warranty: '1 an',
    specs: [
      { key: 'Compatibilité', value: 'PC, PS5, Xbox' },
      { key: 'Micro', value: 'Antibruit' },
    ],
    seller: {
      id: 's001',
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/50',
      verified: true,
      badges: ['premium', 'fast_shipping'],
      rating: 4.5,
      sales: 10,
      phone: '0123456789',
    },
  },
  {
    id: 'u002',
    name: 'Laptop Lenovo ThinkPad',
    price: 499.99,
    description: "Ordinateur portable d'occasion, 8GB RAM, SSD 256GB.",
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    ],
    category: 'ordinateurs',
    condition: 'used',
    warranty: '6 mois',
    specs: [
      { key: 'RAM', value: '8GB' },
      { key: 'Stockage', value: '256GB SSD' },
    ],
    seller: {
      id: 's002',
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/50',
      verified: false,
      badges: [],
      rating: 3.8,
      sales: 5,
    },
  },
];

export default function UserProductDetailPage({ params }: { params: { id: string } }) {
  // Use params directly (no typeof params.then check)
  const product = userProducts.find((p) => p.id === params.id);
  if (!product) return notFound();

  // Carousel state
  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images || [];

  const fallbackUser: MarketplaceUser = { id: 'demo', name: 'Demo', email: 'demo@mail.com', isVerified: false };
  let user: MarketplaceUser | undefined = undefined;
  if (useAuth) {
    const auth = useAuth();
    if (auth && auth.user) {
      // Map AuthContext user to marketplace User type
      user = {
        id: auth.user.uid,
        name: auth.user.name,
        email: auth.user.email,
        isVerified: false, // You can enhance this if you have verification logic
        avatarUrl: auth.user.photoURL,
      };
    }
  }
  // Reviews state
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem('reviews_' + product.id);
    return stored ? JSON.parse(stored) : [];
  });
  const handleReview = (rating: number, comment: string) => {
    const newReview = {
      id: Date.now().toString(),
      productId: product.id,
      user: user || fallbackUser,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('reviews_' + product.id, JSON.stringify(updated));
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 flex flex-col gap-8">
        {/* Image Carousel */}
        {images.length > 0 && (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-4">
            <Image src={images[imgIdx]} alt={product.name} fill style={{objectFit:'cover'}} />
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-900/60 text-white p-2 rounded-full z-10"
                  onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                  aria-label="Précédent"
                >&#8592;</button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900/60 text-white p-2 rounded-full z-10"
                  onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                  aria-label="Suivant"
                >&#8594;</button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Aperçu ${i+1}`}
                      className={`w-10 h-10 object-cover rounded border-2 ${i === imgIdx ? 'border-cyan-500' : 'border-gray-300'}`}
                      onClick={() => setImgIdx(i)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        {/* Video */}
        {product.videoUrl && (
          <div className="mb-4">
            {product.videoUrl.includes('youtube') ? (
              <iframe
                width="100%"
                height="315"
                src={product.videoUrl}
                title="Vidéo du produit"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg w-full h-64 md:h-80"
              ></iframe>
            ) : (
              <video controls className="rounded-lg w-full h-64 md:h-80">
                <source src={product.videoUrl} type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            )}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.seller && (
            <div className="flex items-center gap-2 mb-2">
              <Image
                src={product.seller.avatar}
                alt={product.seller.name}
                width={32}
                height={32}
                className="rounded-full border-2 border-cyan-400"
              />
              <span className="font-medium text-gray-800 dark:text-gray-200 text-base">
                {product.seller.name}
              </span>
              {product.seller.verified && (
                <span className="ml-1 bg-cyan-200 text-cyan-800 px-2 py-0.5 rounded text-xs font-semibold">Vérifié</span>
              )}
              {product.seller.badges && product.seller.badges.filter(b => b !== 'verified').map(badge => (
                <span key={badge} className="ml-1 bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded text-xs font-semibold">{badge}</span>
              ))}
              <span className="flex items-center ml-2 text-yellow-400 text-xs font-semibold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-4 w-4 ${i < Math.round(product.seller.rating) ? 'fill-yellow-400' : 'fill-gray-300 dark:fill-gray-600'}`} viewBox="0 0 20 20"><polygon points="9.9,1.1 12.3,6.6 18.2,7.3 13.7,11.3 15,17.1 9.9,14.1 4.8,17.1 6.1,11.3 1.6,7.3 7.5,6.6" /></svg>
                ))}
                <span className="ml-1">{product.seller.rating?.toFixed(1)}</span>
              </span>
              {typeof product.seller.sales === 'number' && (
                <span className="ml-2 text-xs text-gray-500">Ventes: {product.seller.sales}</span>
              )}
              {product.seller.phone && (
                <span className="ml-4 text-xs text-cyan-700 dark:text-cyan-300 font-semibold">📞 {product.seller.phone}</span>
              )}
            </div>
          )}
          <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-4">{product.price.toFixed(2)}€</p>
          <p className="mb-4 text-gray-700 dark:text-gray-200">{product.description}</p>
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Catégorie : {product.category}</div>
          {product.condition && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">État : <span className="font-semibold">{product.condition}</span></div>
          )}
          {product.warranty && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Garantie : <span className="font-semibold">{product.warranty}</span></div>
          )}
          {product.specs && product.specs.length > 0 && (
            <div className="mb-2">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Spécifications :</div>
              <ul className="list-disc ml-6">
                {product.specs.map((spec, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300">{spec.key}: {spec.value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {/* Reviews & Feedback */}
        <ReviewSection productId={product.id} reviews={reviews} currentUser={user || fallbackUser} onReview={handleReview} />
        {/* Seller Review Section */}
        {product.seller && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-2">Avis sur le vendeur</h2>
            <ReviewSection sellerId={product.seller.id} currentUser={user || fallbackUser} title="Avis sur le vendeur" />
          </div>
        )}
      </div>
    </div>
  );
} 