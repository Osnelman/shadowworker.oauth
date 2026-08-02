import React, { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { useNotification } from '../context/NotificationContext'

export default function GameNotificationListener() {
  const { unlockedBadges, BADGES } = useGame()
  const { addNotification } = useNotification()
  const previousBadgesRef = useRef([])
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      previousBadgesRef.current = unlockedBadges
      return
    }

    // Find newly unlocked badges
    const newBadges = unlockedBadges.filter(
      (id) => !previousBadgesRef.current.includes(id)
    )

    // Show notification for each new badge
    newBadges.forEach((badgeId) => {
      const badge = BADGES.find((b) => b.id === badgeId)
      if (badge) {
        addNotification(
          `${badge.emoji} Nouveau badge: ${badge.name}!`,
          'success',
          4000
        )
      }
    })

    previousBadgesRef.current = unlockedBadges
  }, [unlockedBadges, BADGES, addNotification])

  const { lessonCompletedEvent, clearLessonCompletedEvent } = useGame()
  useEffect(() => {
    if (lessonCompletedEvent) {
      addNotification(
        `🎉 Leçon ${lessonCompletedEvent} terminée !`,
        'success',
        4000
      )
      clearLessonCompletedEvent()
    }
  }, [lessonCompletedEvent, addNotification, clearLessonCompletedEvent])

  return null
}

// Add styles for premium lock icon
/*
.premium-lock-icon {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.8em;
  background: #fbbf24;
  border-radius: 50%;
  padding: 2px;
  line-height: 1;
}
*/
