import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getDailyMission } from '../data/dailyMissions'
import { useGame } from '../context/GameContext'

export default function DailyMission() {
  const navigate = useNavigate()
  const { dailyMissionCompleted, completeDailyMission } = useGame()
  const mission = getDailyMission()

  return (
    <main className="page daily-mission-page">
      <section className="card daily-mission-card">
        <span className="badge">☀️ Mission du jour</span>
        <div className="daily-mission-reward">+75 XP</div>
        <h1>{mission.title}</h1>
        <p className="muted">{mission.description}</p>

        <div className="daily-objective">
          <span>Objectif</span>
          <p>{mission.objective}</p>
        </div>
        <p className="daily-hint">💡 Indice : {mission.hint}</p>

        {dailyMissionCompleted ? (
          <div className="daily-complete">✅ Mission du jour terminée. Reviens demain pour une nouvelle aventure !</div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => {
              completeDailyMission()
              navigate('/result', { state: { source: 'daily-mission' } })
            }}
          >
            Réclamer mes 75 XP
          </button>
        )}
        <button className="btn btn-secondary" onClick={() => navigate('/home')}>Retour à la carte</button>
      </section>
    </main>
  )
}
