---
description: Workflow de l'Agent Design (Architecte) pour l'infrastructure visuelle.
---

# Workflow : Agent Design (Architecte)

Ce workflow définit les tâches de l'Agent Architecte, responsable de créer une interface utilisateur adaptative, moderne et dynamique (scalabilité infinie). 

## Étapes de Conception UI/UX

1. **Intégration du Plan de Routage** : 
   - Lire et analyser le fichier `navigation_map.json` transmis par l'Agent Cartographe.
   - Initialiser la structure globale du projet Frontend (ex: React / Vanilla JS + CSS System).

2. **Création du Layout Principal** : 
   - Définir une architecture d'écran propre et minimaliste (focus sur le contenu pédagogique).
   - Veiller à l'adaptabilité parfaite (responsive design) pour chaque bloc défini.

3. **Développement de la Sidebar Dynamique** : 
   - Utiliser les Unités (`id_unit`, `title`, `route`) du plan de nav pour peupler la navigation latérale.
   - Injecter le comportement "Sidebar au survol" : elle doit se rétracter automatiquement pour libérer l'espace central et s'ouvrir au passage de la souris ou via un toggle.

4. **Implémentation du Menu Paramètres** : 
   - Créer un module flottant modulaire en haut de page.
   - Intégrer les variables dynamiques (CSS Variables) pour manipuler en temps réel :
     - La Couleur (Mode Sombre, Mode Pastel, Mode Zen).
     - La Police d'écriture (typographies modernes type Inter, Roboto, Dyslexic).
     - La Luminosité / Contraste.

5. **Développement du Dashboard Performance** : 
   - Créer l'interface de reporting (Tableau de bord de l'utilisateur).
   - Afficher les métriques pédagogiques prévues pour le suivi visuel (avancement des exercices, score, unité actuelle).

6. **Relais Visuel** : Laisser l'empreinte d'accueil vierge (les *placeholders* centralisés du corps de page) prête pour l'injection textuelle/image par l'Agent Retranscription (Scribe).
