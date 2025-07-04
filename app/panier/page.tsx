"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Gestion du code promo
  const handleApplyCoupon = () => {
    // Exemple simple: code "TECHSTORE10" donne 10% de réduction
    if (couponCode === 'TECHSTORE10' && !couponApplied) {
      setDiscount(getTotalPrice() * 0.1);
      setCouponApplied(true);
      alert('Code promo appliqué avec succès !');
    } else if (couponApplied) {
      alert('Un code promo est déjà appliqué');
    } else {
      alert('Code promo invalide');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-sm">
          <div className="max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-xl font-semibold mb-4">Votre panier est vide</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats.
            </p>
            <Link 
              href="/produits" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg inline-block"
            >
              Découvrir nos produits
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold">{getTotalItems()} article(s)</h2>
                <button 
                  onClick={clearCart}
                  className="text-red-600 dark:text-red-400 text-sm hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Vider le panier
                </button>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <Link 
                            href={`/produits/${item.category}/${item.id}`}
                            className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            {item.name}
                          </Link>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Catégorie: {item.category === 'telephones' ? 'Téléphones' : 
                                         item.category === 'accessoires' ? 'Accessoires' : 'PC & Composants'}
                          </p>
                        </div>
                        
                        <div className="text-blue-600 dark:text-blue-400 font-bold">
                          {item.price.toFixed(3)} TND
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex items-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600 px-4 py-1">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 dark:text-red-400 text-sm hover:underline flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Récapitulatif de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm sticky top-4">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{getTotalPrice().toFixed(3)} TND</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Remise</span>
                      <span>-{discount.toFixed(3)} TND</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span>Gratuit</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{(getTotalPrice() - discount).toFixed(3)} TND</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      TVA incluse
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Code promo */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-3">Code promo</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    placeholder="Entrez votre code"
                    className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className={`px-4 py-2 rounded-r-lg font-medium ${
                      couponApplied
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Appliquer
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                    Code promo TECHSTORE10 appliqué !
                  </p>
                )}
              </div>
              
              {/* Boutons d'action */}
              <div className="p-6">
                <Link 
                  href="/commande"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center mb-3"
                >
                  Passer la commande
                </Link>
                
                <Link 
                  href="/produits"
                  className="w-full border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
                >
                  Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
