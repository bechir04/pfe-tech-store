import React from 'react';
import type { GamificationEvent } from '../../types/marketplace';

const mockPoints = 1200;
const mockBadges = ['verified', 'loyalty', 'top-seller'];
const mockHistory: GamificationEvent[] = [
  { id: 'g1', type: 'buy', points: 100, date: '2024-05-01', description: 'Achat PC' },
  { id: 'g2', type: 'sell', points: 200, date: '2024-05-10', description: 'Vente iPhone' },
  { id: 'g3', type: 'review', points: 50, date: '2024-05-15', description: 'Avis laissé' },
];

const badgeIcons: Record<string, string> = {
  verified: '✅',
  loyalty: '💎',
  'top-seller': '🚀',
};

export default function LoyaltyPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2 text-cyan-400 drop-shadow-glow">
        🏆 Mes points & badges
      </h1>
      <div className="bg-gradient-to-br from-cyan-900 via-gray-900 to-blue-900 rounded-2xl shadow-xl p-8 mb-8 flex flex-col items-center border-2 border-cyan-500/40 animate-glow">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">💰</span>
          <span className="text-4xl font-extrabold text-cyan-300 drop-shadow-glow">{mockPoints} pts</span>
        </div>
        <div className="flex gap-3 mt-2">
          {mockBadges.map(badge => (
            <span
              key={badge}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-cyan-800/60 text-cyan-200 font-semibold text-lg shadow-glow border border-cyan-400/40"
            >
              <span className="text-2xl">{badgeIcons[badge] || '🔰'}</span> {badge.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
      <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center gap-2 text-cyan-300">
        📜 Historique des points
      </h2>
      <ul className="space-y-2">
        {mockHistory.map(e => (
          <li
            key={e.id}
            className="border rounded-xl p-3 flex justify-between items-center bg-gray-900/80 border-cyan-800/40 shadow-glow"
          >
            <span className="flex items-center gap-2">
              {e.type === 'buy' && '🛒'}
              {e.type === 'sell' && '💸'}
              {e.type === 'review' && '⭐'}
              {e.description}
            </span>
            <span className="text-cyan-400 font-bold flex items-center gap-1">+{e.points} pts</span>
            <span className="text-xs text-gray-400">{e.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 