"use client";
import React, { useState } from 'react';
import PriceHistoryChart from '../components/PriceHistoryChart';
import type { Product, PriceHistoryEntry } from '../types/marketplace';

const mockProducts: Product[] = [
  { id: 'p1', name: 'PC Gamer', description: '', price: 2000, image: '', category: 'ordinateurs', owner: { id: 'u1', name: 'Seller', email: '', isVerified: true } },
  { id: 'p2', name: 'iPhone', description: '', price: 1500, image: '', category: 'telephones', owner: { id: 'u2', name: 'Seller2', email: '', isVerified: false } },
];
const mockHistory: PriceHistoryEntry[] = [
  { date: '2024-05-01', price: 2100 },
  { date: '2024-05-15', price: 2000 },
  { date: '2024-06-01', price: 1950 },
];

export default function MarketTrendsPage() {
  const [selected, setSelected] = useState(mockProducts[0]);
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Tendances du marché</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Produit</label>
        <select className="border rounded px-2 py-1" value={selected.id} onChange={e => setSelected(mockProducts.find(p => p.id === e.target.value) || mockProducts[0])}>
          {mockProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <PriceHistoryChart history={mockHistory} />
    </div>
  );
} 