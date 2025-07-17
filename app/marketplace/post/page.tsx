"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const categoryOptions = [
  { id: 'telephones', name: 'Téléphones', icon: '📱', color: 'from-pink-500 to-yellow-400' },
  { id: 'ordinateurs', name: 'PC & Composants', icon: '💻', color: 'from-blue-500 to-indigo-500' },
  { id: 'accessoires', name: 'Accessoires', icon: '🎧', color: 'from-purple-500 to-cyan-400' },
];

const typeOptions: Record<string, { id: string; name: string; icon: string; description: string }[]> = {
  telephones: [
    { id: 'smartphone', name: 'Smartphone', icon: '📱', description: 'Téléphone intelligent' },
    { id: 'featurephone', name: 'Téléphone Classique', icon: '☎️', description: 'Téléphone basique' },
    { id: 'foldable', name: 'Pliable', icon: '🤳', description: 'Téléphone pliable' },
  ],
  ordinateurs: [
    { id: 'laptop', name: 'Portable', icon: '💻', description: 'Ordinateur portable' },
    { id: 'desktop', name: 'Bureau', icon: '🖥️', description: 'PC de bureau' },
    { id: 'gpu', name: 'Carte Graphique', icon: '🎮', description: 'GPU/Carte graphique' },
    { id: 'monitor', name: 'Écran', icon: '🖲️', description: 'Moniteur/Écran' },
  ],
  accessoires: [
    { id: 'headphones', name: 'Casque', icon: '🎧', description: 'Casque audio' },
    { id: 'keyboard', name: 'Clavier', icon: '⌨️', description: 'Clavier' },
    { id: 'mouse', name: 'Souris', icon: '🖱️', description: 'Souris' },
    { id: 'speaker', name: 'Haut-parleur', icon: '🔊', description: 'Enceinte' },
  ],
};

const specFields: Record<string, { key: string; label: string; icon: string; placeholder: string }[]> = {
  smartphone: [
    { key: 'ram', label: 'RAM', icon: '💾', placeholder: '8GB' },
    { key: 'storage', label: 'Stockage', icon: '🗄️', placeholder: '128GB' },
    { key: 'camera', label: 'Caméra', icon: '📸', placeholder: '108MP' },
    { key: 'battery', label: 'Batterie', icon: '🔋', placeholder: '5000mAh' },
  ],
  featurephone: [
    { key: 'battery', label: 'Batterie', icon: '🔋', placeholder: '2000mAh' },
    { key: 'screen', label: 'Écran', icon: '📺', placeholder: '2.4"' },
  ],
  foldable: [
    { key: 'ram', label: 'RAM', icon: '💾', placeholder: '12GB' },
    { key: 'screen', label: 'Écran', icon: '📺', placeholder: '7.6" pliable' },
    { key: 'battery', label: 'Batterie', icon: '🔋', placeholder: '4500mAh' },
  ],
  laptop: [
    { key: 'cpu', label: 'Processeur', icon: '🧠', placeholder: 'Intel i7' },
    { key: 'ram', label: 'RAM', icon: '💾', placeholder: '16GB' },
    { key: 'storage', label: 'Stockage', icon: '🗄️', placeholder: '512GB SSD' },
    { key: 'screen', label: 'Écran', icon: '📺', placeholder: '14" FHD' },
  ],
  desktop: [
    { key: 'cpu', label: 'Processeur', icon: '🧠', placeholder: 'AMD Ryzen 7' },
    { key: 'gpu', label: 'Carte Graphique', icon: '🎮', placeholder: 'RTX 3070' },
    { key: 'ram', label: 'RAM', icon: '💾', placeholder: '32GB' },
    { key: 'storage', label: 'Stockage', icon: '🗄️', placeholder: '1TB SSD' },
  ],
  gpu: [
    { key: 'chipset', label: 'Chipset', icon: '🎮', placeholder: 'NVIDIA RTX 4080' },
    { key: 'vram', label: 'Mémoire Vidéo', icon: '💾', placeholder: '16GB' },
  ],
  monitor: [
    { key: 'size', label: 'Taille', icon: '📏', placeholder: '27"' },
    { key: 'resolution', label: 'Résolution', icon: '🖼️', placeholder: '2560x1440' },
    { key: 'refresh', label: 'Taux de rafraîchissement', icon: '🔄', placeholder: '144Hz' },
  ],
  headphones: [
    { key: 'type', label: 'Type', icon: '🎧', placeholder: 'Sans fil' },
    { key: 'battery', label: 'Batterie', icon: '🔋', placeholder: '30h' },
  ],
  keyboard: [
    { key: 'switch', label: 'Switch', icon: '⌨️', placeholder: 'Mécanique' },
    { key: 'backlight', label: 'Rétroéclairage', icon: '💡', placeholder: 'RGB' },
  ],
  mouse: [
    { key: 'dpi', label: 'DPI', icon: '🎯', placeholder: '12000' },
    { key: 'buttons', label: 'Boutons', icon: '🔘', placeholder: '8' },
  ],
  speaker: [
    { key: 'power', label: 'Puissance', icon: '🔊', placeholder: '20W' },
    { key: 'connectivity', label: 'Connectivité', icon: '📡', placeholder: 'Bluetooth' },
  ],
};

