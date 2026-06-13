# Guide de Démarrage et Lancement Local - QuickPoll 🚀

Ce guide détaillé décrit pas à pas les étapes de configuration et de lancement de l'application **QuickPoll** dans votre environnement de développement local, en expliquant le rôle et l'importance de chaque composant technique utilisé (Docker, scripts shell, Next.js, etc.).

Le projet est disponible en open source sur GitHub : [https://github.com/Nehemie-Jacques/QuickPoll-](https://github.com/Nehemie-Jacques/QuickPoll-)

---

## 📋 Table des Matières
1. [Prérequis Système](#1-prérequis-système)
2. [Étapes de Démarrage Détaillées](#2-étapes-de-démarrage-détaillées)
   - [Étape 1 : Installation des dépendances](#étape-1--installation-des-dépendances)
   - [Étape 2 : Configuration des variables d'environnement](#étape-2--configuration-des-variables-denvironnement)
   - [Étape 3 : Lancement de DynamoDB Local via Docker Compose](#étape-3--lancement-de-dynamodb-local-via-docker-compose)
   - [Étape 4 : Initialisation et configuration des tables DynamoDB](#étape-4--initialisation-et-configuration-des-tables-dynamodb)
   - [Étape 5 : Lancement du serveur de développement Next.js](#étape-5--lancement-du-serveur-de-développement-nextjs)
3. [Exécution des Tests Unitaires (Vitest)](#3-exécution-des-tests-unitaires-vitest)
4. [Assurance Qualité et Linter (ESLint)](#4-assurance-qualité-et-linter-eslint)
5. [Guide de Résolution des Problèmes (Troubleshooting)](#5-guide-de-résolution-des-problèmes-troubleshooting)

---

## 1. Prérequis Système

Avant de procéder au lancement, assurez-vous que les outils suivants sont installés et configurés :
* **Node.js (v22.0.0+)** et **npm** : Nécessaires pour exécuter l'application web Next.js et gérer les dépendances du projet.
* **Docker et Docker Compose** : Indispensables pour instancier localement la base de données Amazon DynamoDB sans avoir besoin de se connecter à AWS.
* **AWS CLI (Facultatif)** : Pratique si vous souhaitez utiliser l'outil en ligne de commande pour interagir avec DynamoDB Local.

---

## 2. Étapes de Démarrage Détaillées

### Étape 1 : Installation des dépendances

La première étape consiste à télécharger et installer l'ensemble des modules Node.js requis pour faire tourner le frontend et le backend de Next.js.

À la racine du projet, exécutez la commande :
```bash
npm install
```
* **Que fait cette étape ?**
  Elle installe les outils d'orchestration à la racine du projet et prépare les dépendances de l'application située dans le dossier `app/` (Next.js, Tailwind CSS, Radix UI, Framer Motion, Vitest, AWS SDK v3, etc.).
* **Pourquoi est-ce nécessaire ?**
  Sans dépendances, l'application Next.js et les scripts de tests ne possèdent pas les bibliothèques logicielles tierces indispensables à leur exécution.

---

### Étape 2 : Configuration des variables d'environnement

L'application a besoin de certains paramètres de configuration pour s'exécuter correctement (clé secrète JWT pour la gestion sans mot de passe, endpoints de base de données, etc.).

Copiez le fichier de modèle vers un fichier de configuration locale :
```bash
cp app/.env.example app/.env.local
```
* **Que fait cette étape ?**
  Elle crée un fichier `.env.local` non versionné dans lequel vous pouvez configurer les clés de développement.
* **Pourquoi est-ce nécessaire ?**
  * Sécurise les secrets applicatifs afin de ne jamais pousser de clés privées sur le dépôt public GitHub.
  * Définit la variable `CREATOR_JWT_SECRET` (utilisée pour générer des tokens JWT signés et sécurisés pour les créateurs de sondages).
  * Dirige les requêtes de base de données vers `DYNAMODB_ENDPOINT=http://localhost:8000` au lieu de tenter de se connecter à l'infrastructure cloud réelle d'AWS.

---

### Étape 3 : Lancement de DynamoDB Local via Docker Compose

QuickPoll utilise Amazon DynamoDB comme base de données persistance. En local, nous utilisons un émulateur officiel fourni par AWS, exécuté dans un conteneur isolé.

Lancez le conteneur Docker :
```bash
npm run db:up
```
* **Que fait cette étape ?**
  Elle appelle Docker Compose pour télécharger et lancer l'image Docker officielle `amazon/dynamodb-local` sur le port `8000` et l'interface d'administration graphique `instructure/dynamodb-admin` sur le port `8001`.
* **Pourquoi est-ce nécessaire ?**
  * **DynamoDB Local** émule le comportement de la base de données de production sans engendrer de coûts AWS et sans dépendre d'une connexion Internet active.
  * **dynamodb-admin** (accessible sur [http://localhost:8001](http://localhost:8001)) fournit une interface graphique de type tableau de bord pour explorer les tables, éditer les entrées et s'assurer du bon fonctionnement des requêtes.

---

### Étape 4 : Initialisation et configuration des tables DynamoDB

Le conteneur DynamoDB vide ne contient par défaut aucune structure de données. Il faut créer les tables nécessaires au schéma de QuickPoll.

Initialisez les tables en lançant le script :
```bash
npm run db:init
```
* **Que fait cette étape ?**
  Elle exécute le script shell `scripts/init-dynamodb-local.sh` qui communique avec l'instance locale DynamoDB. Elle crée deux tables :
  1. `quickpoll-polls` : pour stocker les configurations des sondages (clés, options, dates d'expiration, paramètres).
  2. `quickpoll-votes` : pour stocker les votes individuels de manière chiffrée et indexée.
* **Pourquoi est-ce nécessaire ?**
  Si ces tables ne sont pas préalablement provisionnées avec leurs clés de partition (`HASH`) et clés de tri (`RANGE`) respectives, toutes les requêtes d'écriture et de lecture Next.js échoueront avec des erreurs de base de données.

---

### Étape 5 : Lancement du serveur de développement Next.js

Une fois la base de données prête, vous pouvez lancer l'interface utilisateur et le serveur d'API locaux.

Démarrez le serveur en local :
```bash
npm run dev
```
* **Que fait cette étape ?**
  Elle démarre le serveur Next.js en mode développement sur [http://localhost:3000](http://localhost:3000) en s'appuyant sur **Turbopack**, le moteur de build ultra-rapide écrit en Rust.
* **Pourquoi est-ce nécessaire ?**
  Elle compile dynamiquement les pages, active le *Hot Module Replacement* (HMR) pour appliquer instantanément les modifications de code à l'écran sans rafraîchir la page, et active le serveur d'API local pour écouter les requêtes de vote et de résultats SSE.

---

## 3. Exécuter les Tests Unitaires (Vitest)

L'application comporte des tests unitaires pour valider la logique d'hachage des identifiants des votants, la gestion du cycle de vie et du statut des sondages, etc.

Pour lancer les tests :
```bash
npm test
```
* **Rôle** : Utilise **Vitest** pour valider l'intégrité de la logique métier. C'est l'assurance qu'un changement de style ou de code ne brise pas une règle fonctionnelle majeure (ex: le fait de ne pas pouvoir voter après la date d'expiration).

---

## 4. Assurance Qualité et Linter (ESLint)

Pour maintenir des standards élevés de lisibilité et de conformité du code TypeScript/React, nous utilisons ESLint.

Pour lancer la vérification de syntaxe :
```bash
npm run lint
```
* **Rôle** : Analyse statiquement le code pour détecter les erreurs potentielles, les importations inutilisées et le non-respect des règles de hooks React (comme l'appel d'effets asynchrones provoquant des changements de state non souhaités).

---

## 5. Guide de Résolution des Problèmes (Troubleshooting)

### 🔴 Erreur `ECONNREFUSED 127.0.0.1:8000`
* **Symptôme** : L'application web démarre mais toute tentative de création de sondage ou de vote génère une page d'erreur indiquant une incapacité à joindre la base de données.
* **Résolution** :
  1. Assurez-vous que Docker est allumé.
  2. Exécutez `docker compose ps` à la racine pour vérifier que le service `dynamodb` est dans l'état `Up`.
  3. Si le conteneur n'est pas démarré, lancez `npm run db:up`.
  4. Réinitialisez la base avec `npm run db:init`.

### 🔴 Erreur `Permission denied` lors de l'initialisation des tables
* **Symptôme** : Le terminal refuse de lancer `npm run db:init` avec un message d'erreur de droits.
* **Résolution** : Les fichiers du dossier `scripts/` doivent recevoir les droits d'exécution Unix. Lancez la commande suivante depuis la racine du projet :
  ```bash
  chmod +x scripts/init-dynamodb-local.sh scripts/seed_local.sh
  ```

### 🔴 Problème d'affichage en mode Clair (Light Mode)
* **Symptôme** : Les textes, bordures de cartes ou éléments actifs ne sont pas bien visibles ou ont un mauvais contraste.
* **Résolution** : Grâce aux récentes refontes de styles de QuickPoll, le système se base entièrement sur des variables CSS déclarées dans `app/src/app/globals.css`. Si un problème de contraste subsiste, inspectez l'élément HTML dans le navigateur et vérifiez qu'il utilise bien les styles sémantiques basés sur `var(--text-primary)`, `var(--border-card)`, etc. au lieu de classes Tailwind de couleur en dur (ex: `text-zinc-50` ou `bg-zinc-900`).
