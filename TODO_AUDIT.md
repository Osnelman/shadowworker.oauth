# TODO_AUDIT — ShadowWorker / Linux Quest

## Statut de l’audit

Ce document est la base de travail avant toute correction applicative. Il reflète les anomalies confirmées dans le dépôt local et les éléments de configuration/dépendances observés dans le projet actuel.

> Important : cet audit couvre prioritairement le code source et la configuration du dépôt. Une validation navigateur du site vivant sur Render devra être faite ensuite en environnement prod pour confirmer les effets utilisateur finaux.

---

## 1) Sécurité

- [ ] **[Sévérité: Critique]** Secrets et variables d’environnement non correctement sécurisées dans le dépôt

  Description précise du problème :
  Un fichier de configuration local est présent dans le dépôt : `components/.env.local`. Il contient au moins une clé publique Kkiapay et le mode sandbox. Le dépôt ne contient pas de `.env.example` ni de garde-fou clair pour empêcher l’exposition de clés et variables de runtime dans le code versionné / le build public.

  Fichier(s)/composant(s) concerné(s) :
  - `components/.env.local`
  - `components/PremiumModal.jsx`
  - `context/PremiumContext.jsx`

  Impact utilisateur ou technique :
  Risque de fuite d’information de configuration, incohérence d’environnement, build public exposant des paramètres qui ne devraient pas être versionnés, difficulté de rotation de clés et fuite de configuration métier en production.

  Solution proposée :
  - Supprimer tout fichier `.env*` du dépôt et l’ajouter au `.gitignore`.
  - Déclarer les variables dans le dashboard Render / variable environment uniquement.
  - Ajouter un `.env.example` documenté sans valeurs réelles.
  - Vérifier qu’aucune clé sensible n’est visible dans le build final ni dans le code source.

- [ ] **[Sévérité: Critique]** Vérification du paiement Kkiapay côté client uniquement, sans validation backend robuste

  Description précise du problème :
  Le flux premium appelle `verifyKkiapayPayment` depuis le client via Firebase Functions, mais le code de validation du paiement n’est pas présent dans le dépôt et le flux dépend fortement d’un appel client-vers-serveur sans garde-fou validé dans le code versionné. Le modèle actuel ne garantit pas de manière suffisante l’intégrité du paiement ni l’autorisation du premium.

  Fichier(s)/composant(s) concerné(s) :
  - `components/PremiumModal.jsx`
  - `context/PremiumContext.jsx`
  - `data/config.js`

  Impact utilisateur ou technique :
  Possibilité de contournement de paiement, désynchronisation du statut premium, risque de fraude, incohérence entre le statut backend et le UI.

  Solution proposée :
  - Vérifier le paiement via Cloud Function Firebase côté serveur avec validation stricte du montant, de l’ID de transaction, du statut et du callback Kkiapay.
  - Enregistrer le statut premium directement côté backend, pas seulement dans le front.
  - Ne pas faire confiance au client pour “ouvrir” le premium.

- [ ] **[Sévérité: Majeure]** Firebase initialisé directement côté client sans validation du contexte d’exécution ni de sécurité

  Description précise du problème :
  `context/PremiumContext.jsx` initialise Firebase avec des variables `import.meta.env.*` et appelle directement Firestore / Functions depuis le navigateur. Il n’y a ni garde-fou robustes sur la présence des variables, ni documentation de sécurité Firebase, ni règles Firestore dans le dépôt.

  Fichier(s)/composant(s) concerné(s) :
  - `context/PremiumContext.jsx`
  - `data/authConfig.js`
  - `components/.env.local`

  Impact utilisateur ou technique :
  Les données sensibles ou les règles d’accès peuvent être violées, et le frontend peut se casser si les variables d’env ne sont pas présentes.

  Solution proposée :
  - Vérifier les variables requis avant l’initialisation Firebase.
  - Supprimer les accès de type “public write” dans les règles Firestore et documenter une règle minimale autorisant uniquement les utilisateurs authentifiés et les champs attendus.
  - Vérifier les règles de sécurité sur Firebase Console.

---

## 2) Bugs fonctionnels / logique métier

