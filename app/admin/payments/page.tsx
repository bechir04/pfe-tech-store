'use client';
import { useState } from 'react';

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'En attente' | 'Payé' | 'Échoué' | 'Remboursé';
  method: 'Carte bancaire' | 'PayPal' | 'Virement';
  date: string;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([
    { id: '1', orderId: '12345', amount: 199.99, status: 'Payé', method: 'Carte bancaire', date: '2024-06-23' },
    { id: '2', orderId: '12346', amount: 349.99, status: 'En attente', method: 'PayPal', date: '2024-06-22' },
    { id: '3', orderId: '12347', amount: 89.99, status: 'Payé', method: 'Virement', date: '2024-06-21' }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({ 
    orderId: '', 
    amount: '', 
    status: 'En attente' as Payment['status'],
    method: 'Carte bancaire' as Payment['method']
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPayment) {
      // Edit existing payment
      setPayments(payments.map(p => 
        p.id === editingPayment.id 
          ? { ...p, orderId: formData.orderId, amount: parseFloat(formData.amount), status: formData.status, method: formData.method }
          : p
      ));
    } else {
      // Add new payment
      const newPayment: Payment = {
        id: Date.now().toString(),
        orderId: formData.orderId,
        amount: parseFloat(formData.amount),
        status: formData.status,
        method: formData.method,
        date: new Date().toISOString().split('T')[0]
      };
      setPayments([...payments, newPayment]);
    }
    setShowForm(false);
    setEditingPayment(null);
    setFormData({ orderId: '', amount: '', status: 'En attente', method: 'Carte bancaire' });
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({ 
      orderId: payment.orderId, 
      amount: payment.amount.toString(), 
      status: payment.status,
      method: payment.method
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPayments(payments.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-600';
      case 'Payé': return 'bg-green-600';
      case 'Échoué': return 'bg-red-600';
      case 'Remboursé': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-cyan-400">Suivi des Paiements</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
        >
          Ajouter un paiement
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-cyan-400">
            {editingPayment ? 'Modifier le paiement' : 'Ajouter un paiement'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">ID Commande</label>
              <input
                type="text"
                value={formData.orderId}
                onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Montant (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Méthode de paiement</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({...formData, method: e.target.value as Payment['method']})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="Carte bancaire">Carte bancaire</option>
                <option value="PayPal">PayPal</option>
                <option value="Virement">Virement</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as Payment['status']})}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="En attente">En attente</option>
                <option value="Payé">Payé</option>
                <option value="Échoué">Échoué</option>
                <option value="Remboursé">Remboursé</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
                {editingPayment ? 'Modifier' : 'Ajouter'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingPayment(null);
                  setFormData({ orderId: '', amount: '', status: 'En attente', method: 'Carte bancaire' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table className="w-full text-left text-gray-300">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4">Commande</th>
              <th className="py-3 px-4">Montant</th>
              <th className="py-3 px-4">Méthode</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="py-3 px-4">#{payment.orderId}</td>
                <td className="py-3 px-4">{payment.amount.toFixed(3)} TND</td>
                <td className="py-3 px-4">{payment.method}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-4">{payment.date}</td>
                <td className="py-3 px-4 space-x-2">
                  <button 
                    onClick={() => handleEdit(payment)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm transition"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(payment.id)}
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
            <p className="text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer ce paiement ?</p>
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