export const missions = {
  basic: {
    title: 'Mission : Maîtriser la navigation et les fichiers',
    lessons: [1, 2],
    mission: {
      description:
        "Crée un petit dépôt de travail : navigue entre dossiers, crée des fichiers, et supprime-les proprement.",
      tasks: [
        'Créer un dossier `workshop` avec `mkdir workshop`',
        'Entrer dans le dossier et créer deux fichiers texte avec `touch`',
        'Lister les fichiers avec `ls -la` et vérifier les permissions',
        'Supprimer proprement les fichiers créés puis revenir au dossier parent',
      ],
    },
  },
  intermediate: {
    title: 'Mission : Gestion et lecture de fichiers',
    lessons: [3, 4],
    mission: {
      description:
        "Lis et manipule des fichiers texte : utilise `cat`, `less`, et change les permissions pour un script simple.",
      tasks: [
        'Créer un script simple `hello.sh` contenant `echo "Hello"`',
        'Rendre le script exécutable avec `chmod +x hello.sh` et l’exécuter',
        'Afficher un fichier long avec `less` et rechercher une chaîne avec `/`',
      ],
    },
  },
  advanced: {
    title: 'Mission : Recherche et productivité',
    lessons: [5],
    mission: {
      description:
        "Améliore ta productivité en combinant `grep`, historique et redirections pour extraire des informations.",
      tasks: [
        'Utiliser `grep -R` pour trouver un mot dans plusieurs fichiers',
        'Utiliser `history` pour retrouver une commande utile et la ré-exécuter',
        'Rediriger la sortie d’une commande vers un fichier avec `>` puis la consulter',
      ],
    },
  },
}
