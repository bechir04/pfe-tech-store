import React from 'react';
import Badge from './Badge';

export default function PointsDisplay({ points, badges }: { points: number; badges: string[] }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-bold text-cyan-600">{points} pts</span>
      {badges.map(b => <Badge key={b} type={b} />)}
    </div>
  );
} 