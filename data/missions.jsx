export const missions = {
  basic: {
    title: 'Mission : Maîtriser la navigation et les fichiers',
    lessons: [1, 2],
    mission: {
      description:
        'Crée un dépôt de travail : découvre ta position, liste les fichiers, et manipule des dossiers et fichiers sans te perdre.',
      tasks: [
        'Vérifie ton répertoire courant avec `pwd`.',
        'Liste le contenu du dossier avec `ls -l`.',
        'Crée un dossier `workshop` puis un fichier `notes.txt`.',
        'Supprime proprement le fichier créé et reviens au dossier parent.',
      ],
    },
  },
  security: {
    title: 'Mission : Trouver le mot de passe caché',
    lessons: [3],
    mission: {
      description:
        'Un mot de passe secret est caché dans un fichier invisible. Utilise les commandes Linux pour le trouver, puis saisis-le dans le champ prévu.',
      tasks: [
        'Liste les fichiers cachés avec `ls -a`.',
        'Affiche le contenu du fichier caché en utilisant `cat`.',
        'Mémorise le mot de passe et saisis-le dans le champ prévu.',
      ],
    },
    challenge: {
      initialFiles: {
        '.secret': 'open-sesame',
      },
      expected: 'open-sesame',
      hint: 'Le mot de passe est dans un fichier caché nommé `.secret`.',
      prompt: 'Saisis ici le mot de passe trouvé dans le terminal pour valider la mission.',
    },
  },
  permissions: {
    title: 'Mission : Gestion avancée des permissions',
    lessons: [4],
    mission: {
      description:
        'Apprends à protéger un script et à gérer les droits d’accès sur les fichiers.',
      tasks: [
        'Crée un script `deploy.sh` avec `touch deploy.sh`.',
        'Ajoute les droits d’exécution avec `chmod +x deploy.sh`.',
        'Vérifie le mode et le propriétaire avec `ls -l deploy.sh`.',
      ],
    },
  },
  search: {
    title: 'Mission : Recherche et productivité',
    lessons: [5],
    mission: {
      description:
        'Utilise les commandes de recherche pour trouver rapidement des informations et automatiser ta recherche.',
      tasks: [
        'Utilise `grep -R` pour trouver un mot dans les fichiers du dossier.',
        'Consulte ton historique avec `history`.',
        'Redirige la sortie d’une commande vers un fichier avec `>` puis affiche ce fichier.',
      ],
    },
  },
}
