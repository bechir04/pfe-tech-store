import React, { useEffect, useState } from 'react';
import Badge from '../../components/Badge';
import Image from 'next/image';
import Link from 'next/link';
import ReviewSection, { getAverageRatingFor } from '../../components/ReviewSection';
import { useAuth } from '../../context/AuthContext';

// Mock user and products data (replace with real fetch in production)
const mockUsers = {
  s001: {
    id: 's001',
    name: 'Alice Martin',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    badges: ['verified', 'top-seller'],
    rating: 4.8,
    verified: true,
    sales: 120,
    products: [
      {
        id: 'u001',
        name: 'Casque Gamer Pro',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
        category: 'accessoires',
      },
    ],
  },
  s002: {
    id: 's002',
    name: 'Bechir Ben Salah',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    badges: ['verified'],
    rating: 4.2,
    verified: true,
    sales: 45,
    products: [
      {
        id: 'u002',
        name: 'Laptop Lenovo ThinkPad',
        price: 499.99,
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
        category: 'ordinateurs',
      },
    ],
  },
};

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const user = mockUsers[params.userId];
  if (!user) {
    return <div className="max-w-2xl mx-auto py-20 text-center text-red-500">Utilisateur introuvable.</div>;
  }
  const [isFollowed, setIsFollowed] = useState(false);
  const { user: currentUser } = useAuth ? useAuth() : { user: { name: 'Demo', email: 'demo@mail.com', uid: 'demo' } };
  // Get average seller rating from reviews
  const avgRating = getAverageRatingFor('reviews_seller_' + user.id) || user.rating;
  useEffect(() => {
    const followed = JSON.parse(localStorage.getItem('followedSellers') || '[]');
    setIsFollowed(followed.includes(user.id));
  }, [user.id]);
  const handleFollow = () => {
    let followed = JSON.parse(localStorage.getItem('followedSellers') || '[]');
    if (isFollowed) {
      followed = followed.filter((id: string) => id !== user.id);
    } else {
      followed.push(user.id);
    }
    localStorage.setItem('followedSellers', JSON.stringify(followed));
    setIsFollowed(!isFollowed);
  };
  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 flex flex-col items-center mb-8">
        <Image src={user.avatar} alt={user.name} width={96} height={96} className="rounded-full border-4 border-cyan-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{user.name}</h1>
        <div className="flex gap-2 mb-2">
          {user.verified && <Badge type="verified" />}
          {user.badges && user.badges.filter(b => b !== 'verified').map(badge => (
            <Badge key={badge} type={badge} />
          ))}
        </div>
        <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`h-5 w-5 ${i < Math.round(avgRating) ? 'fill-yellow-400' : 'fill-gray-300 dark:fill-gray-600'}`} viewBox="0 0 20 20"><polygon points="9.9,1.1 12.3,6.6 18.2,7.3 13.7,11.3 15,17.1 9.9,14.1 4.8,17.1 6.1,11.3 1.6,7.3 7.5,6.6" /></svg>
          ))}
          <span className="ml-1 font-semibold">{avgRating.toFixed(1)}</span>
        </div>
        <div className="text-gray-500 text-sm mb-2">{user.sales} ventes réalisées</div>
        <button onClick={handleFollow} className={`mt-2 px-4 py-2 rounded-full font-semibold transition ${isFollowed ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}>{isFollowed ? 'Ne plus suivre' : 'Suivre'}</button>
        <Link href={`/messages?user=${user.id}`} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">Contacter</Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Produits en vente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.products.map(product => (
            <Link key={product.id} href={`/produits/${product.category}/${product.id}`} className="block bg-gray-100 dark:bg-gray-900 rounded-lg p-3 hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <Image src={product.image} alt={product.name} width={60} height={60} className="rounded" />
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">{product.name}</div>
                  <div className="text-blue-600 dark:text-blue-400 font-bold">{product.price.toFixed(3)} TND</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Seller Review Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <ReviewSection sellerId={user.id} currentUser={currentUser} title="Avis sur le vendeur" />
      </div>
    </div>
  );
} 