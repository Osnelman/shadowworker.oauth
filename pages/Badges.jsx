import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function Badges() {
  const navigate = useNavigate()
  const { unlockedBadges, BADGES } = useGame()

  const unlockedSet = new Set(unlockedBadges)

  return (
    <div className="page">
      <header className="page-header">
        <button className="btn-back" onClick={() => navigate('/home')}>← Retour</button>
        <h1>🏆 Mes Badges</h1>
      </header>

      <main className="page-content">
        <p className="muted" style={{ marginBottom: 20 }}>
          Chaque badge représente un objectif réel : premier quiz, XP, niveaux et leçons complétées.
          Reviens ici après avoir progressé pour voir tes succès et savoir lequel débloquer ensuite.
        </p>

        <div className="badges-container">
          <div className="badges-grid">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`badge-card ${unlockedSet.has(badge.id) ? 'unlocked' : 'locked'}`}
              >
                <div className="badge-emoji">
                  {badge.img ? (
                    <img src={badge.img} alt={badge.name} className="badge-img" />
                  ) : (
                    badge.emoji
                  )}
                </div>
                <h3>{badge.name}</h3>
                <p className="badge-description">{badge.description}</p>
                {!unlockedSet.has(badge.id) ? (
                  <span className="badge-status">⏳ À atteindre</span>
                ) : (
                  <span className="badge-status unlocked-text">✅ Atteint</span>
                )}
              </div>
            ))}
          </div>

          <div className="badges-stats">
            <h2>Progression</h2>
            <div className="progress-bar-container">
              <div className="progress-bar-full">
                <div
                  className="progress-bar-fill-badges"
                  style={{ width: `${(unlockedBadges.length / BADGES.length) * 100}%` }}
                />
              </div>
              <p className="stat-value">{unlockedBadges.length} / {BADGES.length} badges</p>
            </div>
            {unlockedBadges.length === 0 && (
              <p className="muted" style={{ marginTop: 18 }}>
                Aucun badge débloqué pour l’instant. Commence une leçon et gagne ton premier succès.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
