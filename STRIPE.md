# Stripe Integration Plan

This document describes how to add real payments to EscapeHub in the future. **Not implemented yet** — purchases are currently simulated.

## Why Stripe isn't in the app yet

The current app writes purchases directly from React to Supabase using the anon key + Row Level Security. That's fine for simulated purchases, but it's insecure for real payments: the frontend could write a purchase row without an actual payment ever happening. Stripe integration requires a backend server to be the source of truth.

## Two implementation paths (undecided — choose when ready)

### Path A: Supabase Edge Functions (lower complexity)

Keep everything inside Supabase — no separate service to deploy or maintain.

```
React → Supabase Edge Functions → Stripe
                    │
                    └──► Supabase DB (service role key, inside the same platform)
```

- One platform, one deployment
- TypeScript/Deno — familiar if you already know JS/TS
- Best if payment logic stays simple

### Path B: Go API (more control)

A separate Go service handles payment logic and DB writes.

```
React frontend
  │
  ├──► Supabase (auth + DB reads)
  │
  └──► Go API
              │
              ├──► Stripe (payment processing)
              │
              └──► Supabase (DB writes via service role key)
```

- Full control over the runtime
- Good excuse to learn Go
- More to manage (separate deployment, logs, CI/CD)

**Pick when you're ready to build it** — the React changes are identical either way.

The key rule (both paths): **the server decides if a purchase is valid, not the browser**.

## How the payment flow works

1. User clicks "Buy" in React
2. React calls the Go API: `POST /api/checkout`
3. Go API creates a Stripe Checkout Session and returns its URL
4. React redirects the user to Stripe's hosted payment page
5. User pays on Stripe
6. Stripe sends a **webhook** to `POST /api/stripe/webhook` (server-to-server, not browser)
7. Go API verifies the webhook signature, then writes the purchase to Supabase using the **service role key**
8. User is redirected back to the app

The purchase only exists in the DB if Stripe confirmed it — the frontend never makes that call.

## Keys involved

| Key | Where it lives | What it does |
|---|---|---|
| Stripe publishable key | React (`.env`) | Identifies your Stripe account to the browser — safe to expose |
| Stripe secret key | Go API (env var, never in repo) | Creates sessions, verifies webhooks — must stay server-side |
| Supabase service role key | Go API (env var, never in repo) | Bypasses RLS to write purchases — must stay server-side |
| Supabase anon key | React (`.env`) | Reads + auth — safe because RLS limits scope |

## What needs to be built

- [ ] Go API with at least two endpoints:
  - `POST /api/checkout` — creates a Stripe Checkout Session
  - `POST /api/stripe/webhook` — receives Stripe's payment confirmation
- [ ] Stripe account (free to create at stripe.com)
- [ ] Webhook registered in the Stripe dashboard pointing at your server
- [ ] Remove the direct Supabase insert from `usePurchases.ts` and replace with a call to the Go API

## What changes in React

Minimal. Only `usePurchases.ts` changes — instead of calling Supabase directly, `buyRoom` calls the Go API:

```ts
// Before (simulated)
await supabase.from('purchases').insert({ user_id, room_id })

// After (real payments)
const res = await fetch('/api/checkout', {
  method: 'POST',
  headers: { Authorization: `Bearer ${session.access_token}` },
  body: JSON.stringify({ room_id }),
})
const { url } = await res.json()
window.location.href = url  // redirect to Stripe
```

Components don't change at all.

## Cost

Stripe charges **2.9% + $0.30 per successful transaction** — no monthly fee, no setup cost. Test mode with fake cards is free and unlimited.
