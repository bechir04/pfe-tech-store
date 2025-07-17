"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '../../context/AdminAuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock user data and analytics data (static, outside component)
const mockUsers: AdminUserType[] = [
  {
    id: 'u001',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    registered: '2024-01-10',
    status: 'active' as 'active',
    role: 'user' as 'user',
    orders: 5,
    lastLogin: '2024-06-01',
  },
  {
    id: 'u002',
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    registered: '2024-02-15',
    status: 'banned' as 'banned',
    role: 'user' as 'user',
    orders: 2,
    lastLogin: '2024-05-28',
  },
  {
    id: 'u003',
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    registered: '2024-03-05',
    status: 'active' as 'active',
    role: 'seller' as 'seller',
    orders: 12,
    lastLogin: '2024-06-02',
  },
  {
    id: 'u004',
    name: 'Admin Bechir',
    email: 'bechir@admin.com',
    registered: '2024-01-01',
    status: 'active' as 'active',
    role: 'admin' as 'admin',
    orders: 0,
    lastLogin: '2024-06-03',
  },
  // ...add more users as needed
];
const analyticsData = {
  salesData: [
    { month: 'Jan', sales: 12000, orders: 45 },
    { month: 'Fév', sales: 15000, orders: 52 },
    { month: 'Mar', sales: 18000, orders: 61 },
    { month: 'Avr', sales: 22000, orders: 78 },
    { month: 'Mai', sales: 25000, orders: 89 },
    { month: 'Juin', sales: 28000, orders: 95 }
  ],
  categoryData: [
    { category: 'Téléphones', sales: 35, color: '#3B82F6' },
    { category: 'PC & Composants', sales: 28, color: '#10B981' },
    { category: 'Accessoires', sales: 22, color: '#F59E0B' },
    { category: 'Autres', sales: 15, color: '#EF4444' }
  ],
  topProducts: [
    { name: 'Smartphone Galaxy Pro', sales: 89, revenue: 71200 },
    { name: 'Ultrabook Zenith X1', sales: 67, revenue: 87100 },
    { name: 'Écouteurs Sans Fil Pulse', sales: 156, revenue: 23400 },
    { name: 'Carte Graphique TurboVision', sales: 34, revenue: 18700 }
  ],
  userMetrics: {
    totalUsers: 1247,
    activeUsers: 892,
    newUsers: 156,
    conversionRate: 3.2
  }
};

// 1. Define User type for admin dashboard

type AdminUserType = {
  id: string;
  name: string;
  email: string;
  registered: string;
  status: 'active' | 'banned';
  role: 'user' | 'seller' | 'admin';
  orders: number;
  lastLogin: string;
};

export default function AdminDashboard() {
  // All useState, useMemo, and logic go here!
  // User management state
  const [users, setUsers] = useState<AdminUserType[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'seller' | 'admin'>('all');
const [currentPage, setCurrentPage] = useState(1);
const [selectedUser, setSelectedUser] = useState<AdminUserType | null>(null);
const [showUserModal, setShowUserModal] = useState(false);
const USERS_PER_PAGE = 5;

// Edit and reset password modal state (move to top)
const [editUser, setEditUser] = useState<AdminUserType | null>(null);
const [showEditModal, setShowEditModal] = useState(false);
const [editForm, setEditForm] = useState<{ name: string; email: string; role: 'user' | 'seller' | 'admin'; status: 'active' | 'banned' }>({ name: '', email: '', role: 'user', status: 'active' });
const [resetUser, setResetUser] = useState<AdminUserType | null>(null);
const [showResetModal, setShowResetModal] = useState(false);

const filteredUsers = useMemo(() => {
  return users.filter(u =>
    (filterStatus === 'all' || u.status === filterStatus) &&
    (filterRole === 'all' || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()))
  );
}, [users, search, filterStatus, filterRole]);

const paginatedUsers = useMemo(() => {
  const start = (currentPage - 1) * USERS_PER_PAGE;
  return filteredUsers.slice(start, start + USERS_PER_PAGE);
}, [filteredUsers, currentPage]);

const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

// 2. Add types to all handler parameters
function handleBanUnban(user: AdminUserType) {
  setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u));
}
function handleDelete(user: AdminUserType) {
  setUsers(prev => prev.filter(u => u.id !== user.id));
  setNotification({ type: 'success', message: `Utilisateur ${user.name} supprimé.` });
}
function handleView(user: AdminUserType) {
  setSelectedUser(user);
  setShowUserModal(true);
}
function handleEdit(user: AdminUserType) {
  setEditUser(user);
  setEditForm({ name: user.name, email: user.email, role: user.role, status: user.status });
  setShowEditModal(true);
}
function handleEditSave(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (!editUser) return;
  setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editForm } : u));
  setShowEditModal(false);
  setNotification({ type: 'success', message: `Utilisateur ${editForm.name} modifié.` });
}
function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  const { name, value } = e.target;
  setEditForm(f => ({ ...f, [name]: value }));
}
function handleResetPassword(user: AdminUserType) {
  setResetUser(user);
  setShowResetModal(true);
}
function handleResetConfirm() {
  setShowResetModal(false);
  if (resetUser) {
    setNotification({ type: 'success', message: `Lien de réinitialisation envoyé à ${resetUser.email}` });
  }
}

