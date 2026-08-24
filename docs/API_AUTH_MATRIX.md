# API auth matrix

Update this table whenever you add a Route Handler.

| Route | Auth | Notes |
| --- | --- | --- |
| `GET/POST /api/auth/[...all]` | Public (Auth.js) | NextAuth handlers |
| `POST /api/auth/forgot-password` | Public + rate limit | Does not enumerate emails |
| `POST /api/auth/reset-password` | Public + rate limit | Token must be unexpired |
| `POST /api/admin/change-password` | Session required | Authenticated user only |
| `POST /api/upload` | Session required | Local disk fallback under `public/uploads` |
| `POST /api/site-gate` | Public | Sets HMAC cookie when `SITE_GATE_PASSWORD` matches |

Site gate (preview/production only) runs in `proxy.ts` before page auth. Cron/webhook bypasses should be added explicitly if you introduce those routes.

Capabilities (`admin` implies `moderate`) live on `users.capabilities`. Use `requireUserId` + `requireCapabilityResponse` from `lib/api/helpers.ts`.
