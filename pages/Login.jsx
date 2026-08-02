import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import { useAuth } from '../context/AuthContext'
import learningAnimation from '../Learning.json'
import BackButton from '../components/BackButton'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [googleRenderFailed, setGoogleRenderFailed] = useState(false)
  const { ready, googleAvailable, authError, signInWithEmail, signInGuest, renderGoogleButton, signIn, user } = useAuth()

  useEffect(() => {
    if (ready && user && !user.isGuest) navigate('/home', { replace: true })
  }, [navigate, ready, user])

  useEffect(() => {
    if (ready && googleAvailable) {
      const rendered = renderGoogleButton()
      setGoogleRenderFailed(!rendered)
    }
  }, [googleAvailable, ready, renderGoogleButton])

  if (ready && user && !user.isGuest) return null

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    signInWithEmail(email)
  }

  return (
    <main className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <BackButton />
      </div>
      <section className="card login-card" style={{ maxWidth: 420, padding: '48px', textAlign: 'center' }}>
        <div aria-hidden="true" style={{ width: 180, height: 180, margin: '-32px auto 8px' }}>
          <Lottie animationData={learningAnimation} loop />
        </div>

        <div style={{ marginBottom: 20 }}>
          <span className="badge" style={{ fontSize: '1.4rem', padding: '12px 24px' }}>🐧 Linux Quest</span>
        </div>

        <h1 style={{ marginBottom: 12 }}>Bienvenue sur Linux Quest</h1>
        <p className="muted" style={{ marginBottom: 32 }}>
          Apprends Linux en t'amusant. Connecte-toi pour sauvegarder ta progression.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {googleAvailable ? (
            <div className="google-login-zone">
              <div id="gsi-button" className="google-button-container" />
              {googleRenderFailed && (
                <button className="google-login-button" type="button" onClick={signIn}>
                  <img src="https://www.svgrepo.com/show/354043/google.svg" alt="Google" />
                  Se connecter avec Google
                </button>
              )}
            </div>
          ) : (
            <div className="google-unavailable-note">
              Google indisponible. Utilise l'e-mail ci-dessous.
            </div>
          )}

          {authError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 12, padding: 12, color: '#fca5a5' }}>
              {authError}
            </div>
          )}

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
          <button className="btn btn-secondary" onClick={() => { signInGuest(); navigate('/home') }} style={{ width: '100%', padding: '12px' }}>
            👤 Continuer en mode invité
          </button>
        </div>
      </section>
    </main>
  )
}
