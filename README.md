# Law Ledger

Production-ready MVP for a small law firm that manages client balances through a financial ledger.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, RLS, and Realtime

## Main Routes

- `/dashboard` - firm totals and payments vs expenses chart
- `/clients` - create, edit, delete, and inspect clients
- `/clients/[id]` - overview, finance ledger, and files placeholder

## Project Structure

```txt
app/
  (app)/
    dashboard/page.tsx
    clients/page.tsx
    clients/[id]/page.tsx
components/
  clients/
  dashboard/
  layout/
  ui/
lib/
  supabase/
    client.ts
    server.ts
    queries.ts
    types.ts
supabase/
  schema.sql
```

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
4. Install dependencies with `npm.cmd install`.
5. Start the app with `npm.cmd run dev`.

RLS is enabled in the schema. Insert a row in `public.users` for each authenticated auth user, with `role` set to `admin` or `lawyer`.
