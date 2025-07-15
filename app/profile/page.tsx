"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import ProductGrid from '../components/ProductGrid';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Mock verification data (in a real app, this would come from your backend)
  const [verifications] = useState({
    email: true,
    phone: false,
    id: false
  });

  const [userStats] = useState({
    totalPoints: 50,
    totalOrders: 3,
    memberSince: '2024-01-15',
    lastLogin: '2024-01-20'
  });

  const [earnedBadges] = useState(['verified']);

  // Mock: Replace with your real product data source or API call
  const allProducts = [
    {
      id: "001",
      name: "Smartphone Galaxy Pro",
      price: 799.99,
      description: "Écran 6.5 pouces, processeur 8 coeurs, 128GB, caméra 108MP",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop",
      category: "telephones"
    },
    {
      id: "002",
      name: "Ultrabook Zenith X1",
      price: 1299.99,
      description: "Portable fin et léger, Core i7, 16GB RAM, SSD 512GB, écran 14\"",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
      category: "ordinateurs"
    },
    {
      id: "003",
      name: "Écouteurs Sans Fil Pulse",
      price: 149.99,
      description: "Réduction de bruit active, autonomie 30h, résistant à l'eau",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop",
      category: "accessoires"
    },
    {
      id: "004",
      name: "Carte Graphique TurboVision",
      price: 549.99,
      description: "8GB GDDR6, ray tracing, ports HDMI 2.1, performance gaming",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
      category: "ordinateurs"
    }
  ];

  React.useEffect(() => {
    if (activeTab === 'favorites') {
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
      const favorites = allProducts.filter((product) => favoriteIds.includes(product.id));
      setFavoriteProducts(favorites);
    }
  }, [activeTab]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg">
          <p>Vous devez être connecté pour accéder à votre profil.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: '📊' },
    { id: 'favorites', label: 'Favoris', icon: '❤️' },
    { id: 'verification', label: 'Vérification', icon: '✅' },
    { id: 'orders', label: 'Commandes', icon: '📦' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-cyan-700 flex items-center justify-center text-white font-bold text-3xl">
            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-100">{user.name || 'Utilisateur'}</h2>
            <p className="text-gray-400">{user.email}</p>
            <p className="text-sm text-gray-500">Membre depuis {new Date(userStats.memberSince).toLocaleDateString('fr-FR')}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-400">{userStats.totalPoints}</div>
            <div className="text-sm text-gray-400">Points</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Commandes</p>
              <p className="text-2xl font-bold text-gray-100">{userStats.totalOrders}</p>
            </div>
            <div className="text-cyan-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Badges</p>
              <p className="text-2xl font-bold text-gray-100">{earnedBadges.length}</p>
            </div>
            <div className="text-cyan-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Dernière connexion</p>
              <p className="text-sm font-medium text-gray-100">
                {new Date(userStats.lastLogin).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-cyan-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Badges débloqués</h3>
        <div className="flex flex-wrap gap-3">
          {earnedBadges.length > 0 ? (
            earnedBadges.map(badge => (
              <Badge key={badge} type={badge as any} />
            ))
          ) : (
            <p className="text-gray-400">Aucun badge débloqué pour le moment.</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/profile/verify" className="flex items-center p-4 bg-cyan-900/20 rounded-lg hover:bg-cyan-900/30 transition-colors">
            <div className="text-cyan-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Vérifier mon compte</p>
              <p className="text-sm text-gray-400">Gagnez des points et badges</p>
            </div>
          </Link>

          <Link href="/dashboard/loyalty" className="flex items-center p-4 bg-cyan-900/20 rounded-lg hover:bg-cyan-900/30 transition-colors">
            <div className="text-cyan-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Points & Badges</p>
              <p className="text-sm text-gray-400">Voir mes récompenses</p>
            </div>
          </Link>

          <Link href="/marketplace" className="flex items-center p-4 bg-cyan-900/20 rounded-lg hover:bg-cyan-900/30 transition-colors">
            <div className="text-cyan-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Marketplace</p>
              <p className="text-sm text-gray-400">Acheter et vendre</p>
            </div>
          </Link>

          <Link href="/messages" className="flex items-center p-4 bg-cyan-900/20 rounded-lg hover:bg-cyan-900/30 transition-colors">
            <div className="text-cyan-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Messages</p>
              <p className="text-sm text-gray-400">Mes conversations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Mes produits favoris</h3>
        <ProductGrid products={favoriteProducts} title="Produits que j'aime" />
        {favoriteProducts.length === 0 && (
          <p className="text-gray-400 mt-4">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
        )}
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Statut de vérification</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${verifications.email ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <span className="text-gray-100">Vérification email</span>
            </div>
            <Badge type={verifications.email ? 'verified' : 'unverified'} />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${verifications.phone ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <span className="text-gray-100">Vérification téléphone</span>
            </div>
            <Badge type={verifications.phone ? 'verified' : 'unverified'} />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${verifications.id ? 'bg-green-500' : 'bg-gray-600'}`}></div>
              <span className="text-gray-100">Vérification identité</span>
            </div>
            <Badge type={verifications.id ? 'verified' : 'unverified'} />
          </div>
        </div>
        
        <div className="mt-6">
          <Link href="/profile/verify" className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Compléter la vérification
          </Link>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Mes commandes</h3>
        <p className="text-gray-400">Fonctionnalité en cours de développement...</p>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Paramètres du compte</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
            <input
              type="text"
              value={user.name || ''}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={user.email || ''}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              disabled
            />
          </div>
          
          <div className="pt-4">
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'favorites':
        return renderFavorites();
      case 'verification':
        return renderVerification();
      case 'orders':
        return renderOrders();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-100">Mon Profil</h1>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-900 rounded-lg p-1 border border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
} 