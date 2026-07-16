# Currents

A personal, hourly-refreshing news digest across 10 topics (Politics, World,
Business, Tech, Science, Health, Sports, Entertainment, Art, Fashion) — no AI
summarization, just publisher RSS snippets, deduped and organized.

## How it fits together

1. **`scripts/fetch-news.mjs`** — pulls every RSS feed defined in
   `src/data/categories.js`, dedupes against what's already there, and writes
   `public/data/{category}.json` + `public/data/meta.json`.
2. **`.github/workflows/fetch-news.yml`** — runs that script every hour and
   commits the results, so the site's data updates itself.
3. **The React app (`src/`)** — reads those static JSON files at runtime, and
   talks to Supabase for login and saved articles.
4. **Supabase** — a name+4-digit-code login (built on top of Supabase's real
   email+password auth, disguised) and a `currents_saved_articles` table,
   both already provisioned with Row Level Security.

No AI API is used anywhere in this pipeline — summaries are exactly what each
publisher's RSS feed provides, lightly trimmed.

## One-time setup

### 1. Supabase

The `currents_users` and `currents_saved_articles` tables (with RLS policies)
already exist in your Supabase project. One setting still needs to be
changed by hand, since it isn't available via the management API:

> **Authentication → Providers → Email → turn OFF "Confirm email"**

This is required because signup uses a synthetic internal "email" (built
from your username) that can't actually receive a confirmation link. Without
this change, new accounts will be created but won't be signed in
automatically.

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase
project's **Settings → API** page. The anon/public key is safe to use here —
it's the client-facing key, and Row Level Security is what actually protects
the data.

### 3. Install and run locally

```bash
npm install
npm run dev
```

The app will run against the sample data already in `public/data/` so you can
see it working immediately, before the real pipeline has ever run.

## Running the real news pipeline

Locally (needs normal internet access to reach RSS feeds):

```bash
node scripts/fetch-news.mjs
```

On GitHub, the included workflow (`.github/workflows/fetch-news.yml`) runs
this automatically every hour once you push this repo to GitHub — no
secrets or API keys needed, since RSS feeds are public.

## Deploying

1. Push this repo to a **new GitHub repository** (keep it separate from your
   other projects/sites — see note below on why).
2. Import that repo into a **new Vercel project**. Vercel will auto-detect
   the Vite setup.
3. Add the same two environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in Vercel's project settings.
4. Every push to `main` (including the hourly bot commits) will trigger a
   redeploy automatically.

**Why a separate GitHub repo / Vercel project:** this app has its own
GitHub Actions automation and its own deploy history — bundling it into an
unrelated site's repo would mean its hourly cron job and deploys live
alongside code that has nothing to do with it. The **Supabase project**
itself, on the other hand, is fine to keep shared with your other apps as
long as tables stay clearly prefixed (`currents_*`), which they already are.

## Adjusting things later

- **Add/remove RSS feeds or categories** — edit `src/data/categories.js`.
  Each category's `feeds` array can have as many sources as you want.
- **Change the refresh schedule** — edit the `cron` line in
  `.github/workflows/fetch-news.yml` (e.g. `0 */4 * * *` for every 4 hours).
- **Give one category its own faster/slower schedule** — duplicate the
  workflow file, point it at a script that only fetches that category, and
  give it its own cron schedule.
