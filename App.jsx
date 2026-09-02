import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { GameProvider } from './context/GameContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import NotificationCenter from './components/NotificationCenter';
import GameNotificationListener from './components/BadgeNotificationListener'; // Renamed from BadgeNotificationListener
import { ThemeProvider } from './context/ThemeContext'
import LevelUpModal from './components/LevelUpModal'
import SiteFooter from './components/SiteFooter'
import { SoundProvider } from './context/SoundContext'

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <SoundProvider>
            <GameProvider>
              <NotificationCenter />
              <GameNotificationListener />
              <AppRoutes />
              <SiteFooter />
              <LevelUpModal />
            </GameProvider>
          </SoundProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  )
}
