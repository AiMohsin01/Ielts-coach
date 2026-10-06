# Free public deployment

## Components

- **Web:** deploy `apps/web` to a Node-capable Next.js host. Set `NEXT_PUBLIC_API_URL` to the public API URL.
- **API:** deploy `apps/api` as a persistent Node process. Run `npm run build` and serve the compiled application through a process manager or container.
- **Database:** use managed PostgreSQL 16+ or self-host PostgreSQL. Run `npm run db:migrate` exactly once per release.

## Required API environment

`DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `PORT`, and `NODE_ENV=production` are required. Use a long randomly generated `JWT_SECRET`, enforce HTTPS, and set `CLIENT_URL` to the exact web origin.

## Free local AI

Set `AI_PROVIDER=local`, run Ollama, and pull `llama3.2`. Configure `LOCAL_AI_BASE_URL` if it is not localhost. Speech transcription is optional: run a Whisper-compatible service and supply `LOCAL_TRANSCRIPTION_URL`. The rest of the platform does not require either service.

## Files and data

The current local upload directory is suitable only for testing. Before public launch, use private object storage and authenticated, time-limited download URLs for speaking recordings and listening audio.

## Release order

1. Provision PostgreSQL and create a restricted application database user.
2. Set secrets in the host’s secret manager; never commit `.env`.
3. Run migrations and seed only a staging database.
4. Deploy API, then deploy web with the API URL.
5. Run `RUN_E2E=true npm run test:e2e` against staging.
6. Verify PWA installation, mobile layout, authentication, and accessibility on real devices.
