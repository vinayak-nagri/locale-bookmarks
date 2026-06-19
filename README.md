# Locale Bookmarks

A small bilingual (English / Arabic) bookmark manager built as a pre-onboarding capstone. Users view bookmarks stored in Supabase and add new ones through a validated form. The UI is fully localized for `/en` and `/ar`, with right-to-left layout on Arabic.

**Live demo:** https://locale-bookmarks.vercel.app/

## Features

- Bookmark list backed by Supabase
- Add-bookmark form with Zod validation and a loading state on submit
- Four async list states: loading (skeletons), empty, error (with retry), and success
- Two locales (`/en`, `/ar`) with shared translation keys and RTL on Arabic
- Wrapped button component (`AppButton`) and a centralized MUI dark theme
- Per-bookmark open / copy actions

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript (strict)
- Material UI v9 + Emotion (`stylis-plugin-rtl` for RTL)
- Supabase (Postgres + Row Level Security)
- TanStack Query (server state)
- React Hook Form + Zod (forms and validation)
- next-intl (internationalization and locale routing)

## Prerequisites

- Node.js 20.x or later (LTS recommended)
- npm
- A free Supabase project

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/vinayak-nagri/locale-bookmarks
cd locale-bookmarks
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your project's public anon key |

> These names must match what the Supabase client in `lib/` reads. The anon key is safe to expose in the browser **only** when RLS is enabled; never commit the `service_role` key or any `.env*` file.

### 3. Set up the database

In the Supabase SQL editor, create the `bookmarks` table and enable RLS:

```sql
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null,
  created_at timestamptz default now()
);

alter table public.bookmarks enable row level security;

-- Demo policies: this capstone uses the anon key with no auth.
create policy "Anon can read bookmarks"
  on public.bookmarks for select to anon using (true);

create policy "Anon can insert bookmarks"
  on public.bookmarks for insert to anon with check (true);
```

> These open policies are for the single-user demo only. A production app would scope rows to an authenticated user (e.g. `using (auth.uid() = user_id)`).

### 4. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000> — it redirects to the default locale at `/en`. Visit `/ar` for the Arabic (RTL) version.

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Internationalization

User-facing text lives in `messages/en.json` and `messages/ar.json` under shared keys; components read them via next-intl's `t()`. Locale routing, request config, and navigation helpers live under `i18n/`, with the locale segment handled in `app/[locale]/`. Arabic renders RTL via `dir="rtl"` on `<html>` plus `stylis-plugin-rtl` for MUI styles.

## Project structure

```
app/[locale]/   Locale-scoped routes and layout (thin)
components/      Reusable UI (AppButton, BookmarkList, BookmarkForm, BookmarkDialog, ...)
i18n/            next-intl routing, request, and navigation config
lib/             Supabase client, types, Zod schema, data helpers
messages/        en.json and ar.json translations
middleware.ts    Locale middleware
```

## Deployment (optional)

The app deploys to Vercel:

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables.
4. Deploy. Vercel rebuilds on every push to `main`.

## Security notes

- `.env.local` is git-ignored and must never be committed.
- The anon key is fine in the browser **only** with RLS enabled.
- The `service_role` key must never appear in the browser or in Git.