- [ ] **[Sévérité: Critique]** Le router utilise `HashRouter` dans un contexte de production Render qui peut nuire à l’expérience et au SEO

  Description précise du problème :
  Le build utilise `HashRouter` dans `src/main.jsx`, ce qui entraîne des URLs du type `/#/home`. Sur Render, cela fonctionne, mais c’est moins propre, peut casser les liens externes et limite le SEO / partages sociaux.

  Fichier(s)/composant(s) concerné(s) :
  - `src/main.jsx`
  - `routes/AppRoutes.jsx`

  Impact utilisateur ou technique :
  Navigation moins naturelle, liens non standard, mauvais comportement pour le partage / indexation, moins professionnalisme commercial.

  Solution proposée :
  - Évaluer une migration vers `BrowserRouter` si le hosting Render est configuré avec rewrite SPA.
  - Garder `HashRouter` seulement s’il y a une contrainte technique explicite ; sinon le retirer.

- [ ] **[Sévérité: Majeure]** Absence de validation et de cohérence des données sauvegardées dans `localStorage`

  Description précise du problème :
  `context/GameContext.jsx` lit et écrit des structures localStorage sans robustesse de validation. Les valeurs sont supposées, mais aucun schéma ni migration n’est défini. En cas de corruption, d’upgrade de version ou de données cassées, l’application peut se retrouver dans un état incohérent.

  Fichier(s)/composant(s) concerné(s) :
  - `context/GameContext.jsx`

  Impact utilisateur ou technique :
  Progression perdue, badges incohérents, niveaux non calculés correctement, bugs “mystérieux” après sauvegarde locale problématique.

  Solution proposée :
  - Valider le payload JSON avant usage.
  - Introduire des migrations versionnées du state.
  - Définir des valeurs par défaut explicites et des guards pour `undefined` / `NaN` / données non conformes.

- [ ] **[Sévérité: Majeure]** Gestion de progression / badges / login streak potentiellement incohérente

  Description précise du problème :
  La logique de streak, de niveaux, de badges et de transfert de progression invité vers utilisateur semble être faite côté UI/localStorage sans vérification métier stricte. Il existe des conditions de logique fragiles et un calcul d’XP par niveaux qui n’est pas toujours unifié entre composants.

  Fichier(s)/composant(s) concerné(s) :
  - `context/GameContext.jsx`
  - `context/AuthContext.jsx`

  Impact utilisateur ou technique :
  Incohérence entre les stats affichées et les réalisations du joueur, bonus non applicables, mauvaise sensation de “bug” sur la progression.

  Solution proposée :
  - Centraliser le calcul de progression dans un moteur de jeu unique.
  - Script de validation de l’état (badges, streak, niveaux, xp) avant sauvegarde.
  - Aligner les règles métier sur un modèle unique accepté par toute l’application.

- [ ] **[Sévérité: Majeure]** Absence de protection contre les erreurs Firebase / réseau / variables d’env manquantes

  Description précise du problème :
  L’app ne semble pas vérifier localement les variables Firebase et ne gère pas les erreurs de connexion de manière explicite dans plusieurs endroits. `PremiumContext` gère l’erreur dans `catch`, mais le contexte global n’a pas de fallback UX clair pour les utilisateurs.

  Fichier(s)/composant(s) concerné(s) :
  - `context/PremiumContext.jsx`
  - `context/AuthContext.jsx`

  Impact utilisateur ou technique :
  L’application peut montrer un comportement flou, un premium impossible à vérifier, un statut incohérent ou un message implicite en production.

  Solution proposée :
  - Ajouter un état “fatal config error” si Firebase est absent ou invalide.
  - Afficher un message explicite et bloquer les features dépendantes.
  - Ajouter des logs structurés côté production.

---

## 3) Performance / dépendances / sécurité logicielle

- [ ] **[Sévérité: Majeure]** Vulnérabilités de dépendances détectées par `npm audit`

  Description précise du problème :
  Le scan `npm audit --json` montre des vulnérabilités modérées dans `firebase` / `@firebase/*` et au moins un risque de type XSS / open redirect sur le bundle `@remix-run/router` / `react-router-dom`.

  Fichier(s)/composant(s) concerné(s) :
  - `package.json`
  - `package-lock.json`

  Impact utilisateur ou technique :
  Risque de sécurité, parcours de navigation potentiellement dangereux, fragilité de la dépendance front sous les versions actives.

  Solution proposée :
  - Mettre à jour `react-router-dom` vers la version stable la plus récente compatible.
  - Mettre à jour Firebase et les sous-dépendances ciblées.
  - Re-exécuter `npm audit` après chaque montée de version et documenter les exceptions restantes.

