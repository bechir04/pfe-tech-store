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
    condition: 'new',
    warranty: '',
    video: '',
    specs: [{ key: '', value: '' }],
  });
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(imgs => setImages(imgs));
  };

  const handleSpecsChange = (idx: number, field: 'key' | 'value', value: string) => {
    setForm(f => {
      const specs = [...f.specs];
      specs[idx][field] = value;
      return { ...f, specs };
    });
  };
  const addSpec = () => setForm(f => ({ ...f, specs: [...f.specs, { key: '', value: '' }] }));
  const removeSpec = (idx: number) => setForm(f => ({ ...f, specs: f.specs.filter((_, i) => i !== idx) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!form.name || !form.description || !form.price || !form.category || images.length === 0) {
      setError('Veuillez remplir tous les champs et ajouter au moins une image.');
      setLoading(false);
      return;
    }
    const article = {
      id: 'u' + Date.now(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      images, // array of base64 strings
      videoUrl: form.video,
      condition: form.condition,
      warranty: form.warranty,
      specs: form.specs.filter(s => s.key && s.value),
      category: form.category,
      owner: user ? { id: user.uid, name: user.name, email: user.email, isVerified: true } : null,
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
          <label className="block mb-1 font-medium" htmlFor="images">Images (max 5)</label>
          <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImagesChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
          {images.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {images.map((img, i) => (
                <img key={i} src={img} alt={`Aperçu ${i+1}`} className="rounded-lg max-h-24 border" />
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="video">Vidéo (YouTube ou fichier mp4)</label>
          <input type="text" id="video" name="video" value={form.video} onChange={handleChange} placeholder="Lien YouTube ou mp4" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="condition">État</label>
          <select id="condition" name="condition" value={form.condition} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
            <option value="new">Neuf</option>
            <option value="used">Occasion</option>
            <option value="refurbished">Reconditionné</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium" htmlFor="warranty">Garantie</label>
          <input type="text" id="warranty" name="warranty" value={form.warranty} onChange={handleChange} placeholder="Ex: 1 an, 6 mois..." className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Spécifications détaillées</label>
          {form.specs.map((spec, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="text" placeholder="Clé (ex: RAM)" value={spec.key} onChange={e => handleSpecsChange(idx, 'key', e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-700" />
              <input type="text" placeholder="Valeur (ex: 16GB)" value={spec.value} onChange={e => handleSpecsChange(idx, 'value', e.target.value)} className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-700" />
              <button type="button" onClick={() => removeSpec(idx)} className="text-red-500 font-bold">×</button>
            </div>
          ))}
          <button type="button" onClick={addSpec} className="text-cyan-600 hover:underline text-sm">+ Ajouter une spécification</button>
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