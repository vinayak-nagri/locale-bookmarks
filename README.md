# Locale Bookmarks

A small bilingual (English / Arabic) bookmark manager built as a pre-onboarding capstone. Each user signs in, sees only their own bookmarks, and manages a short profile (display name + preferred language). The UI is fully localized for `/en` and `/ar`, with right-to-left layout on Arabic.

**Live demo:** https://locale-bookmarks.vercel.app/

## Features

- Email authentication (sign up / sign in / sign out)
- Per-user bookmarks — each row is scoped to the signed-in user and enforced at the database level
- Add-bookmark form with Zod validation and a loading state on submit
- Profile page to update display name and preferred locale
- Auth-aware home: a signed-out landing panel, the bookmark dashboard once signed in
- Route protection: `/profile` redirects unauthenticated users to sign-in
- Four async list states: loading (skeletons), empty, error (with retry), and success
- Two locales (`/en`, `/ar`) with shared translation keys and RTL on Arabic
- Wrapped button component (`AppButton`) and a centralized MUI theme

> More bookmark features (edit, delete, sort/filter, pagination, view toggle) are being added incrementally; this list reflects the current state of `main`.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript (strict)
- Material UI v9 + Emotion (`stylis-plugin-rtl` for RTL)
- Supabase (Postgres, Auth, Row Level Security) via `@supabase/ssr`
- TanStack Query (server state)
- React Hook Form + Zod (forms and validation)
- next-intl (internationalization and locale routing)

## Prerequisites

- Node.js 20.x or later (Next.js 16 does not support Node 18)
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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your project's publishable (public) key |

Both values come from your Supabase project's API settings. See [Security and environment](#security-and-environment) for why the publishable key is safe to ship to the browser and what must never be committed.

### 3. Set up the database

Database schema and security live in `supabase/migrations/` as SQL files — they are the source of truth. Apply them **in filename order** in the Supabase SQL editor (this project applies migrations through the dashboard, not the CLI). The migrations create:

- a `bookmarks` table with a `user_id` column referencing `auth.users`, and
- a `profiles` table keyed on the user's auth id (`display_name`, `preferred_locale`),

then enable Row Level Security and add per-user policies on both (see below). Migration files are append-only — never edit an applied migration; add a new one.

Email confirmation is disabled on this project, so sign-up logs the user in immediately.

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

## Security and environment

This app talks to Supabase directly from the browser, so the security boundary is the **database**, not a hand-written API layer. A few rules make that safe:

- **`.env.local` is git-ignored and must never be committed.** `.env` (no secrets) is fine to commit; secrets are not.
- **The publishable key is safe in the browser — but only because RLS is enabled.** The key identifies the project and grants the `anon` / `authenticated` Postgres roles; it does not grant access to data by itself. With RLS on and no broad policies, an unscoped request returns nothing. The key is public on purpose; the data is protected by policy, not by hiding the key.
- **The `service_role` key must never appear in the browser or in Git.** It bypasses RLS entirely and is server-only.

### Row Level Security in practice

RLS is **default-deny**: a request only sees the rows a policy explicitly grants for that command (`select` / `insert` / `update` / `delete`). Both tables have RLS enabled with per-user policies:

- `bookmarks` — `auth.uid() = user_id`
- `profiles` — `auth.uid() = id` (the profile's primary key *is* the user's auth id)

A signed-in user can therefore read and mutate only their own rows; another user's rows are invisible, enforced in Postgres regardless of what the client requests.

One consequence worth knowing: **a missing policy fails silently.** If no policy grants a command, no row qualifies, so the request affects zero rows and returns **no error** — the client may believe it succeeded. When a write or delete "does nothing" with a clean console, an absent RLS policy is the first thing to check.

### Auth enforcement vs. data protection

Two independent layers guard authenticated pages:

- **Middleware redirect** — the front door. An unauthenticated request to `/profile` is redirected to sign-in before the page renders or touches the database.
- **RLS** — the real security boundary. Even if a request reached the data, RLS scopes it to the owner.

The redirect protects the *experience* (no broken page for a signed-out user); RLS protects the *data*. The redirect alone is not security — RLS is.

## Internationalization

User-facing text lives in `messages/en.json` and `messages/ar.json` under shared keys; components read them via next-intl's `t()`. Locale routing, request config, and navigation helpers live under `i18n/`, with the locale segment handled in `app/[locale]/`. Arabic renders RTL via `dir="rtl"` on `<html>` plus `stylis-plugin-rtl` for MUI styles.

## Project structure

```
app/[locale]/   Locale-scoped routes: home, signin, signup, profile, layout (thin)
components/      Reusable UI (AppButton, BookmarkList, BookmarkForm, BookmarkDialog,
                 BookmarksView, SignedOutHome, ProfileForm, AuthForm, ...)
i18n/            next-intl routing, request, and navigation config
lib/             Supabase clients (browser + SSR server), Zod schemas, data helpers
messages/        en.json and ar.json translations
supabase/        SQL migrations (schema + RLS policies, applied in order)
middleware.ts    Locale routing + Supabase session refresh + route protection
```

## Deployment

The app deploys to Vercel:

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as environment variables (these names must match exactly — the app reads the publishable key, not the legacy anon key).
4. Deploy. Vercel rebuilds on every push to `main`.

> Until these env vars are set on Vercel, the deployed site cannot establish a session and will show the signed-out landing to everyone — expected, not a regression.
