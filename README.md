# EscapeHub

A React learning project — a fictional escape room marketplace where users can browse rooms, create an account, purchase rooms, and view their profile with purchased rooms.

Built with [Bolt](https://bolt.new) as a hands-on way to learn React while exploring how a real frontend app is structured.

## What the app does

- **Browse** a catalog of escape rooms with search and filters (difficulty, theme)
- **Sign up / Sign in** via email and password
- **Purchase rooms** (simulated — no real payment)
- **Profile page** showing all purchased rooms and stats

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Backend / Auth / DB | Supabase (BaaS) |
| Icons | Lucide React |

## Project structure

```
src/
├── App.tsx              # Root component, page routing
├── main.tsx             # React entry point
├── components/
│   ├── auth/            # Login/signup modal
│   ├── layout/          # Header
│   └── rooms/           # Room card and detail view
├── pages/
│   ├── HomePage.tsx     # Room listing with filters
│   └── ProfilePage.tsx  # User profile and purchases
├── context/
│   └── AuthContext.tsx  # Global auth state
├── hooks/
│   └── usePurchases.ts  # Purchase logic
├── lib/
│   └── supabase.ts      # Supabase client
└── types/               # TypeScript types
```

## Getting started

```bash
npm install
npm run dev
```

The app needs Supabase environment variables set up. See [SUPABASE.md](./SUPABASE.md) for details.

## Learning notes

See [ARCHITECTURE.md](./ARCHITECTURE.md) for an explanation of how the pieces fit together — useful if you're learning React or want to understand how to later replace Supabase with a Spring Boot backend.

See [STRIPE.md](./STRIPE.md) for the plan to add real payments in the future — explains the architecture, what needs to be built, and what changes in React.