// 3. Fix never/null errors in modals
const renderUserModal = () => selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-gray-950 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md p-8 relative animate-fade-in">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
        onClick={() => setShowUserModal(false)}
        aria-label="Fermer"
      >×</button>
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Détails utilisateur</h2>
      <div className="space-y-2 text-gray-200">
        <div><span className="font-semibold">Nom:</span> {selectedUser.name}</div>
        <div><span className="font-semibold">Email:</span> {selectedUser.email}</div>
        <div><span className="font-semibold">ID:</span> {selectedUser.id}</div>
        <div><span className="font-semibold">Rôle:</span> {selectedUser.role}</div>
        <div><span className="font-semibold">Statut:</span> <span className={selectedUser.status === 'banned' ? 'text-red-400' : 'text-green-400'}>{selectedUser.status}</span></div>
        <div><span className="font-semibold">Commandes:</span> {selectedUser.orders}</div>
        <div><span className="font-semibold">Dernière connexion:</span> {selectedUser.lastLogin}</div>
        <div><span className="font-semibold">Inscription:</span> {selectedUser.registered}</div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => setShowUserModal(false)}>Fermer</button>
      </div>
    </div>
  </div>
);

  const { adminUser, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the admin dashboard
  const [stats] = useState({
    totalUsers: 1247,
    totalOrders: 892,
    totalRevenue: 45678.50,
    pendingProducts: 5,
    activeProducts: 234,
    todayOrders: 23,
    todayRevenue: 1234.50,
    avgOrderValue: 51.20
  });

  const [recentOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'Jean Dupont',
      amount: 299.99,
      status: 'pending',
      date: '2024-01-20'
    },
    {
      id: 'ORD-002',
      customer: 'Marie Martin',
      amount: 149.50,
      status: 'shipped',
      date: '2024-01-19'
    },
    {
      id: 'ORD-003',
      customer: 'Pierre Durand',
      amount: 89.99,
      status: 'delivered',
      date: '2024-01-18'
    }
  ]);

  const [pendingProducts] = useState([
    {
      id: 'u003',
      name: 'Souris Gaming RGB',
      price: 29.99,
      seller: 'user123',
      category: 'accessoires',
      submittedAt: '2024-01-20'
    },
    {
      id: 'u004',
      name: 'Clavier Mécanique',
      price: 89.99,
      seller: 'user456',
      category: 'accessoires',
      submittedAt: '2024-01-19'
    }
  ]);

  const [systemAlerts] = useState([
    {
      type: 'warning',
      message: 'Stock faible pour "Écouteurs Sans Fil Pulse"',
      time: '2h ago'
    },
    {
      type: 'info',
      message: 'Nouvelle commande #ORD-001 en attente',
      time: '1h ago'
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: '📊' },
    { id: 'orders', label: 'Commandes', icon: '📦' },
    { id: 'products', label: 'Produits', icon: '🛍️' },
    { id: 'users', label: 'Utilisateurs', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Paramètres', icon: '⚙️' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-100">{stats.totalUsers}</p>
            </div>
            <div className="text-cyan-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Commandes</p>
              <p className="text-2xl font-bold text-gray-100">{stats.totalOrders}</p>
            </div>
            <div className="text-green-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenus</p>
              <p className="text-2xl font-bold text-gray-100">{stats.totalRevenue.toLocaleString('fr-FR')}€</p>
            </div>
            <div className="text-yellow-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Produits</p>
              <p className="text-2xl font-bold text-gray-100">{stats.activeProducts}</p>
            </div>
            <div className="text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Aujourd'hui</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Commandes</span>
              <span className="text-gray-100 font-semibold">{stats.todayOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Revenus</span>
              <span className="text-gray-100 font-semibold">{stats.todayRevenue}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Panier moyen</span>
              <span className="text-gray-100 font-semibold">{stats.avgOrderValue}€</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Commandes récentes</h3>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <div>
                  <p className="text-sm font-medium text-gray-100">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-100">{order.amount}€</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                    order.status === 'shipped' ? 'bg-blue-900 text-blue-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Alertes système</h3>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded ${
                alert.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-700' :
                'bg-blue-900/20 border border-blue-700'
              }`}>
                <p className="text-sm text-gray-100">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products" className="flex items-center p-4 bg-cyan-900/20 rounded-lg hover:bg-cyan-900/30 transition-colors">
            <div className="text-cyan-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Gérer les produits</p>
              <p className="text-sm text-gray-400">Ajouter, modifier, supprimer</p>
            </div>
          </Link>

          <Link href="/admin/orders" className="flex items-center p-4 bg-green-900/20 rounded-lg hover:bg-green-900/30 transition-colors">
            <div className="text-green-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Gérer les commandes</p>
              <p className="text-sm text-gray-400">Suivre et traiter</p>
            </div>
          </Link>

          <Link href="/admin/users" className="flex items-center p-4 bg-blue-900/20 rounded-lg hover:bg-blue-900/30 transition-colors">
            <div className="text-blue-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Gérer les utilisateurs</p>
              <p className="text-sm text-gray-400">Modérer et bannir</p>
            </div>
          </Link>

          <Link href="/admin/analytics" className="flex items-center p-4 bg-purple-900/20 rounded-lg hover:bg-purple-900/30 transition-colors">
            <div className="text-purple-400 mr-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-100">Analytics</p>
              <p className="text-sm text-gray-400">Statistiques détaillées</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Gestion des commandes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-gray-300">ID</th>
                <th className="text-left py-3 text-gray-300">Client</th>
                <th className="text-left py-3 text-gray-300">Montant</th>
                <th className="text-left py-3 text-gray-300">Statut</th>
                <th className="text-left py-3 text-gray-300">Date</th>
                <th className="text-left py-3 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-800">
                  <td className="py-3 text-gray-100">{order.id}</td>
                  <td className="py-3 text-gray-100">{order.customer}</td>
                  <td className="py-3 text-gray-100">{order.amount}€</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      order.status === 'shipped' ? 'bg-blue-900 text-blue-300' :
                      'bg-green-900 text-green-300'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-100">{order.date}</td>
                  <td className="py-3">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm">Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Produits en attente de modération</h3>
        <div className="space-y-4">
          {pendingProducts.length === 0 ? (
            <p className="text-gray-400">Aucun produit en attente de modération.</p>
          ) : (
            pendingProducts.map((product) => (
              <div key={product.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-700 rounded"></div>
                  <div>
                    <h4 className="text-gray-100 font-medium">{product.name}</h4>
                    <p className="text-gray-400 text-sm">{product.price}€ - {product.category}</p>
                    <p className="text-gray-500 text-xs">Vendeur: {product.seller}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                    Approuver
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
                    Rejeter
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // Modal renderers (move above renderUsers)
  const renderEditModal = () => editUser && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray-950 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
          onClick={() => setShowEditModal(false)}
          aria-label="Fermer"
        >×</button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Éditer utilisateur</h2>
        <form className="space-y-4" onSubmit={handleEditSave}>
          <div>
            <label className="block text-gray-300 mb-1">Nom</label>
            <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input name="email" value={editForm.email} onChange={handleEditChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700" type="email" required />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Rôle</label>
            <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700">
              <option value="user">Utilisateur</option>
              <option value="seller">Vendeur</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Statut</label>
            <select name="status" value={editForm.status} onChange={handleEditChange} className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700">
              <option value="active">Actif</option>
              <option value="banned">Banni</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => setShowEditModal(false)}>Annuler</button>
            <button type="submit" className="px-6 py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-700">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderResetModal = () => resetUser && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray-950 rounded-xl shadow-2xl border border-gray-800 w-full max-w-sm p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
          onClick={() => setShowResetModal(false)}
          aria-label="Fermer"
        >×</button>
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Réinitialiser le mot de passe</h2>
        <p className="text-gray-200 mb-6">Envoyer un lien de réinitialisation à <span className="font-semibold">{resetUser.email}</span> ?</p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => setShowResetModal(false)}>Annuler</button>
          <button className="px-6 py-2 rounded bg-yellow-600 text-white font-bold hover:bg-yellow-700" onClick={handleResetConfirm}>Envoyer</button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Gestion des utilisateurs</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom, email ou ID..."
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          />
          <select
            className="px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value as 'all' | 'active' | 'banned'); setCurrentPage(1); }}
          >
            <option value="all">Tous statuts</option>
            <option value="active">Actif</option>
            <option value="banned">Banni</option>
          </select>
          <select
            className="px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none"
            value={filterRole}
            onChange={e => { setFilterRole(e.target.value as 'all' | 'user' | 'seller' | 'admin'); setCurrentPage(1); }}
          >
            <option value="all">Tous rôles</option>
            <option value="user">Utilisateur</option>
            <option value="seller">Vendeur</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 text-gray-300">Nom</th>
                <th className="text-left py-3 text-gray-300">Email</th>
                <th className="text-left py-3 text-gray-300">Rôle</th>
                <th className="text-left py-3 text-gray-300">Statut</th>
                <th className="text-left py-3 text-gray-300">Commandes</th>
                <th className="text-left py-3 text-gray-300">Inscription</th>
                <th className="text-left py-3 text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-400 py-8">Aucun utilisateur trouvé.</td></tr>
              ) : paginatedUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-3 text-gray-100 font-medium">{user.name}</td>
                  <td className="py-3 text-gray-100">{user.email}</td>
                  <td className="py-3 text-gray-100 capitalize">{user.role}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${user.status === 'banned' ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>{user.status}</span>
                  </td>
                  <td className="py-3 text-gray-100">{user.orders}</td>
                  <td className="py-3 text-gray-100">{user.registered}</td>
                  <td className="py-3 flex flex-wrap gap-1">
                    <button className="bg-cyan-700 hover:bg-cyan-800 text-white px-2 py-1 rounded text-xs" onClick={() => handleView(user)}>Voir</button>
                    <button className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-xs" onClick={() => handleEdit(user)}>Éditer</button>
                    <button className={`px-2 py-1 rounded text-xs ${user.status === 'banned' ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-red-700 hover:bg-red-800 text-white'}`} onClick={() => handleBanUnban(user)}>{user.status === 'banned' ? 'Débannir' : 'Bannir'}</button>
                    <button className="bg-yellow-700 hover:bg-yellow-800 text-white px-2 py-1 rounded text-xs" onClick={() => handleResetPassword(user)}>Réinit. MDP</button>
                    <button className="bg-red-900 hover:bg-red-800 text-white px-2 py-1 rounded text-xs" onClick={() => handleDelete(user)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-gray-400 text-sm">Page {currentPage} / {totalPages || 1}</span>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50">Précédent</button>
            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50">Suivant</button>
          </div>
        </div>
      </div>
      {showUserModal && renderUserModal()}
      {showEditModal && renderEditModal()}
      {showResetModal && renderResetModal()}
    </div>
  );

  // Notification state for toasts
  const [notification, setNotification] = useState<{ type: 'success' | 'info'; message: string } | null>(null);
  // Modal state
  const [showAlertModal, setShowAlertModal] = useState(false);
  // Alert config state
  const [alertConfig, setAlertConfig] = useState({
    stockLow: true,
    outOfStock: true,
    orderFailed: false,
    highValueOrder: false,
    highValueThreshold: 1000,
    suspiciousOrder: false,
    conversionRate: false,
    conversionRateThreshold: 2,
    topSeller: false,
    topSellerCount: 1
  });

  // Mock analytics data (move outside renderAnalytics)
  const analyticsData = {
    salesData: [
      { month: 'Jan', sales: 12000, orders: 45 },
      { month: 'Fév', sales: 15000, orders: 52 },
      { month: 'Mar', sales: 18000, orders: 61 },
      { month: 'Avr', sales: 22000, orders: 78 },
      { month: 'Mai', sales: 25000, orders: 89 },
      { month: 'Juin', sales: 28000, orders: 95 }
    ],
    categoryData: [
      { category: 'Téléphones', sales: 35, color: '#3B82F6' },
      { category: 'PC & Composants', sales: 28, color: '#10B981' },
      { category: 'Accessoires', sales: 22, color: '#F59E0B' },
      { category: 'Autres', sales: 15, color: '#EF4444' }
    ],
    topProducts: [
      { name: 'Smartphone Galaxy Pro', sales: 89, revenue: 71200 },
      { name: 'Ultrabook Zenith X1', sales: 67, revenue: 87100 },
      { name: 'Écouteurs Sans Fil Pulse', sales: 156, revenue: 23400 },
      { name: 'Carte Graphique TurboVision', sales: 34, revenue: 18700 }
    ],
    userMetrics: {
      totalUsers: 1247,
      activeUsers: 892,
      newUsers: 156,
      conversionRate: 3.2
    }
  };

  // Helper: CSV export
  function exportAnalyticsCSV() {
    const rows = [
      ['Mois', 'Ventes (€)', 'Commandes'],
      ...analyticsData.salesData.map(d => [d.month, d.sales, d.orders])
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setNotification({ type: 'success', message: 'Données exportées en CSV !' });
  }

  function generatePDFReport() {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Rapport Analytique - TechStore', 14, 18);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 26);

    // Key Metrics
    doc.setFontSize(14);
    doc.text('Résumé des indicateurs clés', 14, 38);
    doc.setFontSize(11);
    let lastY = 42;
    autoTable(doc, {
      startY: lastY,
      head: [['Revenus totaux', 'Commandes', 'Utilisateurs actifs', 'Taux de conversion']],
      body: [[
        '112,000€',
        '420',
        '892',
        '3.2%'
      ]],
      theme: 'grid',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    lastY = (doc as any).lastAutoTable?.finalY || lastY + 20;

    // Sales Trend Table
    doc.setFontSize(14);
    doc.text('Évolution des ventes', 14, lastY + 10);
    autoTable(doc, {
      startY: lastY + 14,
      head: [['Mois', 'Ventes (€)', 'Commandes']],
      body: analyticsData.salesData.map(d => [d.month, d.sales, d.orders]),
      theme: 'striped',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [16, 185, 129] },
    });
    lastY = (doc as any).lastAutoTable?.finalY || lastY + 20;

    // Category Breakdown
    doc.setFontSize(14);
    doc.text('Répartition par catégorie', 14, lastY + 10);
    autoTable(doc, {
      startY: lastY + 14,
      head: [['Catégorie', 'Part (%)']],
      body: analyticsData.categoryData.map(c => [c.category, c.sales]),
      theme: 'striped',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [245, 158, 11] },
    });
    lastY = (doc as any).lastAutoTable?.finalY || lastY + 20;

    // Top Products
    doc.setFontSize(14);
    doc.text('Produits les plus vendus', 14, lastY + 10);
    autoTable(doc, {
      startY: lastY + 14,
      head: [['Produit', 'Ventes', 'Revenus (€)', 'Performance (%)']],
      body: analyticsData.topProducts.map(p => [
        p.name,
        p.sales,
        p.revenue,
        Math.round((p.sales / 156) * 100)
      ]),
      theme: 'striped',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [59, 130, 246] },
    });
    lastY = (doc as any).lastAutoTable?.finalY || lastY + 20;

    // User Metrics
    doc.setFontSize(14);
    doc.text('Métriques utilisateurs', 14, lastY + 10);
    autoTable(doc, {
      startY: lastY + 14,
      head: [['Utilisateurs totaux', 'Utilisateurs actifs', 'Nouveaux utilisateurs', 'Taux de conversion']],
      body: [[
        analyticsData.userMetrics.totalUsers,
        analyticsData.userMetrics.activeUsers,
        analyticsData.userMetrics.newUsers,
        analyticsData.userMetrics.conversionRate + '%'
      ]],
      theme: 'grid',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [16, 185, 129] },
    });
    // No need to update lastY after the last table

    doc.save('rapport-analytique-techstore.pdf');
  }

  const renderAlertModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-gray-950 rounded-xl shadow-2xl border border-gray-800 w-full max-w-lg p-8 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-400 text-2xl font-bold"
          onClick={() => setShowAlertModal(false)}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Configurer les alertes</h2>
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); setShowAlertModal(false); setNotification({ type: 'success', message: 'Alertes enregistrées !' }); }}>
          {/* Stock/Inventory Alerts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Stock / Inventaire</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={alertConfig.stockLow} onChange={e => setAlertConfig(c => ({ ...c, stockLow: e.target.checked }))} />
                <span className="text-gray-300">Alerte si stock faible</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={alertConfig.outOfStock} onChange={e => setAlertConfig(c => ({ ...c, outOfStock: e.target.checked }))} />
                <span className="text-gray-300">Alerte si rupture de stock</span>
              </label>
            </div>
          </div>
          {/* Order/Payment Alerts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Commandes / Paiements</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={alertConfig.orderFailed} onChange={e => setAlertConfig(c => ({ ...c, orderFailed: e.target.checked }))} />
                <span className="text-gray-300">Alerte si paiement échoué</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={alertConfig.highValueOrder} onChange={e => setAlertConfig(c => ({ ...c, highValueOrder: e.target.checked }))} />
                <span className="text-gray-300">Alerte si commande &gt; </span>
                <input type="number" min={1} className="w-20 px-2 py-1 rounded bg-gray-800 text-gray-100 border border-gray-700" value={alertConfig.highValueThreshold} onChange={e => setAlertConfig(c => ({ ...c, highValueThreshold: Number(e.target.value) }))} />
                <span className="text-gray-300">€</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={alertConfig.suspiciousOrder} onChange={e => setAlertConfig(c => ({ ...c, suspiciousOrder: e.target.checked }))} />
                <span className="text-gray-300">Alerte activité suspecte</span>
              </label>
            </div>
          </div>
          {/* Custom Analytics Triggers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Déclencheurs personnalisés</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={alertConfig.conversionRate} onChange={e => setAlertConfig(c => ({ ...c, conversionRate: e.target.checked }))} />
                <span className="text-gray-300">Alerte si taux de conversion &lt; </span>
                <input type="number" min={0} max={100} className="w-16 px-2 py-1 rounded bg-gray-800 text-gray-100 border border-gray-700" value={alertConfig.conversionRateThreshold} onChange={e => setAlertConfig(c => ({ ...c, conversionRateThreshold: Number(e.target.value) }))} />
                <span className="text-gray-300">%</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={alertConfig.topSeller} onChange={e => setAlertConfig(c => ({ ...c, topSeller: e.target.checked }))} />
                <span className="text-gray-300">Alerte si un produit devient top vendeur (top </span>
                <input type="number" min={1} max={10} className="w-12 px-2 py-1 rounded bg-gray-800 text-gray-100 border border-gray-700" value={alertConfig.topSellerCount} onChange={e => setAlertConfig(c => ({ ...c, topSellerCount: Number(e.target.value) }))} />
                <span className="text-gray-300">)</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600" onClick={() => setShowAlertModal(false)}>Annuler</button>
            <button type="submit" className="px-6 py-2 rounded bg-cyan-600 text-white font-bold hover:bg-cyan-700">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    return (
      <div className="space-y-6">
        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300
            ${notification.type === 'success' ? 'bg-green-600' : 'bg-cyan-700'}`}
            onClick={() => setNotification(null)}
            style={{ cursor: 'pointer' }}
          >
            {notification.message}
          </div>
        )}
        {showAlertModal && renderAlertModal()}
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenus totaux</p>
                <p className="text-2xl font-bold text-gray-100">112,000€</p>
                <p className="text-green-400 text-sm">+12.5% vs mois dernier</p>
              </div>
              <div className="text-green-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Commandes</p>
                <p className="text-2xl font-bold text-gray-100">420</p>
                <p className="text-green-400 text-sm">+8.3% vs mois dernier</p>
              </div>
              <div className="text-blue-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-gray-100">892</p>
                <p className="text-green-400 text-sm">+15.2% vs mois dernier</p>
              </div>
              <div className="text-cyan-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-100">3.2%</p>
                <p className="text-green-400 text-sm">+0.5% vs mois dernier</p>
              </div>
              <div className="text-yellow-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-gray-100">Évolution des ventes</h3>
            <div className="space-y-4">
              {analyticsData.salesData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-gray-400 w-12">{data.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(data.sales / 30000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-100 text-sm font-medium">{data.sales.toLocaleString()}€</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-gray-100">Répartition par catégorie</h3>
            <div className="space-y-4">
              {analyticsData.categoryData.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-gray-300">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-800 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${category.sales}%`,
                          backgroundColor: category.color 
                        }}
                      ></div>
                    </div>
                    <span className="text-gray-100 text-sm font-medium">{category.sales}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4 text-gray-100">Produits les plus vendus</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300">Produit</th>
                  <th className="text-left py-3 text-gray-300">Ventes</th>
                  <th className="text-left py-3 text-gray-300">Revenus</th>
                  <th className="text-left py-3 text-gray-300">Performance</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topProducts.map((product, index) => (
                  <tr key={product.name} className="border-b border-gray-800">
                    <td className="py-3 text-gray-100">{product.name}</td>
                    <td className="py-3 text-gray-100">{product.sales}</td>
                    <td className="py-3 text-gray-100">{product.revenue.toLocaleString()}€</td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                            style={{ width: `${(product.sales / 156) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.round((product.sales / 156) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-gray-100">Métriques utilisateurs</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Utilisateurs totaux</span>
                <span className="text-gray-100 font-semibold">{analyticsData.userMetrics.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Utilisateurs actifs</span>
                <span className="text-gray-100 font-semibold">{analyticsData.userMetrics.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Nouveaux utilisateurs</span>
                <span className="text-gray-100 font-semibold">{analyticsData.userMetrics.newUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Taux de conversion</span>
                <span className="text-gray-100 font-semibold">{analyticsData.userMetrics.conversionRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4 text-gray-100">Actions rapides</h3>
            <div className="space-y-3">
              <button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                onClick={exportAnalyticsCSV}
              >
                Exporter les données
              </button>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                onClick={generatePDFReport}
              >
                Générer un rapport
              </button>
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setShowAlertModal(true)}
              >
                Configurer les alertes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h3 className="text-lg font-bold mb-4 text-gray-100">Paramètres administrateur</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom du site</label>
            <input
              type="text"
              defaultValue="TechStore"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email de contact</label>
            <input
              type="email"
              defaultValue="admin@techstore.fr"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mode maintenance</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-100">Activer le mode maintenance</span>
              </label>
            </div>
          </div>
          
          <div className="pt-4">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg">
              Sauvegarder les paramètres
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
      case 'orders':
        return renderOrders();
      case 'products':
        return renderProducts();
      case 'users':
        return renderUsers();
      case 'analytics':
        return renderAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Admin Header */}
      <div className="bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-cyan-400">Admin Panel</h1>
                <p className="text-sm text-gray-400">Connecté en tant que {adminUser?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-gray-100 text-sm">
                Voir le site
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Gestion complète de la plateforme TechStore</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-900 rounded-lg p-1 border border-gray-800 overflow-x-auto">
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
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}