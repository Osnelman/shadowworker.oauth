import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'

const GameContext = createContext()
const TOTAL_LESSONS = 5

const DEFAULT_STATE = {
  lives: 3,
  xp: 0,
  currentLesson: 1,
  completedLessons: [],
  completedMissions: [],
  progressHistory: [],
  unlockedBadges: [],
}

const XP_PER_CORRECT_ANSWER = 50
const XP_PER_MISSION = 220
const XP_FOR_LEVEL = 150

function computeRank(xp) {
  if (xp >= 900) return 'Linux Virtuose'
  if (xp >= 600) return 'Ninja du Terminal'
  if (xp >= 350) return 'Shell Opérateur'
  if (xp >= 150) return 'Développeur Linux'
  return 'Terminal Novice'
}

const BADGES = [
  { id: 'first-quiz', name: 'Premier pas', emoji: '👣', description: 'Complète ton premier quiz', img: '/badges_auto/file_2_r0_c0.png' },
  { id: 'xp-100', name: 'Apprenti', emoji: '📚', description: 'Gagne 100 XP', img: '/badges_auto/file_2_r0_c1.png' },
  { id: 'xp-250', name: 'Étudiant', emoji: '🎓', description: 'Gagne 250 XP', img: '/badges_auto/file_2_r0_c2.png' },
  { id: 'xp-500', name: 'Expert', emoji: '🏆', description: 'Gagne 500 XP', img: '/badges_auto/file_2_r0_c3.png' },
  { id: 'level-2', name: 'Niveau 2', emoji: '⬆️', description: 'Atteins le niveau 2', img: '/badges_auto/file_2_r1_c0.png' },
  { id: 'level-3', name: 'Niveau 3', emoji: '⬆️⬆️', description: 'Atteins le niveau 3', img: '/badges_auto/file_2_r1_c1.png' },
  { id: 'level-5', name: 'Niveau 5', emoji: '🚀', description: 'Atteins le niveau 5', img: '/badges_auto/file_2_r1_c2.png' },
  { id: 'all-lessons', name: 'Complétiste', emoji: '✅', description: 'Complète les 5 leçons', img: '/badges_auto/file_2_r1_c3.png' },
  { id: 'mission-master', name: 'Maître des missions', emoji: '⭐', description: 'Complète 3 missions', img: '/badges_auto/file_2_r2_c0.png' },
]

function checkBadges(state) {
  const newBadges = []
  const { xp, completedLessons, completedMissions, unlockedBadges } = state
  const level = Math.max(1, Math.floor(xp / XP_FOR_LEVEL) + 1)

  // Badges XP
  if (xp >= 100 && !unlockedBadges.includes('xp-100')) newBadges.push('xp-100')
  if (xp >= 250 && !unlockedBadges.includes('xp-250')) newBadges.push('xp-250')
  if (xp >= 500 && !unlockedBadges.includes('xp-500')) newBadges.push('xp-500')

  // Badges Niveau
  if (level >= 2 && !unlockedBadges.includes('level-2')) newBadges.push('level-2')
  if (level >= 3 && !unlockedBadges.includes('level-3')) newBadges.push('level-3')
  if (level >= 5 && !unlockedBadges.includes('level-5')) newBadges.push('level-5')

  // Badges Leçons
  if (completedLessons.length > 0 && !unlockedBadges.includes('first-quiz')) newBadges.push('first-quiz')
  if (completedLessons.length === 5 && !unlockedBadges.includes('all-lessons')) newBadges.push('all-lessons')

  // Badges Missions
  if (completedMissions.length >= 3 && !unlockedBadges.includes('mission-master')) newBadges.push('mission-master')

  return newBadges
}

