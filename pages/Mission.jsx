import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { missions } from '../data/missions'
import { useGame } from '../context/GameContext'

export default function Mission() {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const { completeMission } = useGame()

  const section = missions[sectionId]
  if (!section) {
    return (
      <main className="page">
        <div className="card center-card">
          <h1>Mission introuvable</h1>
          <p className="muted">Cette mission n'existe pas encore.</p>
        </div>
      </main>
    )
  }

  const { title, mission } = section

  return (
    <main className="page">
      <section className="card mission-card">
        <span className="badge">Mission</span>
        <h1>{title}</h1>
        <p className="muted">{mission.description}</p>

        <ol style={{ marginTop: 16, marginBottom: 20 }}>
          {mission.tasks.map((t, i) => (
            <li key={i} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: t }} />
          ))}
        </ol>

        <div className="course-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              completeMission(sectionId)
              navigate('/result')
            }}
          >
            Marquer la mission comme terminée
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Retour</button>
        </div>
      </section>
    </main>
  )
}
