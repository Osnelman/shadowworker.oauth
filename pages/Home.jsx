import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { useSpring, animated } from '@react-spring/web'
import { useAuth } from '../context/AuthContext'
import ProfileCorner from '../components/ProfileCorner'
import BrandLogo from '../components/BrandLogo'
import { lessons, lessonIds } from '../data/lessons'
import { usePremium } from '../context/PremiumContext'
import PremiumModal from '../components/PremiumModal'

export default function Home() {
  const navigate = useNavigate()
  const { xp, level, levelProgress, rank, lives, completedLessons, dailyMissionCompleted, loginStreak, nextLifeAt, MAX_LIVES } = useGame()
  const { user } = useAuth()
  const nextLesson = lessonIds.find((id) => !completedLessons.includes(id)) || lessonIds[lessonIds.length - 1]
  const [timeLeft, setTimeLeft] = useState(null)
  const { isPremium, premiumLoading } = usePremium()
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [previousStreak, setPreviousStreak] = useState(loginStreak)

  const streakSpring = useSpring({
    from: { scale: 1 },
    to: { scale: loginStreak > previousStreak ? 1.2 : 1 },
    config: { tension: 300, friction: 10 },
  })

  useEffect(() => {
    if (!nextLifeAt || lives >= MAX_LIVES) {
      setTimeLeft(null)
      return
    }

    const intervalId = setInterval(() => {
      const remainingSeconds = Math.max(0, Math.round((nextLifeAt - Date.now()) / 1000))
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      setTimeLeft(`${minutes}:${String(seconds).padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [nextLifeAt, lives, MAX_LIVES])

  useEffect(() => {
    setPreviousStreak(loginStreak)
  }, [nextLifeAt, lives, MAX_LIVES])

  // Les invités peuvent accéder à Home aussi (ProfileCorner les affiche pas)

  return (
    <main className="page hero home-shell">
      <ProfileCorner />

      <section className="hero-card card home-hero">
        <div className="brand-logo-wrap"><BrandLogo /></div>
        <div className="home-hero-top">
          <div>
            <span className="badge">Linux Quest</span>
            <h1>{user?.isGuest ? 'Apprends Linux en jouant' : `Prêt pour la suite, ${user?.name?.split(' ')[0] || 'aventurier'} ?`}</h1>
          </div>
          <div className="home-level-badge">Niveau {level}</div>
        </div>

        <p className="home-hero-copy">
          Découvre les commandes pas à pas, gagne de l'XP et progresse dans ton aventure.
        </p>

        <div className="stats-grid home-stats">
          <div>
            <strong>⚡ {xp}</strong>
            <p>XP acquis</p>
          </div>
          <div>
            <strong>❤️ {lives}</strong>
            <p className="muted">{timeLeft ? `+1 dans ${timeLeft}` : 'Vies'}</p>
          </div>
          <div>
            <strong>{completedLessons.length}</strong>
            <p>Leçons terminées</p>
          </div>
        </div>

        <div className="home-quick-grid">
          <div className="quick-panel quick-panel-primary">
            <span className="quick-kicker">Prochaine mission</span>
            <h3>Leçon {nextLesson}</h3>
            <p>Continue l’aventure et débloque la prochaine étape du parcours.</p>
          </div>
          <div className="quick-panel">
            <span className="quick-kicker">Progression</span>
            <h3>{rank}</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="muted">{levelProgress}% vers le niveau suivant</p>
          </div>
        </div>

        <div className="home-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/course/${nextLesson}`)}>
            {completedLessons.length === lessonIds.length ? 'Revoir la dernière leçon' : `Continuer : leçon ${nextLesson}`}
          </button>
          {user?.isGuest && (
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>
              🔐 Se connecter
            </button>
          )}
        </div>

        <div className="home-secondary-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/progress')}>
            📊 Progression
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/badges')}>
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
          <animated.div className="streak-pill" style={streakSpring}>
            🔥 {loginStreak} jour{loginStreak > 1 ? 's' : ''} d’affilée
          </animated.div>
        </div>
        <p className="muted">Une étape à la fois : termine une leçon pour ouvrir la suivante.</p>

        <div className="adventure-map">
          {Object.values(lessons).map((step, index) => {
            const completed = completedLessons.includes(step.id)
            const available = step.id <= nextLesson
            const isAlt = index % 2 !== 0
            return (
              <div key={step.id} className={`adventure-stop ${completed ? 'completed' : available ? 'available' : 'locked'} ${isAlt ? 'alt' : ''}`}>
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
                  <small>{completed ? 'Terminé' : available ? step.summary : 'À débloquer'}</small>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
