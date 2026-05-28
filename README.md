# QuickPoll

Sondages en temps réel — création sans compte, vote sécurisé, résultats live.

## Fonctionnalités V1

- **Création** : choix unique, multiple (limite configurable), notation 1–5★, oui/non
- **Personnalisation** : titre, description, options, expiration, couleur d'accent
- **Paramètres avancés** : mot de passe, commentaires, visibilité des résultats, alias obligatoire
- **Liens** : vote public + gestion privée (JWT, sans compte)
- **Vote** : anti-double vote (fingerprint + hash IP), alias et commentaires optionnels
- **Résultats** : SSE temps réel, graphiques, partage (QR, iframe, réseaux sociaux)
- **Dashboard créateur** : stats, clôture, prolongation, duplication, export CSV, SES au 1er vote

## Structure

```
quickpoll/
├── app/                 # Next.js 16 (App Router)
├── infrastructure/      # Terraform AWS
├── .github/workflows/   # CI / CD
└── docker-compose.yml   # DynamoDB Local
```

## Démarrage local

```bash
# DynamoDB Local
docker compose up dynamodb -d

# Créer les tables (AWS CLI)
aws dynamodb create-table --endpoint-url http://localhost:8000 \
  --table-name quickpoll-polls \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

aws dynamodb create-table --endpoint-url http://localhost:8000 \
  --table-name quickpoll-votes \
  --attribute-definitions \
    AttributeName=pollId,AttributeType=S \
    AttributeName=fingerprint,AttributeType=S \
  --key-schema \
    AttributeName=pollId,KeyType=HASH \
    AttributeName=fingerprint,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# App
cp app/.env.example app/.env.local
npm install --prefix app
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Voir [`app/.env.example`](app/.env.example).

| Variable | Description |
|----------|-------------|
| `CREATOR_JWT_SECRET` | Signature des liens de gestion |
| `IP_HASH_SALT` | Sel pour le hash IP (anti-fraude) |
| `DYNAMODB_*` | Tables et endpoint (local ou AWS) |
| `SES_FROM_EMAIL` | Expéditeur des notifications |

## Infrastructure

```bash
cd infrastructure
terraform init
terraform plan -var="creator_jwt_secret=..."
```

Modules : networking, ECR, ECS, DynamoDB, ALB, CloudFront, SES.

## Scripts racine

| Commande | Action |
|----------|--------|
| `npm run dev` | Lance Next.js dans `app/` |
| `npm run build` | Build production |
| `npm run lint` | ESLint |
