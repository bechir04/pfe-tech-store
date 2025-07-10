import React, { useState } from 'react';
import type { Review, User } from '../types/marketplace';

type ReviewSectionProps = {
  productId: string;
  reviews: Review[];
  currentUser?: User;
  onReview?: (rating: number, comment: string) => void;
};

export default function ReviewSection({ productId, reviews, currentUser, onReview }: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-2">Avis des utilisateurs</h3>
      <ul className="space-y-3 mb-4">
        {reviews.map(r => (
          <li key={r.id} className="border rounded p-2 bg-gray-50 dark:bg-gray-800">
            <div className="font-medium text-sm text-blue-700 dark:text-blue-300">{r.user.name} :</div>
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <div>{r.comment}</div>
          </li>
        ))}
      </ul>
      {currentUser && onReview && (
        <form onSubmit={e => { e.preventDefault(); onReview(rating, comment); setComment(''); }} className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <button type="button" key={i} onClick={() => setRating(i+1)} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</button>
            ))}
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)} className="border rounded px-2 py-1" placeholder="Votre avis..." />
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded self-end">Laisser un avis</button>
        </form>
      )}
    </div>
  );
} 