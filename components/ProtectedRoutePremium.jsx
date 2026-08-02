import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePremium } from '../context/PremiumContext';
import { lessons } from '../data/lessons';
import { useNotification } from '../context/NotificationContext';

export default function ProtectedRoutePremium({ children }) {
  const { user, ready: authReady } = useAuth();
  const { isPremium, premiumLoading } = usePremium();
  const { addNotification } = useNotification();
  const { lessonId } = useParams();
  const lesson = lessons[lessonId];

  if (!authReady || premiumLoading) {
    return null; // Or a loading spinner
  }

  if (lesson?.isPremium && !isPremium) {
    addNotification('Accès refusé : cette leçon est réservée aux membres Premium.', 'error', 5000);
    if (user?.isGuest) {
      // If guest, redirect to login to encourage registration/login before premium
      return <Navigate to="/login" replace state={{ fromPremium: true }} />;
    }
    // If logged in but not premium, redirect to home to see premium offer
    return <Navigate to="/home" replace />;
  }

  return children;
}