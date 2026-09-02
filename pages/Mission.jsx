import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { missions } from '../data/missions'
import { useGame } from '../context/GameContext'
import TerminalSimulator from '../components/TerminalSimulator'
import TreasureChestReward from '../components/TreasureChestReward'
import { buildMissionChallenge } from '../src/services/missionService'

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
  const challengeMeta = buildMissionChallenge(challenge)
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
    <main className="page mission-shell">
      <section className="card mission-card mission-incident-card">
        <div className="mission-header-row">
          <div>
            <span className="badge mission-badge">Mission</span>
            <h1>{title}</h1>
          </div>
          <div className={`mission-status severity-${challengeMeta.severity || 'normal'}`}>
            {challengeMeta.status || 'À traiter'}
          </div>
        </div>

        <div className="mission-scenario-panel">
          <div>
            <p className="mission-kicker">Scénario</p>
            <h2>{challengeMeta.title}</h2>
          </div>
          <p className="muted">{challengeMeta.scenario || mission.description}</p>
          <p className="mission-objective"><strong>Objectif :</strong> {challengeMeta.objective || mission.description}</p>
        </div>

        <p className="muted mission-description">{mission.description}</p>

        <div className="mission-task-list">
          {mission.tasks.map((t, i) => (
            <div key={`${sectionId}-${i}`} className="mission-task-item">
              <span>{i + 1}</span>
              <p>{t}</p>
            </div>
          ))}
        </div>

        {challenge && (
          <div className="mission-incident-panel">
            <div className="mission-plan-header">
              <h3>Plan d’intervention</h3>
              <span>{challengeMeta.type === 'incident' ? '🚨 Incident' : '💡 Challenge'}</span>
            </div>
            <div className="mission-plan-grid">
              {challengeMeta.steps.map((step, index) => (
                <div key={`${sectionId}-step-${index}`} className="mission-plan-step">
                  <div className="mission-step-index">{index + 1}</div>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {challenge?.initialFiles && (
          <div style={{ marginTop: 20 }}>
            <h2 style={{ marginBottom: 12 }}>Terminal interactif</h2>
            <p className="muted" style={{ marginBottom: 18 }}>
              {challengeMeta.hint || challenge.hint}
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
            <h2 style={{ marginBottom: 12 }}>Validation du correctif</h2>
            <p className="muted" style={{ marginBottom: 12 }}>
              {terminalFound
                ? 'Tu as trouvé la clé. Saisis-la ci-dessous pour valider la mission.'
                : 'Diagnostique le problème dans le terminal puis valide la clé ici.'}
            </p>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <input
                type="text"
                placeholder={challengeMeta.prompt || challenge.prompt || 'Clé de validation'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="input"
                style={{ width: '100%' }}
                disabled={passwordValidated}
              />
              <button type="submit" className="btn btn-primary" disabled={passwordValidated}>
                Valider le correctif
              </button>
            </form>
            {passwordError && (
              <div style={{ color: '#fecaca', marginBottom: 12 }}>{passwordError}</div>
            )}
            {passwordValidated && (
              <div style={{ color: '#bbf7d0', marginBottom: 12 }}>{challengeMeta.successText || 'Mission validée, tu peux terminer.'}</div>
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
          <BackButton to="/home" />
        </div>
      </section>
    </main>
  )
}
