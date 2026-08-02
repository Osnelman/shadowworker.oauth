import React from 'react'

export default function BadgeIcon({ type }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' }

  let icon
  switch (type) {
    case 'terminal':
      icon = <><rect x="8" y="12" width="48" height="40" rx="8" {...common} /><path d="m19 26 7 6-7 6M34 40h11" {...common} /></>
      break
    case 'book':
      icon = <><path d="M10 14c9-4 17-1 22 5v32c-5-6-13-9-22-5V14Z" {...common} /><path d="M54 14c-9-4-17-1-22 5v32c5-6 13-9 22-5V14Z" {...common} /></>
      break
    case 'cap':
      icon = <><path d="m7 27 25-13 25 13-25 13L7 27Z" {...common} /><path d="M17 33v10c8 7 22 7 30 0V33M57 27v15" {...common} /></>
      break
    case 'trophy':
      icon = <><path d="M20 10h24v13c0 11-5 18-12 18s-12-7-12-18V10Z" {...common} /><path d="M20 17H9c0 10 5 15 13 15M44 17h11c0 10-5 15-13 15M32 41v10M22 54h20" {...common} /></>
      break
    case 'chevron-one':
      icon = <path d="m17 38 15-15 15 15" {...common} />
      break
    case 'chevron-two':
      icon = <><path d="m17 42 15-15 15 15M17 29l15-15 15 15" {...common} /></>
      break
    case 'rocket':
      icon = <><path d="M38 9c10 5 15 15 14 28L37 52c-13 1-23-4-28-14 4-14 14-24 29-29Z" {...common} /><circle cx="39" cy="25" r="5" {...common} /><path d="m22 42-9 9M27 47l-9 9M20 35l-10-2 7-7" {...common} /></>
      break
    case 'shield':
      icon = <><path d="M32 8 52 16v14c0 13-8 22-20 27-12-5-20-14-20-27V16l20-8Z" {...common} /><path d="m22 32 7 7 14-15" {...common} /></>
      break
    case 'target':
      icon = <><circle cx="32" cy="32" r="21" {...common} /><circle cx="32" cy="32" r="11" {...common} /><circle cx="32" cy="32" r="2" fill="currentColor" /><path d="m45 19 10-10M45 19h10v10" {...common} /></>
      break
    case 'flame':
      icon = <path d="M34 7c3 11-6 15-3 23 2 4 6 5 8 9 3-6 8-10 8-19 8 7 10 16 8 25-3 12-13 18-23 18-12 0-23-9-23-23 0-10 6-18 16-25-1 10 2 15 6 18 1-10 8-15 3-26Z" {...common} />
      break
    case 'penguin':
      icon = <span role="img" aria-label="penguin">🐧</span>
      break
    case 'users': icon = <><path d="M16 28c0-6 5-11 11-11h10c6 0 11 5 11 11M32 38v10M22 48h20" {...common} /><circle cx="32" cy="22" r="6" {...common} /></>; break;
    case 'package': icon = <><path d="M10 16v32l22 10 22-10V16L32 6Z" {...common} /><path d="m10 16 22 10 22-10M32 26v22" {...common} /></>; break;
    case 'text-editor': icon = <><rect x="10" y="10" width="44" height="44" rx="4" {...common} /><path d="M18 18h28M18 26h28M18 34h14M18 42h14" {...common} /></>; break;
    case 'disk': icon = <><circle cx="32" cy="32" r="22" {...common} /><circle cx="32" cy="32" r="10" {...common} /><path d="M32 10v44" {...common} /></>; break;
    case 'clock': icon = <><circle cx="32" cy="32" r="22" {...common} /><path d="M32 10v22h10" {...common} /></>; break;
    case 'globe': icon = <><circle cx="32" cy="32" r="22" {...common} /><path d="M10 32h44M32 10v44" {...common} /></>; break;
    case 'satellite': icon = <><path d="M10 32a22 22 0 0 1 44 0M32 10v44M10 32c0 12 10 22 22 22s22-10 22-22M32 10c-12 0-22 10-22 22s10 22 22 22" {...common} /><path d="M44 20 54 10M20 44 10 54" {...common} /></>; break;
    case 'scroll': icon = <><path d="M16 8v48l16-8 16 8V8L32 16Z" {...common} /><path d="M16 8c0 8 16 8 16 0M48 8c0 8-16 8-16 0" {...common} /></>; break;
    case 'hard-drive': icon = <><rect x="10" y="10" width="44" height="20" rx="4" {...common} /><rect x="10" y="34" width="44" height="20" rx="4" {...common} /><path d="M18 17h2M18 41h2" {...common} /></>; break;
    case 'key': icon = <><circle cx="20" cy="44" r="8" {...common} /><path d="m26 38 10-10M36 28l10-10M46 18l-6-6" {...common} /></>; break;
    case 'detective': icon = <><path d="M16 20c0-6 5-11 11-11h10c6 0 11 5 11 11M32 38v10M22 48h20" {...common} /><circle cx="32" cy="22" r="6" {...common} /><path d="M22 32h20" {...common} /></>; break;
    default:
      icon = <circle cx="32" cy="32" r="18" {...common} />
  }

  return <svg className="badge-icon" viewBox="0 0 64 64" aria-hidden="true">{icon}</svg>
}
