# QuickPoll 🗳️

**Créez des sondages en quelques secondes. Partagez instantanément. Suivez les résultats en direct.**

QuickPoll est une application web moderne, légère et performante permettant de concevoir et de participer à des sondages en temps réel sans aucune friction (aucun compte requis pour les créateurs ni pour les votants). L'architecture est entièrement conteneurisée et optimisée pour un déploiement sécurisé, scalable et hautement disponible sur Amazon Web Services (AWS) via Terraform, avec un pipeline de déploiement continu automatisé.

Le projet est disponible en open source sur GitHub : [https://github.com/Nehemie-Jacques/QuickPoll-](https://github.com/Nehemie-Jacques/QuickPoll-)

Démo en direct : [https://quick-poll-ba18.vercel.app/](https://quick-poll-ba18.vercel.app/)

> **Note** : en production sur Vercel, définissez `NEXT_PUBLIC_APP_URL=https://quick-poll-ba18.vercel.app` pour que les liens de vote et les QR codes pointent vers l'URL publique (et non `localhost`).

---

## 🌟 Fonctionnalités Principales

* **Zéro Friction** : Créez des sondages instantanément. Un lien administrateur sécurisé (généré via signature de jeton JWT) vous permet de gérer votre sondage sans mot de passe ni compte utilisateur.
* **Diversité de Sondages** :
  * *Choix unique* (Single Choice)
  * *Choix multiple* (Multiple Choice, avec restriction du nombre de choix autorisés)
  * *Évaluation par étoiles* (Rating Scale de 1 à 5 étoiles)
  * *Oui / Non* (Yes / No)
* **Résultats en Direct (Real-time)** : Suivi dynamique des votes grâce aux Server-Sent Events (SSE). Pas de rafraîchissement nécessaire.
* **Fonctionnalités Avancées** :
  * Protection par mot de passe des votes.
  * Collecte et affichage des commentaires des votants en direct.
  * Définition de dates de fin d'expiration (presets 1h, 6h, 24h, 7j, date personnalisée ou illimitée).
  * Système anti-double vote basé sur les adresses IP hachées.
  * Notifications par e-mail optionnelles lors du premier vote sur un sondage (via AWS SES).
* **Partage et Intégration** :
  * Génération de Code QR dynamique pour un partage physique.
  * Copie rapide des liens de vote et d'administration.
  * Bouton de partage rapide sur WhatsApp et X (Twitter).
  * Code d'intégration Iframe fourni pour intégrer le sondage sur un autre site web.
  * Exportation des résultats au format CSV.

---

## 📂 Arborescence Complète du Projet

Voici l'organisation détaillée de l'espace de travail QuickPoll :

```text
quickpoll/
├── .github/                  # Configuration des pipelines d'intégration et déploiement continus
│   └── workflows/
│       ├── ci.yml            # CI : Linting, tests unitaires (Vitest), build Docker et scan de sécurité Trivy
│       └── deploy.yml        # CD : Build de production Docker, push sur AWS ECR et mise à jour forcée d'AWS ECS
│
├── app/                      # Application Next.js 16 (Front-end et API)
│   ├── public/               # Ressources statiques publiques (images, icônes SVG)
│   ├── src/                  # Code source de l'application
│   │   ├── app/              # Structure Next.js App Router
│   │   │   ├── api/          # Endpoints API (Gestion des sondages, votes, flux SSE, exports)
│   │   │   ├── poll/         # Pages dynamiques de l'application (/poll/[id], results, manage)
│   │   │   ├── globals.css   # Styles CSS globaux incluant le design system et les thèmes (Clair/Sombre)
│   │   │   ├── layout.tsx    # Structure de mise en page globale de l'application
│   │   │   └── page.tsx      # Page d'accueil (Créateur de sondage)
│   │   ├── components/       # Composants React modulaires et réutilisables
│   │   │   ├── layout/       # Composants de mise en page (SiteHeader, SiteFooter, Logo)
│   │   │   ├── poll-creator/ # Composants de l'interface de création (PollCreator, AdvancedSettings, presets...)
│   │   │   ├── voting/       # Composants de l'interface de vote (VoteForm, choix, PasswordGate...)
│   │   │   ├── results/      # Composants d'affichage des résultats (ActivityChart, CommentsFeed, Stats...)
│   │   │   ├── manage/       # Composants du tableau de bord d'administration (DangerZone, ResponsesTable...)
│   │   │   └── ui/           # Bibliothèque de composants d'interface bas niveau (Button, Card, Modal, Input...)
│   │   ├── lib/              # Fonctions utilitaires, clients de connexion, et logique métier pure
│   │   │   ├── dynamodb/     # Clients et requêtes DynamoDB (polls.ts, votes.ts, client.ts)
│   │   │   ├── api/          # Utilitaires pour les requêtes HTTP et le formatage des API
│   │   │   ├── poll-status.ts# Détermination du statut (actif, expiré, clos)
│   │   │   └── ...           # Autres utilitaires (JWT, QRCode, formatage du temps, envoi de mails SES)
│   │   └── types/            # Déclarations de types TypeScript partagés (poll.ts, vote.ts)
│   ├── Dockerfile            # Spécification de build de l'image de conteneur de l'application Next.js
│   ├── package.json          # Dépendances et scripts de l'application
│   ├── tailwind.config.ts    # Configuration du framework CSS Tailwind
│   ├── tsconfig.json         # Configuration du compilateur TypeScript
│   └── vitest.config.ts      # Configuration de l'environnement de tests unitaires Vitest
│
├── docs/                     # Guides de documentation technique approfondis
│   ├── GETTING_STARTED.md    # Guide de lancement local et de configuration de développement
│   └── INFRASTRUCTURE.md     # Architecture détaillée des ressources Cloud AWS configurées via Terraform
│
├── infrastructure/           # Code de l'infrastructure cloud AWS (Terraform)
│   ├── modules/              # Modules Terraform encapsulant les services AWS
│   │   ├── alb/              # Application Load Balancer (gestion et routage du trafic)
│   │   ├── cloudfront/       # Réseau CDN CloudFront (mise en cache des fichiers statiques)
│   │   ├── dynamodb/         # Tables DynamoDB chiffrées avec PITR et TTL activés
│   │   ├── ecr/              # Registre privé AWS ECR pour stocker les images Docker de production
│   │   ├── ecs/              # Service ECS Fargate sans serveur (lancement et configuration des conteneurs)
│   │   ├── networking/       # Configuration du VPC (Sous-réseaux Publics/Privés, Route Tables, NAT Gateway)
│   │   └── ses/              # Configuration IAM pour les notifications d'envoi d'emails (Simple Email Service)
│   ├── main.tf               # Fichier principal Terraform orchestrant les différents modules AWS
│   ├── variables.tf          # Déclarations des variables d'entrée de l'infrastructure
│   ├── outputs.tf            # Déclarations des variables de sortie (DNS de l'ALB, URL CloudFront...)
│   └── terraform.tfvars      # Fichier de valeurs des variables d'environnement de production
│
├── scripts/                  # Scripts shell d'automatisation
│   ├── init-dynamodb-local.sh# Script de création des tables pour l'environnement de développement local
│   └── seed_local.sh         # Script de peuplement de données de test en local (facultatif)
│
├── docker-compose.yml        # Orchestration locale pour lancer l'instance DynamoDB locale en conteneur
├── package.json              # Scripts d'orchestration à la racine du projet
└── README.md                 # Ce document de présentation générale
```

---

## 🛠️ Lancement Local Rapide

Pour configurer, lancer et utiliser QuickPoll localement, suivez ces 4 étapes simples :

1. **Installer les dépendances** :
   ```bash
   npm install
   ```
   *Cette commande installe les dépendances requises pour exécuter les tâches d'orchestration racine.*

2. **Configurer l'environnement** :
   ```bash
   cp app/.env.example app/.env.local
   ```
   *Génère les configurations d'environnement de développement pour le backend Next.js.*

3. **Lancer et initialiser la base de données locale** :
   ```bash
   npm run db:up && npm run db:init
   ```
   *Démarre DynamoDB Local dans un conteneur Docker et configure automatiquement les tables et index.*

4. **Lancer le serveur de développement Next.js** :
   ```bash
   npm run dev
   ```
   *Démarre le serveur local. L'application est maintenant disponible sur [http://localhost:3000](http://localhost:3000).*

Pour des instructions de configuration complètes, des détails sur les variables d'environnement et la résolution des erreurs courantes, consultez notre 📖 **[Guide de Démarrage Local](docs/GETTING_STARTED.md)**.

---

## 🏗️ Infrastructure AWS & Terraform

L'infrastructure réseau et applicative est hébergée sur AWS et gérée en tant que code (IaC) à l'aide de **Terraform**. 

L'architecture est optimisée pour garantir une sécurité robuste (les conteneurs applicatifs s'exécutent dans des sous-réseaux privés protégés du réseau public) et une performance globale maximale grâce au caching global CloudFront et à la faible latence d'Amazon DynamoDB.

Pour comprendre le schéma d'architecture, la configuration réseau VPC, les politiques IAM de moindre privilège et les commandes de déploiement Terraform, lisez notre 🏗️ **[Guide de l'Infrastructure AWS](docs/INFRASTRUCTURE.md)**.

---

## 🧪 Tests et Linter

Nous garantissons la qualité du code à l'aide de tests unitaires avec Vitest et de règles de conformité ESLint.

* **Exécuter les tests unitaires** :
  ```bash
  npm test
  ```
* **Lancer le linter** :
  ```bash
  npm run lint
  ```
* **Compiler le projet pour la production** :
  ```bash
  npm run build
  ```

---

## 📄 Licence

Ce projet est sous licence MIT.
