import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="page notfound-page">
      <section className="card center-card">
        <h1>404</h1>
        <p className="muted">La page que tu cherches n’existe pas encore.</p>
        <button className="btn btn-primary" onClick={() => navigate('/home')}>Retour à l’accueil</button>
      </section>
    </main>
  )
}
