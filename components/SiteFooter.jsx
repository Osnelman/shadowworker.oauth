import React from 'react'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <span className="site-footer-badge">Linux Quest</span>
          <p>
            Un apprentissage Linux progressif, pratique et orienté missions.
          </p>
        </div>

        <div className="site-footer-column">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="mailto:osnelnawana@gmail.com">osnelnawana@gmail.com</a>
            </li>
            <li>
              <a href="tel:+2290146464608">+229 01 46 46 46 08</a>
            </li>
            <li>Abomey-Calavi, Bénin</li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 Linux Quest</span>
      </div>
    </footer>
  )
}
