import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { lessonIds } from '../data/lessons'
import firstStepBadge from '../icons8-premiere-96.png'
import linuxBadge from '../icons8-linux-50.png'
import { useSound } from './SoundContext'
import trophyBadge from '../icons8-trophy-48.png'
import missionBadge from '../icons8-mission-94.png'
import targetBadge from '../icons8-bullseye-48.png'

const GameContext = createContext()
const TOTAL_LESSONS = lessonIds.length
const MAX_LIVES = 3
const LIFE_REGEN_MINUTES = 10

const DEFAULT_STATE = {
  lives: MAX_LIVES,
  xp: 0,
  currentLesson: 1,
  completedLessons: [],
  completedMissions: [],
  progressHistory: [],
  unlockedBadges: [],
  loginStreak: 0,
  lastActiveDate: null,
  nextLifeAt: null,
}

const DEFAULT_LOOT_STATE = {
  lastReward: null,
  history: [],
}

const XP_PER_COMMAND = 10
const XP_PER_MISSION = 40
const XP_PER_DAILY_MISSION = 25
const XP_LEVEL_BASE = 100
const XP_LEVEL_EXPONENT = 1.5

function getXpForLevel(level) {
  return Math.round(XP_LEVEL_BASE * Math.pow(level, XP_LEVEL_EXPONENT))
}

function computeLevelFromXp(totalXp) {
  let level = 1
  let remaining = totalXp

  while (remaining >= getXpForLevel(level)) {
    remaining -= getXpForLevel(level)
    level += 1
  }

  return level
}

function getXpIntoCurrentLevel(totalXp) {
  let level = 1
  let remaining = totalXp

  while (remaining >= getXpForLevel(level)) {
    remaining -= getXpForLevel(level)
    level += 1
  }

  return remaining
}

