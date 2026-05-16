# Next.js 16 — incomplete RSC payload on SSG prerender (ISR + generateStaticParams + turbopack)

Minimal reproduction for [vercel/next.js#93889](https://github.com/vercel/next.js/issues/93889).

## Symptom

A page that combines `generateStaticParams` + `export const revalidate = N` is silently rendered
with an **incomplete RSC payload** at build time when bundled with turbopack. In production:

- Server returns `HTTP 200`.
- HTML shell renders the static prelude (root layout, top-level JSX).
- Page content sits as a hydration skeleton forever.
- DevTools → Console: `Error: Connection closed.`
- `curl -H "RSC: 1" <url>` returns a body containing `$L*` Suspense placeholders **without** their
  resolution chunks.
- `x-vercel-cache: HIT` + `x-nextjs-prerender: 1` — the broken payload is locked in the edge cache.

Toggling the same page to `export const dynamic = "force-dynamic"` makes it render fine.

The bug does **not** reproduce on `npm start` locally — it only manifests on Vercel (production
edge runtime + ISR cache). A local production server returns a complete RSC payload for the same
build.

## Versions

- Next.js: `16.1.6`
- React: `19.2.3`
- Bundler: turbopack (`next.config.ts` → `turbopack: { root }`)
- Node.js: `26.0.0` (locally) / Vercel runtime
- Hosting: Vercel (Edge / Production environment)

## Reproduction

```bash
npm install
npm run build
npm start            # local: this returns a COMPLETE RSC payload (does NOT repro)
```

To see the bug, deploy to Vercel as a Production deployment:

```bash
vercel --prod
```

Then visit any of:

- `/guide/store/store-a`
- `/guide/store/store-b`
- `/guide/store/store-c`
- `/guide/store/store-d`
- `/guide/store/store-e`

Each loads the root header but the page content never resolves. In DevTools:

```
Error: Connection closed.
```

`curl -H "RSC: 1" https://<deployment>/guide/store/store-a | tail -c 200` shows the body ends in
unresolved `$L*` placeholders, not a complete tree.

## Fix it locally — toggle one line

Open `app/guide/store/[slug]/page.tsx` and swap:

```diff
- export const revalidate = 3600;
+ export const dynamic = "force-dynamic";
```

Redeploy. The exact same JSX, the same `generateStaticParams`, but now rendered per request — the
page renders fine.

## Expected behavior

A build-time SSG prerender of a page with `generateStaticParams` + `revalidate` should either:

1. Complete the RSC payload (correct).
2. Fail the build loudly.

It should not silently emit an incomplete payload that gets locked into the production cache.

## Background

This repository was extracted from a production app (`maison-de-talents`) that was broken for up
to 21 hours by exactly this pattern. The original `/guide/store/[slug]` page is 393 LOC with 4
JSON-LD scripts, ~7 page sections, and a Supabase fetch. We ran a 4-step variable matrix on a
preview branch:

| commit | variable | result |
|---|---|---|
| baseline | `force-dynamic` → `revalidate = 3600` | ❌ broken (`Connection closed`, empty body) |
| 2A | also: Supabase fetch → static mock | ❌ broken (same) — fetch is **not** the cause |
| 2B | also: remove `generateStaticParams` | ⚠ partial (header renders + content 404) |
| 2C | also: remove `revalidate` (pure SSG) | ❌ broken (same) — `generateStaticParams` alone enough |

Findings:

- `generateStaticParams` is a **necessary** condition.
- `revalidate` value, `Supabase` fetch, and ISR mechanism itself are **not** the cause.
- We could not isolate a single sufficient JSX-level trigger from a healthy peer page (`/guide/brand-inside/[slug]`)
  with similar structure.

This repo keeps the broken page minimal (no Supabase, no client components, no Suspense boundary,
plain JSX with 4 inline JSON-LD scripts) and still reproduces the bug on Vercel production.

The original issue, [vercel/next.js#93889](https://github.com/vercel/next.js/issues/93889), was
auto-closed for missing a public reproduction link. This repo is that link.
