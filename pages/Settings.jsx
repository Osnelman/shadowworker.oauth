import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useSound } from '../context/SoundContext'

export default function Settings() {
  const navigate = useNavigate()
  const { theme, setTheme, toggleTheme } = useTheme()
  const { reloadGoogle } = useAuth()
  const { isSoundEnabled, toggleSound } = useSound()

  return (
    <main className="page">
      <section className="card" style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            ← Retour
          </button>
          <h1 style={{ margin: 0 }}>Paramètres</h1>
        </div>

        <div style={{ marginTop: 18 }}>
          <h3>Thème</h3>
          <p className="muted">Choisis le mode clair ou sombre pour l'interface.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={() => setTheme('light')} aria-pressed={theme === 'light'}>
              Mode clair
            </button>
            <button className="btn btn-secondary" onClick={() => setTheme('dark')} aria-pressed={theme === 'dark'}>
              Mode sombre
            </button>
            <button className="btn btn-primary" onClick={toggleTheme}>
              Basculer
            </button>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <h3>Sons</h3>
          <p className="muted">Active ou désactive les effets sonores du jeu.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={toggleSound} aria-pressed={isSoundEnabled}>
              {isSoundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
            </button>
          </div>
        </div>



        <div style={{ marginTop: 28 }}>
          <h3>Authentification</h3>
          <p className="muted">Actions utiles sur l'authentification</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {reloadGoogle && (
              <button className="btn btn-secondary" onClick={reloadGoogle}>
                Recharger Google Identity
              </button>
            )}
          </div>
        </div>

      </section>
    </main>
  )
}
