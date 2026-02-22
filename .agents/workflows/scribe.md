---
description: Workflow de l'Agent Retranscription (Scribe) pour l'intégration interactive.
---

# Workflow : Agent Retranscription (Scribe)

Ce workflow détaille la mission du Scribe, qui transforme les données extraites par le Scanneur et structurées par le Cartographe en de véritables cours interactifs affichables dans l'interface de l'Architecte.

## Étapes de Retranscription

1. **Croisement des données** : 
   - Lire `scan_results.json` (données OCR et Screenshots HD) et `navigation_map.json` (Routes/Unités).
   
2. **Identification et Formatage** :
   - Parcourir les pages associées à la première Unité (ex: Unit 1: "Addition, equation & conclusion").
   - Nettoyer le texte OCR brut pour l'organiser en titres, paragraphes et consignes.

3. **Injection des Assets Visuels** :
   - Convertir les instances d'éléments complexes détectés par le Scanneur en balises images HTML (`<img src="...">`) conservant le rendu exact du livre.

4. **Interactivité (Gamification)** :
   - Détecter les exercices (ex: phrases à trous comme `".........."` ou `_______`).
   - Remplacer automatiquement ces trous par des champs interactifs (`<input type="text" class="exercise-input" />`).
   - Préparer les encarts d'instructions et les boutons de validation pour l'utilisateur.

5. **Génération du Rendu** :
   - Sauvegarder ce contenu transformé et structuré dans la base de données ou sous forme de fichier JSON consommé par le Frontend (ex: `/frontend/content/unit_X.json`).
   - Signaler la complétion au Superviseur.
