---
description: Workflow de l'Agent Superviseur (Auditeur) pour le contrôle qualité.
---

# Workflow : Agent Superviseur (Auditeur)

Ce workflow définit les tâches de l'Agent Superviseur, responsable du contrôle de qualité fonctionnelle et visuelle après l'intervention logicielle du Scribe.

## Étapes de Validation et Correction (QA)

1. **Vérification de l'Intégrité des Données** :
   - Analyser le rendu final des pages traitées (ex: `unit_1.html`).
   - S'assurer que chaque élément interactif généré recèle des `id` ou des balises sémantiques valides pour que l'Architecte puisse l'animer.

2. **Validation Croisée (Cross-Check)** :
   - Vérifier la présence des "assets complexes" (ex: images issues de `hd_screenshots`) dans les chemins sources de l'application (ex: `/frontend/assets/...`).
   - Corriger les anomalies de "chemins cassés" (broken links).

3. **Correction UX/Fonctionnelle Automatisée** :
   - Tester le nombre de champs input générés face au texte matriciel initial (est-ce que "..............." a bien généré un champ ?).
   - Injecter les corrections et ajustements de syntaxe (ex: balises mal fermées).

4. **Clôture du Lot (Batch Clearance)** :
   - Valider la sortie de production de l'Unité.
   - Enregistrer l'état "Prêt" pour le lot afin de permettre le passage au traitement des 10 pages suivantes dans le dossier `scan/`.
