import React from 'react'
import Lottie from 'lottie-react'
import { useGame } from '../context/GameContext'
import levelUpAnimation from '../level-up.json'

export default function LevelUpModal() {
  const { levelUpEvent, clearLevelUpEvent, rank } = useGame()

  if (!levelUpEvent) {
    return null
  }

  const { oldLevel, newLevel } = levelUpEvent

  return (
    <div className="modal-overlay">
      <div className="modal-card level-up-modal">
        <div className="level-up-animation">
          <Lottie animationData={levelUpAnimation} loop={false} autoplay />
        </div>
        <h1 className="level-up-title">LEVEL UP!</h1>
        <p className="level-up-levels">
          Niveau {oldLevel} &rarr; Niveau {newLevel}
        </p>
        <p className="level-up-rank">
          Ton nouveau rang : <strong>{rank}</strong>
        </p>
        <p className="muted">
          Félicitations ! Ta persévérance porte ses fruits. De nouveaux défis t'attendent.
        </p>
        <button className="btn btn-primary" onClick={clearLevelUpEvent}>
          Continuer l'aventure
        </button>
      </div>
    </div>
  )
}