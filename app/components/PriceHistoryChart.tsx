import React from 'react';
import type { PriceHistoryEntry } from '../types/marketplace';

// Placeholder: Replace with Chart.js or similar for real chart
export default function PriceHistoryChart({ history }: { history: PriceHistoryEntry[] }) {
  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-2">Historique des prix</h3>
      <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-center text-gray-500">
        {/* TODO: Replace with real chart */}
        <div>Graphique des prix (mock)</div>
        <div className="flex justify-center gap-2 mt-2">
          {history.map((entry, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs">{entry.date}</span>
              <span className="font-bold">{entry.price} TND</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 