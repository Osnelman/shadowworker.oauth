import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { quizzes } from '../data/quizzes'
import { useGame } from '../context/GameContext'
import { useNotification } from '../context/NotificationContext'
import { useSound } from '../context/SoundContext'
import TerminalSimulator from '../components/TerminalSimulator'
import { useSpring, animated } from '@react-spring/web'
import BackButton from '../components/BackButton'

export default function Quiz() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const {
    lives,
    loseLife,
    addXp,
    resetLives,
    advanceLesson,
    nextLifeAt,
    MAX_LIVES,
  } = useGame()
  const { addNotification } = useNotification()
  const [index, setIndex] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(null)
  const [willNavigateToCourse, setWillNavigateToCourse] = useState(false)
  const [showXpPop, setShowXpPop] = useState(false) // New state for XP pop animation
  const { playSound } = useSound()
  const [attemptCount, setAttemptCount] = useState(0) // New: tracks attempts for current question

  // Questions for the current lesson
  const questions = quizzes[lessonId] || []

  const [timeLeft, setTimeLeft] = useState(null)

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

    // XP pop animation logic
    if (showXpPop) {
      const xpPopTimer = setTimeout(() => {
        setShowXpPop(false)
      }, 1000) // Duration of the XP pop animation
      return () => clearTimeout(xpPopTimer)
    }



    return () => clearInterval(intervalId)
  }, [nextLifeAt, lives, MAX_LIVES])

  // Reset quiz state when lessonId changes
  useEffect(() => {
    setIndex(0);
    setAttemptCount(0);
    // Removed incorrectOptions state as it's QCM specific
    setShowExplanation(false);
    setLastCorrect(null);
    setWillNavigateToCourse(false);
  }, [lessonId]);

  // Remove showXpPop and related logic as XP gain is handled by TerminalSimulator's onSuccess
  // and QCM is being removed.

  if (!questions.length) {
    return <div className="page card p-6 text-white">Aucun quiz disponible pour cette leçon.</div>
  }

  const current = questions[index]
  const isLastQuestion = index === questions.length - 1
  
  const handleTerminalSuccess = () => {
    addXp()
    playSound('correct')
    addNotification('⚡ Terminal : défi réussi +50 XP', 'success', 2500)
    setLastCorrect(true)
    setShowExplanation(true)
  }

  const handleTerminalFailure = () => {
        const nextLives = Math.max(lives - 1, 0)
        loseLife()
        addNotification(`❤️ -1 Vie (${nextLives} restantes)`, 'error', 2000)
        playSound('incorrect') // Play sound on second incorrect attempt
        setLastCorrect(false) // Definitely incorrect
        setShowExplanation(true) // Show explanation
        if (nextLives === 0) {
          setWillNavigateToCourse(true)
        }
  }

  const handleNext = () => {
    setShowExplanation(false)

    if (lastCorrect) {
      if (isLastQuestion) {
        completeLesson(Number(lessonId))
        // resetLives() // Lives are reset when navigating to result or course
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
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <BackButton />
      </div>
      <section className="card quiz-card">
        <div className="quiz-header">
          <div>
            <p className="muted">Leçon {lessonId} · Question {index + 1}/{questions.length}</p>
            <h1>{current.question}</h1>
          )}
          <div className="badge">
            ❤️ Vies : {lives} {timeLeft && <span className="muted" style={{ fontSize: '0.8em', marginLeft: '4px' }}>(+1 dans {timeLeft})</span>}
          </div>
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
                expected={current.expected} // This is for the simulator to know what to expect
                onSuccess={handleTerminalSuccess}
                onFailure={handleTerminalFailure} // Added onFailure prop
              />
            </div>
          </>
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
