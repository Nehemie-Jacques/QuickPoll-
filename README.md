# QuickPoll

**Créez des sondages. Partagez instantanément. Suivez les résultats en direct.**

Un outil de sondage en temps réel sans friction, ne nécessitant aucune création de compte. Développé avec Next.js 16 (Turbopack), DynamoDB et AWS.

Le projet est disponible en open source sur GitHub : [https://github.com/Nehemie-Jacques/QuickPoll-](https://github.com/Nehemie-Jacques/QuickPoll-)

---

## Fonctionnalités principales

* **Types de sondages** : choix unique, choix multiple, évaluation par étoiles, oui/non.
* **Lien créateur (signé via JWT)** : gère et administre le sondage sans inscription obligatoire.
* **Résultats en direct** : mis à jour en temps réel via SSE (Server-Sent Events), avec protection anti-double vote, mot de passe facultatif et commentaires.
* **Partage et export** : export CSV des résultats, génération de codes QR, intégration et partage sur les réseaux sociaux.

---

## Démarrage Rapide

Lancez le projet localement en quelques secondes :

```bash
# Installer les dépendances
npm install --prefix app

# Configurer les variables d'environnement
cp app/.env.example app/.env.local

# Lancer la base de données locale (Docker) et l'initialiser
npm run db:up && npm run db:init

# Démarrer le serveur de développement Next.js
npm run dev
```

Pour plus d'informations, lisez le [Guide d'installation local](docs/GETTING_STARTED.md).

---

## Structure du Projet

```
quickpoll/
├── app/              # Application Next.js (front-end et API)
├── infrastructure/   # Fichiers Terraform (VPC, ECS Fargate, DynamoDB, ALB, CloudFront)
├── .github/workflows # Pipelines CI (PR) + Déploiement CD (main)
└── docs/             # Guides de démarrage et détails de l'architecture
```

---

## Commandes NPM Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Compile l'application Next.js pour la production |
| `npm test` | Exécute les tests unitaires (Vitest) |
| `npm run db:up` | Lance l'instance DynamoDB locale (Docker) |
| `npm run db:init` | Crée les tables DynamoDB en local |

---

## Documentation Complète

* 📖 [Guide de Démarrage](docs/GETTING_STARTED.md)
* 🏗️ [Architecture et Infrastructure AWS](docs/INFRASTRUCTURE.md)

---

## Licence

MIT
