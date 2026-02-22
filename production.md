# Système Antigraphique - Fichier de Référence (production.md)

## Résumé du Projet
Le système "Antigraphique" est une architecture multi-agents conçue pour convertir des livres papiers scannés en une Application Web Interactive de haute qualité. Le système est conçu pour atteindre une scalabilité infinie avec une interface 100% dynamique, automatisant le traitement, l'analyse, la structuration et la restitution interactive du texte et des images grâce à la collaboration de 5 agents spécialisés.

## Fiche Technique des Agents

### 1. Agent Analyse (Cartographe)
- **Rôle** : Cartographier et structurer.
- **Fonctionnement** : Délimite les unités logiques du livre (chapitres, leçons, sections) et signale à l'Agent Design les paramètres nécessaires pour créer le système de routes dynamiques.

### 2. Agent Design (Architecte)
- **Rôle** : UI/UX et infrastructure visuelle.
- **Fonctionnement** : Met en place une interface 100% dynamique et adaptative. 
- **Modules clés** : 
  - Sidebar flottante (apparaissant au survol).
  - Menu Paramètres modulaire (Couleur, Police d'écriture, Luminosité).
  - Dashboard Performance (suivi contextuel ou global).

### 3. Agent Scan (Batch Manager)
- **Rôle** : Traitement massif des données brutes en pipeline.
- **Fonctionnement** : 
  - Surveille en continu le dossier `/antigraphique/scan/`.
  - Extrait et gère l'avancement par **lots de 10 fichiers**.
  - Exécute l'OCR sur les zones textuelles.
  - Produit et isole des screenshots HD des éléments complexes ne pouvant être interprétés de façon fiable en texte (tableaux, schémas, illustrations expertes).

### 4. Agent Retranscription (Scribe)
- **Rôle** : Mise en page et interactivité.
- **Fonctionnement** : Injecte le texte de l'OCR et les screenshots HD dans les composants React/Web générés par le Design. Identifie les éléments de pratique et rend les exercices interactifs (champs de saisie, validation, correction).

### 5. Agent Superviseur (Auditeur)
- **Rôle** : Contrôle Qualité (QA) et débogage.
- **Fonctionnement** : Analyse la fidélité visuelle et fonctionnelle entre la page source (scan) et le composant web rendu. Identifie les incohérences et corrige les bugs automatiquement avant la validation finale du lot.

## Protocole du Dossier `/scan`
- **Chemin cible** : `/antigraphique/scan/`
- **Comportement réseau/système** : Traitement exclusif par lots de 10 (batch processing). Cette contrainte de flux sécurise la mémoire, permet d'éviter la surcharge CPU lors des processus OCR/Screenshots et maintient un rendu ordonné.
- **Cycle** : Surveillance → Détection de nouveau Lot → OCR + Capture HD → Délégation au Scribe.

## Schéma de la Base de Données

Le modèle d'architecture de l'information suit un principe d'imbrication (Unité > Page > Contenu) pour supporter la scalabilité :

- **1. Unité (Unit)**
  - `id_unit` : Identifiant unique.
  - `title` : Nom de l'unité (ex: Chapitre 1).
  - `route` : Adresse de navigation dynamique.
  
- **2. Page (Page)**
  - `id_page` : Identifiant unique.
  - `id_unit` : Clé étrangère liant la page à son unité.
  - `page_number` : Numéro de la page source.
  
- **3. Contenu (Content)**
  - `id_content` : Identifiant unique.
  - `id_page` : Clé étrangère liant le contenu à sa page d'appartenance.
  - `type` : Enum [ "TEXT_OCR", "IMAGE_HD", "INTERACTIVE_EXERCISE" ].
  - `data` : Payload du contenu (chaîne de texte, chemin `/assets/...` vers l'image HD, ou données JSON de l'exercice interactif).
  - `order` : Index de positionnement dans la page (Top to Bottom).
