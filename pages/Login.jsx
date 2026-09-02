import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'
import learningAnimation from '../Learning.json'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [googleRenderFailed, setGoogleRenderFailed] = useState(false)
  const { ready, googleAvailable, authError, signInWithEmail, signInGuest, renderGoogleButton, signIn, user } = useAuth()

  useEffect(() => {
    if (ready && user && !user.isGuest) {
      navigate('/home', { replace: true });
    }
  }, [navigate, ready, user]);

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
    <main className="page login-shell" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <section className="card login-card" style={{ textAlign: 'center' }}>
        <div className="login-visual-wrap" aria-hidden="true" style={{ position: 'relative', width: '100%', maxWidth: 360, height: 210, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="login-lottie-container" style={{ width: 280, height: 180, filter: 'drop-shadow(0 0 28px rgba(34, 211, 238, 0.35))' }}>
            <Lottie animationData={learningAnimation} loop style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        <span className="badge" style={{ marginBottom: 10 }}>Linux Quest</span>
        <h1 style={{ marginBottom: 12 }}>Bienvenue</h1>
        <p className="muted" style={{ marginBottom: 28 }}>
          Connecte-toi pour sauvegarder ta progression et reprendre ton parcours.
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

          <div style={{ position: 'relative', margin: '10px 0' }}>
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

        <div style={{ marginTop: 28, paddingTop: 18, borderTop: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <button className="btn btn-secondary" onClick={() => { signInGuest(); navigate('/home', { replace: true }) }} style={{ width: '100%', padding: '12px' }}>
            👤 Continuer en mode invité
          </button>
        </div>
      </section>
    </main>
  )
}
