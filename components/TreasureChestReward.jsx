import React, { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import treasureChestAnimation from '../treasure-chest.json'
import { useSound } from '../context/SoundContext'

export default function TreasureChestReward({ reward, onClose }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const { playSound } = useSound()

  useEffect(() => {
    if (!reward) return
    const timer = window.setTimeout(() => setIsRevealed(true), 600)
    playSound('xp') // Ou un son spécifique pour le trésor
    return () => window.clearTimeout(timer)
  }, [reward])

  if (!reward) return null

  return (
    <div className="treasure-reward-card">
      <div className="treasure-animation-wrap" aria-hidden="true">
        <Lottie animationData={treasureChestAnimation} loop={false} autoplay />
      </div>

      <div className={`treasure-reward-content ${isRevealed ? 'revealed' : ''}`}>
        <h3>Coﬀre ouvert</h3>
        <p>{reward.message}</p>
        <div className="treasure-reward-badge">{reward.label}</div>
      </div>

      <button className="btn btn-primary" onClick={onClose}>
        Continuer
      </button>
    </div>
  )
}
