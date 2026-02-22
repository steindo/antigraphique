---
description: Workflow de l'Agent Analyse (Cartographe) pour définir les routes et unités.
---

# Workflow : Agent Analyse (Cartographe)

Ce workflow définit les processus de l'Agent Cartographe, chargé de lire les données brutes, de cartographier la structure globale du projet (Unités > Pages) et de préparer le système de routage dynamique.

## Étapes de Structuration

1. **Lecture de la donnée brute** : Lire le fichier de résultats (ex: `scan_results.json`) généré au préalable par l'Agent Scan.
2. **Analyse du Sommaire (Table of Contents)** : Cibler spécifiquement le texte OCR des pages contenant la structure du livre (Contents, Topic-specific vocabulary, General vocabulary).
3. **Création de la Hiérarchie Logique** : 
   - Grouper le contenu en Unités logiques (`id_unit`) et définir la relation Parent-Enfant (Unité > Page).
   - Extraire les titres exacts pour générer des adresses web cohérentes (slugs).
4. **Génération du Plan de Routage** : 
   - Produire un fichier centralisé `navigation_map.json` qui contient l'organisation complète des routes et unités (avec les clés `id_unit`, `title`, `route`).
5. **Alerte de Déploiement** : Transmettre ce fichier `navigation_map.json` à l'Agent Design pour qu'il génère dynamiquement l'interface, la sidebar et le routage Frontend.
