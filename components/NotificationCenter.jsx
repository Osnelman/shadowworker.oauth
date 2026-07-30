import React from 'react'
import { useNotification } from '../context/NotificationContext'

export default function NotificationCenter() {
  const { notifications } = useNotification()

  return (
    <div className="notification-center">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  )
}
