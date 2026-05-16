# Next.js 16 — incomplete RSC payload on SSG prerender (ISR + generateStaticParams + turbopack)

> **⚠ Important honesty note:** This repo is the *closest minimal clone* of the broken production
> page we can publish, but it **does not by itself reproduce the bug**. The bug is 100%
> deterministic in the original production build (`maisondetalents.com`) but does not appear in
> this isolated clone. See **Bisect history** below for evidence — we ruled out 4 levels of
> page-level variables. The trigger is environmental/configuration, not page-shape.
>
> Why publish it anyway: the previous issue ([#93889](https://github.com/vercel/next.js/issues/93889))
> was auto-closed for missing a public reproduction repo. This is the public repo we promised.
> Maintainers can use it as the starting point and combine with the production observations below
> to investigate the actual environmental trigger.

## Symptom (in the original production build)

A page that combines `generateStaticParams` + `export const revalidate = N` + turbopack is
silently rendered with an **incomplete RSC payload** at build time. In production:

- Server returns `HTTP 200`.
- HTML shell renders (root layout, top-level JSX).
- Page content sits as a hydration skeleton forever.
- DevTools → Console: `Error: Connection closed.`
- `curl -H "RSC: 1" <url>` returns a body containing `$L*` Suspense placeholders **without** their
  resolution chunks (~184 KB body that ends mid-tree).
- `x-vercel-cache: HIT` + `x-nextjs-prerender: 1` — the broken payload is locked in the edge cache.

Toggling the same page to `export const dynamic = "force-dynamic"` makes it render fine. This is
the production hotfix we ship today.

## Versions

- Next.js: `16.1.6`
- React: `19.2.3`
- Bundler: turbopack (`next.config.ts` → `turbopack: { root }`)
- Hosting: Vercel (Production deployment)
- Local `npm start` after `npm run build` **does not** reproduce — the bug only appears on the
  Vercel production edge / ISR cache.

## What this repo contains

`app/guide/store/[slug]/page.tsx` is a direct clone of the broken production page, including all
its dependencies (`src/components/seo/JsonLd`, `src/components/ui/BrandLogo`, `src/lib/seo/*`,
`src/lib/constants/{stores,brands,interview-simulator}.ts`). GNB / Footer / PageBanner / TldrCard
are stubbed because their full dependency cascade is enormous (NotificationBell, BottomBar,
FooterNewsletter, supabase auth, useDarkMode, …) but their server/client shape is preserved.

Deploy this to Vercel as a Production deployment and visit any of the prerendered URLs (8 store
slugs). They render fine — meaning the bug is not in the page code itself.

## Bisect history

| cycle | what we changed on top of baseline | result |
|---|---|---|
| 0 | minimal page (`force-dynamic` → `revalidate = 3600`, 5 store slugs, 4 inline JSON-LD scripts, plain JSX) | ✅ healthy (does not repro) |
| 1 | + client component (`"use client"` + `useState` + `useEffect`) | ✅ healthy |
| 2 | + 14 store slugs, 23 brands, 12 jobs per page (RSC payload 15 KB → 22 KB) | ✅ healthy |
| 3 | + production page.tsx verbatim + its dependencies (real `stores.ts` 8 slugs, real `brands.ts` 23 entries, `JsonLd` server component, `BrandLogo` client component with `useState`, `breadcrumb` / `json-ld` builders, supabase mock that mirrors the `from().select().eq().or().order().limit()` chain) | ✅ healthy |

In the original repository we also ran a separate 4-step variable matrix on a preview branch:

| variable | result |
|---|---|
| baseline (`force-dynamic` → `revalidate = 3600`) | ❌ broken |
| also: supabase fetch → static mock | ❌ broken (fetch is **not** the cause) |
| also: remove `generateStaticParams` | ⚠ partial (header renders, content 404) |
| also: remove `revalidate` (pure SSG, `generateStaticParams` only) | ❌ broken |

So `generateStaticParams` is a **necessary** condition. `revalidate` value, supabase fetch, and
ISR mechanism are **not** the cause. But cloning the page + its deps into a fresh repo does not
reproduce the bug, which means there is also a sufficient cause we have not isolated, and it
lives somewhere outside the page.

## Candidate environmental triggers (not yet bisected)

Things present in the broken production build that this repo intentionally does not yet replicate:

- **`withSentryConfig`** wrapping the next.config (Sentry webpack/turbopack plugin pipeline).
- **`withBundleAnalyzer`** wrapping the next.config.
- **`experimental.staleTimes: { dynamic: 60, static: 300 }`**.
- **`experimental.optimizePackageImports: ["recharts", "@supabase/supabase-js", "lucide-react"]`**.
- **`images.dangerouslyAllowSVG: true`** + `images.remotePatterns` to brandfetch / DuckDuckGo.
- **Many other pages in the build graph** (the production build has 50+ routes; this repo has 1).
- **Real supabase network calls at build time** — production fetches data with realistic latency,
  this repo's mock resolves synchronously.
- **Build-time RSC payload size** — the broken pages weighed ~184 KB; the cloned pages here are
  28–38 KB. There may be a size threshold for the streaming truncation.

## Reproduction (in production only — this repo will not show the bug)

```bash
npm install
npm run build           # 8 store slugs prerendered as SSG ●
npx vercel --prod       # deploys
```

Then visit `https://<your-deployment>/guide/store/galleria-apgujeong`. The page renders.

To see the actual bug, you need to recreate enough of the original environment to cross the
threshold. Likely things to add first (in order of suspicion):

1. `withSentryConfig` wrap + a Sentry DSN.
2. The full `experimental` + `images` block from the original next.config.
3. More routes in the build graph (other `/guide/*` pages with their own deps).

## Toggle the fix

In `app/guide/store/[slug]/page.tsx`:

```diff
- export const revalidate = 3600;
+ export const dynamic = "force-dynamic";
```

In the original repo this single-line toggle is the difference between "broken for 21 hours" and
"healthy."

## Original incident

The production app `maisondetalents.com` was broken for up to 21 hours on 2026-05-16 by this
pattern. 5 pages were affected:

- `/`
- `/brands`
- `/brands/[slug]`
- `/guide/interview/[brand]`
- `/guide/store/[slug]` (cloned here)

The user-facing recovery commit (`01dcd9ab`) adds `export const dynamic = "force-dynamic"` to all
5, accepting the TTFB penalty (~50–200 ms on Vercel CDN miss) and giving up the Vercel ISR cache.
This is the current production state.

## Previous issue

[vercel/next.js#93889](https://github.com/vercel/next.js/issues/93889) was auto-closed for
missing a public reproduction link. The new issue should reference this repo, this README's
bisect history, and the candidate environmental triggers list so maintainers can pick up where
we left off.
