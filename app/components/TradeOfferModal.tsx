"use client";

import React, { useState } from 'react';
import type { Product, TradeOffer, User } from '../types/marketplace';

interface TradeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  myProducts: Product[];
  targetProduct: Product;
  onSubmit: (offer: Partial<TradeOffer>) => void;
  mode?: 'propose' | 'respond';
  incomingOffer?: TradeOffer;
}

export default function TradeOfferModal({ isOpen, onClose, myProducts, targetProduct, onSubmit, mode = 'propose', incomingOffer }: TradeOfferModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [cashAdjustment, setCashAdjustment] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Proposer un échange</h2>
        <div className="mb-4">
          <div className="font-medium mb-1">Produit ciblé :</div>
          <div className="p-2 border rounded bg-gray-50 dark:bg-gray-800">{targetProduct.name}</div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              offeredProduct: myProducts.find(p => p.id === selectedProductId),
              requestedProduct: targetProduct,
              cashAdjustment: cashAdjustment ? parseFloat(cashAdjustment) : undefined,
            });
            onClose();
          }}
        >
          <label className="block mb-1 font-medium">Choisir un de vos produits à échanger</label>
          <select
            className="w-full border rounded px-2 py-1 mb-2"
            value={selectedProductId}
            onChange={e => setSelectedProductId(e.target.value)}
            required
          >
            <option value="">-- Sélectionner --</option>
            {myProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <label className="block mb-1 font-medium">Ajout d'argent (optionnel)</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1 mb-4"
            value={cashAdjustment}
            onChange={e => setCashAdjustment(e.target.value)}
            min="0"
            step="0.001"
            placeholder="0.000 TND"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-1 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Annuler</button>
            <button type="submit" className="px-4 py-1 rounded bg-blue-600 text-white font-semibold">Proposer</button>
          </div>
        </form>
        {mode === 'respond' && incomingOffer && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Offre reçue :</h3>
            <div className="mb-2">Produit proposé : {incomingOffer.offeredProduct?.name || 'Aucun'}</div>
            <div className="mb-2">Ajout d'argent : {incomingOffer.cashAdjustment || 0} TND</div>
            <div className="flex gap-2">
              <button className="px-4 py-1 rounded bg-green-600 text-white">Accepter</button>
              <button className="px-4 py-1 rounded bg-red-600 text-white">Rejeter</button>
              <button className="px-4 py-1 rounded bg-yellow-500 text-white">Contre-offre</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 