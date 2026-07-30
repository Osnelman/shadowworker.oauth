export const quizzes = {
  1: [
    {
      question: 'Quelle commande affiche le dossier courant ?', 
      options: ['ls', 'pwd', 'cd'],
      answer: 'pwd',
      explanation:
        "`pwd` (print working directory) affiche le chemin absolu du répertoire où vous vous trouvez. Utile pour savoir votre position avant d'exécuter des commandes affectant des fichiers.",
    },
    {
      type: 'terminal',
      question: 'Dans le simulateur, tape `pwd` pour afficher le dossier courant.',
      commands: ['pwd', 'help'],
      initialFiles: {},
      expected: 'pwd',
      explanation: 'Dans un vrai terminal, `pwd` affiche le chemin du répertoire courant. C’est le bon réflexe pour se repérer.',
    },
    {
      question: 'Tom cherche son dossier personnel. Quelle commande lui permet d’y aller rapidement ?',
      options: ['cd /', 'cd ~', 'pwd'],
      answer: 'cd ~',
      explanation:
        "`cd ~` vous envoie dans votre dossier personnel. C’est la manière la plus simple de revenir à la base quand on est perdu.",
    },
    {
      question: 'Quelle option de `ls` montre aussi les fichiers cachés ?',
      options: ['-a', '-l', '-h'],
      answer: '-a',
      explanation:
        "`ls -a` affiche tous les fichiers, y compris ceux dont le nom commence par `.`. Très utile pour voir les fichiers de configuration cachés.",
    },
    {
      question: 'Tu veux voir uniquement les noms de fichiers dans le dossier courant. Quelle commande utilises-tu ?',
      options: ['ls', 'cat', 'find . -type f'],
      answer: 'ls',
      explanation:
        "`ls` liste simplement les fichiers et dossiers du répertoire courant. C’est la commande basique pour explorer un répertoire.",
    },
    {
      question: 'Quel alias Linux liste les fichiers avec détails et permissions ?',
      options: ['ls -l', 'pwd -l', 'cd -l'],
      answer: 'ls -l',
      explanation:
        "`ls -l` affiche le contenu avec permissions, proprietaire, taille et date. Pratique pour vérifier rapidement qui peut lire ou modifier un fichier.",
    },
  ],
  2: [
    {
      question: 'Quelle commande crée un dossier ?', 
      options: ['mkdir', 'rm', 'cat'],
      answer: 'mkdir',
      explanation: "`mkdir nom_dossier` crée un répertoire. Pour créer des arborescences, utilisez `mkdir -p parent/enfant`.",
    },
    {
      question: 'Comment supprimer un fichier ?',
      options: ['touch file', 'rm file', 'mv file'],
      answer: 'rm file',
      explanation: "`rm fichier` supprime un fichier. Attention : c'est définitif (sauf avec des sauvegardes). Pour supprimer des dossiers, utilisez `rm -r`.",
    },
    {
      question: 'Marc veut créer un dossier et un sous-dossier en une seule fois. Quelle commande est correcte ?',
      options: ['mkdir projet/code', 'mkdir -p projet/code', 'mkdir -r projet/code'],
      answer: 'mkdir -p projet/code',
      explanation:
        "`mkdir -p` crée tous les dossiers manquants dans l’arborescence. Pratique pour gagner du temps et éviter des erreurs.",
    },
    {
      question: 'Une fois dans `documents`, quelle commande crée un fichier vide `note.txt` ?',
      options: ['touch note.txt', 'cat note.txt', 'mkdir note.txt'],
      answer: 'touch note.txt',
      explanation:
        "`touch fichier` crée un fichier vide si celui-ci n’existe pas déjà, ou met à jour sa date de modification.",
    },
    {
      question: 'Tu dois supprimer un dossier appelé `old_project` et tous ses fichiers. Quelle commande utilises-tu ?',
      options: ['rm old_project', 'rm -r old_project', 'rmdir old_project'],
      answer: 'rm -r old_project',
      explanation:
        "`rm -r dossier` supprime le dossier et son contenu récursivement. `rmdir` ne fonctionne que si le dossier est vide.",
    },
    // Example terminal-style challenge (lightweight)
    {
      type: 'terminal',
      question: 'Crée un fichier `note.txt` dans le dossier courant en utilisant la ligne de commande.',
      commands: ['touch', 'ls', 'cat', 'help'],
      initialFiles: {},
      expected: 'file:note.txt',
      explanation: 'Utilise `touch note.txt` pour créer un fichier vide. Vérifie ensuite avec `ls` ou `cat`.',
    },
  ],
  3: [
    {
      question: 'Quelle commande change le dossier courant ?',
      options: ['cd', 'pwd', 'echo'],
      answer: 'cd',
      explanation: "`cd chemin` vous déplace vers un autre répertoire. `cd ..` remonte d'un niveau et `cd -` revient au précédent.",
    },
    {
      question: 'Comment afficher le contenu d’un fichier texte ?',
      options: ['cat', 'grep', 'chmod'],
      answer: 'cat',
      explanation: "`cat fichier` affiche le contenu. Pour des fichiers longs, préférez `less` ou `more` pour naviguer page par page.",
    },
    {
      question: 'Tom veut revenir au dossier précédent. Quelle commande doit-il exécuter ?',
      options: ['cd ..', 'cd ~', 'pwd'],
      answer: 'cd ..',
      explanation:
        "`cd ..` remonte d’un niveau dans l’arborescence. C’est la commande standard pour passer au dossier parent.",
    },
    {
      question: 'Tu veux afficher le chemin absolu du répertoire courant. Quelle commande utilises-tu ?',
      options: ['pwd', 'cd .', 'ls -d'],
      answer: 'pwd',
      explanation:
        "`pwd` montre le chemin complet du dossier dans lequel vous êtes. C’est utile pour vérifier votre emplacement exact.",
    },
    {
      question: 'Quelle commande permet de voir rapidement si tu es dans `/home/user` ?',
      options: ['pwd', 'ls', 'cd /home/user'],
      answer: 'pwd',
      explanation:
        "`pwd` indique directement le chemin courant, sans modifier l’état du terminal.",
    },
  ],
  4: [
    {
      question: 'Quelle commande montre les permissions d’un fichier ? ',
      options: ['chmod', 'ls -l', 'chown'],
      answer: 'ls -l',
      explanation: "`ls -l` affiche les permissions, le propriétaire et le groupe. Les permissions se lisent comme `rwx` pour read/write/execute.",
    },
    {
      question: 'Comment modifier les permissions pour être exécutable ?',
      options: ['chmod +x fichier', 'chmod 777 fichier', 'chmod -r fichier'],
      answer: 'chmod +x fichier',
      explanation: "`chmod +x fichier` ajoute la permission exécutable sans changer les autres permissions. Évitez `chmod 777` car il donne trop de droits.",
    },
    {
      question: 'Tu veux donner au groupe la permission de lecture sur un fichier. Quelle commande est adaptée ?',
      options: ['chmod g+r fichier', 'chmod o+r fichier', 'chmod u+r fichier'],
      answer: 'chmod g+r fichier',
      explanation:
        "`chmod g+r fichier` ajoute la permission de lecture au groupe sans toucher aux autres droits.",
    },
    {
      question: 'Quelle commande affiche le propriétaire et le groupe d’un fichier ?',
      options: ['ls -l', 'chmod -v', 'stat'],
      answer: 'ls -l',
      explanation:
        "`ls -l` montre déjà le propriétaire et le groupe. Pour plus de détails, on peut aussi utiliser `stat fichier`.",
    },
    {
      question: 'Alice veut rendre un script exécutable uniquement pour elle. Quelle commande doit-elle utiliser ?',
      options: ['chmod u+x script.sh', 'chmod a+x script.sh', 'chmod 777 script.sh'],
      answer: 'chmod u+x script.sh',
      explanation:
        "`chmod u+x` ajoute l’exécution pour l’utilisateur propriétaire seulement, ce qui est plus sûr.",
    },
  ],
  5: [
    {
      question: 'Quelle commande recherche un mot-clé dans un fichier ?',
      options: ['find', 'grep', 'awk'],
      answer: 'grep',
      explanation: "`grep 'mot' fichier` recherche les lignes contenant 'mot'. Combinez avec `-r` pour rechercher dans les dossiers.",
    },
    {
      question: 'Comment afficher l’historique des commandes ?',
      options: ['history', 'top', 'date'],
      answer: 'history',
      explanation: "`history` liste les commandes précédemment exécutées. Utilise `!n` pour ré-exécuter la commande numéro n ou `!!` pour la dernière.",
    },
    {
      question: 'Luc veut trouver un fichier nommé `rapport.txt` dans son dossier courant et sous-dossiers. Quelle commande utilise-t-il ?',
      options: ['find . -name rapport.txt', 'grep rapport.txt', 'ls -R | grep rapport.txt'],
      answer: 'find . -name rapport.txt',
      explanation:
        "`find . -name rapport.txt` recherche récursivement à partir du dossier courant un fichier portant ce nom.",
    },
    {
      question: 'Tu veux filtrer les lignes contenant `erreur` dans tous les fichiers `.log`. Quelle commande est la plus adaptée ?',
      options: ['grep -R "erreur" *.log', 'grep "erreur" *.log', 'rm *.log'],
      answer: 'grep "erreur" *.log',
      explanation: '`grep "erreur" *.log` cherche le mot dans tous les fichiers log du dossier. Pour une recherche récursive, ajoutez `-R`.',
    },
    {
      question: 'Quelle combinaison permet de voir les 10 dernières commandes et d’exécuter la dernière fois de nouveau ?',
      options: ['history | tail -n 10 && !!', 'history | tail -n 10 ; !!', 'history !10'],
      answer: 'history | tail -n 10 ; !!',
      explanation:
        "`history | tail -n 10` montre les dix dernières commandes et `!!` ré-exécute la dernière commande.",
    },
  ],
}
