import Link from 'next/link';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      <aside className="w-64 bg-gray-950 p-6 flex-shrink-0 border-r border-gray-800">
        <div className="mb-10">
          <Link href="/admin/dashboard">
            <h2 className="text-2xl font-bold text-cyan-400">Admin Panel</h2>
          </Link>
        </div>
        <nav className="space-y-4">
          <Link href="/admin/dashboard" className="flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors">
            Produits
          </Link>
          <Link href="/admin/categories" className="flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors">
            Catégories
          </Link>
          <Link href="/admin/orders" className="flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors">
            Commandes
          </Link>
          <Link href="/admin/payments" className="flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors">
            Paiements
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
} 