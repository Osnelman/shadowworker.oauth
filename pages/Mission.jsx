import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { missions } from '../data/missions'
import { useGame } from '../context/GameContext'
import TerminalSimulator from '../components/TerminalSimulator'
import TreasureChestReward from '../components/TreasureChestReward'

export default function Mission() {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const { completeMission } = useGame()
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordValidated, setPasswordValidated] = useState(false)
  const [terminalFound, setTerminalFound] = useState(false)
  const [rewardResult, setRewardResult] = useState(null)
  const [missionCompleted, setMissionCompleted] = useState(false)

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

  const { title, mission, challenge } = section
  const canComplete = !challenge || passwordValidated

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    if (!challenge) return

    if (passwordInput.trim() === challenge.expected) {
      setPasswordValidated(true)
      setPasswordError('')
    } else {
      setPasswordError('Mot de passe incorrect. Réessaie.')
      setPasswordValidated(false)
    }
  }

  const handleMissionComplete = () => {
    if (missionCompleted) {
      navigate('/result')
      return
    }

    const reward = completeMission(sectionId)
    setRewardResult(reward)
    setMissionCompleted(true)
  }

  return (
    <main className="page">
      <section className="card mission-card">
        <span className="badge">Mission</span>
        <h1>{title}</h1>
        <p className="muted">{mission.description}</p>

        <ol style={{ marginTop: 16, marginBottom: 20 }}>
          {mission.tasks.map((t, i) => (
            <li key={`${sectionId}-${i}`} style={{ marginBottom: 8 }}>
              {t}
            </li>
          ))}
        </ol>

        {challenge?.initialFiles && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ marginBottom: 12 }}>Terminal interactif</h2>
            <p className="muted" style={{ marginBottom: 18 }}>
              {challenge.hint}
            </p>
            <TerminalSimulator
              initialFiles={challenge.initialFiles}
              expected={challenge.expected}
              onSuccess={() => setTerminalFound(true)}
            />
          </div>
        )}

        {challenge && (
          <div style={{ marginTop: 24 }}>
            <h2 style={{ marginBottom: 12 }}>Saisie du mot de passe</h2>
            <p className="muted" style={{ marginBottom: 12 }}>
              {terminalFound
                ? 'Tu as trouvé le mot de passe. Saissis-le ci-dessous pour valider la mission.'
                : 'Trouve d’abord le mot de passe caché avec le terminal puis saisis-le ici.'}
            </p>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <input
                type="text"
                placeholder={challenge.prompt || 'Mot de passe'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="input"
                style={{ width: '100%' }}
                disabled={passwordValidated}
              />
              <button type="submit" className="btn btn-primary" disabled={passwordValidated}>
                Vérifier le mot de passe
              </button>
            </form>
            {passwordError && (
              <div style={{ color: '#fecaca', marginBottom: 12 }}>{passwordError}</div>
            )}
            {passwordValidated && (
              <div style={{ color: '#bbf7d0', marginBottom: 12 }}>Mot de passe validé, tu peux terminer la mission.</div>
            )}
          </div>
        )}

        {rewardResult && (
          <div style={{ marginTop: 24 }}>
            <TreasureChestReward reward={rewardResult} onClose={() => navigate('/result')} />
          </div>
        )}

        <div className="course-actions">
          <button
            className="btn btn-primary"
            onClick={handleMissionComplete}
            disabled={!canComplete}
          >
            {missionCompleted ? 'Voir le résumé' : 'Marquer la mission comme terminée'}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Retour</button>
        </div>
      </section>
    </main>
  )
}
