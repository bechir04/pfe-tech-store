"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const [products] = useState([
    {
      id: '001',
      name: 'Smartphone Galaxy Pro',
      price: 799.99,
      category: 'telephones',
      stock: 15,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop'
    },
    {
      id: '002',
      name: 'Ultrabook Zenith X1',
      price: 1299.99,
      category: 'ordinateurs',
      stock: 8,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop'
    },
    {
      id: '003',
      name: 'Écouteurs Sans Fil Pulse',
      price: 149.99,
      category: 'accessoires',
      stock: 3,
      status: 'low-stock',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1978&auto=format&fit=crop'
    },
    {
      id: '004',
      name: 'Carte Graphique TurboVision',
      price: 549.99,
      category: 'ordinateurs',
      stock: 0,
      status: 'out-of-stock',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop'
    }
  ]);

  const [categories] = useState([
    { id: 'telephones', name: 'Téléphones', count: 45 },
    { id: 'ordinateurs', name: 'PC & Composants', count: 89 },
    { id: 'accessoires', name: 'Accessoires', count: 123 }
  ]);

  const tabs = [
    { id: 'all', label: 'Tous les produits', count: products.length },
    { id: 'active', label: 'Actifs', count: products.filter(p => p.status === 'active').length },
    { id: 'low-stock', label: 'Stock faible', count: products.filter(p => p.status === 'low-stock').length },
    { id: 'out-of-stock', label: 'Rupture', count: products.filter(p => p.status === 'out-of-stock').length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300';
      case 'low-stock': return 'bg-yellow-900 text-yellow-300';
      case 'out-of-stock': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'low-stock': return 'Stock faible';
      case 'out-of-stock': return 'Rupture';
      default: return 'Inconnu';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || product.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 mb-2">Gestion des Produits</h1>
              <p className="text-gray-400">Gérez votre catalogue de produits</p>
            </div>
            <Link href="/admin/dashboard" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors">
              ← Retour au Dashboard
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              + Ajouter un produit
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-900 rounded-lg p-1 border border-gray-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="relative h-48 bg-gray-800">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(product.status)}`}>
                    {getStatusText(product.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{product.name}</h3>
                <p className="text-cyan-400 font-bold text-lg mb-2">{product.price}€</p>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
                  <span>Stock: {product.stock}</span>
                  <span className="capitalize">{product.category}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    Modifier
                  </button>
                  <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded text-sm transition-colors">
                    Dupliquer
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Catégories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-100">{category.name}</h3>
                  <span className="text-cyan-400 font-bold">{category.count}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    Modifier
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Alertes de stock</h2>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="space-y-4">
              {products.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock').map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <h4 className="text-gray-100 font-medium">{product.name}</h4>
                      <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm">
                      Réapprovisionner
                    </button>
                    <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm">
                      Masquer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 