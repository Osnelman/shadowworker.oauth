import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useAuth } from '../context/AuthContext'
import ProfileCorner from '../components/ProfileCorner'

export default function Home() {
  const navigate = useNavigate()
  const { xp, level, levelProgress, rank, lives, completedLessons, dailyMissionCompleted, loginStreak } = useGame()
  const { user } = useAuth()
  const nextLesson = [1, 2, 3, 4, 5].find((id) => !completedLessons.includes(id)) || 5
  const adventure = [
    { id: 1, icon: '⌘', title: 'Les bases', text: 'Se repérer dans le terminal' },
    { id: 2, icon: '◫', title: 'Fichiers', text: 'Créer et organiser' },
    { id: 3, icon: '↗', title: 'Navigation', text: 'Se déplacer comme un pro' },
    { id: 4, icon: '⌁', title: 'Permissions', text: 'Protéger ses fichiers' },
    { id: 5, icon: '⌕', title: 'Recherche', text: 'Trouver l’information' },
  ]

  // Les invités peuvent accéder à Home aussi (ProfileCorner les affiche pas)

  return (
    <main className="page hero">
      <ProfileCorner />

      <section className="hero-card card">
        <div style={{ marginBottom: 16 }}>
          <span className="badge">🐧 Linux Quest</span>
        </div>

        <h1>{user?.isGuest ? 'Apprends Linux en jouant' : `Prêt pour la suite, ${user?.name?.split(' ')[0] || 'aventurier'} ?`}</h1>
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
        <button className="btn btn-primary" onClick={() => navigate(`/course/${nextLesson}`)}>
          {completedLessons.length === 5 ? 'Revoir la dernière leçon' : `Continuer : leçon ${nextLesson}`}
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

      <section className="daily-quest-card card">
        <div className="daily-quest-icon" aria-hidden="true">☀️</div>
        <div>
          <span className="section-kicker">Mission quotidienne</span>
          <h2>{dailyMissionCompleted ? 'Mission terminée !' : 'Une petite victoire aujourd’hui ?'}</h2>
          <p>{dailyMissionCompleted ? 'Tes 75 XP sont en sécurité. Une nouvelle mission t’attend demain.' : 'Un défi court, une astuce Linux utile et 75 XP à gagner.'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/daily-mission')}>
          {dailyMissionCompleted ? 'Voir la mission' : 'Jouer maintenant'}
        </button>
      </section>

      <section className="adventure-card card">
        <div className="adventure-heading">
          <div>
            <span className="section-kicker">Ton parcours</span>
            <h2>La carte d’aventure</h2>
          </div>
          <div className="streak-pill">🔥 {loginStreak} jour{loginStreak > 1 ? 's' : ''} d’affilée</div>
        </div>
        <p className="muted">Une étape à la fois : termine une leçon pour ouvrir la suivante.</p>

        <div className="adventure-map">
          {adventure.map((step) => {
            const completed = completedLessons.includes(step.id)
            const available = step.id <= nextLesson
            return (
              <div key={step.id} className={`adventure-stop ${completed ? 'completed' : available ? 'available' : 'locked'}`}>
                <button
                  className="adventure-node"
                  disabled={!available}
                  onClick={() => navigate(`/course/${step.id}`)}
                  aria-label={`${step.title}${completed ? ', terminé' : available ? ', disponible' : ', verrouillé'}`}
                >
                  <span>{completed ? '✓' : available ? step.icon : '🔒'}</span>
                </button>
                <div className="adventure-label">
                  <strong>{step.title}</strong>
                  <small>{completed ? 'Terminé' : available ? step.text : 'À débloquer'}</small>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
