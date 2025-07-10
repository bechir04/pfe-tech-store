"use client";
import React, { useState } from 'react';
import TradeOfferModal from '../components/TradeOfferModal';
import type { TradeOffer, Product, User } from '../types/marketplace';

const mockUser: User = { id: 'u1', name: 'Moi', email: 'me@mail.com', isVerified: true };
const mockProduct: Product = { id: 'p1', name: 'Mon PC', description: '', price: 1000, image: '', category: 'ordinateurs', owner: mockUser };
const mockOffers: TradeOffer[] = [
  { id: 't1', fromUser: mockUser, toUser: mockUser, offeredProduct: mockProduct, requestedProduct: mockProduct, status: 'pending', createdAt: '2024-06-01' },
];

export default function TradePage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Mes échanges</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={() => setShowModal(true)}>Proposer un échange</button>
      <h2 className="text-lg font-semibold mt-6 mb-2">Offres en attente</h2>
      <ul className="space-y-2">
        {mockOffers.map(o => (
          <li key={o.id} className="border rounded p-2">Offre pour {o.requestedProduct.name} - Statut : {o.status}</li>
        ))}
      </ul>
      <TradeOfferModal isOpen={showModal} onClose={() => setShowModal(false)} myProducts={[mockProduct]} targetProduct={mockProduct} onSubmit={() => {}} />
    </div>
  );
} 