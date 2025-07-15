import { notFound } from 'next/navigation';
import Image from 'next/image';
import React, { useState, use } from 'react';
import ReviewSection from '../../components/ReviewSection';
import { useAuth } from '../../context/AuthContext';

// Mock data for user products (updated for new Product type)
const userProducts = [
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
  },
  {
    id: 'u002',
    name: 'Laptop Lenovo ThinkPad',
    price: 499.99,
    description: 'Ordinateur portable d\'occasion, 8GB RAM, SSD 256GB.',
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
  },
];

export default function UserProductDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params if it's a Promise (Next.js future-proofing)
  const actualParams = typeof params.then === 'function' ? use(params) : params;
  const product = userProducts.find((p) => p.id === actualParams.id);
  if (!product) return notFound();

  // Carousel state
  const [imgIdx, setImgIdx] = useState(0);
  const images = product.images || [];

  const { user } = useAuth ? useAuth() : { user: { name: 'Demo', email: 'demo@mail.com', uid: 'demo' } };
  // Reviews state
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem('reviews_' + product.id);
    return stored ? JSON.parse(stored) : [];
  });
  const handleReview = (rating: number, comment: string) => {
    const newReview = {
      id: Date.now().toString(),
      productId: product.id,
      user: user || { name: 'Demo', email: 'demo@mail.com', uid: 'demo' },
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
        <ReviewSection productId={product.id} reviews={reviews} currentUser={user} onReview={handleReview} />
      </div>
    </div>
  );
} 