import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function Result() {
  const navigate = useNavigate()
  const { xp, completedLessons, resetGame } = useGame()
  const fullCompletion = completedLessons.length >= 5

  return (
    <main className="page result-page">
      <section className="card result-card">
        <span className="badge">Résultat</span>
        <h1>{fullCompletion ? 'Bravo, tu es devenu un vrai pro !' : 'Très bien joué !'}</h1>
        <p className="muted">
          Tu as terminé la leçon et accumulé <strong>⚡ {xp} XP</strong>.
        </p>

        <div className="summary-grid">
          <div>
            <strong>{completedLessons.length}</strong>
            <p>Leçons terminées</p>
          </div>
          <div>
            <strong>⚡ {xp}</strong>
            <p>Expérience totale</p>
          </div>
        </div>

        <div className="course-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              resetGame()
              navigate('/')
            }}
          >
            Revenir à l’accueil
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Voir mon tableau de bord</button>
        </div>
      </section>
    </main>
  )
}
