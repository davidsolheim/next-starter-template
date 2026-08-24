# Doppler environment setup

This project uses [Doppler](https://www.doppler.com/) as the source of truth for secrets and environment configuration.

The app still reads configuration from `process.env`, because Next.js and Vercel receive secrets as environment variables. Doppler injects them locally and syncs them to Vercel through the Doppler integration.

## Doppler configs

| Doppler config | Use |
| --- | --- |
| `development` | Local development (`doppler.yaml` default) |
| `preview` | Vercel Preview (sync via Doppler → Vercel) |
| `production` | Vercel Production (sync via Doppler → Vercel) |

Map Doppler `preview` → Vercel Preview and Doppler `production` → Vercel Production when you configure the integration.

## Local development

1. Install the [Doppler CLI](https://docs.doppler.com/docs/install-cli).
2. Authenticate: `doppler login`
3. From the repo root, link this directory (once per machine):

```bash
doppler setup --project next-starter-template --config development
```

`doppler.yaml` defaults to `next-starter-template` / `development`, so `doppler run` works without extra flags after setup.

4. Run commands through the package scripts:

```bash
bun run env:verify:doppler
bun run dev
bun run db:migrate
bun run db:seed
```

`build` and `start` stay as plain Next.js commands so **Vercel** can use environment variables synced from Doppler without the Doppler CLI on the platform. Use `build:doppler` / `start:doppler` when testing production builds locally.

Do not copy production values into `.env.local`. Keep secrets in Doppler only.

Required names are listed in `.env.example` and checked by `bun run env:verify`.