- [ ] **[Sévérité: Mineure]** Dépendances probablement obsolètes / non optimisées pour le build de production

  Description précise du problème :
  Le projet dépend de `firebase` ainsi que d’un ensemble de packages UI/animation. Sans audit complet des dépendances directes / transitive, le projet peut utiliser des versions qui ne sont ni les plus stables ni les plus compactes pour une production Web moderne.

  Fichier(s)/composant(s) concerné(s) :
  - `package.json`
  - `package-lock.json`

  Impact utilisateur ou technique :
  Bundle plus lourd, bugs de compatibilité, temps de chargement plus longs, coût d’entretien plus élevé.

  Solution proposée :
  - Faire un audit dependency review complet.
  - Mettre à jour les packages critiques.
  - Vérifier les bundles Vite et le poids de build dans Render.

---

## 4) UX / UI / accessibilité / SEO

- [ ] **[Sévérité: Majeure]** La version actuelle semble peu robuste pour un produit “pro” en production

  Description précise du problème :
  Le design global a une identité forte, mais les composants présentent des régressions possibles d’UX et de cohérence, notamment autour du routing hash, des modales premium, des messages d’erreur peu standardisés et de la navigation sur mobile.

  Fichier(s)/composant(s) concerné(s) :
  - `components/PremiumModal.jsx`
  - `pages/*`
  - `styles/index.css`

  Impact utilisateur ou technique :
  Le produit peut sembler “prototype” au lieu d’être un produit premium crédible.

  Solution proposée :
  - Standardiser les modales, états de chargement, messages d’erreur et feedback utilisateur.
  - Harmoniser les composants de navigation et l’espacement.
  - Vérifier le rendu sur mobile/tablette/desktop de chaque parcours critique.

- [ ] **[Sévérité: Mineure]** Accessibilité HTML insuffisante sur certains éléments interactifs

  Description précise du problème :
  Le code contient beaucoup d’éléments interactifs, modales et boutons sans validation de focus/aria/contrastes suffisants. Le projet semble avoir une base visuelle, mais pas une couverture accessibilité suffisante pour un site public sérieux.

  Fichier(s)/composant(s) concerné(s) :
  - `components/*`
  - `pages/*`
  - `styles/index.css`

  Impact utilisateur ou technique :
  Réduction de l’accessibilité pour clavier/souris, malvoyants, navigation assistive.

  Solution proposée :
  - Vérifier les contrastes, aria-label, focus visible, modales accessibles, alt text, états disabled et navigation clavier.

- [ ] **[Sévérité: Mineure]** SEO basique insuffisant pour un produit public / commercial

  Description précise du problème :
  Le projet est probablement une SPA React. Sans métadonnées HTML explicites, sans `title` / `meta description` dynamiques et sans gestion SEO des routes, il est peu crédible comme site public livré à des utilisateurs.

  Fichier(s)/composant(s) concerné(s) :
  - `index.html`
  - `src/main.jsx`
  - `App.jsx`

  Impact utilisateur ou technique :
  Partage social peu propre, mauvais référencement naturel, perception “non mature” du produit.

  Solution proposée :
  - Ajouter title / meta description / Open Graph / favicon complets.
  - Vérifier que les routes publiques sont bien rendues sur le host final.

---

## 5) Paiement / premium / achats

- [ ] **[Sévérité: Critique]** Le flux premium nécessite une sécurisation réelle du statut d’accès

  Description précise du problème :
  Le code du front affiche un accès premium, mais la persistance de ce statut est seulement partiellement contrôlée côté client / Firestore. Sans validation serveur et sans logique de sanction, le flux ne peut être crédible en production.

  Fichier(s)/composant(s) concerné(s) :
  - `context/PremiumContext.jsx`
  - `components/PremiumModal.jsx`
  - `components/ProtectedRoutePremium.jsx`

  Impact utilisateur ou technique :
  Déblocage frauduleux, contenu verrouillé accessible sans achat réel, mauvais signal de confiance pour les clients.

  Solution proposée :
  - Refaire le flux premium sur base backend validée.
  - Vérifier le temps de paiement, le statut de transaction et la persistance unique du statut d’accès.

