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
    title: 'Mission : Incident serveur — accès restreint',
    lessons: [3],
    mission: {
      description:
        'Un service local a été bloqué par une mauvaise configuration. Tu dois identifier le fichier caché qui contient la clé d’accès et remettre le système en ordre.',
      tasks: [
        'Inspecte le dossier de travail et repère les fichiers cachés.',
        'Affiche le contenu du fichier caché pour retrouver la clé d’accès.',
        'Valide le correctif pour rétablir l’accès au service.',
      ],
    },
    challenge: {
      type: 'incident',
      title: 'Incident système détecté',
      scenario: 'Une anomalie de permissions a fermé un accès critique. Un fichier caché contient le secret nécessaire pour restaurer le service.',
      objective: 'Diagnostiquer la cause, retrouver la clé et rétablir l’accès.',
      status: 'Accès bloqué',
      severity: 'high',
      steps: [
        'Vérifie les fichiers cachés du dossier.',
        'Ouvre le fichier secret pour récupérer la clé.',
        'Confirme la restauration en validant la clé.',
      ],
      initialFiles: {
        '.secret': 'open-sesame',
      },
      expected: 'open-sesame',
      hint: 'Le mot de passe est dans un fichier caché nommé `.secret`.',
      prompt: 'Saisis ici la clé de restauration trouvée dans le terminal.',
      successText: 'Incident résolu : le service a bien retrouvé son accès sécurisé.',
    },
  },
  permissions: {
    title: 'Mission : Incident déploiement — script bloqué',
    lessons: [4],
    mission: {
      description:
        'Un script de déploiement est bloqué par de mauvaises permissions. Tu dois corriger les droits avant que le système ne refuse l’exécution.',
      tasks: [
        'Crée le script `deploy.sh`.',
        'Rends-le exécutable avec les bons droits.',
        'Vérifie le mode et valide que le script est prêt à lancer.',
      ],
    },
    challenge: {
      type: 'incident',
      title: 'Déploiement bloqué',
      scenario: 'Le script de livraison ne démarre pas parce que les permissions ont été modifiées par erreur.',
      objective: 'Restaurer les droits d’exécution et relancer le déploiement.',
      status: 'Script refusé',
      severity: 'medium',
      steps: [
        'Crée le script de déploiement.',
        'Applique les permissions nécessaires.',
        'Vérifie l’exécution et valide la reprise.',
      ],
      prompt: 'Valide la correction dans le terminal pour relancer le déploiement.',
      hint: 'La commande clé est `chmod +x deploy.sh`.',
      expected: 'chmod +x deploy.sh',
      successText: 'Déploiement relancé : les permissions sont restaurées.',
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
  // Nouvelle mission pour la leçon 6 (Gestion des processus)
  process_management: {
    title: 'Mission : Incident runtime — service saturé',
    lessons: [6],
    mission: {
      description: 'Un service tourne en boucle et consomme trop de ressources. Tu dois localiser le processus, le diagnostiquer puis le neutraliser proprement.',
      tasks: [
        'Liste les processus actifs pour repérer l’anomalie.',
        'Trouve le PID du service perturbé.',
        'Arrête proprement le processus et confirme la stabilisation.',
      ],
    },
    challenge: {
      type: 'incident',
      title: 'Saturation du service',
      scenario: 'Le service de production tourne trop vite et manque de ressources. L’anomalie doit être stoppée avant qu’elle ne dégrade le serveur.',
      objective: 'Identifier le PID du processus bloquant et le neutraliser proprement.',
      status: 'Service saturé',
      severity: 'high',
      steps: [
        'Lance la commande de surveillance des processus.',
        'Repère le mauvais PID.',
        'Arrête le processus et vérifie le retour.',
      ],
      prompt: 'Valide la commande qui a stoppé le service.',
      hint: 'Le terminal peut simuler `ps aux` puis `kill <PID>`.',
      expected: 'kill',
      successText: 'Le service est revenu à un état stable.',
    },
  },
  // Nouvelle mission pour la leçon 7 (Gestion des utilisateurs et groupes)
  users: {
    title: 'Mission : Administrateur des utilisateurs',
    lessons: [7],
    mission: {
      description: 'Gère les utilisateurs et les groupes pour sécuriser l\'accès à votre système.',
      tasks: [
        'Crée un nouvel utilisateur `dev` et un groupe `developers`.',
        'Ajoute `dev` au groupe `developers`.',
        'Vérifie les groupes de l\'utilisateur `dev`.',
      ],
    },
  },
  // Nouvelle mission pour la leçon 8 (Gestion des paquets APT)
  package_management: {
    title: 'Mission : Gestionnaire de paquets',
    lessons: [8],
    mission: {
      description: 'Installe, met à jour et supprime des logiciels sur votre système.',
      tasks: [
        'Mets à jour la liste des paquets.',
        'Installe un paquet fictif `my-app` (simulé).',
        'Supprime le paquet `my-app`.',
      ],
    },
  },
  // Nouvelle mission pour la leçon 9 (Tâches planifiées avec Cron et At)
  archive: {
    title: 'Mission : Archivage et compression',
    lessons: [13], // Corrected to new lesson ID
    mission: {
      description: 'Compresse et archive des fichiers pour optimiser l\'espace et les transferts.',
      tasks: [
        'Crée un dossier `documents` avec quelques fichiers à l\'intérieur.',
        'Archive et compresse le dossier `documents` en `documents.tar.gz`.',
        'Extrais l\'archive dans un nouveau dossier `restored_documents`.',
      ],
    },
  },
  // Nouvelle mission pour la leçon 10 (Connexions sécurisées avec SSH)
  automation: {
    title: 'Mission : Automatisation des tâches',
    lessons: [9], // Corrected to new lesson ID
    mission: {
      description: 'Planifie des commandes pour qu\'elles s\'exécutent automatiquement.',
      tasks: [
        'Ajoute une tâche cron qui exécute `echo "Hello Cron"` toutes les minutes (simulé).',
        'Planifie une tâche `at` qui affiche "Mission accomplie" dans 2 minutes.',
        'Vérifie que la tâche `at` est bien en attente.',
      ],
    },
  },
  // Nouvelle mission pour la leçon 11 (Réseau de base et diagnostic)
  text_processing: {
    title: 'Mission : Maître du traitement de texte',
    lessons: [14], // Corrected to new lesson ID
    mission: {
      description: 'Utilise `sed` et `awk` pour manipuler et extraire des informations de fichiers texte.',
      tasks: [
        'Dans un fichier `log.txt`, remplace toutes les occurrences de "ERROR" par "CRITICAL".',
        'Extrais la première et la troisième colonne d\'un fichier `data.csv` (séparateur virgule).',
        'Affiche les lignes d\'un fichier `config.ini` qui commencent par "User".',
      ],
    },
  },
  // Nouvelle mission pour la leçon 12 (Analyse et surveillance des journaux)
  ssh_remote: {
    title: 'Mission : Accès distant sécurisé',
    lessons: [10], // Corrected to new lesson ID
    mission: {
      description: 'Connecte-toi à des serveurs distants et transfère des fichiers en toute sécurité.',
      tasks: [
        'Génère une paire de clés SSH.',
        'Copie un fichier local vers un serveur distant (simulé).',
        'Connecte-toi à un serveur distant (simulé).',
      ],
    },
  },
  // Nouvelle mission pour la leçon 13 (Archivage et compression de données)
  network_basics: {
    title: 'Mission : Fondamentaux du réseau',
    lessons: [11], // Corrected to new lesson ID
    mission: {
      description: 'Diagnostique la connectivité et explore les bases du réseau Linux.',
      tasks: [
        'Teste la connectivité vers `google.com`.',
        'Affiche les adresses IP de tes interfaces réseau.',
        'Effectue une requête HTTP GET vers `example.com` depuis le terminal.',
      ],
    },
  },
  // Nouvelle mission pour la leçon 14 (Traitement de texte avancé avec Sed et Awk)
  logs_monitoring: {
    title: 'Mission : Analyse des journaux',
    lessons: [12], // Corrected to new lesson ID
    mission: {
      description: 'Apprends à lire et surveiller les logs pour diagnostiquer les problèmes système.',
      tasks: [
        'Surveille les logs système en temps réel (simulé).',
        'Affiche les messages du noyau.',
        'Filtre les logs pour trouver les erreurs (simulé).',
      ],
    },
  },
  // Nouvelle mission pour la leçon 15 (Maîtrise des services Systemd)
  systemd_services: {
    title: 'Mission : Maîtrise des services système',
    lessons: [15],
    mission: {
      description: 'Gère les services et processus de démarrage de ton système Linux.',
      tasks: [
        'Vérifie le statut du service `nginx` (simulé, ex: `systemctl status nginx`).',
        'Démarre le service `apache2` (simulé, ex: `systemctl start apache2`).',
        'Active le service `mysql` pour qu\'il démarre au boot (simulé, ex: `systemctl enable mysql`).',
      ],
    },
  },
  // Nouvelle mission pour la leçon 16 (Gestion de l'espace disque et des systèmes de fichiers)
  disk_management: {
    title: 'Mission : Gestion de l\'espace disque',
    lessons: [16], // Corrected to new lesson ID
    mission: {
      description: 'Gère l\'espace disque et comprends l\'organisation des systèmes de fichiers.',
      tasks: [
        'Affiche l\'espace disque utilisé de manière lisible.',
        'Vérifie la taille d\'un dossier spécifique.',
        'Liste les périphériques de bloc.',
      ],
    },
  },
  // Nouvelle mission pour la leçon 17 (Permissions avancées et Sudo)
  advanced_permissions: {
    title: 'Mission : Sécurisation avancée',
    lessons: [17], // Corrected to new lesson ID
    mission: {
      description: 'Applique des permissions numériques et utilise `sudo` de manière sécurisée.',
      tasks: [
        'Crée un fichier et donne-lui les permissions `700`.',
        'Vérifie les permissions du fichier.',
        'Exécute une commande avec `sudo` (simulé).',
      ],
    },
  },
  // Nouvelle mission pour la leçon 18 (Sécurité réseau et reconnaissance)
  network_security_recon: {
    title: 'Mission : Reconnaissance et sécurité réseau',
    lessons: [18],
    mission: {
      description: 'Explore les outils de reconnaissance réseau et les principes éthiques de la cybersécurité.',
      tasks: [
        'Récupère des informations publiques sur un nom de domaine avec `whois`.',
        'Simule un scan de ports sur `localhost` avec `nmap`.',
        '**Rappel :** Utilise `nmap` et `whois` de manière éthique et légale.',
      ],
    },
  },
  // Nouvelle mission pour la leçon 19 (Archivage avancé et synchronisation)
  advanced_archive_sync: {
    title: 'Mission : Archivage avancé et synchronisation',
    lessons: [19],
    mission: {
      description: 'Maîtrise les techniques avancées d\'archivage et de synchronisation de fichiers.',
      tasks: [
        'Utilise `rsync` pour synchroniser un dossier (simulé).',
        'Crée une archive incrémentielle avec `tar` (simulé).',
      ],
    },
  },
  // Nouvelle mission pour la leçon 20 (Scripting Bash avancé)
  bash_scripting: {
    title: 'Mission : Scripting Bash avancé',
    lessons: [20],
    mission: {
      description: 'Écris des scripts Bash complexes pour automatiser des tâches d\'administration système.',
      tasks: [
        'Déclare une variable et affiche sa valeur.',
        'Utilise une condition `if` pour vérifier l\'existence d\'un fichier.',
        'Crée une boucle `for` simple.',
      ],
    },
  },
}
