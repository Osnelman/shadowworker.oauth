export const USER_TITLES = [
  { title: 'Novice', minLessons: 0 },
  { title: 'Débutant', minLessons: 1 },
  { title: 'Apprenti', minLessons: 3 },
  { title: 'Initié', minLessons: 5 },
  { title: 'Pro', minLessons: 7 },
  { title: 'Élite', minLessons: 9 },
  { title: 'Master', minLessons: 12 },
  { title: 'Chef', minLessons: 15 },
]

export function getUserTitle(lessonsCompleted) {
  const currentTitle = USER_TITLES.filter((step) => lessonsCompleted >= step.minLessons).at(-1) ?? USER_TITLES[0]
  return currentTitle.title
}

export function getUserTitleProgress(lessonsCompleted) {
  const current = USER_TITLES.filter((step) => lessonsCompleted >= step.minLessons).at(-1) ?? USER_TITLES[0]
  const next = USER_TITLES.find((step) => step.minLessons > lessonsCompleted)

  if (!next) {
    return {
      currentTitle: current.title,
      nextTitle: null,
      progress: 100,
      lessonsNeeded: 0,
      lessonsCompleted,
    }
  }

  const range = Math.max(1, next.minLessons - current.minLessons)
  const progress = Math.min(100, Math.max(0, Math.round(((lessonsCompleted - current.minLessons) / range) * 100)))
  const lessonsNeeded = Math.max(0, next.minLessons - lessonsCompleted)

  return {
    currentTitle: current.title,
    nextTitle: next.title,
    progress,
    lessonsNeeded,
    lessonsCompleted,
  }
}