export default function MarketplacePost() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: categoryOptions[0].id,
    condition: 'new',
    warranty: '',
    video: '',
    specs: [{ key: '', value: '' }],
    sellerPhone: '', // NEW FIELD
  });
  const [phoneError, setPhoneError] = useState(''); // NEW STATE
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'sellerPhone') {
      setPhoneError('');
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert('Vous pouvez sélectionner jusqu\'à 5 images maximum.');
      return;
    }
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
    setPhoneError('');
    setLoading(true);
    // Validate phone number: exactly 8 digits
    if (!/^\d{8}$/.test(form.sellerPhone)) {
      setPhoneError('Le numéro de téléphone doit contenir exactement 8 chiffres.');
      setLoading(false);
      return;
    }
    if (!form.name || !form.description || !form.price || !form.category || images.length === 0 || !form.sellerPhone) {
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
      category: selectedCategory,
      seller: user ? {
        id: user.uid,
        name: user.name,
        avatar: user.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
        badges: ['verified'],
        rating: 5.0,
        verified: true,
        sales: 0,
        phone: form.sellerPhone // NEW FIELD
      } : {
        id: 's-demo',
        name: 'Demo Seller',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        badges: ['verified'],
        rating: 4.5,
        verified: true,
        sales: 10,
        phone: form.sellerPhone // NEW FIELD
      },
    };
    const articles = JSON.parse(localStorage.getItem('userArticles') || '[]');
    articles.push(article);
    localStorage.setItem('userArticles', JSON.stringify(articles));

    // --- Notification for followers (local demo logic) ---
    // If the current user follows this seller, add a notification
    try {
      const followedSellers = JSON.parse(localStorage.getItem('followedSellers') || '[]');
      // If the seller is in the followedSellers list (and not self-follow)
      if (user && followedSellers.includes(user.uid)) {
        const notif = JSON.parse(localStorage.getItem('newProductsFromFollowed') || '[]');
        notif.push({
          message: `\uD83D\uDC64 <b>${user.name}</b> a ajouté un nouveau produit : <b>${form.name}</b>`,
          productId: article.id,
          productName: article.name,
          productImage: article.images?.[0] || '',
          timestamp: Date.now(),
          sellerId: user.uid,
          sellerName: user.name,
        });
        localStorage.setItem('newProductsFromFollowed', JSON.stringify(notif));
      }
    } catch (e) { /* ignore */ }
    // --- End notification logic ---

    setLoading(false);
    router.push('/marketplace');
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <h1 className="text-3xl font-bold mb-6 text-center">Choisissez une catégorie</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {categoryOptions.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setStep(2); }}
                  className={`rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg bg-gradient-to-br ${cat.color} text-white text-2xl font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                >
                  <span className="text-5xl mb-2 animate-bounce">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 2 && selectedCategory && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <button onClick={() => setStep(1)} className="text-cyan-500 hover:underline mb-4">← Retour</button>
            <h1 className="text-3xl font-bold mb-6 text-center">Quel type de produit ?</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {typeOptions[selectedCategory].map(type => (
                <button
                  key={type.id}
                  onClick={() => { setSelectedType(type.id); setStep(3); }}
                  className="rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg bg-gradient-to-br from-gray-800 to-gray-900 text-white text-xl font-bold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <span className="text-5xl mb-2 animate-pulse">{type.icon}</span>
                  {type.name}
                  <span className="text-sm font-normal mt-2 text-gray-300">{type.description}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 3 && selectedCategory && selectedType && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <button onClick={() => setStep(2)} className="text-cyan-500 hover:underline mb-4">← Retour</button>
            <h1 className="text-3xl font-bold mb-6 text-center">Ajouter un {typeOptions[selectedCategory].find(t => t.id === selectedType)?.name}</h1>
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
                <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImagesChange} required className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700" max="5" />
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
              {/* Replace Spécifications détaillées with dynamic fields: */}
              <div className="bg-gray-900 rounded-xl p-6 shadow-lg mb-6">
                <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">{typeOptions[selectedCategory].find(t => t.id === selectedType)?.icon} Spécifications détaillées</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specFields[selectedType].map(field => (
                    <div key={field.key} className="flex flex-col">
                      <label className="text-gray-300 mb-1 flex items-center gap-2">{field.icon} {field.label}</label>
                      <input
                        type="text"
                        name={`spec_${field.key}`}
                        value={form.specs?.find(s => s.key === field.key)?.value || ''}
                        onChange={e => {
                          const value = e.target.value;
                          setForm(f => ({
                            ...f,
                            specs: f.specs.map(s => s.key === field.key ? { ...s, value } : s)
                          }));
                        }}
                        placeholder={field.placeholder}
                        className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* ...rest of the form (name, price, images, etc.)... */}
              <div>
                <label className="block text-gray-300 mb-1">Numéro du vendeur*</label>
                <input
                  type="tel"
                  name="sellerPhone"
                  value={form.sellerPhone}
                  onChange={handleChange}
                  pattern="^\d{8}$"
                  inputMode="numeric"
                  maxLength={8}
                  minLength={8}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Ex: 12345678"
                />
                {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
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
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-4 text-center">
        <Link href="/marketplace" className="text-blue-600 dark:text-blue-400 hover:underline">Retour à la marketplace</Link>
      </div>
    </div>
  );
} 