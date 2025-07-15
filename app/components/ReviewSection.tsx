import React, { useState } from 'react';
import type { Review, User } from '../types/marketplace';

export function getAverageRatingFor(key: string) {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
  if (!stored) return 0;
  const reviews = JSON.parse(stored);
  if (!reviews.length) return 0;
  return (
    reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
  );
}

type ReviewSectionProps = {
  productId?: string;
  sellerId?: string;
  reviews?: Review[];
  currentUser?: User;
  onReview?: (rating: number, comment: string) => void;
  title?: string;
};

export default function ReviewSection({ productId, sellerId, reviews: propReviews, currentUser, onReview, title }: ReviewSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const key = sellerId ? `reviews_seller_${sellerId}` : productId ? `reviews_${productId}` : '';
  const [reviews, setReviews] = useState(() => {
    if (propReviews) return propReviews;
    if (!key) return [];
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return stored ? JSON.parse(stored) : [];
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key) return;
    const newReview = {
      id: Date.now().toString(),
      productId,
      sellerId,
      user: currentUser || { name: 'Demo', email: 'demo@mail.com', uid: 'demo' },
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    setComment('');
    if (onReview) onReview(rating, comment);
  };
  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-2">{title || (sellerId ? 'Avis sur le vendeur' : 'Avis des utilisateurs')}</h3>
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
      {currentUser && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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