import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { quizzes } from '../data/quizzes'
import { useGame } from '../context/GameContext'
import { useNotification } from '../context/NotificationContext'
import TerminalSimulator from '../components/TerminalSimulator'

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const {
    lives,
    loseLife,
    addXp,
    resetLives,
    advanceLesson,
    completeLesson,
  } = useGame()
  const { addNotification } = useNotification()

  const questions = quizzes[lessonId] || []
  const [index, setIndex] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(null)
  const [willNavigateToCourse, setWillNavigateToCourse] = useState(false)

  if (!questions.length) {
    return <div className="page card p-6 text-white">Aucun quiz disponible pour cette leçon.</div>
  }

  const current = questions[index]
  const isLastQuestion = index === questions.length - 1

  const handleAnswer = (option) => {
    const correct = option === current.answer
    setLastCorrect(correct)

    if (correct) {
      addXp()
      addNotification('⚡ +50 XP !', 'success', 2000)
    } else {
      const nextLives = Math.max(lives - 1, 0)
      loseLife()
      addNotification(`❤️ -1 Vie (${nextLives} restantes)`, 'error', 2000)
    }

    let willNavCourse = false
    if (!correct) {
      const nextLives = Math.max(lives - 1, 0)
      if (nextLives === 0) {
        willNavCourse = true
      }
    }

    setWillNavigateToCourse(willNavCourse)
    setShowExplanation(true)
  }

  const handleNext = () => {
    setShowExplanation(false)

    if (lastCorrect) {
      if (isLastQuestion) {
        completeLesson(Number(lessonId))
        resetLives()
        advanceLesson()
        navigate('/result')
        return
      }
      setIndex((p) => p + 1)
      return
    }

    // incorrect answer
    if (willNavigateToCourse) {
      resetLives()
      navigate(`/course/${lessonId}`)
      return
    }

    // continue to next question even after une bonne explication
    if (isLastQuestion) {
      resetLives()
      advanceLesson()
      navigate('/result')
      return
    }
    setIndex((p) => p + 1)
  }

  return (
    <main className="page quiz-page">
      <section className="card quiz-card">
        <div className="quiz-header">
          <div>
            <p className="muted">Leçon {lessonId} · Question {index + 1}/{questions.length}</p>
            <h1>{current.question}</h1>
          </div>
          <div className="badge">❤️ Vies : {lives}</div>
        </div>

        {current.type === 'terminal' && (
          <>
            <div className="terminal-tip card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 8 }}>Défi terminal</h3>
              <p style={{ marginBottom: 8 }}>
                Lis l’objectif, tape ta réponse puis appuie sur Entrée. Prends ton temps : chaque essai t’aide à progresser.
              </p>
              <p className="muted" style={{ marginTop: 10 }}>
                Le terminal reste visible après réussite, et tu auras une explication claire en dessous.
              </p>
            </div>

            <div className="quiz-options">
              <TerminalSimulator
                initialFiles={current.initialFiles}
                expected={current.expected}
                onSuccess={() => {
                  addXp()
                  addNotification('⚡ Terminal : défi réussi +50 XP', 'success', 2500)
                  setShowExplanation(true)
                  setLastCorrect(true)
                }}
              />
            </div>
          </>
        )}

        {!showExplanation && current.type !== 'terminal' && (
          <div className="quiz-options">
            {current.options.map((option) => (
              <button
                key={option}
                type="button"
                className="btn btn-secondary quiz-option"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {showExplanation && (
          <div className="explanation card" style={{ marginTop: 18 }}>
            <h3 style={{ marginBottom: 8 }}>{lastCorrect ? 'Correct !' : 'Pas tout à fait'}</h3>
            <p className="muted" style={{ marginBottom: 12 }}>{current.explanation}</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" onClick={handleNext}>
                Suivant
              </button>
              <button className="btn btn-secondary" onClick={() => navigate(`/course/${lessonId}`)}>
                Revoir la leçon
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
