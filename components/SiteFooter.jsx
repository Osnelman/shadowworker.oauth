import React from 'react'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <span className="site-footer-badge">Linux Quest</span>
          <p>
            Apprentissage Linux immersif, progressif et orienté missions.
          </p>
        </div>

        <div className="site-footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Abomey Calavi</li>
            <li>Bénin</li>
            <li>
              <a href="tel:+2290146464608">0146464608</a>
            </li>
            <li>
              <a href="mailto:osnelnawana@gmail.com">osnelnawana@gmail.com</a>
            </li>
          </ul>
        </div>

        <div className="site-footer-column">
          <h4>Organisation</h4>
          <ul>
            <li>Shadowworker</li>
            <li>Digital & learning studio</li>
            <li>Abomey Calavi, Bénin</li>
            <li>Afrique de l’Ouest</li>
          </ul>
        </div>

        <div className="site-footer-column">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="mailto:osnelnawana@gmail.com">osnelnawana@gmail.com</a>
            </li>
            <li>Réponse rapide</li>
            <li>Disponible par email</li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 Shadowworker</span>
        <span>Abomey Calavi • Bénin</span>
      </div>
    </footer>
  )
}
