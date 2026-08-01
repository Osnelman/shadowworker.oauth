export const dailyMissions = [
  {
    title: 'Éclaireur des dossiers',
    description: 'Retrouve ton chemin avant de commencer à manipuler des fichiers.',
    objective: 'Dans le terminal, utilise la commande qui affiche le dossier dans lequel tu te trouves.',
    hint: 'Elle contient trois lettres et commence par p.',
  },
  {
    title: 'Gardien du répertoire',
    description: 'Observe ce qui t’entoure comme un vrai explorateur Linux.',
    objective: 'Affiche le contenu du dossier courant avec les détails des fichiers.',
    hint: 'Ajoute une option courte à la commande qui liste les fichiers.',
  },
  {
    title: 'Architecte du shell',
    description: 'Prépare un espace de travail pour ta prochaine aventure.',
    objective: 'Crée un dossier nommé mission-du-jour.',
    hint: 'La commande de création de dossier commence par mkdir.',
  },
  {
    title: 'Messager du terminal',
    description: 'Fais parler le terminal avec un message de victoire.',
    objective: 'Affiche le texte « Mission accomplie » dans le terminal.',
    hint: 'La commande echo affiche un message.',
  },
  {
    title: 'Chercheur de traces',
    description: 'Utilise la mémoire du terminal pour retrouver tes actions.',
    objective: 'Affiche l’historique des commandes déjà utilisées.',
    hint: 'Une commande porte exactement ce nom.',
  },
]

export function getDailyMission() {
  const today = new Date()
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000)
  return dailyMissions[dayNumber % dailyMissions.length]
}
