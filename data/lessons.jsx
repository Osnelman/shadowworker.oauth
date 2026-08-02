export const lessons = {
  1: {
    id: 1,
    isPremium: false,
    icon: '🧭', // Compass for exploration
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
    isPremium: false,
    icon: '🛠️', // Tools for creation/manipulation
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
    isPremium: false,
    icon: '🗺️', // Map for navigation
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
    isPremium: false,
    icon: '🛡️', // Shield for security/permissions
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
    isPremium: false,
    icon: '🔍', // Magnifying glass for search
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
    isPremium: true,
    icon: '🧠', // Brain/gear for process management
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
  7: {
    id: 7,
    isPremium: true,
    icon: '⚙️', // Gear for system
    title: 'Gestion des utilisateurs et groupes',
    summary: 'Apprends à administrer les utilisateurs et leurs permissions sur le système.',
    steps: [
      'Créer un nouvel utilisateur avec <code>useradd</code> ou <code>adduser</code>.',
      'Modifier les propriétés d\'un utilisateur avec <code>usermod</code>.',
      'Gérer les groupes avec <code>groupadd</code>, <code>groupdel</code>, <code>gpasswd</code>.',
      'Afficher les informations d\'un utilisateur et ses groupes avec <code>id</code> et <code>groups</code>.',
      'Supprimer un utilisateur avec <code>userdel</code> (avec <code>-r</code> pour le répertoire personnel).',
    ],
    details: 'La gestion des utilisateurs est fondamentale pour la sécurité et l\'organisation d\'un système multi-utilisateurs.'
  },
  8: {
    id: 8,
    isPremium: true,
    icon: '📦', // Box for packages
    title: 'Gestion des paquets APT',
    summary: 'Maîtrise l\'installation, la mise à jour et la suppression de logiciels sur les systèmes Debian/Ubuntu.',
    steps: [
      'Mettre à jour la liste des paquets disponibles : <code>sudo apt update</code>.',
      'Installer un nouveau paquet : <code>sudo apt install nom_du_paquet</code>.',
      'Mettre à niveau les paquets installés : <code>sudo apt upgrade</code>.',
      'Supprimer un paquet : <code>sudo apt remove nom_du_paquet</code>.',
      'Supprimer un paquet et ses fichiers de configuration : <code>sudo apt purge nom_du_paquet</code>.',
      'Nettoyer les paquets inutiles : <code>sudo apt autoremove</code>.',
    ],
    details: 'APT est le gestionnaire de paquets par excellence sur Debian/Ubuntu. Sa maîtrise est indispensable pour maintenir un système à jour et fonctionnel.'
  },
  9: {
    id: 9,
    isPremium: true,
    icon: '⏰', // Clock for automation
    title: 'Tâches planifiées avec Cron et At',
    summary: 'Automatise des scripts et des commandes pour qu\'ils s\'exécutent à des moments précis.',
    steps: [
      'Éditer la crontab de l\'utilisateur courant : <code>crontab -e</code>.',
      'Comprendre la syntaxe de Cron (minute, heure, jour du mois, mois, jour de la semaine, commande).',
      'Lister les tâches cron : <code>crontab -l</code>.',
      'Planifier une tâche unique avec <code>at</code> : <code>echo "commande" | at now + X minutes</code>.',
      'Lister les tâches <code>at</code> en attente : <code>atq</code>.',
    ],
    details: 'L\'automatisation est la clé de l\'efficacité en administration système. Cron et At sont des outils puissants pour cela.'
  },
  10: {
    id: 10,
    isPremium: true,
    icon: '🔒', // Lock for SSH
    title: 'Connexions sécurisées avec SSH',
    summary: 'Connecte-toi à distance à des serveurs Linux de manière sécurisée et transfère des fichiers.',
    steps: [
      'Se connecter à un serveur distant : <code>ssh user@host</code>.',
      'Générer une paire de clés SSH : <code>ssh-keygen</code>.',
      'Copier la clé publique sur un serveur : <code>ssh-copy-id user@host</code>.',
      'Transférer des fichiers avec <code>scp</code> : <code>scp fichier user@host:/chemin/</code>.',
      'Comprendre le rôle des clés publique et privée dans l\'authentification SSH.',
    ],
    details: 'SSH est l\'outil incontournable pour l\'administration distante. L\'authentification par clés est plus sécurisée que par mot de passe.'
  },
  11: {
    id: 11,
    isPremium: true,
    icon: '📡', // Satellite dish for network
    title: 'Réseau de base et diagnostic',
    summary: 'Comprends les fondamentaux du réseau Linux et diagnostique les problèmes de connectivité.',
    steps: [
      'Tester la connectivité avec <code>ping</code>.',
      'Afficher les adresses IP des interfaces réseau : <code>ip a</code>.',
      'Afficher la table de routage : <code>ip r</code> ou <code>route -n</code>.',
      'Lister les connexions réseau actives : <code>ss -tuln</code> ou <code>netstat -tuln</code>.',
      'Effectuer des requêtes HTTP depuis le terminal avec <code>curl</code> ou <code>wget</code>.',
      'Tracer le chemin des paquets avec <code>traceroute</code> ou <code>tracepath</code>.',
    ],
    details: 'Les outils réseau de base sont essentiels pour comprendre comment votre système communique et pour résoudre les pannes.'
  },
  12: {
    id: 12,
    isPremium: true,
    icon: '📄', // Document for logs
    title: 'Analyse et surveillance des journaux',
    summary: 'Apprends à lire, filtrer et surveiller les logs système pour identifier les problèmes.',
    steps: [
      'Afficher le contenu d\'un fichier de log : <code>cat /var/log/syslog</code>.',
      'Surveiller un fichier de log en temps réel : <code>tail -f /var/log/auth.log</code>.',
      'Naviguer dans de grands fichiers de log : <code>less /var/log/kern.log</code>.',
      'Filtrer les logs avec <code>grep</code> : <code>grep "error" /var/log/syslog</code>.',
      'Afficher les messages du noyau : <code>dmesg</code>.',
      'Utiliser <code>journalctl</code> pour les systèmes basés sur systemd.',
    ],
    details: 'Les logs sont la mémoire de votre système. Savoir les interpréter est une compétence cruciale pour le dépannage.'
  },
  13: {
    id: 13,
    isPremium: true,
    icon: '🗄️', // Filing cabinet for archiving
    title: 'Archivage et compression de données',
    summary: 'Gère efficacement l\'espace disque en compressant et archivant tes fichiers.',
    steps: [
      'Créer une archive TAR : <code>tar -cvf archive.tar dossier/</code>.',
      'Compresser une archive TAR avec Gzip : <code>tar -czvf archive.tar.gz dossier/</code>.',
      'Extraire une archive TAR : <code>tar -xvf archive.tar</code>.',
      'Décompresser un fichier Gzip : <code>gunzip fichier.gz</code>.',
      'Créer et extraire des archives ZIP : <code>zip -r archive.zip dossier/</code> et <code>unzip archive.zip</code>.',
    ],
    details: 'L\'archivage et la compression sont essentiels pour les sauvegardes, le transfert de fichiers et l\'optimisation de l\'espace de stockage.'
  },
  14: {
    id: 14,
    isPremium: true,
    icon: '📝', // Memo for text processing
    title: 'Traitement de texte avancé avec Sed et Awk',
    summary: 'Transforme et analyse des fichiers texte avec des outils puissants et flexibles.',
    steps: [
      'Remplacer du texte avec <code>sed</code> : <code>sed \'s/ancien/nouveau/g\' fichier.txt</code>.',
      'Supprimer des lignes avec <code>sed</code> : <code>sed \'/motif/d\' fichier.txt</code>.',
      'Extraire des colonnes avec <code>awk</code> : <code>awk \'{print $1, $3}\' fichier.csv</code>.',
      'Filtrer des lignes avec <code>awk</code> : <code>awk \'/motif/{print}\' fichier.log</code>.',
      'Utiliser les expressions régulières avec <code>grep</code>, <code>sed</code> et <code>awk</code>.',
    ],
    details: 'Sed et Awk sont des outils indispensables pour les administrateurs système et les développeurs qui manipulent de grandes quantités de données textuelles.'
  },
  15: {
    id: 15,
    isPremium: true,
    icon: '🖥️', // Desktop computer for systemd
    title: 'Maîtrise des services Systemd',
    summary: 'Gère les services système, les unités et le processus de démarrage de Linux.',
    steps: [
      'Vérifier le statut d\'un service : <code>systemctl status nom_service</code>.',
      'Démarrer, arrêter, redémarrer un service : <code>systemctl start/stop/restart nom_service</code>.',
      'Activer/désactiver un service au démarrage : <code>systemctl enable/disable nom_service</code>.',
      'Afficher les logs d\'un service avec <code>journalctl -u nom_service</code>.',
      'Comprendre les unités Systemd (service, target, mount, etc.).',
    ],
    details: 'Systemd est le système d\'initialisation et gestionnaire de services moderne de Linux. Sa compréhension est essentielle pour l\'administration système.'
  },
  16: {
    id: 16,
    isPremium: true,
    icon: '💾', // Floppy disk for disk management
    title: 'Gestion de l\'espace disque et des systèmes de fichiers',
    summary: 'Surveille l\'utilisation du disque, gère les partitions et les points de montage.',
    steps: [
      'Afficher l\'espace disque utilisé et disponible : <code>df -h</code>.',
      'Vérifier l\'utilisation du disque par répertoire : <code>du -sh /chemin/</code>.',
      'Lister les périphériques de bloc : <code>lsblk</code>.',
      'Monter et démonter des systèmes de fichiers : <code>mount</code> et <code>umount</code>.',
      'Afficher le type de système de fichiers : <code>df -T</code>.',
    ],
    details: 'Une bonne gestion de l\'espace disque est vitale pour la performance et la stabilité du système. Comprendre les systèmes de fichiers est la première étape.'
  },
  17: {
    id: 17,
    isPremium: true,
    icon: '🔑', // Key for permissions
    title: 'Permissions avancées et Sudo',
    summary: 'Applique des permissions granulaires et exécute des commandes avec des privilèges élevés en toute sécurité.',
    steps: [
      'Comprendre les permissions numériques (rwx = 7, rw- = 6, r-x = 5, etc.).',
      'Modifier les permissions avec <code>chmod</code> (mode numérique et symbolique).',
      'Changer le propriétaire et le groupe d\'un fichier : <code>chown</code> et <code>chgrp</code>.',
      'Exécuter des commandes en tant que root avec <code>sudo</code>.',
      'Éditer le fichier <code>/etc/sudoers</code> avec <code>visudo</code>.',
      'Définir le masque de création de fichiers par défaut : <code>umask</code>.',
    ],
    details: 'La sécurité du système repose en grande partie sur une gestion rigoureuse des permissions et l\'utilisation judicieuse de sudo.'
  },
  18: {
    id: 18,
    isPremium: true,
    icon: '🌐', // Globe for network security
    title: 'Sécurité réseau et reconnaissance',
    summary: 'Explore les bases de la sécurité réseau, les outils de scan et l\'éthique du hacking.',
    steps: [
      'Récupérer des informations sur un domaine : <code>whois example.com</code>.',
      'Scanner les ports d\'une machine : <code>nmap localhost</code> (à utiliser avec prudence).',
      'Comprendre les risques liés à l\'utilisation non autorisée d\'outils de scan.',
      'Principes éthiques : toujours demander l\'autorisation avant de scanner un réseau qui ne vous appartient pas.',
      'Introduction aux pare-feu (<code>ufw</code>, <code>iptables</code> - conceptuel).',
    ],
    details: 'La connaissance des outils de sécurité est essentielle pour se défendre. L\'éthique est primordiale dans le monde de la cybersécurité.'
  },
  19: {
    id: 19,
    isPremium: true,
    icon: '🗃️', // Card index for archiving
    title: 'Archivage avancé et synchronisation',
    summary: 'Maîtrise les techniques avancées d\'archivage et de synchronisation de fichiers.',
    steps: [
      'Utiliser <code>rsync</code> pour la synchronisation de fichiers locaux et distants.',
      'Créer des archives incrémentielles avec <code>tar</code>.',
      'Gérer les permissions et les attributs lors de l\'archivage.',
      'Utiliser <code>dd</code> pour copier des blocs de données (avec extrême prudence).',
    ],
    details: 'Des techniques d\'archivage et de synchronisation robustes sont cruciales pour la gestion des données et la reprise après sinistre.'
  },
  20: {
    id: 20,
    isPremium: true,
    icon: '🤖', // Robot for automation
    title: 'Scripting Bash avancé',
    summary: 'Écris des scripts Bash complexes pour automatiser des tâches d\'administration système.',
    steps: [
      'Variables, conditions (<code>if</code>, <code>else</code>), boucles (<code>for</code>, <code>while</code>) en Bash.',
      'Fonctions Bash et passage de paramètres.',
      'Gestion des erreurs et codes de retour.',
      'Interaction avec l\'utilisateur (<code>read</code>).',
      'Création de scripts robustes pour l\'administration quotidienne.',
    ],
    details: 'Le scripting Bash est l\'outil ultime pour automatiser et personnaliser votre environnement Linux. C\'est la clé pour devenir un administrateur système efficace.'
  },
};

export const lessonIds = Object.keys(lessons).map(Number);