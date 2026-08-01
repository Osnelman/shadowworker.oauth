export const lessons = {
  1: {
    id: 1,
    icon: '⌘',
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
    id: 2,
    icon: '◫',
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
    id: 3,
    icon: '↗',
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
    id: 4,
    icon: '⌁',
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
    id: 5,
    icon: '⌕',
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
  6: {
    id: 6,
    icon: '⚙️',
    title: 'Gestion des processus',
    summary: 'Découvre comment voir et gérer les programmes en cours d’exécution.',
    steps: [
      'Lister les processus avec <code>ps aux</code>.',
      'Filtrer les processus avec <code>grep</code>.',
      'Arrêter un processus avec <code>kill PID</code>.',
      'Voir les processus en temps réel avec <code>top</code>.',
    ],
    details: 'Savoir gérer les processus est crucial pour débugger ou arrêter des applications qui ne répondent plus.'
  },
};

export const lessonIds = Object.keys(lessons).map(Number);