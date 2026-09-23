# Recomvia

Recomvia is an AI Visibility Optimization Platform built around the product loop:

`Measure → Explain → Fix → Monitor → Improve`

The current repository is a functional private-beta foundation. A visitor submits one public website URL; the application crawls the website, records evidence, calculates an explainable readiness score, stores findings, and exposes account-owned dashboard and report views.

## Current stack

- Next.js 16 / React 19 / TypeScript
- Vinext + Cloudflare Workers-compatible output
- Tailwind CSS 4 and reusable UI components
- Cloudflare D1 / SQLite with Drizzle migrations
- English and Arabic public interface

## Run locally

Requirements: Node.js 22.13+ and pnpm 11.

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm lint
pnpm build
```

Database migrations are in `drizzle/`. Generate a new immutable migration after changing `db/schema.ts`:

```bash
pnpm db:generate
```

## Product status

Working now:

- URL-only live website readiness scan
- SSRF and fetch safety controls
- 24-hour result caching and private-beta usage limit
- Explainable findings and evidence report
- User-owned dashboard and scan history
- Product database foundation for subscriptions, fixes, credits, costs, audits, and support
- Grounded FAQ/blog assistant with human ticket escalation
- Blog, FAQ, methodology, pricing, contact, privacy, terms, and billing-policy pages

Not yet connected:

- Live AI/search provider adapters
- Google OAuth outside the current hosted environment
- Payment processor and subscription webhooks
- Purchasable Fix Credits
- CMS apply/rollback integrations

Read `HANDOFF_AR.md` before production work. It is the authoritative Arabic engineering handoff and launch checklist.

No production credentials or customer data are included in this repository.
