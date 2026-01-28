# Next.js Starter Template

A production-ready Next.js starter template with authentication, database, and modern tooling pre-configured.

## Features

- **Next.js 16** with App Router
- **Drizzle ORM** with Neon PostgreSQL
- **NextAuth.js v5** (Auth.js) - Credentials authentication with JWT sessions
- **Resend** - Email integration for password reset and verification
- **Stripe** - Payment processing integration
- **Tailwind CSS 4** - Modern styling
- **shadcn/ui** - Beautiful, accessible component library
- **TypeScript** - Full type safety
- **Vercel Blob Storage** - File uploads (optional)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Neon PostgreSQL database (or any PostgreSQL database)
- Resend account (for email)
- Stripe account (optional, for payments)

### Installation

1. Clone this repository or use it as a template:

```bash
git clone <your-repo-url>
cd next-starter-template
```

2. Install dependencies:

```bash
bun install
# or
npm install
```

3. Copy the environment variables file:

```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host:port/database
AUTH_SECRET=your-secret-key-here
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_SITE_NAME="Your App Name"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Set up your database:

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate
```

6. Start the development server:

```bash
bun run dev
# or
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

This template uses Drizzle ORM with Neon PostgreSQL. The database schema includes:

- `users` - User accounts
- `sessions` - Authentication sessions
- `accounts` - OAuth accounts (if you add OAuth providers)
- `verifications` - Email verification tokens

### Database Commands

```bash
# Generate migrations from schema changes
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema changes directly (development only)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio
```

## Authentication

The template includes NextAuth.js v5 with credentials authentication. To create your first admin user, you'll need to:

1. Set up the database (see above)
2. Create a user manually in the database or build a signup page

Example user creation (you can add this to a setup script):

```typescript
import { drizzleDb } from "@/lib/db"
import { users } from "@/lib/db/schema"
import bcrypt from "bcryptjs"

const hashedPassword = await bcrypt.hash("your-password", 10)
await drizzleDb.insert(users).values({
  id: crypto.randomUUID(),
  email: "admin@example.com",
  password: hashedPassword,
  name: "Admin User",
})
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages (protected)
│   ├── api/               # API routes
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── db/                # Database setup
│   │   └── schema/        # Drizzle schema files
│   └── utils.ts           # Helper functions
└── drizzle/               # Database migrations
```

## Environment Variables

See `.env.example` for all required environment variables.

### Required

- `DATABASE_URL` or `NEON_DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret key for NextAuth.js (generate with `openssl rand -base64 32`)
- `RESEND_API_KEY` - Resend API key for emails
- `EMAIL_FROM` - Email address to send from

### Optional

- `STRIPE_SECRET_KEY` - Stripe secret key (if using payments)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token (if using file uploads)
- `NEXT_PUBLIC_SITE_NAME` - Your site name
- `NEXT_PUBLIC_SITE_URL` - Your site URL
- `NEXT_PUBLIC_BASE_URL` - Base URL for client-side auth (defaults to `http://localhost:3000`)
- `AUTH_URL` - Auth base URL for server-side auth (defaults to `NEXT_PUBLIC_BASE_URL`)
## Customization

1. **Update site metadata**: Edit `app/layout.tsx` to customize your site's metadata
2. **Add database tables**: Create new schema files in `lib/db/schema/` and export them in `lib/db/schema/index.ts`
3. **Customize admin**: Modify `app/admin/page.tsx` to add your admin functionality
4. **Add API routes**: Create new routes in `app/api/`
5. **Customize styling**: Modify `app/globals.css` for theme customization

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

### Other Platforms

This template works with any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

Make sure to set all required environment variables in your deployment platform.

## Author

Created by **David Solheim**

## License

MIT

## Support

This is a starter template. Customize it to fit your needs!
