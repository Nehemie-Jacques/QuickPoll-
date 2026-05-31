# Getting Started with QuickPoll

## Prerequisites

- Node.js 22+
- Docker (for DynamoDB Local)
- AWS CLI (optional, for table init)

## Local development

### 1. Install dependencies

```bash
npm install --prefix app
cp app/.env.example app/.env.local
```

### 2. Start DynamoDB Local

```bash
npm run db:up
npm run db:init
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Troubleshooting

| Error | Fix |
|-------|-----|
| `ECONNREFUSED 127.0.0.1:8000` | Run `npm run db:up` and `npm run db:init` |
| Hydration warning on `<body>` | Browser extension (e.g. ColorZilla). Harmless; `suppressHydrationWarning` is set |
| Vote table errors after schema change | Drop and recreate votes table with `voterId` range key |

## Environment variables

See [`app/.env.example`](../app/.env.example).

## Tests

```bash
npm test
```

## Production deploy

Infrastructure is managed with Terraform under `infrastructure/`. CI/CD:

- **Pull requests**: lint → unit tests → Docker build → Trivy scan
- **Push to `main`**: build image → push ECR → ECS rolling deploy

Configure GitHub secrets: `AWS_DEPLOY_ROLE_ARN`, `ECR_REPOSITORY_NAME`, `ECS_CLUSTER_NAME`, `ECS_SERVICE_NAME`.
