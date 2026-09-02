import React from 'react';

export default function PremiumModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card premium-modal">
        <h2>Accès gratuit</h2>
        <p className="muted">
          Toute l’application est désormais gratuite. Il n’y a plus de paiement ni de mode premium.
        </p>
        <p className="muted" style={{ marginTop: '12px' }}>
          Tu peux continuer à utiliser les missions, leçons et défis sans restriction.
        </p>
        <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '20px' }}>
          Continuer
        </button>
      </div>
    </div>
  );
}