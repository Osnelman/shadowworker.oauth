import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { sounds } from '../data/sounds'

const SOUND_KEY = 'linux-quest-sound-enabled'
const SoundContext = createContext()

export function SoundProvider({ children }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(SOUND_KEY)
      return saved ? JSON.parse(saved) : true // Activé par défaut
    } catch (e) {
      return true
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, JSON.stringify(isSoundEnabled))
    } catch (e) { /* ignore */ }
  }, [isSoundEnabled])

  const playSound = useCallback((soundName) => {
    if (!isSoundEnabled || !sounds[soundName]) return
    try {
      const audio = new Audio(sounds[soundName])
      audio.play().catch(e => console.warn("La lecture audio a échoué.", e))
    } catch (e) {
      console.warn(`Impossible de jouer le son : ${soundName}`, e)
    }
  }, [isSoundEnabled])

  const toggleSound = () => setIsSoundEnabled(prev => !prev)

  return <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playSound }}>{children}</SoundContext.Provider>
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) throw new Error('useSound doit être utilisé dans un SoundProvider')
  return ctx
}