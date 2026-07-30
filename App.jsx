import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { GameProvider } from './context/GameContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import NotificationCenter from './components/NotificationCenter'
import BadgeNotificationListener from './components/BadgeNotificationListener'

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <GameProvider>
          <NotificationCenter />
          <BadgeNotificationListener />
          <AppRoutes />
        </GameProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}
