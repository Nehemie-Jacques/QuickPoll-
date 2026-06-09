# Guide de Démarrage - QuickPoll

Ce guide vous explique comment configurer et lancer le projet QuickPoll dans votre environnement de développement local.

Le projet est hébergé en open source sur GitHub : [https://github.com/Nehemie-Jacques/QuickPoll-](https://github.com/Nehemie-Jacques/QuickPoll-)

---

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :
* **Node.js** (version 22 ou supérieure)
* **Docker** et **Docker Compose** (requis pour exécuter la base de données DynamoDB locale)
* **AWS CLI** (facultatif, utilisé par le script d'initialisation de la base de données)

---

## 2. Configuration Locale

### Étape 1 : Installer les dépendances
Installez les packages Node pour l'application Next.js :
```bash
npm install --prefix app
```

### Étape 2 : Configurer les variables d'environnement
Créez le fichier de configuration locale `.env.local` à partir du modèle exemple :
```bash
cp app/.env.example app/.env.local
```

### Étape 3 : Démarrer DynamoDB Local
Démarrez le conteneur Docker DynamoDB local en arrière-plan :
```bash
npm run db:up
```
*Note : Cela démarre également `dynamodb-admin` sur le port `8001` pour vous permettre de visualiser les tables graphiquement dans votre navigateur.*

### Étape 4 : Initialiser les tables DynamoDB
Créez les tables requises (`quickpoll-polls` et `quickpoll-votes`) dans l'instance DynamoDB locale en exécutant le script d'initialisation :
```bash
npm run db:init
```

### Étape 5 : Lancer l'application
Démarrez le serveur de développement Next.js :
```bash
npm run dev
```
Ouvrez ensuite votre navigateur sur [http://localhost:3000](http://localhost:3000).

---

## 3. Exécuter les Tests

QuickPoll utilise **Vitest** pour ses tests unitaires. Pour exécuter la suite de tests :
```bash
npm test
```

---

## 4. Variables d'Environnement Clés

Dans le fichier `app/.env.local`, voici les variables importantes à configurer :

| Variable | Description | Valeur par défaut locale |
|----------|-------------|-------------------------|
| `DYNAMODB_ENDPOINT` | URL de la base de données locale | `http://localhost:8000` |
| `AWS_REGION` | Région AWS | `us-east-1` |
| `CREATOR_JWT_SECRET` | Secret pour signer les jetons des créateurs | `dev-secret-change-in-prod-minimum-32-chars` |
| `SES_FROM_EMAIL` | Adresse d'expédition des notifications e-mail | `noreply@example.com` (Optionnel) |

---

## 5. Résolution des Problèmes (Troubleshooting)

### Erreur `ECONNREFUSED 127.0.0.1:8000`
* **Cause** : L'application n'arrive pas à se connecter à la base de données DynamoDB.
* **Solution** : Vérifiez que le conteneur Docker est bien démarré en exécutant `docker compose ps`. Si nécessaire, lancez `npm run db:up` et réinitialisez les tables avec `npm run db:init`.

### Erreur `Permission denied` sur les scripts
* **Cause** : Les scripts du dossier `scripts/` n'ont pas les droits d'exécution.
* **Solution** : Exécutez la commande suivante à la racine pour accorder les permissions nécessaires :
  ```bash
  chmod +x scripts/init-dynamodb-local.sh scripts/seed_local.sh
  ```

### Erreurs de linter ou d'importation dans l'EDI
* **Solution** : Lancez le linter manuellement pour vous assurer de la conformité du code :
  ```bash
  npm run lint
  ```
