# QuickPoll

**Create polls. Share instantly. See results live.**

Frictionless real-time polling — no account required. Built with Next.js 16, DynamoDB, and AWS.

## Features

- Poll types: single choice, multiple choice, star rating, yes/no
- Creator link (JWT) for management without signup
- Live results via SSE, anti-double vote, optional password & comments
- Export CSV, QR codes, embed & social sharing

## Quick start

```bash
npm install --prefix app
cp app/.env.example app/.env.local
npm run db:up && npm run db:init
npm run dev
```

→ [Full guide](docs/GETTING_STARTED.md)

## Project structure

```
quickpoll/
├── app/              # Next.js application
├── infrastructure/   # Terraform (VPC, ECS, DynamoDB, ALB, CloudFront)
├── .github/workflows # CI (PR) + Deploy (main)
└── docs/             # Guides
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Unit tests (Vitest) |
| `npm run db:up` | DynamoDB Local (Docker) |
| `npm run db:init` | Create local tables |

## Documentation

- [Getting started](docs/GETTING_STARTED.md)
- [Infrastructure](docs/INFRASTRUCTURE.md)

## License

MIT
