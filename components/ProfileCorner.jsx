import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfileCorner() {
  const { user, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  // Ferme le menu au clic extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  if (!user || user.isGuest) return null

  return (
    <div className="profile-corner" ref={menuRef}>
      <div className="profile-corner-trigger" onClick={() => setShowMenu(!showMenu)}>
        {user.picture ? (
          <img src={user.picture} alt="avatar" className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">👤</div>
        )}
      </div>

      {showMenu && (
        <div className="profile-corner-menu">
          <div className="profile-menu-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {user.picture ? (
                <img src={user.picture} alt="avatar" style={{ width: 40, height: 40, borderRadius: 999 }} />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(255, 179, 71, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                  👤
                </div>
              )}
              <div>
                <strong style={{ display: 'block', color: '#f1f5f9' }}>{user.name}</strong>
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  {user.isGoogle ? '🔐 Google' : user.isEmail ? '✉️ Email' : 'Invité'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-menu-divider" />

          <div className="profile-menu-details">
            {user.email && (
              <div className="profile-detail">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user.email}</span>
              </div>
            )}
            {user.isGoogle && (
              <div className="profile-detail">
                <span className="profile-label">Compte</span>
                <span className="profile-value">Google</span>
              </div>
            )}
            {user.isEmail && (
              <div className="profile-detail">
                <span className="profile-label">Compte</span>
                <span className="profile-value">E-mail</span>
              </div>
            )}
          </div>

          <div className="profile-menu-divider" />

          <button className="profile-menu-logout" onClick={signOut}>
            👋 Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}
