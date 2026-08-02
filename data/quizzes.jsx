import { matchesCommand, fsEntryExists, fsFileContentIncludes, normalizeCommand, parseCommand } from '../utils/quizHelpers';

export const quizzes = {
  1: [
    {
      type: 'terminal',
      question: 'Quelle commande affiche le dossier courant ?', // This is a conceptual question, no validation needed for terminal
    },
    {
      type: 'terminal',
      question: 'Dans le simulateur, tape `pwd` pour afficher le dossier courant.',
      commands: ['pwd', 'help'],
      initialFiles: {},
      expected: 'pwd',
      explanation: 'Dans un vrai terminal, `pwd` affiche le chemin du répertoire courant. C’est le bon réflexe pour se repérer.',
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'pwd'),
      expectedCommand: 'pwd',
    },
    {
      type: 'terminal',
      question: 'Tom cherche son dossier personnel. Tape la commande qui lui permet d’y aller rapidement.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'cd ~', 'cd /home/user'), // Assuming 'user' is the default user in simulator
      expectedCommand: 'cd ~',
      explanation: "`cd ~` vous envoie dans votre dossier personnel. C’est la manière la plus simple de revenir à la base quand on est perdu.",
    },
    {
      type: 'terminal',
      question: 'Tape la commande `ls` avec l\'option qui montre aussi les fichiers cachés.',
      initialFiles: { '.hidden_file': '' },
      validate: (typedCommand, output, fs) => {
        const normalized = normalizeCommand(typedCommand);
        return normalized.startsWith('ls') && (normalized.includes('-a') || normalized.includes('-l -a'));
      },
      expectedCommand: 'ls -a',
      explanation: "`ls -a` affiche tous les fichiers, y compris ceux dont le nom commence par `.`. Très utile pour voir les fichiers de configuration cachés.",
    },
    {
      type: 'terminal',
      question: 'Tu veux voir uniquement les noms de fichiers dans le dossier courant. Tape la commande que tu utilises.',
      initialFiles: { 'file1.txt': '', 'folder1': { type: 'dir' } },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ls'),
      expectedCommand: 'ls',
      explanation: "`ls` liste simplement les fichiers et dossiers du répertoire courant. C’est la commande basique pour explorer un répertoire.",
    },
    {
      type: 'terminal',
      question: 'Tape la commande `ls` avec l\'option qui liste les fichiers avec détails et permissions.',
      initialFiles: { 'file.txt': '' },
      validate: (typedCommand, output, fs) => {
        const normalized = normalizeCommand(typedCommand);
        return normalized.startsWith('ls') && (normalized.includes('-l') || normalized.includes('-a -l'));
      },
      expectedCommand: 'ls -l',
      explanation: "`ls -l` affiche le contenu avec permissions, proprietaire, taille et date. Pratique pour vérifier rapidement qui peut lire ou modifier un fichier.",
    },
  ],
  2: [
    {
      type: 'terminal',
      question: 'Quelle commande crée un dossier ?', explanation: "`mkdir nom_dossier` crée un répertoire. Pour créer des arborescences, utilisez `mkdir -p parent/enfant`.", validate: (typedCommand, output, fs) => {
        const { cmd, args } = parseCommand(typedCommand);
        return cmd === 'mkdir' && args.length > 0 && fsEntryExists(fs, `/${args[0]}`, 'dir');
      },
      expectedCommand: 'mkdir nom_dossier',
    },
    {
      type: 'terminal',
      question: 'Comment supprimer un fichier ?', explanation: "`rm fichier` supprime un fichier. Attention : c'est définitif (sauf avec des sauvegardes). Pour supprimer des dossiers, utilisez `rm -r`.", initialFiles: { 'file_to_delete.txt': '' },
      validate: (typedCommand, output, fs) => {
        const { cmd, args } = parseCommand(typedCommand);
        return cmd === 'rm' && args.includes('file_to_delete.txt') && !fsEntryExists(fs, '/file_to_delete.txt');
      },
      expectedCommand: 'rm file_to_delete.txt',
    },
    {
      explanation: "`mkdir -p` crée tous les dossiers manquants dans l’arborescence. Pratique pour gagner du temps et éviter des erreurs.", type: 'terminal', question: 'Marc veut créer un dossier `projet` et un sous-dossier `code` en une seule fois. Tape la commande correcte.', initialFiles: {},
      validate: (typedCommand, output, fs) => {
        return matchesCommand(typedCommand, 'mkdir -p projet/code') && fsEntryExists(fs, '/projet/code', 'dir');
      },
      expectedCommand: 'mkdir -p projet/code',
        "`mkdir -p` crée tous les dossiers manquants dans l’arborescence. Pratique pour gagner du temps et éviter des erreurs.",
    },
    {
      explanation: "`touch fichier` crée un fichier vide si celui-ci n’existe pas déjà, ou met à jour sa date de modification.", type: 'terminal', question: 'Une fois dans `documents`, tape la commande qui crée un fichier vide `note.txt`.', initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'touch note.txt') && fsEntryExists(fs, '/note.txt', 'file'),
      expectedCommand: 'touch note.txt',
        "`touch fichier` crée un fichier vide si celui-ci n’existe pas déjà, ou met à jour sa date de modification.",
    },
    {
      type: 'terminal',
      question: 'Tu dois supprimer un dossier appelé `old_project` et tous ses fichiers. Tape la commande que tu utilises.',
      initialFiles: { 'old_project/file.txt': '' },
      validate: (typedCommand, output, fs) => {
        return matchesCommand(typedCommand, 'rm -r old_project') && !fsEntryExists(fs, '/old_project');
      },
      expectedCommand: 'rm -r old_project',
        "`rm -r dossier` supprime le dossier et son contenu récursivement. `rmdir` ne fonctionne que si le dossier est vide.",
    },
    {
      type: 'terminal',
      question: 'Crée un fichier `note.txt` dans le dossier courant en utilisant la ligne de commande.',
      commands: ['touch', 'ls', 'cat', 'help'],
      initialFiles: {},
      expected: 'file:note.txt',
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'touch note.txt') && fsEntryExists(fs, '/note.txt', 'file'),
      expectedCommand: 'touch note.txt',
      explanation: 'Utilise `touch note.txt` pour créer un fichier vide. Vérifie ensuite avec `ls` ou `cat`.',
    },
  ],
  3: [
    {
      type: 'terminal',
      question: 'Quelle commande change le dossier courant ?', explanation: "`cd chemin` vous déplace vers un autre répertoire. `cd ..` remonte d'un niveau et `cd -` revient au précédent.",
    },
    {
      type: 'terminal',
      question: 'Comment afficher le contenu d’un fichier texte ?',
      explanation: "`cat fichier` affiche le contenu. Pour des fichiers longs, préférez `less` ou `more` pour naviguer page par page.",
      initialFiles: { 'test.txt': 'hello' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'cat test.txt') && output.includes('hello'),
      expectedCommand: 'cat test.txt',
    },
    {
      type: 'terminal',
      question: 'Tom est dans un sous-dossier et veut revenir au dossier parent. Tape la commande qu\'il doit exécuter.',
      initialFiles: { 'folder/subfolder/file.txt': '' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'cd ..'),
      expectedCommand: 'cd ..',
      explanation: "`cd ..` remonte d’un niveau dans l’arborescence. C’est la commande standard pour passer au dossier parent.",
    },
    {
      type: 'terminal',
      question: 'Tu veux afficher le chemin absolu du répertoire courant. Tape la commande que tu utilises.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'pwd'),
      expectedCommand: 'pwd',
      explanation: "`pwd` montre le chemin complet du dossier dans lequel vous êtes. C’est utile pour vérifier votre emplacement exact.",
    },
    {
      type: 'terminal',
      question: 'Tape la commande qui permet de voir rapidement si tu es dans `/home/user`.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'pwd'),
      expectedCommand: 'pwd',
      explanation: "`pwd` indique directement le chemin courant, sans modifier l’état du terminal.",
    },
    {
      type: 'terminal',
      question: 'Affiche les 5 premières lignes du fichier `log.txt`.',
      initialFiles: { 'log.txt': 'line1\nline2\nline3\nline4\nline5\nline6\nline7' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'head -n 5 log.txt') && output.includes('line5') && !output.includes('line6'),
      expectedCommand: 'head -n 5 log.txt',
      explanation: '`head -n 5 log.txt` affiche les 5 premières lignes du fichier. `head` est utile pour les débuts de fichiers.',
    },
    {
      type: 'terminal',
      question: 'Affiche les 3 dernières lignes du fichier `data.csv`.',
      initialFiles: { 'data.csv': 'header\nitem1\nitem2\nitem3\nitem4\nitem5' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'tail -n 3 data.csv') && output.includes('item3\nitem4\nitem5'),
      expectedCommand: 'tail -n 3 data.csv',
      explanation: '`tail -n 3 data.csv` affiche les 3 dernières lignes du fichier. `tail` est souvent utilisé pour les logs.',
    },
  ],
  4: [
    {
      type: 'terminal',
      question: 'Quelle commande montre les permissions d’un fichier ? ', explanation: "`ls -l` affiche les permissions, le propriétaire et le groupe. Les permissions se lisent comme `rwx` pour read/write/execute.", initialFiles: { 'file.txt': '' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ls -l file.txt') && output.includes('-rw-r--r--'),
      expectedCommand: 'ls -l file.txt',
    },
    {
      type: 'terminal',
      question: 'Comment modifier les permissions pour être exécutable ?', explanation: "`chmod +x fichier` ajoute la permission exécutable sans changer les autres permissions. Évitez `chmod 777` car il donne trop de droits.", initialFiles: { 'script.sh': '' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'chmod +x script.sh'), // Simulator doesn't show permissions change directly
      expectedCommand: 'chmod +x script.sh',
    },
    {
      question: 'Tu veux donner au groupe la permission de lecture sur un fichier. Quelle commande est adaptée ?',
      explanation:
      initialFiles: { 'file.txt': '' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'chmod g+r file.txt'),
      expectedCommand: 'chmod g+r file.txt',
        "`chmod g+r fichier` ajoute la permission de lecture au groupe sans toucher aux autres droits.",
    },
    {
      question: 'Quelle commande affiche le propriétaire et le groupe d’un fichier ?',
      explanation:
      initialFiles: { 'file.txt': '' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ls -l file.txt') && output.includes('user group'),
      expectedCommand: 'ls -l file.txt',
        "`ls -l` montre déjà le propriétaire et le groupe. Pour plus de détails, on peut aussi utiliser `stat fichier`.",
    },
    {
      question: 'Alice veut rendre un script exécutable uniquement pour elle. Quelle commande doit-elle utiliser ?',
      explanation:
      initialFiles: { 'script.sh': '' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'chmod u+x script.sh'),
      expectedCommand: 'chmod u+x script.sh',
        "`chmod u+x` ajoute l’exécution pour l’utilisateur propriétaire seulement, ce qui est plus sûr.",
    },
  ],
  5: [
    {
      question: 'Quelle commande recherche un mot-clé dans un fichier ?',
      explanation: "`grep 'mot' fichier` recherche les lignes contenant 'mot'. Combinez avec `-r` pour rechercher dans les dossiers.",
      initialFiles: { 'test.txt': 'hello world' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'grep hello test.txt') && output.includes('hello world'),
      expectedCommand: 'grep hello test.txt',
    },
    {
      type: 'terminal',
      question: 'Comment afficher l’historique des commandes ?',
      explanation: "`history` liste les commandes précédemment exécutées. Utilise `!n` pour ré-exécuter la commande numéro n ou `!!` pour la dernière.",
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'history') && output.includes('1  history'),
      expectedCommand: 'history',
    },
    {
      type: 'terminal',
      question: 'Luc veut trouver un fichier nommé `rapport.txt` dans son dossier courant et sous-dossiers. Tape la commande qu\'il utilise.',
      initialFiles: { 'subdir/rapport.txt': '' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'find . -name rapport.txt') && output.includes('./subdir/rapport.txt'),
      expectedCommand: 'find . -name rapport.txt',
      explanation: "`find . -name rapport.txt` recherche récursivement à partir du dossier courant un fichier portant ce nom.",
    },
    {
      type: 'terminal',
      question: 'Tu veux filtrer les lignes contenant `erreur` dans le fichier `app.log`. Tape la commande la plus adaptée.',
      initialFiles: { 'app.log': 'INFO: App started\nERROR: Something went wrong\nWARNING: Low disk space' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'grep erreur app.log') && output.includes('ERROR: Something went wrong'),
      expectedCommand: 'grep erreur app.log',
      explanation: '`grep "erreur" app.log` cherche le mot dans le fichier. Pour une recherche récursive, ajoutez `-R`.',
    },
    {
      type: 'terminal',
      question: 'Tape la commande pour afficher les 5 dernières commandes de ton historique.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'history') && output.split('\n').filter(line => line.trim() !== '').length >= 5, // Check if history has at least 5 entries
      expectedCommand: 'history',
      explanation: "`history` montre les commandes précédemment exécutées. Pour filtrer, on peut utiliser `history | tail -n 5` mais le simulateur ne supporte pas les pipes.",
    },
  ],
  6: [
    {
      question: 'Quelle commande liste les processus en cours d’exécution ?',
      explanation: '`ps` (process status) affiche les processus actifs. `ps aux` est une variation courante pour voir tous les processus de tous les utilisateurs.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ps') && output.includes('ps'),
      expectedCommand: 'ps',
    },
    {
      type: 'terminal',
      question: 'Pour voir les processus qui se mettent à jour en temps réel, quelle commande utiliser ?',
      explanation: '`top` fournit une vue dynamique en temps réel des processus en cours d’exécution sur un système.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'top'),
      expectedCommand: 'top',
    },
    {
      type: 'terminal',
      question: 'Comment arrêter un processus en connaissant son PID (Process ID) ?',
      explanation: 'La commande `kill` envoie un signal à un processus. Par défaut, elle envoie le signal TERM (terminate) pour demander au processus de s’arrêter.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'kill 1234'), // Any PID
      expectedCommand: 'kill [PID]',
    },
    {
      question: 'Vous voulez trouver le PID d’un processus nommé `nginx`. Quelle commande est la plus efficace ?',
      explanation: '`ps aux` liste tous les processus. Dans un vrai terminal, on utiliserait un pipe avec `grep` pour filtrer : `ps aux | grep nginx`.', type: 'terminal',
      question: 'Vous voulez trouver le PID d’un processus nommé `nginx`. Tape la commande la plus efficace (le simulateur ne supporte pas les pipes, donc simule la recherche).',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ps aux') && output.includes('nginx'), // Simplified for simulator
      expectedCommand: 'ps aux',
      explanation: '`ps aux` liste tous les processus. Dans un vrai terminal, on utiliserait un pipe avec `grep` pour filtrer : `ps aux | grep nginx`.',
    },
  ],
  9: [
    { // This was lesson 7, now it's lesson 9
      type: 'terminal',
      question: 'Quelle commande permet de créer un nouvel utilisateur ?',
      explanation: '`useradd` est la commande de bas niveau pour ajouter un utilisateur. `adduser` est un script plus convivial qui utilise `useradd` en arrière-plan.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo useradd newuser'),
      expectedCommand: 'sudo useradd [nom_utilisateur]',
    },
    {
      type: 'terminal',
      question: 'Crée un nouvel utilisateur nommé `devops` (tu devras utiliser `sudo`).',
      commands: ['sudo useradd -m devops', 'sudo passwd devops', 'id devops'],
      initialFiles: {},
      expected: 'devops', // Expected to see 'devops' in output of 'id devops'
      explanation: 'La commande `sudo useradd -m devops` crée l\'utilisateur `devops` et son répertoire personnel. `sudo passwd devops` permet de lui attribuer un mot de passe.',
    },
    {
      type: 'terminal',
      question: 'Comment ajouter un utilisateur existant au groupe `sudo` ?',
      explanation: '`usermod -aG` ajoute l\'utilisateur au groupe spécifié sans le retirer de ses autres groupes. `-a` pour append, `-G` pour group.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo usermod -a -g sudo user', 'sudo usermod -ag sudo user', 'sudo usermod -g a sudo user'),
      expectedCommand: 'sudo usermod -aG sudo [nom_utilisateur]',
    },
    {
      type: 'terminal',
      question: 'Quelle commande affiche les groupes auxquels appartient l\'utilisateur `admin` ?',
      explanation: 'La commande `groups` affiche les groupes d\'un utilisateur. `id` affiche également les informations de l\'utilisateur, y compris les groupes.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'groups admin'),
      expectedCommand: 'groups [nom_utilisateur]',
    },
    {
      type: 'terminal',
      question: 'Pour supprimer un utilisateur et son répertoire personnel, quelle commande utiliser ?',
      explanation: '`userdel -r` supprime l\'utilisateur et son répertoire personnel. Sans `-r`, seul le compte utilisateur est supprimé, laissant les fichiers orphelins.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo userdel -r user'),
      expectedCommand: 'sudo userdel -r [nom_utilisateur]',
    },
  ],
  10: [
    { // This was lesson 13, now it's lesson 10
      type: 'terminal',
      question: 'Quelle commande permet de créer une archive `archive.tar` à partir de `dossier/` ?',
      explanation: '`tar -cvf` crée (`c`), affiche les fichiers traités (`v` pour verbose) et spécifie le nom du fichier d\'archive (`f`).',
      initialFiles: { 'dossier/file.txt': '' },
      validate: (typedCommand, output, fs) => {
        const normalized = normalizeCommand(typedCommand);
        return (
          (normalized.includes('tar -c -v -f archive.tar dossier') || normalized.includes('tar -c -f -v archive.tar dossier')) &&
          fsEntryExists(fs, '/archive.tar', 'file')
        );
      },
      expectedCommand: 'tar -cvf archive.tar dossier/',
    },
    {
      type: 'terminal',
      question: 'Crée un dossier `backup` puis archive-le dans `backup.tar` (utilise `tar -cvf`).', commands: ['mkdir backup', 'touch backup/file1.txt', 'tar -cvf backup.tar backup/'], initialFiles: {},
      expected: 'backup.tar', // Expected to see backup.tar created
      explanation: '`mkdir backup` crée le dossier, puis `tar -cvf backup.tar backup/` l\'archive. Vérifie avec `ls`.',
    },
    {
      type: 'terminal',
      question: 'Comment décompresser un fichier `document.txt.gz` ?',
      explanation: '`gunzip` est la commande dédiée à la décompression des fichiers `.gz`.',
      initialFiles: { 'document.txt.gz': 'compressed content' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'gunzip document.txt.gz') && !fsEntryExists(fs, '/document.txt.gz') && fsEntryExists(fs, '/document.txt', 'file'),
      expectedCommand: 'gunzip document.txt.gz',
    },
    {
      type: 'terminal',
      question: 'Quelle commande permet de créer une archive compressée `photos.tar.gz` à partir du dossier `photos/` ?',
      explanation: '`tar -czvf` crée (`c`), compresse avec gzip (`z`), affiche les fichiers (`v`) et spécifie le nom du fichier (`f`).',
      initialFiles: { 'photos/img.jpg': '' },
      validate: (typedCommand, output, fs) => {
        const normalized = normalizeCommand(typedCommand);
        return (
          (normalized.includes('tar -c -z -v -f photos.tar.gz photos') || normalized.includes('tar -c -f -z -v photos.tar.gz photos')) &&
          fsEntryExists(fs, '/photos.tar.gz', 'file')
        );
      },
      expectedCommand: 'tar -czvf photos.tar.gz photos/',
    },
    {
      type: 'terminal',
      question: 'Pour extraire une archive `data.zip`, quelle commande utiliser ?',
      explanation: '`unzip` est la commande standard pour extraire les archives au format `.zip`.',
      initialFiles: { 'data.zip': 'zip content' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'unzip data.zip') && fsEntryExists(fs, '/data', 'dir'), // Assuming unzip creates a folder named 'data'
      expectedCommand: 'unzip data.zip',
    },
  ],
  11: [
    {
      type: 'terminal',
      question: 'Quelle commande permet de remplacer toutes les occurrences de "erreur" par "warning" dans `log.txt` ?',
      explanation: '`sed \'s/motif/remplacement/g\'` est la syntaxe classique pour la substitution. Le `g` à la fin signifie "global", pour toutes les occurrences sur la ligne.',
      initialFiles: { 'log.txt': 'erreur 1\nerreur 2' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sed \'s/erreur/warning/g\' log.txt') && output.includes('warning 1\nwarning 2'),
      expectedCommand: 'sed \'s/erreur/warning/g\' log.txt',
    },
    {
      type: 'terminal',
      question: 'Dans `data.txt` (contenant "ligne 1\nligne 2"), remplace "ligne" par "item" et affiche le résultat.',
      commands: ['sed \'s/ligne/item/g\' data.txt'],
      initialFiles: { 'data.txt': 'ligne 1\nligne 2' },
      expected: 'item 1\nitem 2',
      explanation: '`sed \'s/ligne/item/g\' data.txt` effectue la substitution et affiche le résultat sur la sortie standard.',
    },
    {
      type: 'terminal',
      question: 'Comment afficher uniquement la première colonne d\'un fichier `users.csv` (séparateur espace) ?',
      explanation: '`awk \'{print $1}\'` affiche la première colonne. `$1` représente le premier champ, `$2` le deuxième, etc.',
      initialFiles: { 'users.csv': 'user1 123\nuser2 456' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'awk \'{print $1}\' users.csv') && output.includes('user1\nuser2'),
      expectedCommand: 'awk \'{print $1}\' users.csv',
    },
    {
      type: 'terminal',
      question: 'Quelle expression régulière `grep` correspond aux lignes qui commencent par "START" ?',
      explanation: 'Le caractère `^` ancre la recherche au début de la ligne.',
      initialFiles: { 'file.log': 'START line\nmiddle line\nEND line' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'grep "^start" file.log') && output.includes('START line') && !output.includes('middle line'),
      expectedCommand: 'grep "^START" file.log',
    },
    {
      type: 'terminal',
      question: 'Pour afficher les lignes de `report.txt` qui contiennent "error" ou "warning", quelle commande utiliser ?',
      explanation: 'L\'option `-E` (ou `egrep`) permet d\'utiliser les expressions régulières étendues, où `|` signifie "OU".',
      initialFiles: { 'report.txt': 'INFO\nERROR line\nWARNING line' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'grep -e "error|warning" report.txt') && output.includes('ERROR line') && output.includes('WARNING line'),
      expectedCommand: 'grep -E "error|warning" report.txt',
    },
  ],
  12: [
    { // This was lesson 15, now it's lesson 12
      type: 'terminal',
      question: 'Quelle commande permet de vérifier le statut d\'un service systemd ?',
      explanation: '`systemctl status` affiche l\'état actuel d\'un service, s\'il est actif, inactif, en échec, etc.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'systemctl status nginx'),
      expectedCommand: 'systemctl status [nom_service]',
    },
    {
      type: 'terminal',
      question: 'Simule le démarrage du service `nginx` (utilise `sudo systemctl start nginx`).',
      commands: ['sudo systemctl start nginx'],
      initialFiles: {},
      expected: 'nginx.service - A high performance web server and a reverse proxy server', // This is still used by the simulator's default success check
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo systemctl start nginx'),
      expectedCommand: 'sudo systemctl start nginx',
      explanation: '`sudo systemctl start nginx` démarre le service Nginx. En général, `sudo` est requis pour gérer les services système.',
    },
    {
      type: 'terminal',
      question: 'Comment faire en sorte qu\'un service `apache2` démarre automatiquement au boot ?',
      explanation: '`systemctl enable` crée un lien symbolique qui assure que le service sera démarré au prochain boot.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo systemctl enable apache2'),
      expectedCommand: 'sudo systemctl enable apache2',
    },
    {
      type: 'terminal',
      question: 'Pour afficher les logs d\'un service `sshd` en temps réel, quelle commande utiliser ?',
      explanation: '`journalctl -u` affiche les logs d\'une unité systemd spécifique, et `-f` (follow) permet de voir les nouvelles entrées en temps réel.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'journalctl -u sshd -f'),
      expectedCommand: 'journalctl -u sshd -f',
    },
    {
      type: 'terminal',
      question: 'Quelle commande permet d\'arrêter un service `mysql` ?',
      explanation: '`sudo systemctl stop` arrête un service géré par systemd.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo systemctl stop mysql'),
      expectedCommand: 'sudo systemctl stop mysql',
    },
  ],
  13: [
    { // This was lesson 16, now it's lesson 13
      type: 'terminal',
      question: 'Quelle commande permet de tester la connectivité réseau vers `google.com` ?',
      explanation: '`ping` envoie des paquets ICMP à une destination et mesure le temps de réponse, utile pour vérifier la connectivité.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ping google.com'),
      expectedCommand: 'ping google.com',
    },
    {
      type: 'terminal',
      question: 'Affiche les adresses IP de tes interfaces réseau (utilise `ip a`).',
      commands: ['ip a'],
      initialFiles: {},
      expected: 'inet 127.0.0.1/8 scope host lo',
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ip a') && output.includes('inet 127.0.0.1'),
      expectedCommand: 'ip a',
      explanation: '`ip a` (ou `ip addr show`) affiche les adresses IP et les détails de toutes les interfaces réseau.',
    },
    {
      type: 'terminal',
      question: 'Comment effectuer une requête HTTP GET vers `example.com` depuis le terminal ?',
      explanation: '`curl` est un outil polyvalent pour transférer des données avec des URL, supportant de nombreux protocoles dont HTTP.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'curl example.com'),
      expectedCommand: 'curl example.com',
    },
    {
      type: 'terminal',
      question: 'Quelle commande liste les connexions réseau actives (sockets) ?',
      explanation: '`ss` (socket statistics) est une commande moderne pour inspecter les sockets. `-t` (TCP), `-u` (UDP), `-l` (listening), `-n` (numérique). `netstat` est une alternative plus ancienne.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ss -t -u -l -n') || matchesCommand(typedCommand, 'netstat -t -u -l -n'),
      expectedCommand: 'ss -tuln',
    },
    {
      type: 'terminal',
      question: 'Pour voir le chemin que prennent les paquets pour atteindre `facebook.com`, quelle commande utiliser ?',
      explanation: '`traceroute` affiche la liste des routeurs (hops) par lesquels passent les paquets pour atteindre une destination.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'traceroute facebook.com'),
      expectedCommand: 'traceroute facebook.com',
    },
  ],
  14: [
    { // This was lesson 17, now it's lesson 14
      type: 'terminal',
      question: 'Comment surveiller un fichier de log en temps réel ?',
      explanation: '`tail -f` (follow) affiche les dernières lignes d\'un fichier et continue d\'afficher les nouvelles lignes au fur et à mesure qu\'elles sont ajoutées.',
      initialFiles: { 'log.txt': 'line1\nline2' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'tail -f log.txt'),
      expectedCommand: 'tail -f log.txt',
    },
    {
      type: 'terminal',
      question: 'Affiche les messages du noyau (utilise `dmesg`).',
      commands: ['dmesg'],
      initialFiles: {},
      expected: 'Linux version',
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'dmesg') && output.includes('Linux version'),
      expectedCommand: 'dmesg',
      explanation: '`dmesg` affiche le tampon de messages du noyau, utile pour diagnostiquer les problèmes matériels ou de démarrage.',
    },
    {
      type: 'terminal',
      question: 'Pour naviguer efficacement dans un très grand fichier de log, quelle commande est la plus adaptée ?',
      explanation: '`less` permet de visualiser un fichier page par page, de rechercher du texte et de naviguer sans charger tout le fichier en mémoire, contrairement à `cat`.',
      initialFiles: { 'biglog.txt': 'line1\n'.repeat(100) },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'less biglog.txt'),
      expectedCommand: 'less biglog.txt',
    },
    {
      type: 'terminal',
      question: 'Quelle commande affiche le contenu du fichier `/var/log/syslog` ?',
      explanation: '`cat` est la commande de base pour afficher le contenu d\'un fichier. Pour les fichiers longs, `less` est préférable.',
      initialFiles: { '/var/log/syslog': 'log content' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'cat /var/log/syslog') && output.includes('log content'),
      expectedCommand: 'cat /var/log/syslog',
    },
    {
      type: 'terminal',
      question: 'Pour filtrer les lignes contenant "failed" dans `/var/log/auth.log`, quelle commande utiliser ?',
      explanation: '`grep` est l\'outil idéal pour rechercher des motifs de texte dans des fichiers.',
      initialFiles: { '/var/log/auth.log': 'login failed\nsuccess' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'grep failed /var/log/auth.log') && output.includes('login failed'),
      expectedCommand: 'grep "failed" /var/log/auth.log',
    },
  ],
  15: [
    { // This was lesson 18, now it's lesson 15
      type: 'terminal',
      question: 'Quelle commande affiche l\'espace disque utilisé et disponible de manière lisible ?',
      explanation: '`df -h` (disk free - human readable) affiche l\'utilisation de l\'espace disque pour les systèmes de fichiers montés, avec des tailles lisibles (Go, Mo).',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'df -h'),
      expectedCommand: 'df -h',
    },
    {
      type: 'terminal',
      question: 'Affiche la taille du dossier courant de manière lisible (utilise `du -sh .`).',
      commands: ['du -sh .'],
      initialFiles: { 'file1.txt': 'content', 'subdir/file2.txt': 'more content' },
      expected: 'K',
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'du -s -h .') && output.match(/\d+[KMGT]/),
      expectedCommand: 'du -sh .',
      explanation: '`du -sh .` (disk usage - summarize human readable) affiche la taille totale du répertoire courant.',
    },
    {
      type: 'terminal',
      question: 'Quel est le rôle de la commande `mount` ?',
      explanation: '`mount` attache un système de fichiers (d\'un disque, d\'une partition, d\'un partage réseau) à un point de montage dans l\'arborescence du système.',
      initialFiles: {},
    },
    {
      type: 'terminal',
      question: 'Quelle commande liste les périphériques de bloc (disques, partitions) ?',
      explanation: '`lsblk` (list block devices) affiche les informations sur les périphériques de stockage de manière arborescente.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'lsblk'),
      expectedCommand: 'lsblk',
    },
    {
      type: 'terminal',
      question: 'Pour afficher le type de système de fichiers (ext4, xfs, etc.) des partitions, quelle option de `df` utiliser ?',
      explanation: '`df -T` inclut la colonne "Type" qui indique le type de système de fichiers.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'df -t'),
      expectedCommand: 'df -T',
    },
  ],
  16: [
    { // This was lesson 19, now it's lesson 16
      type: 'terminal',
      question: 'Que signifie la permission numérique `755` pour un fichier ?',
      explanation: '7 (rwx) pour le propriétaire, 5 (r-x) pour le groupe, 5 (r-x) pour les autres. `r=4, w=2, x=1`.',
      initialFiles: {},
    },
    {
      type: 'terminal',
      question: 'Crée un fichier `script.sh` puis donne-lui les permissions `700` (lisible, écrivable, exécutable pour le propriétaire seulement).',
      commands: ['touch script.sh', 'chmod 700 script.sh', 'ls -l script.sh'],
      initialFiles: {},
      expected: '-rwx------',
      validate: (typedCommand, output, fs) => {
        const normalized = normalizeCommand(typedCommand);
        return (
          (matchesCommand(typedCommand, 'touch script.sh') && fsEntryExists(fs, '/script.sh', 'file')) ||
          (matchesCommand(typedCommand, 'chmod 700 script.sh') && output.includes('-rwx------')) // Simulator output for chmod is 'Permissions modifiées (simulé)'
        );
      },
      expectedCommand: 'chmod 700 script.sh',
      explanation: '`chmod 700 script.sh` donne les permissions `rwx` (4+2+1=7) au propriétaire et aucune aux autres.',
    },
    {
      type: 'terminal',
      question: 'Quelle commande permet d\'exécuter une commande avec les privilèges de l\'utilisateur root ?',
      explanation: '`sudo` (superuser do) permet à un utilisateur autorisé d\'exécuter des commandes en tant que superutilisateur ou un autre utilisateur.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo apt update'),
      expectedCommand: 'sudo [commande]',
    },
    {
      type: 'terminal',
      question: 'Le fichier `/etc/sudoers` est utilisé pour configurer `sudo`. Quelle commande est recommandée pour l\'éditer ?',
      explanation: '`visudo` est l\'outil sûr pour éditer `/etc/sudoers`. Il vérifie la syntaxe avant d\'enregistrer, évitant de bloquer l\'accès `sudo`.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'sudo visudo'),
      expectedCommand: 'sudo visudo',
    },
    {
      type: 'terminal',
      question: 'Quelle commande affiche ou définit le masque de création de fichiers par défaut ?',
      explanation: '`umask` détermine les permissions par défaut des nouveaux fichiers et répertoires créés.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'umask'),
      expectedCommand: 'umask',
    },
  ],
  17: [
    { // This was lesson 20, now it's lesson 17
      type: 'terminal',
      question: 'Quelle commande permet de récupérer des informations publiques sur un nom de domaine ?',
      explanation: '`whois` interroge les bases de données publiques pour obtenir des informations sur l\'enregistrement d\'un domaine (propriétaire, dates, serveurs DNS).',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'whois example.com'),
      expectedCommand: 'whois [domaine]',
    },
    {
      type: 'terminal',
      question: 'Simule un scan de ports sur la machine locale (utilise `nmap localhost`).',
      commands: ['nmap localhost'],
      initialFiles: {},
      expected: 'Nmap scan report for localhost',
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'nmap localhost') && output.includes('Nmap scan report for localhost'),
      expectedCommand: 'nmap localhost',
      explanation: '`nmap` est un outil puissant de découverte de réseau et d\'audit de sécurité. `localhost` cible votre propre machine.',
    },
    {
      type: 'terminal',
      question: 'Quel est le principal risque d\'utiliser `nmap` sur un réseau sans autorisation ?',
      explanation: 'Scanner un réseau sans autorisation est souvent considéré comme une tentative d\'intrusion et peut entraîner des conséquences légales ou la suspension de votre accès.',
      initialFiles: {},
    },
    {
      type: 'terminal',
      question: 'Dans le contexte de la cybersécurité, pourquoi est-il important de comprendre les outils comme `nmap` ?',
      explanation: 'Connaître les outils des attaquants permet de mieux anticiper et de renforcer la sécurité de ses propres infrastructures.',
      initialFiles: {},
    },
    {
      type: 'terminal',
      question: 'Quel est le principe éthique fondamental lors de l\'utilisation d\'outils de reconnaissance réseau ?',
      explanation: 'Le respect de la vie privée et de la propriété d\'autrui est primordial. Toujours obtenir un consentement explicite avant toute activité de scan.',
      initialFiles: {},
    },
  ],
  18: [
    { // New quiz for lesson 18 (Archivage avancé et synchronisation)
      type: 'terminal',
      question: 'Quelle commande permet de synchroniser des fichiers de manière efficace ?',
      explanation: '`rsync` est un outil puissant pour la synchronisation incrémentielle de fichiers, localement ou à distance.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'rsync -avz source/ destination/'),
      expectedCommand: 'rsync -avz [source] [destination]',
    },
    {
      type: 'terminal',
      question: 'Crée une archive `backup.tar` du dossier `data/` et ajoute-y un nouveau fichier `new_file.txt` (simulé).',
      commands: ['tar -cvf backup.tar data/', 'touch data/new_file.txt', 'tar -rvf backup.tar data/new_file.txt'],
      initialFiles: { 'data/old_file.txt': '' },
      expected: 'backup.tar',
      explanation: '`tar -r` permet d\'ajouter des fichiers à une archive existante.',
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'tar -rvf backup.tar data/new_file.txt') && fsEntryExists(fs, '/backup.tar', 'file'),
      expectedCommand: 'tar -rvf backup.tar data/new_file.txt',
    },
    {
      type: 'terminal',
      question: 'Quelle option de `tar` permet de conserver les permissions et les dates lors de l\'extraction ?',
      explanation: 'L\'option `-p` (preserve-permissions) de `tar` permet de conserver les permissions originales des fichiers lors de l\'extraction.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'tar -xpf archive.tar'),
      expectedCommand: 'tar -xpf [archive.tar]',
    },
    {
      type: 'terminal',
      question: 'Pour copier un disque entier bloc par bloc, quelle commande utiliser (avec prudence) ?',
      explanation: '`dd` est une commande de bas niveau pour copier des données brutes. Elle est très puissante mais dangereuse si mal utilisée.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'dd if=/dev/sda of=/dev/sdb'),
      expectedCommand: 'dd if=[source] of=[destination]',
    },
    {
      type: 'terminal',
      question: 'Comment vérifier l\'intégrité d\'une archive `archive.tar.gz` sans l\'extraire ?',
      explanation: '`tar -tzf` permet de lister le contenu d\'une archive compressée sans l\'extraire, ce qui peut servir de vérification basique.',
      initialFiles: { 'archive.tar.gz': 'compressed content' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'tar -tzf archive.tar.gz'),
      expectedCommand: 'tar -tzf archive.tar.gz',
    },
  ],
  19: [
    { // New quiz for lesson 19 (Scripting Bash avancé)
      type: 'terminal',
      question: 'Déclare une variable `NOM` avec la valeur "Linux" en Bash.',
      explanation: 'En Bash, les variables sont déclarées sans `$` et assignées avec `=`.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'NOM="Linux"'),
      expectedCommand: 'NOM="Linux"',
    },
    {
      type: 'terminal',
      question: 'Affiche la valeur de la variable `NOM` que tu viens de créer.',
      explanation: 'Pour accéder à la valeur d\'une variable, on utilise le `$` devant son nom.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'echo $NOM') && output.includes('Linux'),
      expectedCommand: 'echo $NOM',
    },
    {
      type: 'terminal',
      question: 'Écris une condition `if` qui vérifie si le dossier `/tmp` existe.',
      explanation: 'La commande `test -d /tmp` ou `[ -d /tmp ]` vérifie si `/tmp` est un dossier.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => typedCommand.includes('if [ -d /tmp ]') || typedCommand.includes('if test -d /tmp'),
      expectedCommand: 'if [ -d /tmp ]',
    },
    {
      type: 'terminal',
      question: 'Crée une boucle `for` qui affiche les nombres de 1 à 3.',
      explanation: 'Une boucle `for` peut itérer sur une séquence de nombres ou d\'éléments.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => typedCommand.includes('for i in 1 2 3') || typedCommand.includes('for i in {1..3}'),
      expectedCommand: 'for i in 1 2 3',
    },
    {
      type: 'terminal',
      question: 'Déclare une fonction Bash nommée `bonjour` qui affiche "Bonjour le monde !".',
      explanation: 'Les fonctions Bash sont déclarées avec `function nom { ... }` ou `nom() { ... }`.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => typedCommand.includes('function bonjour') || typedCommand.includes('bonjour()'),
      expectedCommand: 'function bonjour { echo "Bonjour le monde !" }',
    },
  ],
  20: [
    { // New quiz for lesson 20 (Scripting Bash avancé - suite)
      type: 'terminal',
      question: 'Écris un script simple qui prend un nom en argument et affiche "Bonjour, [Nom] !".',
      explanation: 'Les arguments d\'un script sont accessibles via `$1`, `$2`, etc.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => typedCommand.includes('echo "Bonjour, $1 !"'),
      expectedCommand: 'echo "Bonjour, $1 !"',
    },
    {
      type: 'terminal',
      question: 'Comment vérifier le code de retour de la dernière commande exécutée ?',
      explanation: 'La variable spéciale `$?` contient le code de retour de la dernière commande.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'echo $?'),
      expectedCommand: 'echo $?',
    },
    {
      type: 'terminal',
      question: 'Crée un fichier `log.txt` et redirige la sortie de `ls -l` vers ce fichier.',
      explanation: 'L\'opérateur `>` redirige la sortie standard vers un fichier, écrasant son contenu.',
      initialFiles: {},
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'ls -l > log.txt') && fsFileContentIncludes(fs, '/log.txt', 'total'),
      expectedCommand: 'ls -l > log.txt',
    },
    {
      type: 'terminal',
      question: 'Ajoute la sortie de `pwd` à la fin du fichier `log.txt` sans écraser son contenu.',
      explanation: 'L\'opérateur `>>` redirige la sortie standard et l\'ajoute à la fin du fichier.',
      initialFiles: { 'log.txt': 'initial content\n' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, 'pwd >> log.txt') && fsFileContentIncludes(fs, '/log.txt', 'initial content\n/'),
      expectedCommand: 'pwd >> log.txt',
    },
    {
      type: 'terminal',
      question: 'Exécute un script nommé `my_script.sh` qui se trouve dans le dossier courant.',
      explanation: 'Pour exécuter un script dans le dossier courant, il faut spécifier son chemin relatif `./`.',
      initialFiles: { 'my_script.sh': '#!/bin/bash\necho "Script exécuté"' },
      validate: (typedCommand, output, fs) => matchesCommand(typedCommand, './my_script.sh') && output.includes('Script exécuté'),
      expectedCommand: './my_script.sh',
    },
  ],
}
