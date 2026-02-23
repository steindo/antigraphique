---
description: Workflow de l'Agent Superviseur (Auditeur) pour le contrôle qualité.
---

# Workflow : Agent Superviseur (Auditeur)

Ce workflow définit les tâches de l'Agent Superviseur, responsable du contrôle de qualité fonctionnelle et visuelle après l'intervention logicielle du Scribe.

## Étapes de Validation et Correction (QA)

1. **Validation de l'Accueil (Home) :**
   - Vérifier que la page `home.html` contient bien les extraits sémantiques de l'auteur (Introduction, Pour qui, Conseils, Guide).

2. **Test des Composants Pédagogiques (Exercices) :**
   - S'assurer que le bouton *Check* permet de valider les réponses saisies dans chaque section d'exercice.
   - S'assurer que le bouton *Correction* révèle la solution pour aider l'étudiant.
   - Contrôler la présence de la balise `<span class="notice">` avec l'icône ampoule (💡) et de l'explication sous chaque titre d'exercice.

3. **Vérification Fonctionnelle et Anti-Fraude :**
   - Analyser le nombre d'inputs interactifs générés (y compris en overlay sur les images).
   - Valider que la logique d'unicité des mots est opérationnelle.

4. **Audit de l'Interface Globale (UI/UX) :**
   - Garantir que la barre de navigation Fixed Footer (`Previous` / `Next`) fonctionne correctement pour synchroniser les pages.
   - Contrôler que la Sidebar (menu de gauche) ne gêne pas la lecture et peut s'ouvrir/fermer (retraction à gauche) à l'aide de l'icône de menu (Toggle `#sidebar-toggle`).

5. **Approbation Finale :**
   - Valider la sortie de production de l'Unité avec 0 erreur.
   - Autoriser le Batch Manager à traiter les 10 pages suivantes dans le dossier `scan/`.
