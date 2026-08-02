import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGame } from '../context/GameContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import BadgeIcon from '../components/BadgeIcon'
import BackButton from '../components/BackButton'

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { xp, level, levelProgress, rank, loginStreak, unlockedBadges, BADGES, progressHistory } = useGame()

  if (!user) {
    navigate('/login')
    return null
  }

  const unlockedBadgesDetails = unlockedBadges.map(id => BADGES.find(b => b.id === id)).filter(Boolean)
  
  // Prépare les données pour le graphique d'activité récente (10 derniers gains d'XP)
  const fullHistory = progressHistory;
  const startIndex = Math.max(0, fullHistory.length - 10);
  let cumulativeXp = fullHistory.slice(0, startIndex).reduce((sum, p) => sum + p.xp, 0);
  const chartData = fullHistory.slice(startIndex).map(item => {
    cumulativeXp += item.xp;
    return {
      time: item.time,
      xp: cumulativeXp
    };
  });

  return (
    <div className="page">
      <header className="page-header">
        <BackButton to="/home" />
        <h1>Mon Profil</h1>
      </header>

      <main className="page-content profile-grid">
        <div className="profile-main-card card">
          <div className="profile-identity">
            {user.picture ? (
              <img src={user.picture} alt="avatar" className="profile-avatar-large" />
            ) : (
              <div className="profile-avatar-placeholder-large">👤</div>
            )}
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p className="muted">{user.email || 'Mode invité'}</p>
              <span className="badge">{user.isGoogle ? 'Compte Google' : user.isEmail ? 'Compte E-mail' : 'Invité'}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats-card card">
          <h3>Statistiques</h3>
          <div className="stats-grid-profile">
            <div><strong>Niveau {level}</strong><p>{rank}</p></div>
            <div><strong>⚡ {xp}</strong><p>XP Total</p></div>
            <div><strong>🔥 {loginStreak}</strong><p>Série de jours</p></div>
          </div>
          <div className="xp-summary" style={{ marginTop: '16px' }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${levelProgress}%` }} />
            </div>
            <p className="muted" style={{ textAlign: 'center', marginTop: '8px' }}>{levelProgress}% vers le niveau {level + 1}</p>
          </div>
        </div>

        <div className="profile-badges-card card">
          <h3>Derniers Badges</h3>
          {unlockedBadgesDetails.length > 0 ? (
            <div className="badges-summary-grid">
              {unlockedBadgesDetails.slice(-4).map(badge => (
                <div key={badge.id} className="badge-summary-item" title={badge.name} style={{'--badge-color': badge.color}}>
                  {badge.img ? <img src={badge.img} alt={badge.name} /> : <BadgeIcon type={badge.icon} />}
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Aucun badge débloqué pour le moment.</p>
          )}
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '16px' }} onClick={() => navigate('/badges')}>Voir tous mes badges</button>
        </div>

        <div className="profile-activity-card card">
            <h3>Activité récente (XP Total)</h3>
            {chartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-muted)" /><XAxis dataKey="time" stroke="var(--color-text-muted)" /><YAxis stroke="var(--color-text-muted)" domain={['dataMin - 50', 'dataMax + 50']} /><Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-primary)' }} /><Line type="monotone" dataKey="xp" stroke="var(--color-primary)" name="XP Total" dot={false} /></LineChart>
                </ResponsiveContainer>
            ) : (
                <p className="muted">Pas assez de données pour afficher un graphique. Continue à jouer !</p>
            )}
        </div>
      </main>
    </div>
  )
}