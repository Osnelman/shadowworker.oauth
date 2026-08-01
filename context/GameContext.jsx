import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import firstStepBadge from '../icons8-premiere-96.png'
import linuxBadge from '../icons8-linux-50.png'
import trophyBadge from '../icons8-trophy-48.png'
import missionBadge from '../icons8-mission-94.png'
import targetBadge from '../icons8-bullseye-48.png'

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
  loginStreak: 0,
  lastActiveDate: null,
}

const XP_PER_CORRECT_ANSWER = 50
const XP_PER_MISSION = 220
const XP_PER_DAILY_MISSION = 75
const XP_FOR_LEVEL = 150

function getLocalDayKey() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function getPreviousDayKey() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const month = String(yesterday.getMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getDate()).padStart(2, '0')
  return `${yesterday.getFullYear()}-${month}-${day}`
}

function computeRank(xp) {
  if (xp >= 900) return 'Linux Virtuose'
  if (xp >= 600) return 'Ninja du Terminal'
  if (xp >= 350) return 'Shell Opérateur'
  if (xp >= 150) return 'Développeur Linux'
  return 'Terminal Novice'
}

const BADGES = [
  { id: 'first-quiz', name: 'Premier pas', emoji: '👣', icon: 'terminal', img: firstStepBadge, color: '#38bdf8', description: 'Complète ton premier quiz' },
  { id: 'xp-100', name: 'Apprenti', emoji: '📚', icon: 'book', img: linuxBadge, color: '#22c55e', description: 'Gagne 100 XP' },
  { id: 'xp-250', name: 'Étudiant', emoji: '🎓', icon: 'cap', color: '#a78bfa', description: 'Gagne 250 XP' },
  { id: 'xp-500', name: 'Expert', emoji: '🏆', icon: 'trophy', img: trophyBadge, color: '#fbbf24', description: 'Gagne 500 XP' },
  { id: 'level-2', name: 'Niveau 2', emoji: '⬆️', icon: 'chevron-one', color: '#fb923c', description: 'Atteins le niveau 2' },
  { id: 'level-3', name: 'Niveau 3', emoji: '⬆️⬆️', icon: 'chevron-two', color: '#f97316', description: 'Atteins le niveau 3' },
  { id: 'level-5', name: 'Niveau 5', emoji: '🚀', icon: 'rocket', color: '#ef4444', description: 'Atteins le niveau 5' },
  { id: 'all-lessons', name: 'Complétiste', emoji: '✅', icon: 'shield', img: missionBadge, color: '#2dd4bf', description: 'Complète les 5 leçons' },
  { id: 'mission-master', name: 'Maître des missions', emoji: '⭐', icon: 'target', img: targetBadge, color: '#ec4899', description: 'Complète 3 missions' },
  { id: 'streak-7', name: 'Semaine de feu', emoji: '🔥', icon: 'flame', color: '#f97316', description: 'Reviens 7 jours d’affilée' },
]

function checkBadges(state) {
  const newBadges = []
  const { xp, completedLessons, completedMissions, unlockedBadges, loginStreak } = state
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
  if (loginStreak >= 7 && !unlockedBadges.includes('streak-7')) newBadges.push('streak-7')

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
  const [loginStreak, setLoginStreak] = useState(DEFAULT_STATE.loginStreak)
  const [lastActiveDate, setLastActiveDate] = useState(DEFAULT_STATE.lastActiveDate)
  const [completedDailyMissionDate, setCompletedDailyMissionDate] = useState(null)

  // Identifie l'utilisateur dont la progression est réellement chargée.
  const [loadedUserId, setLoadedUserId] = useState(null)

  // Chargement de la progression quand l'utilisateur change
  useEffect(() => {
    setLoadedUserId(null)

    if (!user) {
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
        setUnlockedBadges(DEFAULT_STATE.unlockedBadges)
        setLoginStreak(1)
        setLastActiveDate(getLocalDayKey())
        setCompletedDailyMissionDate(null)
      } else {
        const data = JSON.parse(raw)
        setLives(data.lives ?? DEFAULT_STATE.lives)
        setXp(data.xp ?? DEFAULT_STATE.xp)
        setCurrentLesson(data.currentLesson ?? DEFAULT_STATE.currentLesson)
        setCompletedLessons(Array.isArray(data.completedLessons) ? data.completedLessons : DEFAULT_STATE.completedLessons)
        setCompletedMissions(Array.isArray(data.completedMissions) ? data.completedMissions : DEFAULT_STATE.completedMissions)
        setProgressHistory(Array.isArray(data.progressHistory) ? data.progressHistory : DEFAULT_STATE.progressHistory)
        setUnlockedBadges(Array.isArray(data.unlockedBadges) ? data.unlockedBadges : DEFAULT_STATE.unlockedBadges)
        const today = getLocalDayKey()
        const savedStreak = Number(data.loginStreak) || 0
        const nextStreak = data.lastActiveDate === today
          ? Math.max(1, savedStreak)
          : data.lastActiveDate === getPreviousDayKey()
            ? savedStreak + 1
            : 1
        setLoginStreak(nextStreak)
        setLastActiveDate(today)
        setCompletedDailyMissionDate(data.completedDailyMissionDate ?? null)
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
      setLoginStreak(1)
      setLastActiveDate(getLocalDayKey())
      setCompletedDailyMissionDate(null)
    }

    setLoadedUserId(user.id)
  }, [user])

  // Sauvegarde : uniquement une fois le chargement terminé pour le user courant
  useEffect(() => {
    if (!user) return
    if (loadedUserId !== user.id) return

    const payload = {
      lives,
      xp,
      currentLesson,
      completedLessons,
      completedMissions,
      progressHistory,
      unlockedBadges,
      loginStreak,
      lastActiveDate,
      completedDailyMissionDate,
      updatedAt: Date.now(),
    }
    try {
      localStorage.setItem(`linux-quest:${user.id}`, JSON.stringify(payload))
    } catch (e) {
      console.warn('Failed to save progress', e)
    }
  }, [user, loadedUserId, lives, xp, currentLesson, completedLessons, completedMissions, progressHistory, unlockedBadges, loginStreak, lastActiveDate, completedDailyMissionDate])

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

  const dailyMissionCompleted = completedDailyMissionDate === getLocalDayKey()
  const completeDailyMission = () => {
    if (dailyMissionCompleted) return false
    setCompletedDailyMissionDate(getLocalDayKey())
    setXp((prev) => prev + XP_PER_DAILY_MISSION)
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setProgressHistory((prev) => [...prev, { time: timeStr, xp: XP_PER_DAILY_MISSION }])
    return true
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
    if (loadedUserId !== user?.id) return
    const newBadges = checkBadges({ xp, completedLessons, completedMissions, unlockedBadges, loginStreak })
    if (newBadges.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newBadges])
    }
  }, [user, loadedUserId, xp, completedLessons, completedMissions, unlockedBadges, loginStreak])

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
        loginStreak,
        dailyMissionCompleted,
        BADGES,
        loseLife,
        resetLives,
        addXp,
        advanceLesson,
        completeLesson,
        completeMission,
        completeDailyMission,
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
