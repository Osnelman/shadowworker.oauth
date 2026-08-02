import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Lottie from 'lottie-react'
import fireStreakAnimation from '../Fire Streak.json'
import BackButton from '../components/BackButton'

export default function Progress() {
  const navigate = useNavigate()
  const { progressHistory, xp, loginStreak } = useGame()

  // Calcul de l'XP cumulé pour chaque point
  const chartData = progressHistory.map((item, index) => {
    const cumulativeXp = progressHistory.slice(0, index + 1).reduce((sum, p) => sum + p.xp, 0)
    return {
      time: item.time,
      xp: cumulativeXp,
    }
  })

  return (
    <div className="page">
      <header className="page-header">
        <BackButton to="/home" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1>📊 Ma progression</h1>
          <div aria-hidden="true" style={{ width: 64, height: 64 }}>
            <Lottie animationData={fireStreakAnimation} loop />
          </div>
        </div>
      </header>

      <main className="page-content">
        <div className="progress-card">
          <h2>Continue comme ça, chaque défi te rapproche du niveau suivant.</h2>

          {chartData.length === 0 ? (
            <p className="empty-state">Aucune progression enregistrée. Complète des quiz pour voir ta courbe !</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22c55e' }}
                    labelStyle={{ color: '#22c55e' }}
                    formatter={(value) => `⚡ ${value} XP`}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8' }} />
                  <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#22c55e" 
                    dot={{ fill: '#22c55e', r: 4 }} 
                    activeDot={{ r: 6 }}
                    name="XP cumulés"
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="progress-stats">
                <div className="stat-item">
                  <span className="stat-label">XP total :</span>
                  <span className="stat-value">⚡ {xp}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Sessions :</span>
                  <span className="stat-value">{chartData.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Moyenne XP/session :</span>
                  <span className="stat-value">⚡ {Math.round(xp / chartData.length)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Série en cours :</span>
                  <span className="stat-value">🔥 {loginStreak} jour{loginStreak > 1 ? 's' : ''}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