function getXpToNextLevel(totalXp) {
  const level = computeLevelFromXp(totalXp)
  return getXpForLevel(level) - getXpIntoCurrentLevel(totalXp)
}

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
  const level = Math.max(1, computeLevelFromXp(xp))

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
  if (completedLessons.length === lessonIds.length && !unlockedBadges.includes('all-lessons')) newBadges.push('all-lessons')

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
  const [recentXpGain, setRecentXpGain] = useState(0)
  const [levelUpEvent, setLevelUpEvent] = useState(null)
  const [lootState, setLootState] = useState(DEFAULT_LOOT_STATE)
  const [xpMultiplier, setXpMultiplier] = useState(1)
  const [xpMultiplierExpiresAt, setXpMultiplierExpiresAt] = useState(null)
  const [nextLifeAt, setNextLifeAt] = useState(null)
  const { playSound } = useSound()

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
        setLives(MAX_LIVES)
        setXp(DEFAULT_STATE.xp)
        setCurrentLesson(DEFAULT_STATE.currentLesson)
        setCompletedLessons(DEFAULT_STATE.completedLessons)
        setCompletedMissions(DEFAULT_STATE.completedMissions)
        setProgressHistory(DEFAULT_STATE.progressHistory)
        setUnlockedBadges(DEFAULT_STATE.unlockedBadges)
        setLootState(DEFAULT_LOOT_STATE)
        setXpMultiplier(1)
        setXpMultiplierExpiresAt(null)
        setLoginStreak(1)
        setLastActiveDate(today)
        setCompletedDailyMissionDate(null)
        setNextLifeAt(null)
      } else {
        const data = JSON.parse(raw)
        const savedLastActiveDate = data.lastActiveDate
        const savedStreak = Number(data.loginStreak) || 0
        const nextStreak = savedLastActiveDate === today
          ? Math.max(1, savedStreak)
          : savedLastActiveDate === getPreviousDayKey()
            ? savedStreak + 1
            : 1
        setLives(data.lives ?? MAX_LIVES)
        setXp(data.xp ?? DEFAULT_STATE.xp)
        setCurrentLesson(data.currentLesson ?? DEFAULT_STATE.currentLesson)
        setCompletedLessons(Array.isArray(data.completedLessons) ? data.completedLessons : DEFAULT_STATE.completedLessons)
        setCompletedMissions(Array.isArray(data.completedMissions) ? data.completedMissions : DEFAULT_STATE.completedMissions)
        setProgressHistory(Array.isArray(data.progressHistory) ? data.progressHistory : DEFAULT_STATE.progressHistory)
        setUnlockedBadges(Array.isArray(data.unlockedBadges) ? data.unlockedBadges : DEFAULT_STATE.unlockedBadges)
        setLootState(data.lootState || DEFAULT_LOOT_STATE)
        setXpMultiplier(data.xpMultiplier || 1)
        setXpMultiplierExpiresAt(data.xpMultiplierExpiresAt ? new Date(data.xpMultiplierExpiresAt) : null)
        setNextLifeAt(data.nextLifeAt || null)
        setLoginStreak(nextStreak)
        setLastActiveDate(today)
        setCompletedDailyMissionDate(data.completedDailyMissionDate ?? null)
      }
    } catch (e) {
      console.warn('Failed to load progress', e)
      setLives(MAX_LIVES)
      setXp(DEFAULT_STATE.xp)
      setCurrentLesson(DEFAULT_STATE.currentLesson)
      setCompletedLessons(DEFAULT_STATE.completedLessons)
      setCompletedMissions(DEFAULT_STATE.completedMissions)
      setProgressHistory(DEFAULT_STATE.progressHistory)
      setUnlockedBadges(DEFAULT_STATE.unlockedBadges)
      setLootState(DEFAULT_LOOT_STATE)
      setXpMultiplier(1)
      setXpMultiplierExpiresAt(null)
      setLoginStreak(1)
      setLastActiveDate(today)
      setCompletedDailyMissionDate(null)
      setNextLifeAt(null)
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
      lootState,
      xpMultiplier,
      xpMultiplierExpiresAt,
      nextLifeAt,
      updatedAt: Date.now(),
    }
    try {
      localStorage.setItem(`linux-quest:${user.id}`, JSON.stringify(payload))
    } catch (e) {
      console.warn('Failed to save progress', e)
    }
  }, [user, loadedUserId, lives, xp, currentLesson, completedLessons, completedMissions, progressHistory, unlockedBadges, loginStreak, lastActiveDate, completedDailyMissionDate, lootState, xpMultiplier, xpMultiplierExpiresAt, nextLifeAt])

  useEffect(() => {
    if (!xpMultiplierExpiresAt) return
    if (Date.now() > xpMultiplierExpiresAt) {
      setXpMultiplier(1)
      setXpMultiplierExpiresAt(null)
    }
  }, [xpMultiplierExpiresAt, xpMultiplier])

  // Life regeneration timer
  useEffect(() => {
    if (lives >= MAX_LIVES) {
      if (nextLifeAt) setNextLifeAt(null) // Clear timer if lives are full
      return
    }

    if (!nextLifeAt) return // No timer running

    const timer = setInterval(() => {
      if (Date.now() >= nextLifeAt) {
        setLives(prev => {
          const newLives = Math.min(prev + 1, MAX_LIVES)
          if (newLives < MAX_LIVES) {
            // Set timer for the next life
            setNextLifeAt(Date.now() + LIFE_REGEN_MINUTES * 60 * 1000)
          } else {
            // Lives are full, stop the timer
            setNextLifeAt(null)
          }
          return newLives
        })
      }
    }, 1000) // Check every second

    return () => clearInterval(timer)
  }, [lives, nextLifeAt])

  const loseLife = () => setLives((prev) => {
    const newLives = Math.max(prev - 1, 0)
    if (newLives < MAX_LIVES && !nextLifeAt) {
      setNextLifeAt(Date.now() + LIFE_REGEN_MINUTES * 60 * 1000)
    }
    return newLives
  })
  const resetLives = () => {
    setLives(MAX_LIVES)
    setNextLifeAt(null)
  }
  const addXp = (value = XP_PER_COMMAND, source = 'général') => {
    if (value <= 0) return

    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    const effectiveValue = Math.round(value * xpMultiplier)
    const oldLevel = computeLevelFromXp(xp)
    const newTotalXp = xp + effectiveValue
    const newLevel = computeLevelFromXp(newTotalXp)

    setXp(newTotalXp)
    setRecentXpGain(effectiveValue)
    setProgressHistory((prev) => [...prev, { time: timeStr, xp: effectiveValue, source }])

    if (newLevel > oldLevel) {
      setLevelUpEvent({ oldLevel, newLevel, xpGained: effectiveValue })
      playSound('levelUp')
    }
  }
  const advanceLesson = () => setCurrentLesson((prev) => Math.min(prev + 1, TOTAL_LESSONS))

  const completeLesson = (lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    )
  }

  const grantLootReward = () => {
    const roll = Math.random()
    let reward = {
      type: 'none',
      amount: 0,
      label: 'Rien de spécial',
      message: 'Le coffre est vide. Reviens bientôt pour une nouvelle chance.',
    }

    if (roll < 0.5) {
      const amount = 10 + Math.floor(Math.random() * 21)
      reward = {
        type: 'xp',
        amount,
        label: `+${amount} XP bonus`,
        message: `Tu as trouvé ${amount} XP bonus dans le coffre.`,
      }
    } else if (roll < 0.8) {
      reward = {
        type: 'none',
        amount: 0,
        label: 'Rien de spécial',
        message: 'Le coffre est vide. Reviens bientôt pour une nouvelle chance.',
      }
    } else if (roll < 0.95) {
      reward = {
        type: 'badge',
        amount: 0,
        label: 'Badge rare débloqué',
        message: 'Le coffre contenait un badge rare. Un nouveau succès vient d’être ajouté.',
      }
    } else {
      reward = {
        type: 'multiplier',
        amount: 2,
        label: 'Multiplicateur XP x2 · 30 min',
        message: 'Tu as débloqué un multiplicateur XP x2 pendant 30 minutes.',
      }
    }

    if (reward.type === 'xp') {
      addXp(reward.amount, 'loot')
    } else if (reward.type === 'badge') {
      setUnlockedBadges((prev) => (prev.includes('treasure-chest') ? prev : [...prev, 'treasure-chest']))
    } else if (reward.type === 'multiplier') {
      setXpMultiplier(2)
      setXpMultiplierExpiresAt(Date.now() + 30 * 60 * 1000)
    }

    const nextReward = {
      ...reward,
      createdAt: Date.now(),
    }

    setLootState((prev) => ({
      lastReward: nextReward,
      history: [nextReward, ...prev.history].slice(0, 8),
    }))

    return nextReward
  }

  const completeMission = (sectionId) => {
    if (completedMissions.includes(sectionId)) return null
    setCompletedMissions((prev) => (prev.includes(sectionId) ? prev : [...prev, sectionId]))
    addXp(XP_PER_MISSION, 'mission')
    return grantLootReward()
  }

  const dailyMissionCompleted = completedDailyMissionDate === getLocalDayKey()
  const completeDailyMission = () => {
    if (dailyMissionCompleted) return false
    setCompletedDailyMissionDate(getLocalDayKey())
    addXp(XP_PER_DAILY_MISSION, 'daily-mission')
    return true
  }

  const resetGame = () => {
    setLives(MAX_LIVES)
    setXp(DEFAULT_STATE.xp)
    setCurrentLesson(DEFAULT_STATE.currentLesson)
    setCompletedLessons(DEFAULT_STATE.completedLessons)
    setCompletedMissions(DEFAULT_STATE.completedMissions)
    setProgressHistory(DEFAULT_STATE.progressHistory)
    setUnlockedBadges(DEFAULT_STATE.unlockedBadges)
    setRecentXpGain(0)
    setLevelUpEvent(null)
    setNextLifeAt(null)
  }

  const clearLevelUpEvent = () => {
    setLevelUpEvent(null)
  }

  // Check for new badges when game state changes
  useEffect(() => {
    if (loadedUserId !== user?.id) return
    const newBadges = checkBadges({ xp, completedLessons, completedMissions, unlockedBadges, loginStreak })
    if (newBadges.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newBadges])
    }
  }, [user, loadedUserId, xp, completedLessons, completedMissions, unlockedBadges, loginStreak])

  const level = computeLevelFromXp(xp)
  const xpIntoCurrentLevel = getXpIntoCurrentLevel(xp)
  const xpToNextLevel = getXpToNextLevel(xp)
  const currentLevelThreshold = getXpForLevel(level)
  const levelProgress = currentLevelThreshold > 0 ? Math.round((xpIntoCurrentLevel / currentLevelThreshold) * 100) : 0
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
        recentXpGain,
        levelUpEvent,
        clearLevelUpEvent,
        lootState,
        nextLifeAt,
        MAX_LIVES,
        xpMultiplier,
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
