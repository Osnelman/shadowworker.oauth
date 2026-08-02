import React from 'react'
import { useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="page notfound-page">
      <section className="card center-card">
        <h1>404</h1>
        <p className="muted">La page que tu cherches n’existe pas encore.</p>
        <BackButton to="/home" className="btn btn-primary">Retour à l’accueil</BackButton>
      </section>
    </main>
  )
}
