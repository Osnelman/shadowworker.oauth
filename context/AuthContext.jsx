import React, { createContext, useContext, useEffect, useState } from 'react'
import { GOOGLE_CLIENT_ID } from '../data/authConfig'

const GAME_PROGRESS_PREFIX = 'linux-quest:'
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

function renderGoogleButton() {
  const container = document.getElementById('gsi-button')
  if (!container || !window.google?.accounts?.id) return false

  container.innerHTML = ''
  window.google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    width: '100%',
  })
  return true
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [googleAvailable, setGoogleAvailable] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [gsiLoaded, setGsiLoaded] = useState(false)

  const initializeGsi = async () => {
    try {
      const saved = loadSavedUser()
      if (saved) setUser(saved)
      else setUser(createGuestUser())

      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('PASTE')) {
        setGoogleAvailable(false)
        setReady(true)
        return false
      }

      // GSI requires HTTPS (except localhost)
      try {
        const isSecureOrigin = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        if (!isSecureOrigin) {
          setGoogleAvailable(false)
          setAuthError('Google Identity requires HTTPS and a registered origin on the Google Console.')
          setReady(true)
          return false
        }
      } catch (e) {
        // ignore
      }

      const ok = await loadGsiScript()
      if (!ok || !window.google || !window.google.accounts || !window.google.accounts.id) {
        setGoogleAvailable(false)
        setAuthError('Le script Google ne s\u2019est pas chargé.')
        setReady(true)
        return false
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp) => {
          const profile = parseJwt(resp.credential)
          if (profile) {
            const previousUser = user; // Capture current user (might be guest)
            const userData = {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              picture: profile.picture,
              isGoogle: true,
            }
            handleUserLogin(previousUser, userData); // Handle progression merge
            setUser(userData)
            saveUser(userData)
            setAuthError(null)
          }
        },
        ux_mode: 'popup',
      })

      // The login page may not be mounted yet (for example when the app opens
      // on the home page), so Login also calls this when it mounts.
      try {
        renderGoogleButton()
      } catch (e) {
        console.warn('GSI renderButton failed', e)
      }

      setReady(true)
      setGoogleAvailable(true)
      setGsiLoaded(true)
      return true
    } catch (e) {
      console.warn('Google Identity initialization failed', e)
      setGoogleAvailable(false)
      setAuthError('Impossible d\u2019initialiser Google Identity')
      setReady(true)
      return false
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await initializeGsi()
      if (cancelled) return
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const reloadGoogle = async () => {
    setAuthError(null)
    setGoogleAvailable(false)
    setGsiLoaded(false)
    return await initializeGsi()
  }

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
    const previousUser = user; // Capture current user (might be guest)
    const profile = createEmailUser(value)
    handleUserLogin(previousUser, profile); // Handle progression merge
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

  // Logic to handle user login and merge guest progress
  const handleUserLogin = (previousUser, newUser) => {
    if (previousUser?.isGuest && newUser?.id) {
      const guestProgressKey = `${GAME_PROGRESS_PREFIX}${previousUser.id}`;
      const newAuthProgressKey = `${GAME_PROGRESS_PREFIX}${newUser.id}`;

      const guestProgress = localStorage.getItem(guestProgressKey);
      const newAuthProgress = localStorage.getItem(newAuthProgressKey);

      // If the new authenticated user has no saved progress, transfer guest progress
      if (guestProgress && !newAuthProgress) {
        localStorage.setItem(newAuthProgressKey, guestProgress);
        console.log(`Progression de l'invité ${previousUser.id} transférée à l'utilisateur ${newUser.id}.`);
      } else if (guestProgress && newAuthProgress) {
        console.log(`Progression de l'invité ${previousUser.id} non transférée car l'utilisateur ${newUser.id} a déjà une progression.`);
      }
      // Clean up guest progress
      localStorage.removeItem(guestProgressKey);
    }
  };

  const signOut = () => {
    if (user?.isGoogle && window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    const guestUser = createGuestUser()
    setUser(guestUser)
    saveUser(guestUser)
  }

  return (
    <AuthContext.Provider value={{ user, ready, googleAvailable, authError, gsiLoaded, reloadGoogle, renderGoogleButton, signIn, signInWithEmail, signInGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
