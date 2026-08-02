import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { GameProvider } from './context/GameContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import NotificationCenter from './components/NotificationCenter';
import GameNotificationListener from './components/BadgeNotificationListener'; // Renamed from BadgeNotificationListener
import { ThemeProvider } from './context/ThemeContext'
import LevelUpModal from './components/LevelUpModal'
import { SoundProvider } from './context/SoundContext'
import { PremiumProvider } from './context/PremiumContext';

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <SoundProvider>
            <PremiumProvider> {/* PremiumProvider wraps GameProvider */}
              <GameProvider>
                <NotificationCenter />
                <GameNotificationListener />
                <AppRoutes />
                <LevelUpModal />
              </GameProvider>
            </PremiumProvider>
          </SoundProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  )
}
