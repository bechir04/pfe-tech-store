import React from 'react';
import PointsDisplay from '../../components/PointsDisplay';
import type { GamificationEvent } from '../../types/marketplace';

const mockPoints = 1200;
const mockBadges = ['verified', 'loyalty', 'top-seller'];
const mockHistory: GamificationEvent[] = [
  { id: 'g1', type: 'buy', points: 100, date: '2024-05-01', description: 'Achat PC' },
  { id: 'g2', type: 'sell', points: 200, date: '2024-05-10', description: 'Vente iPhone' },
  { id: 'g3', type: 'review', points: 50, date: '2024-05-15', description: 'Avis laissé' },
];

export default function LoyaltyPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Mes points & badges</h1>
      <PointsDisplay points={mockPoints} badges={mockBadges} />
      <h2 className="text-lg font-semibold mt-6 mb-2">Historique des points</h2>
      <ul className="space-y-2">
        {mockHistory.map(e => (
          <li key={e.id} className="border rounded p-2 flex justify-between items-center">
            <span>{e.description}</span>
            <span className="text-cyan-600 font-bold">+{e.points} pts</span>
            <span className="text-xs text-gray-400">{e.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 