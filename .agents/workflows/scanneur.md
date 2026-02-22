---
description: Workflow de l'Agent Scan (Batch Manager) pour traiter le dossier /antigraphique/scan/
---

# Workflow : Agent Scan (Batch Manager)

Ce workflow définit les étapes pour surveiller le dossier `/antigraphique/scan/` et traiter les images par lots de 10.

## Étapes de Traitement

1. **Surveillance du dossier** : Vérifier la présence de nouveaux fichiers dans `/antigraphique/scan/`.
2. **Création d'un lot (Batch)** : Sélectionner les 10 prochains fichiers à traiter afin de préserver les ressources.
3. **Traitement par lot** :
   - Pour chaque fichier du lot :
     - Exécuter l'OCR pour extraire le texte existant.
     - Identifier les éléments complexes (tableaux, schémas, illustrations expertes).
     - Prendre des screenshots HD de ces éléments complexes et sauvegarder localement.
4. **Transmission** : Envoyer les résultats formattés (texte OCR + chemins d'accès des screenshots HD) à l'Agent Retranscription (Scribe) pour intégration.
