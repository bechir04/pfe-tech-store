"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../context/CartContext';
import Badge from './Badge';
import { motion } from 'framer-motion';

export type ProductCardProps = {
  product: {
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
    seller?: {
      id: string;
      name: string;
      avatar: string;
      badges: string[];
      rating: number;
      verified: boolean;
      sales?: number;
    };
  };
  detailed?: boolean;
};

const ProductCard = ({ product, detailed }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (product.seller) {
      const followed = JSON.parse(localStorage.getItem('followedSellers') || '[]');
      setIsFollowed(followed.includes(product.seller?.id));
    }
    const favorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    setIsFavorite(favorites.includes(product.id));
  }, [product.seller?.id, product.id]);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      category: product.category,
    };
    addToCart(cartItem);
    alert(`${product.name} a été ajouté au panier.`);
  };

  const handleFollow = () => {
    if (!product.seller) return;
    let followed = JSON.parse(localStorage.getItem('followedSellers') || '[]');
    if (isFollowed) {
      followed = followed.filter((id: string) => id !== product.seller?.id);
    } else {
      followed.push(product.seller?.id);
    }
    localStorage.setItem('followedSellers', JSON.stringify(followed));
    setIsFollowed(!isFollowed);
  };

  const handleFavorite = () => {
    let favorites = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== product.id);
    } else {
      newFavorites = [...favorites, product.id];
      let notified = JSON.parse(localStorage.getItem('newFavoriteProducts') || '[]');
      if (!notified.some((p: any) => p.id === product.id)) {
        notified.push({ id: product.id, name: product.name });
        localStorage.setItem('newFavoriteProducts', JSON.stringify(notified));
      }
    }
    localStorage.setItem('favoriteProducts', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  // Carousel logic
  const images = product.images && product.images.length > 0 ? product.images : ['/public/file.svg'];
  const showArrows = images.length > 1;
  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((idx) => (idx - 1 + images.length) % images.length);
  };
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIdx((idx) => (idx + 1) % images.length);
  };

  if (detailed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, boxShadow: '0 0 16px #0ff' }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all group max-w-xs mx-auto min-h-[420px]"
      >
        {/* Carousel */}
        <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-900">
          <Link href={`/produits/${product.category}/${product.id}`} className="block w-full h-full">
            <Image
              src={images[imgIdx]}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-all duration-300"
              sizes="320px"
            />
          </Link>
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
          <button onClick={handleFavorite} className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-pink-100 dark:hover:bg-pink-900/80 border border-gray-200 dark:border-gray-700 z-10">
            {isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            )}
          </button>
        </div>
        {/* Info */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <Link href={`/produits/${product.category}/${product.id}`}
            className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
            {product.name}
          </Link>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{product.price.toFixed(3)} TND</span>
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-1">{product.description}</p>
          {product.condition && (
            <div className="text-xs text-gray-500 dark:text-gray-400">État : <span className="font-semibold">{product.condition}</span></div>
          )}
          {product.warranty && (
            <div className="text-xs text-gray-500 dark:text-gray-400">Garantie : <span className="font-semibold">{product.warranty}</span></div>
          )}
          {product.specs && product.specs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-1">
              {product.specs.slice(0,2).map((spec, i) => (
                <span key={i} className="bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200 px-2 py-1 rounded text-xs font-medium">{spec.key}: {spec.value}</span>
              ))}
            </div>
          )}
          {product.seller && (
            <div className="flex items-center gap-2 mt-1">
              <Link href={`/profile/${product.seller?.id ?? ''}`} className="flex items-center gap-1 group">
                <Image
                  src={product.seller?.avatar ?? '/public/file.svg'}
                  alt={product.seller?.name ?? 'Vendeur'}
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-cyan-400 group-hover:border-blue-500"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-500 text-sm">
                  {product.seller?.name}
                </span>
                {product.seller?.verified && <Badge type="verified" />}
                {product.seller?.badges && product.seller.badges.filter(b => b !== 'verified').map(badge => (
                  <Badge key={badge} type={badge} />
                ))}
              </Link>
              <span className="flex items-center ml-2 text-yellow-400 text-xs font-semibold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`h-4 w-4 ${i < Math.round(product.seller?.rating ?? 0) ? 'fill-yellow-400' : 'fill-gray-300 dark:fill-gray-600'}`} viewBox="0 0 20 20"><polygon points="9.9,1.1 12.3,6.6 18.2,7.3 13.7,11.3 15,17.1 9.9,14.1 4.8,17.1 6.1,11.3 1.6,7.3 7.5,6.6" /></svg>
                ))}
                <span className="ml-1">{product.seller?.rating?.toFixed(1)}</span>
              </span>
              {typeof product.seller?.sales === 'number' && (
                <span className="ml-2 text-xs text-gray-500">Ventes: {product.seller?.sales}</span>
              )}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Ajouter
            </button>
            {product.seller && (
              <button onClick={handleFollow} className={`text-xs px-3 py-1 rounded-full font-medium ${isFollowed ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>{isFollowed ? 'Ne plus suivre' : 'Suivre'}</button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default (compact) layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, boxShadow: '0 0 16px #0ff' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all group p-2 min-h-[210px]"
    >
      <Link href={`/produits/${product.category}/${product.id}`} className="block w-full">
        <div className="relative w-full h-24 mb-2">
          <Image
            src={product.images && product.images.length > 0 ? product.images[0] : '/public/file.svg'}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-md"
            sizes="128px"
          />
        </div>
      </Link>
      <div className="flex-1 w-full flex flex-col items-center justify-between">
        <Link href={`/produits/${product.category}/${product.id}`}
          className="font-semibold text-gray-900 dark:text-white text-sm truncate w-full text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
          {product.name}
        </Link>
        <span className="text-base font-bold text-blue-600 dark:text-blue-400 mb-1">{product.price.toFixed(3)} TND</span>
        {product.seller && (
          <Link href={`/profile/${product.seller?.id ?? ''}`} className="flex items-center gap-1 mb-1">
            <Image
              src={product.seller?.avatar ?? '/public/file.svg'}
              alt={product.seller?.name ?? 'Vendeur'}
              width={18}
              height={18}
              className="rounded-full border border-cyan-400"
            />
            <span className="font-medium text-gray-800 dark:text-gray-200 text-xs truncate max-w-[60px]">
              {product.seller?.name}
            </span>
            {product.seller?.verified && <Badge type="verified" />}
            {typeof product.seller?.sales === 'number' && (
              <span className="ml-1 text-xs text-gray-500">{product.seller?.sales} ventes</span>
            )}
          </Link>
        )}
        <div className="flex items-center gap-1 mt-1">
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <button onClick={handleFavorite} className="p-1 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/80">
            {isFavorite ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
