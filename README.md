# Site Vitrine - Département d'Informatique EFREI

## Description du projet

Ce projet consiste en la création d'un site vitrine web pour le département d'informatique de l'EFREI Paris. Le site a été développé dans le cadre du module de Programmation Web (HTML5, CSS3, JavaScript) et respecte strictement les contraintes du cahier des charges.

## Objectifs

Le site a pour objectifs de :
- Informer les futurs étudiants sur les formations proposées et leurs débouchés
- Présenter l'équipe enseignante, les domaines d'expertise et la recherche
- Mettre en avant les statistiques d'insertion professionnelle
- Communiquer sur les actualités, événements et clubs du département
- Faciliter le contact avec l'école et la compréhension des admissions

##  Technologies utilisées

- **HTML5** : Structure sémantique des pages
- **CSS3** : Style, mise en page et design responsive (media queries, viewport)
- **JavaScript** : Interactivité et fonctionnalités dynamiques
- **Git** : Gestion de versions et collaboration

**Contraintes respectées :**
- ❌ Aucun framework ou bibliothèque externe
- ❌ PHP interdit
- ✅ Code vanilla JavaScript uniquement
- ✅ Validation W3C complète (toutes les pages validées sans erreur)

## Structure du projet

```
WebProject-Efrei/
├── assets/
│   ├── css/
│   │   └── style.css          # Styles CSS principaux
│   ├── img/                   # Images et logo
│   └── js/
│       ├── back-to-top.js     # Bouton retour en haut
│       ├── barnav.js          # Indicateur de navigation animé
│       ├── carousel.js         # Carrousel d'images
│       ├── chatbot.js          # Chatbot interactif
│       ├── contact-form.js     # Gestion du formulaire de contact
│       ├── counter-animation.js # Animations de compteurs
│       └── navigation.js       # Menu mobile responsive
├── actualites.html            # Page actualités & calendrier
├── contact-apropos.html       # Page contact & à propos
├── equipe-enseignante.html    # Page équipe enseignante
├── formations.html            # Page formations
├── index.html                 # Page d'accueil
├── intent.json                # Base de connaissances du chatbot
├── presentation.html           # Page présentation générale
├── stats-debouches.html       # Page statistiques & débouchés
└── README.md                  # Ce fichier
```

## Pages du site

1. **Accueil** (`index.html`) : Page d'accueil avec carrousel, présentation du département et chiffres clés
2. **Présentation générale** (`presentation.html`) : Vue d'ensemble du département
3. **Formations** (`formations.html`) : Détails des formations proposées
4. **Équipe enseignante** (`equipe-enseignante.html`) : Présentation des enseignants
5. **Statistiques & débouchés** (`stats-debouches.html`) : Données sur l'insertion professionnelle
6. **Actualités & calendrier** (`actualites.html`) : Événements et actualités
7. **Contact & à propos** (`contact-apropos.html`) : Formulaire de contact et informations sur le projet

## Fonctionnalités JavaScript

### Navigation interactive
- **Menu mobile responsive** : Menu hamburger avec animation, gestion du scroll, fermeture au clic ou avec Escape
- **Indicateur de navigation animé** : Barre visuelle qui se déplace sous le lien actif avec transition fluide
- **Détection automatique de la page active** : Mise en évidence automatique du lien correspondant

### Carrousel d'images
- Défilement automatique toutes les 5 secondes
- Navigation manuelle via boutons précédent/suivant
- Indicateurs cliquables pour accès direct à une image
- Pause automatique au survol
- Navigation au clavier (flèches gauche/droite)

### Chatbot interactif
- Assistant virtuel accessible depuis toutes les pages
- Algorithme de détection d'intentions (similarité de Levenshtein)
- Base de connaissances chargée depuis `intent.json`
- Interface de chat avec animations et historique des messages
- Réponses contextuelles sur les formations, admissions, débouchés, etc.

### Formulaire de contact
- Validation côté client des champs obligatoires
- Popup de confirmation animée après envoi
- Gestion des états (bouton désactivé pendant l'envoi)
- Fermeture intuitive (bouton, overlay, touche Escape)

### Animations de compteurs
- Animation progressive des chiffres clés lors du scroll
- Utilisation de l'Intersection Observer API
- Préservation des formats originaux (≈, +, %, etc.)
- Délai progressif pour un effet visuel agréable

### Bouton retour en haut
- Affichage conditionnel après 300px de scroll
- Scroll fluide vers le haut avec animation
- Optimisation des performances (debounce)

## ✅ Respect du cahier des charges

- ✅ **Validation W3C** : Toutes les pages validées sans erreur ni avertissement
- ✅ **HTML5, CSS3, JavaScript** : Technologies exclusives, sans PHP ni frameworks
- ✅ **Design responsive** : Media queries et viewport pour mobile, tablette et desktop
- ✅ **Structure du site** : Arborescence limitée à 2 niveaux
- ✅ **Navigation** : En-tête et footer présents sur toutes les pages
- ✅ **Logo EFREI** : Présent sur toutes les pages via l'en-tête
- ✅ **Gestion Git** : Projet versionné avec dépôt GitHub partagé
- ✅ **Formulaires et tableaux** : Implémentés avec validation JavaScript
- ✅ **Créativité** : Animations CSS/JS, chatbot, carrousel, etc.

## Équipe projet

- **Grégoire BELLEPERCHE** : Développeur Frontend / Design
  - Intégration des maquettes, HTML5/CSS3
  - Charte graphique et cohérence visuelle
  - Adaptation responsive

- **Thomas QUERREC** : Développeur Frontend / Logique JavaScript
  - Scripts JavaScript pour l'interactivité
  - Organisation du code et structuration des fichiers
  - Gestion des fonctionnalités dynamiques

## Liens

- **Dépôt GitHub** : [https://github.com/gregipoux/WebProject-Efrei.git](https://github.com/gregipoux/WebProject-Efrei.git)

## Notes

- Le projet est entièrement développé en vanilla JavaScript (sans frameworks)
- Toutes les pages ont été validées par le validateur W3C
- Le code est modulaire, commenté et optimisé pour les performances
- Le site est entièrement responsive et accessible au clavier

---

**Projet réalisé dans le cadre du module Programmation Web - EFREI Paris - 2025**
