import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { missions } from '../data/missions'
import { lessons, lessonIds } from '../data/lessons.jsx'
import BackButton from '../components/BackButton'

export default function Course() {
  const { lessonId } = useParams()
  const lesson = lessons[lessonId] || lessons[1]
  const navigate = useNavigate()
  const { setCurrentLesson, completedLessons } = useGame()
  const lessonNumber = Number(lessonId) || 1
  const nextLesson = lessonIds.find((id) => !completedLessons.includes(id)) || lessonIds[lessonIds.length - 1]

  useEffect(() => {
    if (lessonNumber <= nextLesson) setCurrentLesson(lessonNumber)
  }, [lessonNumber, nextLesson, setCurrentLesson])

  if (lessonNumber > nextLesson) {
    return (
      <main className="page course-page">
        <section className="card center-card">
          <span className="badge">Étape verrouillée</span>
          <h1>Termine d’abord la leçon {nextLesson}</h1>
          <p className="muted">Chaque étape terminée ouvre naturellement la suite de ton aventure.</p>
          <button className="btn btn-primary" onClick={() => navigate(`/course/${nextLesson}`)}>Continuer l’aventure</button>
        </section>
      </main>
    )
  }

  // determine if this lesson is the end of a section that has a mission
  const sectionEntry = Object.entries(missions).find(([, s]) =>
    s.lessons.includes(Number(lessonId))
  )
  const sectionId = sectionEntry ? sectionEntry[0] : null
  const section = sectionEntry ? sectionEntry[1] : null
  const isSectionEnd = section ? Number(lessonId) === section.lessons[section.lessons.length - 1] : false

  return (
    <main className="page course-page">
      <section className="card">
        <span className="badge">Leçon {lessonId}</span>
        <h1>{lesson.title}</h1>
        <p className="muted">{lesson.summary}</p>

        <div className="lesson-steps">
          {lesson.steps.map((step, index) => (
            <div key={index} className="lesson-step">
              <span>0{index + 1}</span>
              <p dangerouslySetInnerHTML={{ __html: step }} />
            </div>
          ))}
        </div>

        <div className="course-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/quiz/${lessonId}`)}>
            Tester mes connaissances
          </button>
          <BackButton to="/home" />
          {isSectionEnd && sectionId && (
            <button className="btn btn-primary" onClick={() => navigate(`/mission/${sectionId}`)}>
              Lancer la mission : {section.title}
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
