import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import ProfileCorner from '../components/ProfileCorner'

export default function Home() {
  const navigate = useNavigate()
  const { xp, level, levelProgress, rank, lives, currentLesson, completedLessons } = useGame()
  const { user, ready } = useAuth()

  // Les invités peuvent accéder à Home aussi (ProfileCorner les affiche pas)

  return (
    <main className="page hero">
      <ProfileCorner />

      <section className="hero-card card">
        <div style={{ marginBottom: 16 }}>
          <span className="badge">🐧 Linux Quest</span>
        </div>

        <h1>Apprends Linux en jouant</h1>
        <p>
          Découvre les commandes pas à pas, gagne de l'XP et progresse dans ton aventure.
        </p>

        <div className="stats-grid">
          <div>
            <strong>⚡ {xp}</strong>
            <p>XP acquis</p>
          </div>
          <div>
            <strong>❤️ {lives}</strong>
            <p>Vies</p>
          </div>
          <div>
            <strong>{completedLessons.length}</strong>
            <p>Leçons terminées</p>
          </div>
        </div>
        <div className="xp-summary">
          <div className="xp-title">
            <span>⚡ Niveau {level}</span>
            <strong>{rank}</strong>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
          </div>
          <p className="muted">{levelProgress}% vers le niveau suivant</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/course/${currentLesson}`)}>
          Commencer la leçon {currentLesson}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/login')} style={{ marginTop: 12 }}>
          🔐 Se connecter / Gérer mon compte
        </button>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/progress')} style={{ flex: 1 }}>
            📊 Progression
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/badges')} style={{ flex: 1 }}>
            🎯 Objectifs
          </button>
        </div>
      </section>

      <section className="card course-overview">
        <h2>Ce que tu vas apprendre</h2>
        <ul>
          <li>Commande de base : navigation, liste, création et suppression</li>
          <li>Gestion des permissions et lecture de fichiers</li>
          <li>Recherches et historique comme un pro</li>
        </ul>
      </section>
    </main>
  )
}
