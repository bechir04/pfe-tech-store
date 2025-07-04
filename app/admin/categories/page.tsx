'use client';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Téléphones', description: 'Smartphones et téléphones de toutes marques' },
    { id: '2', name: 'Ordinateurs', description: 'PC & Composants' },
    { id: '3', name: 'Accessoires', description: 'Accessoires Multimédia' }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      // Edit existing category
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: formData.name, description: formData.description }
          : c
      ));
    } else {
      // Add new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description
      };
      setCategories([...categories, newCategory]);
    }
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-cyan-400">Gestion des Catégories</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
        >
          Ajouter une catégorie
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">
            {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
                {editingCategory ? 'Modifier' : 'Ajouter'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  setFormData({ name: '', description: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4">Nom</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="py-3 px-4">{category.name}</td>
                <td className="py-3 px-4">{category.description}</td>
                <td className="py-3 px-4 space-x-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm transition"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(category.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-red-400">Confirmer la suppression</h3>
            <p className="text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => handleDelete(showDeleteConfirm)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              >
                Supprimer
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 