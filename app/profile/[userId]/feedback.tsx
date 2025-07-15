import React, { useState } from 'react';

export default function FeedbackPage({ params }: { params: { userId: string } }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, send to backend
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Laisser un avis</h1>
      {submitted ? (
        <div className="bg-green-100 text-green-700 p-4 rounded">Merci pour votre retour !</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Note</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`h-8 w-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                  onClick={() => setRating(star)}
                  aria-label={`Note ${star}`}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 12.3,6.6 18.2,7.3 13.7,11.3 15,17.1 9.9,14.1 4.8,17.1 6.1,11.3 1.6,7.3 7.5,6.6" /></svg>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Commentaire</label>
            <textarea
              className="w-full rounded border border-gray-300 dark:border-gray-700 p-2 min-h-[80px]"
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              placeholder="Votre avis sur ce vendeur..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            disabled={rating === 0 || comment.length < 5}
          >
            Envoyer
          </button>
        </form>
      )}
    </div>
  );
} 