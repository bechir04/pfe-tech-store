"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

// Composant fictif pour simuler l'intégration PayPal (dans un vrai projet, on utiliserait @paypal/react-paypal-js)
const PayPalButton = ({ amount, onSuccess, onError, onCancel }: { 
  amount: number; 
  onSuccess: () => void; 
  onError: () => void; 
  onCancel: () => void; 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center relative"
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Traitement...
        </span>
      ) : (
        <>
          <Image 
            src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
            alt="PayPal" 
            width={80} 
            height={20} 
            className="mr-2"
          />
          Payer {amount.toFixed(3)} TND
        </>
      )}
    </button>
  );
};

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1); // 1: Informations, 2: Paiement, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  // Vérifier si le panier est vide, si oui rediriger vers la page du panier
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/panier');
    }
  }, [cartItems, router]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!formData.email.trim()) errors.email = 'L\'email est requis';
    if (!formData.email.includes('@')) errors.email = 'L\'email n\'est pas valide';
    if (!formData.address.trim()) errors.address = 'L\'adresse est requise';
    if (!formData.city.trim()) errors.city = 'La ville est requise';
    if (!formData.postalCode.trim()) errors.postalCode = 'Le code postal est requis';
    if (!formData.postalCode.match(/^\d{5}$/)) errors.postalCode = 'Le code postal doit contenir 5 chiffres';
    if (!formData.phone.trim()) errors.phone = 'Le téléphone est requis';
    if (!formData.phone.match(/^(\+33|0)[1-9](\d{2}){4}$/)) errors.phone = 'Le téléphone n\'est pas valide';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSuccess = () => {
    const orderData = {
      items: cartItems,
      totalAmount: getTotalPrice(),
      shippingDetails: formData,
      paymentMethod,
      orderDate: new Date().toISOString(),
      orderNumber: 'ORD-' + Math.floor(100000 + Math.random() * 900000)
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Vider le panier
    clearCart();
    
    // Passer à l'étape de confirmation
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handlePaymentError = () => {
    alert('Erreur lors du paiement. Veuillez réessayer.');
  };

  const handlePaymentCancel = () => {
    alert('Paiement annulé.');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
          1
        </div>
        <div className={`h-1 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
          2
        </div>
        <div className={`h-1 w-12 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
          3
        </div>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Récapitulatif de la commande</h2>
        
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-center">
              <div className="relative w-12 h-12 rounded overflow-hidden mr-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quantité: {item.quantity}</p>
              </div>
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-bold">
              {(item.price * item.quantity).toFixed(3)} TND
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between mb-2">
          <span>Sous-total</span>
          <span>{getTotalPrice().toFixed(3)} TND</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Frais de livraison</span>
          <span>Gratuit</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200 dark:border-gray-700">
          <span>Total</span>
          <span>{getTotalPrice().toFixed(3)} TND</span>
        </div>
      </div>
    </div>
  );

  const renderShippingForm = () => (
    <form onSubmit={handleSubmitInfo}>
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1">Prénom*</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700`}
              />
              {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1">Nom*</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700`}
              />
              {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700`}
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Téléphone*</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700`}
              />
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium mb-1">Adresse*</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700`}
              />
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">Ville*</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700`}
              />
              {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
            </div>
            
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-1">Code postal*</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border ${formErrors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700`}
              />
              {formErrors.postalCode && <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>}
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Pays*</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex justify-between">
          <Link 
            href="/panier"
            className="text-blue-600 dark:text-blue-400 font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Retour au panier
          </Link>
          
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Continuer vers le paiement
          </button>
        </div>
      </div>
    </form>
  );

  const renderPaymentMethods = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Méthode de paiement</h2>
        
        <div className="space-y-4">
          <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={() => setPaymentMethod('paypal')}
              className="h-5 w-5 text-blue-600"
            />
            <div className="ml-3 flex items-center">
              <Image 
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
                alt="PayPal" 
                width={80} 
                height={20} 
              />
              <span className="ml-2">PayPal</span>
            </div>
          </label>
          
          <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors opacity-50">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              disabled
              className="h-5 w-5 text-blue-600"
            />
            <div className="ml-3 flex items-center">
              <span className="mr-2">Carte bancaire</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">(bientôt disponible)</span>
            </div>
          </label>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <PayPalButton
            amount={getTotalPrice()}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        </div>
        
        <button
          onClick={() => setStep(1)}
          className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-2 px-6 rounded-lg font-medium"
        >
          Retour aux informations de livraison
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => {
    // Récupérer les données de la dernière commande
    const lastOrderData = localStorage.getItem('lastOrder');
    if (!lastOrderData) {
      router.push('/');
      return null;
    }
    
    const order = JSON.parse(lastOrderData);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm mb-6 text-center">
        <div className="p-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Merci pour votre commande !</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Votre commande #{order.orderNumber} a été confirmée.
          </p>
          
          <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm">
              Un email de confirmation a été envoyé à <strong>{order.shippingDetails.email}</strong>. 
              Nous vous informerons quand votre commande sera expédiée.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold"
            >
              Retour à l'accueil
            </Link>
            
            <Link 
              href="/produits"
              className="border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-2 px-6 rounded-lg font-semibold"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {step === 1 && "Finaliser votre commande"}
        {step === 2 && "Paiement"}
        {step === 3 && "Confirmation de commande"}
      </h1>
      
      {step < 3 && renderStepIndicator()}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`${step === 3 ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          {step === 1 && renderShippingForm()}
          {step === 2 && renderPaymentMethods()}
          {step === 3 && renderConfirmation()}
        </div>
        
        {step < 3 && (
          <div className="lg:col-span-1">
            {renderOrderSummary()}
          </div>
        )}
      </div>
    </div>
  );
}