export function GameProvider({ children }) {
  const { user } = useAuth()

  const [lives, setLives] = useState(DEFAULT_STATE.lives)
  const [xp, setXp] = useState(DEFAULT_STATE.xp)
  const [currentLesson, setCurrentLesson] = useState(DEFAULT_STATE.currentLesson)
  const [completedLessons, setCompletedLessons] = useState(DEFAULT_STATE.completedLessons)
  const [completedMissions, setCompletedMissions] = useState(DEFAULT_STATE.completedMissions)
  const [progressHistory, setProgressHistory] = useState(DEFAULT_STATE.progressHistory)
  const [unlockedBadges, setUnlockedBadges] = useState(DEFAULT_STATE.unlockedBadges)

  // Empêche la sauvegarde tant que le chargement du user courant n'est pas terminé
  const isLoadedRef = useRef(false)

  // Chargement de la progression quand l'utilisateur change
  useEffect(() => {
    isLoadedRef.current = false

    if (!user) {
      isLoadedRef.current = true
      return
    }

    try {
      const raw = localStorage.getItem(`linux-quest:${user.id}`)

      if (!raw) {
        // Nouvel utilisateur sans sauvegarde : on réinitialise explicitement
        setLives(DEFAULT_STATE.lives)
        setXp(DEFAULT_STATE.xp)
        setCurrentLesson(DEFAULT_STATE.currentLesson)
        setCompletedLessons(DEFAULT_STATE.completedLessons)
        setCompletedMissions(DEFAULT_STATE.completedMissions)
        setProgressHistory(DEFAULT_STATE.progressHistory)
      } else {
        const data = JSON.parse(raw)
        setLives(data.lives ?? DEFAULT_STATE.lives)
        setXp(data.xp ?? DEFAULT_STATE.xp)
        setCurrentLesson(data.currentLesson ?? DEFAULT_STATE.currentLesson)
        setCompletedLessons(Array.isArray(data.completedLessons) ? data.completedLessons : DEFAULT_STATE.completedLessons)
        setCompletedMissions(Array.isArray(data.completedMissions) ? data.completedMissions : DEFAULT_STATE.completedMissions)
        setProgressHistory(Array.isArray(data.progressHistory) ? data.progressHistory : DEFAULT_STATE.progressHistory)
        setUnlockedBadges(Array.isArray(data.unlockedBadges) ? data.unlockedBadges : DEFAULT_STATE.unlockedBadges)
      }
    } catch (e) {
      console.warn('Failed to load progress', e)
      setLives(DEFAULT_STATE.lives)
      setXp(DEFAULT_STATE.xp)
      setCurrentLesson(DEFAULT_STATE.currentLesson)
      setCompletedLessons(DEFAULT_STATE.completedLessons)
      setCompletedMissions(DEFAULT_STATE.completedMissions)
      setProgressHistory(DEFAULT_STATE.progressHistory)
      setUnlockedBadges(DEFAULT_STATE.unlockedBadges)
    }

    isLoadedRef.current = true
  }, [user])

  // Sauvegarde : uniquement une fois le chargement terminé pour le user courant
  useEffect(() => {
    if (!user) return
    if (!isLoadedRef.current) return

    const payload = {
      lives,
      xp,
      currentLesson,
      completedLessons,
      completedMissions,
      progressHistory,
      unlockedBadges,
      updatedAt: Date.now(),
    }
    try {
      localStorage.setItem(`linux-quest:${user.id}`, JSON.stringify(payload))
    } catch (e) {
      console.warn('Failed to save progress', e)
    }
  }, [user, lives, xp, currentLesson, completedLessons, completedMissions, progressHistory, unlockedBadges])

  const loseLife = () => setLives((prev) => Math.max(prev - 1, 0))
  const resetLives = () => setLives(3)
  const addXp = (value = XP_PER_CORRECT_ANSWER) => {
    setXp((prev) => prev + value)
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setProgressHistory((prev) => [...prev, { time: timeStr, xp: value }])
  }
  const advanceLesson = () => setCurrentLesson((prev) => Math.min(prev + 1, TOTAL_LESSONS))

  const completeLesson = (lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    )
  }

  const completeMission = (sectionId) => {
    setCompletedMissions((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]))
    setXp((prev) => prev + XP_PER_MISSION)
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setProgressHistory((prev) => [...prev, { time: timeStr, xp: XP_PER_MISSION }])
  }

  const resetGame = () => {
    setLives(DEFAULT_STATE.lives)
    setXp(DEFAULT_STATE.xp)
    setCurrentLesson(DEFAULT_STATE.currentLesson)
    setCompletedLessons(DEFAULT_STATE.completedLessons)
    setCompletedMissions(DEFAULT_STATE.completedMissions)
    setProgressHistory(DEFAULT_STATE.progressHistory)
    setUnlockedBadges(DEFAULT_STATE.unlockedBadges)
  }

  // Check for new badges when game state changes
  useEffect(() => {
    if (!isLoadedRef.current) return
    const newBadges = checkBadges({ xp, completedLessons, completedMissions, unlockedBadges })
    if (newBadges.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newBadges])
    }
  }, [xp, completedLessons, completedMissions, unlockedBadges])

  const level = Math.max(1, Math.floor(xp / XP_FOR_LEVEL) + 1)
  const xpToNextLevel = level * XP_FOR_LEVEL - xp
  const levelProgress = Math.round(((xp % XP_FOR_LEVEL) / XP_FOR_LEVEL) * 100)
  const rank = computeRank(xp)

  return (
    <GameContext.Provider
      value={{
        lives,
        xp,
        level,
        xpToNextLevel,
        levelProgress,
        rank,
        currentLesson,
        setCurrentLesson,
        completedLessons,
        completedMissions,
        progressHistory,
        unlockedBadges,
        BADGES,
        loseLife,
        resetLives,
        addXp,
        advanceLesson,
        completeLesson,
        completeMission,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame doit être utilisé à l\'intérieur d\'un GameProvider')
  }
  return context
}