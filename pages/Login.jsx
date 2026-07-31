import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const { ready, googleAvailable, authError, signIn, signInWithEmail, signInGuest, reloadGoogle, user } = useAuth()

  // Si déjà connecté, rediriger vers accueil
  if (ready && user && !user.isGuest) {
    navigate('/')
    return null
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    signInWithEmail(email)
    if (email && email.includes('@')) {
      setTimeout(() => navigate('/'), 500)
    }
  }

  return (
    <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <section className="card login-card" style={{ maxWidth: 420, padding: '48px', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <span className="badge" style={{ fontSize: '1.4rem', padding: '12px 24px' }}>🐧 Linux Quest</span>
        </div>

        <h1 style={{ marginBottom: 12 }}>Bienvenue sur Linux Quest</h1>
        <p className="muted" style={{ marginBottom: 32 }}>
          Apprends Linux en t'amusant. Connecte-toi pour sauvegarder ta progression.
        </p>

        {authError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: 12, marginBottom: 20, color: '#fca5a5' }}>
            {authError}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {googleAvailable ? (
            <>
              <div id="gsi-button" style={{ width: '100%' }} />
              <button className="btn btn-primary" onClick={signIn} style={{ width: '100%', padding: '14px', display: 'none' }}>
                🔐 Se connecter avec Google
              </button>
            </>
          ) : (
            <div style={{ padding: '14px', background: 'rgba(255, 179, 71, 0.05)', borderRadius: 10, color: '#cbd5e1', fontSize: '0.9rem' }}>
              Google indisponible. Utilise l'e-mail ci-dessous.
            </div>
          )}

          {/* Diagnostic panel */}
          <div style={{ marginTop: 12, textAlign: 'left', fontSize: '0.85rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <strong style={{ color: '#cbd5e1' }}>Diagnostic :</strong>
              <span>ready: {String(ready)}</span>
              <span>googleAvailable: {String(googleAvailable)}</span>
            </div>
            {authError && <div style={{ color: '#fca5a5', marginBottom: 8 }}>{authError}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => { if (typeof window !== 'undefined' && window.location) window.location.reload() }}>
                Rafraîchir la page
              </button>
              <button className="btn btn-outline" onClick={() => { reloadGoogle && reloadGoogle() }}>
                Réessayer Google
              </button>
              <button className="btn btn-outline" onClick={() => { if (typeof window !== 'undefined') { const a = document.createElement('a'); a.href = 'https://accounts.google.com/gsi/client'; a.target = '_blank'; a.rel = 'noreferrer'; a.click() } }}>
                Ouvrir script GSI
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', margin: '20px 0' }}>
            <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)' }} />
            <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(4, 7, 13, 0.98)', padding: '0 12px', color: '#94a3b8', fontSize: '0.9rem' }}>
              ou
            </span>
          </div>

          <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="Ton e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              style={{ padding: '12px 16px', width: '100%' }}
              required
            />
            <button type="submit" className="btn btn-secondary" style={{ width: '100%', padding: '14px' }}>
              ✉️ Se connecter par e-mail
            </button>
          </form>
        </div>

        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <p className="muted" style={{ fontSize: '0.85rem', marginBottom: 12 }}>
            Tu peux aussi continuer en mode invité (ta progression sera locale).
          </p>
          <button className="btn btn-secondary" onClick={() => { signInGuest(); setTimeout(() => navigate('/'), 300); }} style={{ width: '100%', padding: '12px' }}>
            👤 Continuer en mode invité
          </button>
        </div>
      </section>
    </main>
  )
}
