# Supabase Setup

This app uses [Supabase](https://supabase.com) as its backend — it provides authentication and a PostgreSQL database without writing any server code.

## Environment variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values are found in your Supabase project under **Settings → API**.

## Database tables

### `rooms`
Stores the escape room catalog. Seeded with static data — no writes from the app.

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| title | text | |
| description | text | |
| difficulty | text | Easy / Medium / Hard / Expert |
| duration_minutes | integer | |
| price | numeric | |
| theme | text | |
| image_url | text | |
| rating | numeric | |
| players_min | integer | |
| players_max | integer | |
| featured | boolean | Shown at top of list |

### `purchases`
Records which user bought which room.

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | References `auth.users` |
| room_id | uuid | References `rooms` |
| purchased_at | timestamptz | |

## Row Level Security (RLS)

RLS is enabled on the `purchases` table so users can only see and insert their own rows:

```sql
-- Read own purchases
create policy "Users can read own purchases"
  on purchases for select
  using (auth.uid() = user_id);

-- Insert own purchases
create policy "Users can insert own purchases"
  on purchases for insert
  with check (auth.uid() = user_id);
```

This is enforced at the database level — even if someone bypassed the UI, they couldn't read another user's purchases.

## Authentication

Supabase Auth handles email/password sign-up and sign-in. The session is stored in `localStorage` automatically and restored on page load. `AuthContext.tsx` wraps the app and exposes the current user to all components.
