import { createContext, useContext, useState } from 'react'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(1)

  const loseLife = () => setLives((prev) => Math.max(prev - 1, 0))
  const resetLives = () => setLives(3)
  const addScore = (value = 1) => setScore((prev) => prev + value)

  return (
    <GameContext.Provider
      value={{
        lives,
        score,
        currentLesson,
        setCurrentLesson,
        loseLife,
        resetLives,
        addScore,
        setScore,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}