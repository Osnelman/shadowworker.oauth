import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { GameProvider } from './context/GameContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import NotificationCenter from './components/NotificationCenter'
import BadgeNotificationListener from './components/BadgeNotificationListener'
import { ThemeProvider } from './context/ThemeContext'
import LevelUpModal from './components/LevelUpModal'
import { SoundProvider } from './context/SoundContext'

export default function App() {
  return (
    <NotificationProvider>
      <ThemeProvider>
        <AuthProvider>
          <GameProvider>
            <SoundProvider>
              <NotificationCenter />
              <BadgeNotificationListener />
              <AppRoutes />
              <LevelUpModal />
            </SoundProvider>
          </GameProvider>
        </AuthProvider>
      </ThemeProvider>
    </NotificationProvider>
  )
}
