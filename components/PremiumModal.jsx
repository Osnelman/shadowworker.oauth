import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { useNotification } from '../context/NotificationContext';
import Kkiapay from 'kkiapay-react';

export default function PremiumModal({ onClose }) {
  const { user } = useAuth();
  const { checkPremiumStatus, verifyKkiapayPayment } = usePremium();
  const { addNotification } = useNotification();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const KKIAPAY_PUBLIC_KEY = import.meta.env.VITE_KKIAPAY_PUBLIC_KEY;
  const KKIAPAY_SANDBOX = import.meta.env.VITE_KKIAPAY_SANDBOX === 'true';
  const PREMIUM_AMOUNT = 1000; // Example amount in XOF

  const handleKkiapaySuccess = async (response) => {
    setPaymentProcessing(true);
    setPaymentError(null);
    try {
      const result = await verifyKkiapayPayment({ transactionId: response.transactionId });
      if (result.data.success) {
        addNotification('🎉 Premium débloqué ! Bienvenue dans l\'aventure complète.', 'success', 5000);
        checkPremiumStatus(user.id); // Refresh premium status
        onClose();
      } else {
        setPaymentError(result.data.message || 'La vérification du paiement a échoué.');
      }
    } catch (err) {
      setPaymentError(err.message || 'Une erreur est survenue lors de la vérification du paiement.');
      addNotification('Erreur serveur lors de la vérification du paiement.', 'error', 5000);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleKkiapayFailure = (error) => {
    setPaymentError('Le paiement a été annulé ou a échoué. Veuillez réessayer.');
  };

  if (!user || user.isGuest) {
    // This case should ideally be handled before opening the modal,
    // but as a fallback, we can redirect or show a message.
    return (
      <div className="modal-overlay">
        <div className="modal-card">
          <h2>Accès Premium</h2>
          <p className="muted">Veuillez vous connecter pour débloquer le contenu premium.</p>
          <button className="btn btn-primary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card premium-modal">
        <h2>Débloquez le Premium !</h2>
        <p className="muted">
          Accédez à toutes les leçons avancées (Leçons 6 à 20), des missions exclusives et des défis supplémentaires pour devenir un véritable expert Linux.
        </p>
        <ul style={{ margin: '20px 0', listStyle: 'none', padding: 0 }}>
          <li>✅ Accès illimité aux leçons 6 à 20</li>
          <li>✅ Missions et défis avancés</li>
          <li>✅ Contenu exclusif régulièrement ajouté</li>
        </ul>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>
          Prix : {PREMIUM_AMOUNT} XOF (paiement unique)
        </p>

        {paymentError && (
          <div style={{ color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
            {paymentError}
          </div>
        )}

        <Kkiapay
          amount={PREMIUM_AMOUNT}
          callback={handleKkiapaySuccess}
          close={handleKkiapayFailure}
          publicKey={KKIAPAY_PUBLIC_KEY}
          sandbox={KKIAPAY_SANDBOX}
          theme="#ffb347" // Match your amber theme
          data={{ userId: user.id, premiumType: 'full_access' }}
        >
          <button className="btn btn-primary" disabled={paymentProcessing}>
            {paymentProcessing ? 'Traitement...' : `Payer ${PREMIUM_AMOUNT} XOF`}
          </button>
        </Kkiapay>

        <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: '15px' }}>
          Annuler
        </button>
      </div>
    </div>
  );
}