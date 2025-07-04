"use client";
import ProductGrid from '../components/ProductGrid';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Mock data for user products (fallback)
const mockUserProducts = [
  {
    id: 'u001',
    name: 'Casque Gamer Pro',
    price: 89.99,
    description: 'Casque gaming avec micro antibruit, compatible PC et consoles.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    category: 'accessoires',
  },
  {
    id: 'u002',
    name: 'Laptop Lenovo ThinkPad',
    price: 499.99,
    description: "Ordinateur portable d'occasion, 8GB RAM, SSD 256GB.",
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    category: 'ordinateurs',
  },
];

export default function MarketplacePage() {
  const [userProducts, setUserProducts] = useState<any[]>([]);

  useEffect(() => {
    const articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    setUserProducts(articles.length > 0 ? articles : mockUserProducts);
  }, []);

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Link href="/marketplace/post" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition">Vendre un article</Link>
      </div>
      <ProductGrid products={userProducts} title="Articles des utilisateurs" />
    </div>
  );
} 