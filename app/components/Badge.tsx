import React from 'react';

export type BadgeType = 'verified' | 'top-seller' | 'loyalty' | 'eco' | 'admin' | string;

const badgeLabels: Record<BadgeType, string> = {
  verified: 'Vérifié',
  'top-seller': 'Top Vendeur',
  loyalty: 'Fidélité',
  eco: 'Eco',
  admin: 'Admin',
};

const badgeColors: Record<BadgeType, string> = {
  verified: 'bg-blue-500',
  'top-seller': 'bg-yellow-500',
  loyalty: 'bg-green-500',
  eco: 'bg-emerald-500',
  admin: 'bg-red-600',
};

export default function Badge({ type }: { type: BadgeType }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white ${badgeColors[type] || 'bg-gray-500'}`}
      title={badgeLabels[type] || type}
    >
      {badgeLabels[type] || type}
    </span>
  );
} 