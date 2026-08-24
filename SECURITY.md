# Security

Do not open a public GitHub issue for vulnerabilities that could expose user data, credentials, or unauthenticated access.

Use [GitHub private vulnerability reporting](https://github.com/davidsolheim/next-starter-template/security/advisories/new) on this repository.

## Secrets

Never commit real environment values. This includes `.env`, Doppler tokens, database URLs, `AUTH_SECRET`, blob tokens, and API keys.

- `.env.example` lists **names only**
- Local and `db:*` scripts inject secrets through Doppler
- CI uses stub values and must not set `RESEND_API_KEY` (that enables the email provider at build time)

The seed admin password default (`changeme-admin-password`) is for empty local databases only. Change it after first login, and set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in Doppler for anything shared.
