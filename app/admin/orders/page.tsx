"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const [orders] = useState([
    {
      id: 'ORD-001',
      customer: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      amount: 299.99,
      status: 'pending',
      date: '2024-01-20',
      items: 3,
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-002',
      customer: 'Marie Martin',
      email: 'marie.martin@email.com',
      amount: 149.50,
      status: 'shipped',
      date: '2024-01-19',
      items: 2,
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-003',
      customer: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      amount: 89.99,
      status: 'delivered',
      date: '2024-01-18',
      items: 1,
      paymentMethod: 'PayPal'
    },
    {
      id: 'ORD-004',
      customer: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      amount: 599.99,
      status: 'cancelled',
      date: '2024-01-17',
      items: 2,
      paymentMethod: 'PayPal'
    }
  ]);

  const tabs = [
    { id: 'all', label: 'Toutes', count: orders.length },
    { id: 'pending', label: 'En attente', count: orders.filter(o => o.status === 'pending').length },
    { id: 'shipped', label: 'Expédiées', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered', label: 'Livrées', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Annulées', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-900 text-yellow-300';
      case 'shipped': return 'bg-blue-900 text-blue-300';
      case 'delivered': return 'bg-green-900 text-green-300';
      case 'cancelled': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingRevenue = orders.filter(o => o.status === 'pending').reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
      <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 mb-2">Gestion des Commandes</h1>
              <p className="text-gray-400">Suivez et gérez toutes les commandes clients</p>
            </div>
            <Link href="/admin/dashboard" className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors">
              ← Retour au Dashboard
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-100">{orders.length}</p>
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
                <p className="text-gray-400 text-sm">Revenus Totaux</p>
                <p className="text-2xl font-bold text-gray-100">{totalRevenue.toLocaleString('fr-FR')}€</p>
              </div>
              <div className="text-green-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">En Attente</p>
                <p className="text-2xl font-bold text-gray-100">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <div className="text-yellow-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenus En Attente</p>
                <p className="text-2xl font-bold text-gray-100">{pendingRevenue.toLocaleString('fr-FR')}€</p>
              </div>
              <div className="text-blue-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher par client ou numéro de commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Exporter
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

      {/* Orders Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
          <thead>
                <tr className="border-b border-gray-700 bg-gray-800">
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Commande</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Client</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Montant</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Statut</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Date</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Paiement</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-100 font-medium">{order.id}</p>
                        <p className="text-gray-400 text-xs">{order.items} article(s)</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-100">{order.customer}</p>
                        <p className="text-gray-400 text-xs">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-cyan-400 font-bold">{order.amount}€</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                  </span>
                </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-100">{new Date(order.date).toLocaleDateString('fr-FR')}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-100">{order.paymentMethod}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                          Voir détails
                        </button>
                        {order.status === 'pending' && (
                          <>
                            <button className="text-green-400 hover:text-green-300 text-sm">
                              Marquer expédiée
                  </button>
                            <button className="text-red-400 hover:text-red-300 text-sm">
                              Annuler
                  </button>
                          </>
                        )}
                      </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
      </div>

        {/* Bulk Actions */}
        <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-300">Sélectionner tout</span>
            </div>
            <div className="flex space-x-2">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors">
                Marquer comme expédiées
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors">
                Exporter sélection
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors">
                Annuler sélection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 