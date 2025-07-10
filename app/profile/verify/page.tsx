"use client";

import React, { useState } from 'react';
import Badge from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { app } from '../../firebaseConfig';

type VerificationMethod = 'email' | 'phone' | 'id';

interface VerificationReward {
  method: VerificationMethod;
  points: number;
  badge?: string;
  description: string;
}

const verificationRewards: VerificationReward[] = [
  {
    method: 'email',
    points: 50,
    badge: 'verified',
    description: 'Vérification par email'
  },
  {
    method: 'phone',
    points: 100,
    description: 'Vérification par téléphone'
  },
  {
    method: 'id',
    points: 200,
    badge: 'verified',
    description: 'Vérification par pièce d\'identité'
  }
];

export default function VerifyPage() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState<Record<VerificationMethod, boolean>>({
    email: false,
    phone: false,
    id: false
  });
  const [isLoading, setIsLoading] = useState<Record<VerificationMethod, boolean>>({
    email: false,
    phone: false,
    id: false
  });
  const [messages, setMessages] = useState<Record<VerificationMethod, string>>({
    email: '',
    phone: '',
    id: ''
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  
  // ID verification state
  const [showIDModal, setShowIDModal] = useState(false);
  const [idFrontImage, setIdFrontImage] = useState<File | null>(null);
  const [idBackImage, setIdBackImage] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string>('');
  const [idBackPreview, setIdBackPreview] = useState<string>('');
  const [isSubmittingID, setIsSubmittingID] = useState(false);

  // Phone verification state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneCodeSent, setIsPhoneCodeSent] = useState(false);
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleVerification = async (method: VerificationMethod) => {
    if (!user) {
      setMessages(prev => ({ ...prev, [method]: 'Vous devez être connecté pour vérifier votre compte.' }));
      return;
    }

    if (method === 'id') {
      setShowIDModal(true);
      return;
    }

    if (method === 'phone') {
      setShowPhoneModal(true);
      return;
    }

    setIsLoading(prev => ({ ...prev, [method]: true }));
    setMessages(prev => ({ ...prev, [method]: '' }));

    try {
      switch (method) {
        case 'email':
          await handleEmailVerification();
          break;
      }
    } catch (error: any) {
      setMessages(prev => ({ ...prev, [method]: `Erreur: ${error.message}` }));
    } finally {
      setIsLoading(prev => ({ ...prev, [method]: false }));
    }
  };

  const handleEmailVerification = async () => {
    const auth = getAuth(app);
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      await completeVerification('email');
      setMessages(prev => ({ ...prev, email: 'Email de vérification envoyé ! Vérifiez votre boîte mail.' }));
    }
  };

  const validatePhoneNumber = (phone: string) => {
    // French phone number validation (supports +33, 0, and international formats)
    const phoneRegex = /^(\+33|0|0033)[1-9](\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSendPhoneCode = async () => {
    setPhoneError('');
    
    if (!phoneNumber.trim()) {
      setPhoneError('Veuillez entrer un numéro de téléphone');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('Veuillez entrer un numéro de téléphone français valide');
      return;
    }

    setIsSubmittingPhone(true);
    
    try {
      // Simulate sending SMS code
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsPhoneCodeSent(true);
      setMessages(prev => ({ ...prev, phone: 'Code SMS envoyé ! Entrez le code reçu.' }));
    } catch (error: any) {
      setPhoneError('Erreur lors de l\'envoi du code. Veuillez réessayer.');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!verificationCode.trim()) {
      setPhoneError('Veuillez entrer le code de vérification');
      return;
    }

    if (verificationCode.length !== 6) {
      setPhoneError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsSubmittingPhone(true);
    
    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6 && /^\d{6}$/.test(verificationCode)) {
        await completeVerification('phone');
        setMessages(prev => ({ ...prev, phone: 'Numéro de téléphone vérifié avec succès !' }));
        setShowPhoneModal(false);
        
        // Reset form
        setPhoneNumber('');
        setVerificationCode('');
        setIsPhoneCodeSent(false);
      } else {
        setPhoneError('Code incorrect. Veuillez réessayer.');
      }
    } catch (error: any) {
      setPhoneError('Erreur lors de la vérification. Veuillez réessayer.');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

  const handleIDImageUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image doit faire moins de 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (side === 'front') {
          setIdFrontImage(file);
          setIdFrontPreview(e.target?.result as string);
        } else {
          setIdBackImage(file);
          setIdBackPreview(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIDSubmission = async () => {
    if (!idFrontImage || !idBackImage) {
      alert('Veuillez télécharger les photos recto et verso de votre pièce d\'identité');
      return;
    }

    setIsSubmittingID(true);
    
    try {
      // Simulate ID verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await completeVerification('id');
      setMessages(prev => ({ ...prev, id: 'Vérification en cours. Vous recevrez une notification dans 24-48h.' }));
      setShowIDModal(false);
      
      // Reset form
      setIdFrontImage(null);
      setIdBackImage(null);
      setIdFrontPreview('');
      setIdBackPreview('');
    } catch (error: any) {
      setMessages(prev => ({ ...prev, id: `Erreur: ${error.message}` }));
    } finally {
      setIsSubmittingID(false);
    }
  };

  const completeVerification = async (method: VerificationMethod) => {
    const reward = verificationRewards.find(r => r.method === method);
    if (reward) {
      setVerifications(prev => ({ ...prev, [method]: true }));
      setTotalPoints(prev => prev + reward.points);
      
      if (reward.badge && !earnedBadges.includes(reward.badge)) {
        setEarnedBadges(prev => [...prev, reward.badge!]);
      }
    }
  };

  const getTotalPoints = () => {
    return verificationRewards.reduce((total, reward) => {
      return total + (verifications[reward.method] ? reward.points : 0);
    }, 0);
  };

  const getEarnedBadges = () => {
    const badges: string[] = [];
    verificationRewards.forEach(reward => {
      if (verifications[reward.method] && reward.badge && !badges.includes(reward.badge)) {
        badges.push(reward.badge);
      }
    });
    return badges;
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-100">Vérification du compte</h1>
      
      {!user ? (
        <div className="bg-yellow-900/50 text-yellow-300 p-4 rounded-lg">
          <p>Vous devez être connecté pour accéder à la vérification.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Verification Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verificationRewards.map((reward) => (
              <div key={reward.method} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-100">{reward.description}</h3>
                  {verifications[reward.method] && (
                    <Badge type="verified" />
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">{reward.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 font-bold">+{reward.points} points</span>
                    {reward.badge && (
                      <Badge type={reward.badge as any} />
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleVerification(reward.method)}
                  disabled={isLoading[reward.method] || verifications[reward.method]}
                  className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
                    verifications[reward.method]
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : isLoading[reward.method]
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  }`}
                >
                  {verifications[reward.method] 
                    ? 'Vérifié ✓' 
                    : isLoading[reward.method]
                    ? 'Vérification...'
                    : 'Commencer la vérification'
                  }
                </button>

                {messages[reward.method] && (
                  <div className={`mt-3 p-2 rounded text-xs ${
                    messages[reward.method].includes('Erreur') 
                      ? 'bg-red-900/50 text-red-300' 
                      : 'bg-green-900/50 text-green-300'
                  }`}>
                    {messages[reward.method]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Progress Summary */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-gray-100">Progression</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-100">Points gagnés</h3>
                <div className="text-3xl font-bold text-cyan-400">{getTotalPoints()}</div>
                <p className="text-gray-400 text-sm">Points totaux disponibles: 350</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-100">Badges débloqués</h3>
                <div className="flex flex-wrap gap-2">
                  {getEarnedBadges().length > 0 ? (
                    getEarnedBadges().map(badge => (
                      <Badge key={badge} type={badge as any} />
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">Aucun badge débloqué</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Progression globale</span>
                <span className="text-cyan-400 font-bold">
                  {Math.round((Object.values(verifications).filter(Boolean).length / 3) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                <div 
                  className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(Object.values(verifications).filter(Boolean).length / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phone Verification Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">Vérification par téléphone</h3>
              <button 
                onClick={() => {
                  setShowPhoneModal(false);
                  setPhoneNumber('');
                  setVerificationCode('');
                  setIsPhoneCodeSent(false);
                  setPhoneError('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {!isPhoneCodeSent ? (
                <>
                  <p className="text-gray-300 text-sm">
                    Entrez votre numéro de téléphone pour recevoir un code de vérification par SMS.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Numéro de téléphone *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Format accepté: +33, 0, ou 0033 suivi du numéro
                    </p>
                  </div>

                  {phoneError && (
                    <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                      {phoneError}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setShowPhoneModal(false);
                        setPhoneNumber('');
                        setPhoneError('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSendPhoneCode}
                      disabled={!phoneNumber.trim() || isSubmittingPhone}
                      className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingPhone ? 'Envoi...' : 'Envoyer le code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-300 text-sm">
                    Un code de vérification a été envoyé au numéro <strong>{phoneNumber}</strong>.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Code de vérification *
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center text-lg tracking-widest"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Entrez les 6 chiffres reçus par SMS
                    </p>
                  </div>

                  {phoneError && (
                    <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded">
                      {phoneError}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setIsPhoneCodeSent(false);
                        setVerificationCode('');
                        setPhoneError('');
                      }}
                      className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleVerifyPhoneCode}
                      disabled={!verificationCode.trim() || isSubmittingPhone}
                      className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingPhone ? 'Vérification...' : 'Vérifier'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ID Verification Modal */}
      {showIDModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">Vérification par pièce d'identité</h3>
              <button 
                onClick={() => setShowIDModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Téléchargez les photos recto et verso de votre pièce d'identité (carte d'identité, passeport, permis de conduire).
              </p>

              {/* Front ID Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Photo recto *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  {idFrontPreview ? (
                    <div className="space-y-2">
                      <img src={idFrontPreview} alt="Front ID" className="max-h-32 mx-auto rounded" />
                      <button 
                        onClick={() => { setIdFrontImage(null); setIdFrontPreview(''); }}
                        className="text-red-400 text-sm hover:text-red-300"
                      >
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIDImageUpload(e, 'front')}
                        className="hidden"
                        id="front-id-upload"
                      />
                      <label htmlFor="front-id-upload" className="cursor-pointer">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-400 text-sm">Cliquez pour télécharger</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Back ID Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Photo verso *
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  {idBackPreview ? (
                    <div className="space-y-2">
                      <img src={idBackPreview} alt="Back ID" className="max-h-32 mx-auto rounded" />
                      <button 
                        onClick={() => { setIdBackImage(null); setIdBackPreview(''); }}
                        className="text-red-400 text-sm hover:text-red-300"
                      >
                        Supprimer
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleIDImageUpload(e, 'back')}
                        className="hidden"
                        id="back-id-upload"
                      />
                      <label htmlFor="back-id-upload" className="cursor-pointer">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-400 text-sm">Cliquez pour télécharger</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowIDModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleIDSubmission}
                  disabled={!idFrontImage || !idBackImage || isSubmittingID}
                  className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingID ? 'Soumission...' : 'Soumettre'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 