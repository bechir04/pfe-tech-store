'use client';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Smartphone Galaxy Pro', category: 'Téléphones', price: 799.99 },
    { id: '2', name: 'Ultrabook Zenith X1', category: 'Ordinateurs', price: 1299.99 },
    { id: '3', name: 'Écouteurs Sans Fil Pulse', category: 'Accessoires', price: 149.99 }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Edit existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: formData.name, category: formData.category, price: parseFloat(formData.price) }
          : p
      ));
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price)
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', category: '', price: '' });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, category: product.category, price: product.price.toString() });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-cyan-400">Gestion des Produits</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
        >
          Ajouter un produit
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">
            {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
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
              <label className="block text-gray-300 mb-1">Catégorie</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Prix (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
                {editingProduct ? 'Modifier' : 'Ajouter'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                  setFormData({ name: '', category: '', price: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4">Nom</th>
              <th className="py-3 px-4">Catégorie</th>
              <th className="py-3 px-4">Prix</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.category}</td>
                <td className="py-3 px-4">{product.price.toFixed(2)}€</td>
                <td className="py-3 px-4 space-x-2">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm transition"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(product.id)}
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
            <p className="text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer ce produit ?</p>
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