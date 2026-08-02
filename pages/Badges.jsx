import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import Lottie from 'lottie-react'
import trophyAnimation from '../Trophy Badge award Animation.json'
import BackButton from '../components/BackButton'
import BadgeIcon from '../components/BadgeIcon'

export default function Badges() {
  const navigate = useNavigate()
  const { unlockedBadges, BADGES } = useGame()
  const unlockedSet = new Set(unlockedBadges)

  return (
    <div className="page">
      <header className="page-header">
        <BackButton to="/home" />
        <h1>🏆 Mes Badges</h1>
      </header>

      <main className="page-content">
        <p className="muted" style={{ marginBottom: 20 }}>
          Chaque badge représente un objectif réel : premier quiz, XP, niveaux et leçons complétées.
          Reviens ici après avoir progressé pour voir tes succès et savoir lequel débloquer ensuite.
        </p>

        {unlockedBadges.length > 0 && (
          <div aria-hidden="true" style={{ width: 130, height: 130, margin: '-16px auto 8px' }}>
            <Lottie animationData={trophyAnimation} loop={false} />
          </div>
        )}

        <div className="badges-container">
          <div className="badges-grid">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`badge-card ${unlockedSet.has(badge.id) ? 'unlocked' : 'locked'}`}
                style={{ '--badge-color': badge.color }}
              >
                <div className="badge-emblem">
                  {badge.img ? <img className="badge-image" src={badge.img} alt="" /> : <BadgeIcon type={badge.icon} />}
                  {!unlockedSet.has(badge.id) && <span className="badge-lock">🔒</span>}
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
