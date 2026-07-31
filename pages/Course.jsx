import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { missions } from '../data/missions'

const lessons = {
  1: {
    title: 'Explorer le répertoire courant',
    summary: 'Comprends la base : où tu te trouves et comment regarder les fichiers qui t’entourent.',
    steps: [
      'Utilise <code>pwd</code> pour afficher ton dossier actuel.',
      'Utilise <code>ls -l</code> pour lister les fichiers et voir leur détail (permissions, propriétaire, taille).',
      'Utilise <code>ls -a</code> pour révéler les fichiers cachés commençant par <code>.</code>.',
      'Astuce : combine <code>ls -lah</code> pour un affichage lisible (taille humaine, tous les fichiers).',
    ],
    details: 'Savoir où tu es dans l’arborescence évite de supprimer ou modifier les mauvais fichiers. Les options de <code>ls</code> permettent d’obtenir le bon niveau de détail selon le contexte.'
  },
  2: {
    title: 'Créer, supprimer et lire',
    summary: 'Apprends à manipuler fichiers et dossiers sans te mettre en danger.',
    steps: [
      'Créer un dossier avec <code>mkdir mon_dossier</code> et utiliser <code>mkdir -p</code> pour arborescences.',
      'Créer un fichier vide avec <code>touch fichier.txt</code> ou éditer avec <code>nano</code>/<code>vi</code>.',
      'Supprimer un fichier avec <code>rm fichier.txt</code> (attention, définitif).',
      'Supprimer un dossier avec <code>rm -r dossier</code> ou préférer <code>rmdir</code> si vide.',
      'Astuce : sauvegarde avant suppression importante et vérifier le chemin avec <code>pwd</code>.',
    ],
    details: 'Toujours vérifier l’emplacement avant de supprimer. Les éditeurs en ligne de commande comme <code>nano</code> sont utiles pour débuter.'
  },
  3: {
    title: 'Navigation avancée et visualisation',
    summary: 'Déplace-toi rapidement et lis des fichiers longs en toute sérénité.',
    steps: [
      'Changer de dossier : <code>cd chemin/vers/dossier</code>, <code>cd ..</code> pour monter d’un niveau, <code>cd -</code> pour revenir.',
      'Lister les fichiers triés par taille : <code>ls -lahS</code>.',
      'Voir les fichiers page par page : <code>less fichier.txt</code> (q pour quitter).',
      'Afficher les 10 premières lignes : <code>head -n 10 fichier.txt</code>, ou les 10 dernières : <code>tail -n 10 fichier.txt</code>.',
    ],
    details: 'Les commandes <code>head</code>/<code>tail</code>/<code>less</code> facilitent l’inspection rapide de logs et fichiers volumineux sans les ouvrir entièrement.'
  },
  4: {
    title: 'Permissions, propriétaires et sécurité',
    summary: 'Savoir qui peut faire quoi sur les fichiers et comment le changer.',
    steps: [
      'Voir les permissions : <code>ls -l</code> (ex: <code>-rw-r--r--</code>).',
      'Modifier les permissions : <code>chmod u+x script.sh</code> pour rendre exécutable.',
      'Changer le propriétaire : <code>chown user:group fichier</code> (nécessite sudo).',
      'Vérifier l’utilisateur courant avec <code>whoami</code> et les privilèges avec <code>sudo -l</code>.',
    ],
    details: 'Comprendre les bits de permissions et les propriétaires évite d’exposer des fichiers sensibles ou d’empêcher l’accès à des outils.'
  },
  5: {
    title: 'Recherche, filtres et historique',
    summary: 'Deviens efficace pour rechercher, filtrer et réutiliser des commandes.',
    steps: [
      'Recherche de texte : <code>grep -R "mot" .</code> pour rechercher récursivement.',
      'Combiner commandes avec pipe : <code>ps aux | grep node</code> pour filtrer.',
      'Utiliser <code>find . -name "*.log"</code> pour trouver des fichiers par motif.',
      'Historique : <code>history</code> et ré-exécution avec <code>!123</code> ou <code>!!</code>.',
    ],
    details: 'Maîtriser <code>grep</code>, <code>find</code> et les pipes est essentiel pour investiguer et automatiser des tâches.'
  },
}

export default function Course() {
  const { lessonId } = useParams()
  const lesson = lessons[lessonId] || lessons[1]
  const navigate = useNavigate()
  const { setCurrentLesson } = useGame()

  useEffect(() => {
    setCurrentLesson(Number(lessonId) || 1)
  }, [lessonId, setCurrentLesson])

  // determine if this lesson is the end of a section that has a mission
  const sectionEntry = Object.entries(missions).find(([, s]) =>
    s.lessons.includes(Number(lessonId))
  )
  const sectionId = sectionEntry ? sectionEntry[0] : null
  const section = sectionEntry ? sectionEntry[1] : null
  const isSectionEnd = section ? Number(lessonId) === section.lessons[section.lessons.length - 1] : false

  return (
    <main className="page course-page">
      <section className="card">
        <span className="badge">Leçon {lessonId}</span>
        <h1>{lesson.title}</h1>
        <p className="muted">{lesson.summary}</p>

        <div className="lesson-steps">
          {lesson.steps.map((step, index) => (
            <div key={index} className="lesson-step">
              <span>0{index + 1}</span>
              <p dangerouslySetInnerHTML={{ __html: step }} />
            </div>
          ))}
        </div>

        <div className="course-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/quiz/${lessonId}`)}>
            Tester mes connaissances
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/home')}>
            Retour à l’accueil
          </button>
          {isSectionEnd && sectionId && (
            <button className="btn btn-primary" onClick={() => navigate(`/mission/${sectionId}`)}>
              Lancer la mission : {section.title}
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
