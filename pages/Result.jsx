import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { lessonIds } from '../data/lessons'
import Lottie from 'lottie-react'
import trophyAnimation from '../Trophy Badge award Animation.json'
import fireworksAnimation from '../Fireworks.json'

export default function Result() {
  const navigate = useNavigate()
  const location = useLocation()
  const { xp, completedLessons } = useGame()
  const fullCompletion = completedLessons.length >= lessonIds.length
  const isDailyMission = location.state?.source === 'daily-mission'

  return (
    <main className="page result-page">
      <section className="card result-card">
        <div aria-hidden="true" style={{ width: 320, height: 155, margin: '-48px auto -12px' }}>
          <Lottie animationData={fireworksAnimation} loop={false} />
        </div>
        <div aria-hidden="true" style={{ width: 190, height: 190, margin: '-35px auto -20px' }}>
          <Lottie animationData={trophyAnimation} loop={false} />
        </div>
        <span className="badge">{isDailyMission ? 'Mission du jour' : 'Résultat'}</span>
        <h1>{isDailyMission ? 'Mission quotidienne accomplie !' : fullCompletion ? 'Bravo, tu es devenu un vrai pro !' : 'Très bien joué !'}</h1>
        <p className="muted">
          {isDailyMission ? 'Tu as remporté ta récompense du jour et accumulé ' : 'Tu as terminé la leçon et accumulé '}<strong>⚡ {xp} XP</strong>.
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
            onClick={() => navigate('/home')}
          >
            Revenir à l’accueil
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/home')}>Voir mon tableau de bord</button>
        </div>
      </section>
    </main>
  )
}
