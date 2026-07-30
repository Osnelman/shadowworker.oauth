import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { quizzes } from '../data/quizzes'
import { useGame } from '../context/GameContext'

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { lives, loseLife, addScore, resetLives } = useGame()
  const questions = quizzes[lessonId] || []
  const [index, setIndex] = useState(0)

  if (!questions.length) return <div className="p-6 text-white">Aucun quiz.</div>

  const current = questions[index]

  const handleAnswer = (option) => {
    if (option === current.answer) {
      addScore(10)
      if (index === questions.length - 1) {
        resetLives()
        navigate('/result')
      } else {
        setIndex(index + 1)
      }
    } else {
      loseLife()
      if (lives <= 1) {
        resetLives()
        navigate(`/course/${lessonId}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <p className="mb-4">Vies restantes : {lives}</p>
        <h2 className="text-2xl font-bold mb-6">{current.question}</h2>
        <div className="grid gap-4">
          {current.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-left"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}