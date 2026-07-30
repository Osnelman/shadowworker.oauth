import React, { createContext, useContext, useEffect, useState } from 'react'
import { GOOGLE_CLIENT_ID } from '../data/authConfig'

const AuthContext = createContext()
const STORAGE_KEY = 'linux-quest-auth'
const GUEST_ID_KEY = 'linux-quest-guest-id'

function loadGsiScript() {
  return new Promise((resolve) => {
    if (window.google && window.google.accounts && window.google.accounts.id) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.head.appendChild(s)
  })
}

function parseJwt(token) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const json = new TextDecoder('utf-8').decode(bytes)
    return JSON.parse(json)
  } catch (e) {
    console.warn('Failed to parse JWT', e)
    return null
  }
}

function loadSavedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function saveUser(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch (e) {
    console.warn('Failed to save auth profile', e)
  }
}

function clearSavedUser() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to clear auth profile', e)
  }
}

function loadGuestId() {
  try {
    let guestId = localStorage.getItem(GUEST_ID_KEY)
    if (!guestId) {
      guestId = `guest-${Math.random().toString(36).slice(2, 10)}`
      localStorage.setItem(GUEST_ID_KEY, guestId)
    }
    return guestId
  } catch (e) {
    return `guest-${Math.random().toString(36).slice(2, 10)}`
  }
}

function createGuestUser() {
  return {
    id: loadGuestId(),
    name: 'Visiteur',
    picture: '',
    isGuest: true,
  }
}

function createEmailUser(email) {
  const normalized = email.trim().toLowerCase()
  const name = normalized.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    id: `email-${normalized}`,
    name: name || 'Utilisateur',
    email: normalized,
    picture: '',
    isEmail: true,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [googleAvailable, setGoogleAvailable] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const saved = loadSavedUser()
    if (saved) {
      setUser(saved)
      setReady(true)
    } else {
      setUser(createGuestUser())
    }

    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('PASTE')) {
      setGoogleAvailable(false)
      setReady(true)
      return
    }

    loadGsiScript().then((loaded) => {
      if (!loaded || !window.google || !window.google.accounts || !window.google.accounts.id) {
        setGoogleAvailable(false)
        setReady(true)
        return
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => {
          const profile = parseJwt(resp.credential)
          if (profile) {
            const userData = {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              picture: profile.picture,
              isGoogle: true,
            }
            setUser(userData)
            saveUser(userData)
            setGoogleAvailable(true)
            setAuthError(null)
          }
        },
        ux_mode: 'popup',
      })
      setReady(true)
    })
  }, [])

  const signIn = () => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      setAuthError('Google Identity n’est pas accessible. Utilise le mode invité.')
      setGoogleAvailable(false)
      return
    }
    window.google.accounts.id.prompt()
  }

  const signInWithEmail = (email) => {
    const value = String(email || '').trim()
    if (!value || !value.includes('@')) {
      setAuthError('Entrez une adresse e-mail valide pour vous connecter.')
      return
    }
    const profile = createEmailUser(value)
    setUser(profile)
    saveUser(profile)
    setAuthError(null)
  }

  const signInGuest = () => {
    const guestUser = createGuestUser()
    setUser(guestUser)
    saveUser(guestUser)
    setAuthError(null)
  }

  const signOut = () => {
    if (user?.isGoogle && window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    const guestUser = createGuestUser()
    setUser(guestUser)
    saveUser(guestUser)
  }

  return (
    <AuthContext.Provider value={{ user, ready, googleAvailable, authError, signIn, signInWithEmail, signInGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}