"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const categories = [
  { id: 'telephones', name: 'Téléphones' },
  { id: 'accessoires', name: 'Accessoires' },
  { id: 'ordinateurs', name: 'PC & Composants' },
];

export default function PostArticlePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: categories[0].id,
  });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!form.name || !form.description || !form.price || !form.category || !imageBase64) {
      setError('Veuillez remplir tous les champs et ajouter une image.');
      setLoading(false);
      return;
    }
    const article = {
      id: 'u' + Date.now(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      image: imageBase64,
      category: form.category,
      user: user ? { name: user.name, email: user.email } : null,
    };
    const articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    articles.push(article);
    localStorage.setItem('userArticles', JSON.stringify(articles));
    setLoading(false);
    router.push('/marketplace');
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Vendre un article</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <div>
          <label className="block mb-1 font-medium" htmlFor="name">Nom du produit</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" rows={4} />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="price">Prix (€)</label>
          <input type="number" id="price" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="image">Image</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
          {imageBase64 && (
            <img src={imageBase64} alt="Aperçu" className="mt-2 rounded-lg max-h-40 mx-auto" />
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="category">Catégorie</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-md px-6 py-2 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 active:scale-95"
          disabled={loading}
        >
          {loading ? 'Publication...' : "Poster l'article"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/marketplace" className="text-blue-600 dark:text-blue-400 hover:underline">Retour à la marketplace</Link>
      </div>
    </div>
  );
} 