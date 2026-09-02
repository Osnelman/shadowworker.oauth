import React from 'react'

export default function BrandLogo({ compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-lockup-compact' : ''}`} aria-label="Shadowworker brand">
      <svg className="brand-mark" viewBox="0 0 1200 760" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="brandGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="45%" stopColor="#5b7cff" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <linearGradient id="brandGradientSoft" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.95)" />
            <stop offset="50%" stopColor="rgba(96,165,250,0.92)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.94)" />
          </linearGradient>
        </defs>

        <g className="brand-mark-core" transform="translate(60 30)">
          <path
            d="M50 610 L250 110 L410 460 L560 110 L700 610 L820 200 L971 448 L1090 110 L1150 610 H1030 L939 310 L853 550 L720 300 L580 610 H470 L310 250 L186 610 Z"
            fill="rgba(15, 23, 42, 0.92)"
            stroke="url(#brandGradient)"
            strokeWidth="18"
            strokeLinejoin="round"
          />
          <path
            d="M130 610 L285 170 L430 450 L560 180 L680 610 H560 L470 400 L340 610 Z"
            fill="rgba(255,255,255,0.02)"
            stroke="url(#brandGradientSoft)"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M720 610 L860 170 L990 430 L1095 174"
            fill="none"
            stroke="url(#brandGradientSoft)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <div className="brand-wordmark" aria-hidden="true">SHADOWWORKER</div>
    </div>
  )
}
