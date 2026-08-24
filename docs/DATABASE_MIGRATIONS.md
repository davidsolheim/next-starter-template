# Database migrations

Schema changes for Neon are applied **only through versioned Drizzle migrations** under `drizzle/`. Do not use `drizzle-kit push` / `bun run db:push` / `db:push:force` (those scripts exit with an error).

## Why

- Preview, production, and local DBs stay reproducible from the same SQL history.
- Code reviews can inspect DDL before it hits shared databases.
- Empty Neon branches can be bootstrapped with `db:migrate` alone (then seed if needed).

## Workflow

1. Edit TypeScript schema in `lib/db/schema/`.
2. Generate SQL:

   ```bash
   bun run db:generate
   ```

3. Review the new `drizzle/00xx_*.sql` file (and journal entry under `drizzle/meta/`). Prefer additive, idempotent changes when possible.
4. Commit **schema + migration together**.
5. Apply on the environment that needs the change:

   ```bash
   bun run db:migrate
   ```

Vercel does **not** run migrations on deploy. Run `db:migrate` for preview/production (via Doppler) before or immediately after shipping code that depends on new tables/columns.

## First-time empty database

```bash
bun run db:migrate
bun run db:seed
```

## Scripts

| Script | Purpose |
|--------|---------|
| `bun run db:generate` | Create migration SQL from schema drift |
| `bun run db:migrate` | Apply pending migrations for the active Doppler config |
| `bun run db:studio` | Drizzle Studio |
| `bun run db:push` / `db:push:force` | **Disabled** — print error and exit 1 |
