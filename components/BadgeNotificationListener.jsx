import React, { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { useNotification } from '../context/NotificationContext'

export default function BadgeNotificationListener() {
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

  return null
}
