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
  process_management: {
    title: 'Mission : Maîtrise des processus',
    lessons: [6],
    mission: {
      description: 'Identifie et gère les programmes en cours d\'exécution sur ton système Linux.',
      tasks: [
        'Liste tous les processus en cours avec `ps aux`.',
        'Trouve le PID d\'un processus spécifique (simulé).',
        'Arrête un processus (simulé).',
      ],
    },
  },
  users: {
    title: 'Mission : Administrateur des utilisateurs',
    lessons: [7], // Updated to new lesson ID
    mission: {
      description: 'Gère les utilisateurs et les groupes pour sécuriser l\'accès à votre système.',
      tasks: [
        'Crée un nouvel utilisateur `dev` et un groupe `developers`.',
        'Ajoute `dev` au groupe `developers`.',
        'Vérifie les groupes de l\'utilisateur `dev`.',
      ],
    },
  },
  package_management: {
    title: 'Mission : Gestionnaire de paquets',
    lessons: [8], // Updated to new lesson ID
    mission: {
      description: 'Installe, met à jour et supprime des logiciels sur votre système.',
      tasks: [
        'Mets à jour la liste des paquets.',
        'Installe un paquet fictif `my-app` (simulé).',
        'Supprime le paquet `my-app`.',
      ],
    },
  },
  archive: {
    title: 'Mission : Archivage et compression',
    lessons: [13], // Updated to new lesson ID
    mission: {
      description: 'Compresse et archive des fichiers pour optimiser l\'espace et les transferts.',
      tasks: [
        'Crée un dossier `documents` avec quelques fichiers à l\'intérieur.',
        'Archive et compresse le dossier `documents` en `documents.tar.gz`.',
        'Extrais l\'archive dans un nouveau dossier `restored_documents`.',
      ],
    },
  },
  automation: {
    title: 'Mission : Automatisation des tâches',
    lessons: [9], // Updated to new lesson ID
    mission: {
      description: 'Planifie des commandes pour qu\'elles s\'exécutent automatiquement.',
      tasks: [
        'Ajoute une tâche cron qui exécute `echo "Hello Cron"` toutes les minutes (simulé).',
        'Planifie une tâche `at` qui affiche "Mission accomplie" dans 2 minutes.',
        'Vérifie que la tâche `at` est bien en attente.',
      ],
    },
  },
  text_processing: {
    title: 'Mission : Maître du traitement de texte',
    lessons: [14], // Updated to new lesson ID
    mission: {
      description: 'Utilise `sed` et `awk` pour manipuler et extraire des informations de fichiers texte.',
      tasks: [
        'Dans un fichier `log.txt`, remplace toutes les occurrences de "ERROR" par "CRITICAL".',
        'Extrais la première et la troisième colonne d\'un fichier `data.csv` (séparateur virgule).',
        'Affiche les lignes d\'un fichier `config.ini` qui commencent par "User".',
      ],
    },
  },
  ssh_remote: {
    title: 'Mission : Accès distant sécurisé',
    lessons: [10],
    mission: {
      description: 'Connecte-toi à des serveurs distants et transfère des fichiers en toute sécurité.',
      tasks: [
        'Génère une paire de clés SSH.',
        'Copie un fichier local vers un serveur distant (simulé).',
        'Connecte-toi à un serveur distant (simulé).',
      ],
    },
  },
  network_basics: {
    title: 'Mission : Fondamentaux du réseau',
    lessons: [11],
    mission: {
      description: 'Diagnostique la connectivité et explore les bases du réseau Linux.',
      tasks: [
        'Teste la connectivité vers `google.com`.',
        'Affiche les adresses IP de tes interfaces réseau.',
        'Effectue une requête HTTP GET vers `example.com` depuis le terminal.',
      ],
    },
  },
  logs_monitoring: {
    title: 'Mission : Analyse des journaux',
    lessons: [12], // Updated to new lesson ID
    mission: {
      description: 'Apprends à lire et surveiller les logs pour diagnostiquer les problèmes système.',
      tasks: [
        'Surveille les logs système en temps réel (simulé).',
        'Affiche les messages du noyau.',
        'Filtre les logs pour trouver les erreurs (simulé).',
      ],
    },
  },
  systemd_services: {
    title: 'Mission : Maîtrise des services système',
    lessons: [15],
    mission: {
      description: 'Installe, met à jour et supprime des logiciels sur votre système.',
      tasks: [
        'Mets à jour la liste des paquets.',
        'Installe un paquet fictif `my-app` (simulé).',
        'Supprime le paquet `my-app`.',
      ],
    },
  },
  disk_management: {
    title: 'Mission : Gestion de l\'espace disque',
    lessons: [16], // Updated to new lesson ID
    mission: {
      description: 'Gère l\'espace disque et comprends l\'organisation des systèmes de fichiers.',
      tasks: [
        'Affiche l\'espace disque utilisé de manière lisible.',
        'Vérifie la taille d\'un dossier spécifique.',
        'Liste les périphériques de bloc.',
      ],
    },
  },
  advanced_permissions: {
    title: 'Mission : Sécurisation avancée',
    lessons: [17], // Updated to new lesson ID
    mission: {
      description: 'Applique des permissions numériques et utilise `sudo` de manière sécurisée.',
      tasks: [
        'Crée un fichier et donne-lui les permissions `700`.',
        'Vérifie les permissions du fichier.',
        'Exécute une commande avec `sudo` (simulé).',
      ],
    },
  },
  network_security_recon: {
    title: 'Mission : Reconnaissance et sécurité réseau',
    lessons: [18], // New mission for lesson 18
    mission: {
      description: 'Explore les outils de reconnaissance réseau et les principes éthiques de la cybersécurité.',
      tasks: [
        'Récupère des informations publiques sur un nom de domaine avec `whois`.',
        'Simule un scan de ports sur `localhost` avec `nmap`.',
        '**Rappel :** Utilise `nmap` et `whois` de manière éthique et légale.',
      ],
    },
  },
  advanced_archive_sync: {
    title: 'Mission : Archivage avancé et synchronisation',
    lessons: [19], // New mission for lesson 19
    mission: {
      description: 'Maîtrise les techniques avancées d\'archivage et de synchronisation de fichiers.',
      tasks: [
        'Utilise `rsync` pour synchroniser un dossier (simulé).',
        'Crée une archive incrémentielle avec `tar` (simulé).',
      ],
    },
  },
  bash_scripting: {
    title: 'Mission : Scripting Bash avancé',
    lessons: [20], // New mission for lesson 20
    mission: {
      description: 'Gère les services et processus de démarrage de ton système Linux.',
      tasks: [
        'Vérifie le statut du service `nginx` (simulé).',
        'Démarre le service `apache2` (simulé).',
        'Active le service `mysql` pour qu\'il démarre au boot (simulé).',
      ],
    },
  },
  logs_monitoring: {
    title: 'Mission : Analyse des journaux',
    lessons: [17],
    mission: {
      description: 'Apprends à lire et surveiller les logs pour diagnostiquer les problèmes système.',
      tasks: [
        'Surveille les logs système en temps réel (simulé).',
        'Affiche les messages du noyau.',
        'Filtre les logs pour trouver les erreurs (simulé).',
      ],
    },
  },
  disk_management: {
    title: 'Mission : Gestion de l\'espace disque',
    lessons: [18],
    mission: {
      description: 'Gère l\'espace disque et comprends l\'organisation des systèmes de fichiers.',
      tasks: [
        'Affiche l\'espace disque utilisé de manière lisible.',
        'Vérifie la taille d\'un dossier spécifique.',
        'Liste les périphériques de bloc.',
      ],
    },
  },
  advanced_permissions: {
    title: 'Mission : Sécurisation avancée',
    lessons: [19],
    mission: {
      description: 'Applique des permissions numériques et utilise `sudo` de manière sécurisée.',
      tasks: [
        'Crée un fichier et donne-lui les permissions `700`.',
        'Vérifie les permissions du fichier.',
        'Exécute une commande avec `sudo` (simulé).',
      ],
    },
  },
}