- [ ] **[Sévérité: Majeure]** Le callback de paiement n’est pas suffisamment protégé des cas limites

  Description précise du problème :
  Le modal traite le succès, l’échec et la fermeture de widget ; mais les scénarios “paiement refusé”, “annulé”, “retour réseau”, “erreur serveur” ne sont pas assez standardisés pour un produit premium sérieux.

  Fichier(s)/composant(s) concerné(s) :
  - `components/PremiumModal.jsx`

  Impact utilisateur ou technique :
  Mauvais UX, utilisateurs frustrés, risque de confusion et d’abandon de paiement.

  Solution proposée :
  - Standardiser les messages de statut et les états de retry.
  - Vérifier le flux sur mobile et sur redirection.

---

## 6) Dette technique / architecture / maintenance

- [ ] **[Sévérité: Majeure]** Architecture de state management dispersée et fragile

  Description précise du problème :
  Le projet mélange logique métier, localStorage, composants de navigation, notifications, audio, progression et badges dans plusieurs contextes et fichiers. Cela pouvait fonctionner sur un MVP, mais pour un produit commercial il faut une architecture plus claire.

  Fichier(s)/composant(s) concerné(s) :
  - `context/*`
  - `pages/*`
  - `components/*`

  Impact utilisateur ou technique :
  Bugs de synchronisation, maintenance coûteuse, refactorisation de grosse difficulté.

  Solution proposée :
  - Unifier la logique de progression dans un store central (ex. reducer + service persistance).
  - Séparer l’état métier de l’UI et de la persistance.

- [ ] **[Sévérité: Mineure]** Absence de fichier de config de déploiement Render / documentation d’opération

  Description précise du problème :
  Le dépôt ne contient pas de `render.yaml`, ni de documentation de build/preview/prod, ni de checklist de variables. Cela rend le déploiement moins reproductible et la prod plus dépendante de la mémoire humaine.

  Fichier(s)/composant(s) concerné(s) :
  - `/`
  - `package.json`

  Impact utilisateur ou technique :
  Déploiement fragile, difficulté de rollback, confusion si le build prod diverge de `main`.

  Solution proposée :
  - Ajouter `render.yaml` ou les variables Render correspondantes.
  - Documenter le build command, le publish directory, l’environnement.
  - Ajouter une checklist de déploiement avec validation rapide.

---

## 7) Vérification à faire côté production

- [ ] **[Sévérité: Majeure]** Contrôler si le build prod sur Render correspond bien au dernier état du dépôt

  Description précise du problème :
  Le dépôt local contient des limites évidentes et des commits de correction “Render build error” ; il faut absolument valider qu’il y a bien conformité entre `main` et le service Render actuel.

  Fichier(s)/composant(s) concerné(s) :
  - Git history du dépôt local
  - Config Render (non présente dans le dépôt)

  Impact utilisateur ou technique :
  Le site vivant peut être en retard ou comporter des différences avec le dépôt source.

  Solution proposée :
  - Vérifier le dépôt origin vers le service Render.
  - Comparer le build actuel sur Render avec `main` et valider le commit en production.

- [ ] **[Sévérité: Majeure]** Tester les parcours clés en navigateur réel

  Description précise du problème :
  Le dépôt ne permet pas de valider directement les flux côté navigateur sans exécuter le site en prod. Les parcours critique à tester doivent être explicitement validés.

  Fichier(s)/composant(s) concerné(s) :
  - tous les composants de navigation et de paiement

  Impact utilisateur ou technique :
  Risque de bugs cachés dans le parcours d’inscription, quiz, premium, loot chest, progression.

  Solution proposée :
  - Tester l’authentification (Google / email / guest), le parcours officiel, les achats premium, les routes et le responsive design.
  - Surveiller la console navigateur pour erreurs runtime et warnings.

---

## Priorité de correction recommandée

1. Sécurité / variables d’environnement / paiement premium
2. Vulnérabilités dépendances (Firebase + Router)
3. Validation de la logique de progression et des états de sauvegarde
4. UX / UI / accessibilité / SEO de base
5. Documentation de déploiement Render et validation prod
6. Refactor architecture / state management

---

## Conclusion

Le projet a une base solide sur le plan gameplay et visuel, mais il n’est pas encore prêt pour un niveau “production professionnelle” sans un travail de sécurisation important, de standardisation et de validation du flux premium / Firebase / Render. Le travail de refonte doit être mené par priorité, en commençant par la sécurité et la logique métier, avant toute amélioration d’UI.
