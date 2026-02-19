# Bookmarkr — Completion Plan

## Audit Summary (as of 2026-02-19)

---

## ✅ WHAT IS DONE

### Infrastructure

- [x] Next.js 14 App Router project with TypeScript
- [x] Zod-validated env config (`src/config/env.ts`)
- [x] Supabase client (`createBrowserClient`) and server (`createServerClient`) set up
- [x] Middleware for session refresh + route protection (`/dashboard` → `/login` if unauthenticated, `/login` → `/dashboard` if authenticated)
- [x] Auth callback route (`/auth/callback`) — exchanges code for session
- [x] Auth error page (`/auth/auth-code-error`)
- [x] Health check API (`/api/health`)
- [x] shadcn/ui fully initialized with: button, card, badge, input, dropdown-menu, avatar, sheet, dialog, tabs, switch, toast, skeleton, command, tooltip, separator, label

### Auth

- [x] Google OAuth login page (UI complete, Supabase `signInWithOAuth` wired correctly)
- [x] Google OAuth callback handling
- [x] Route protection via middleware
- [x] Session refresh in middleware
- [x] Logout in dashboard layout (calls `supabase.auth.signOut()`)
- [ ] **MISSING: Profile auto-creation** — no DB trigger or logic to insert into `profiles` table on first login

### Landing Page

- [x] Rebuilt with WavyBackground (animated canvas hero)
- [x] Auth-aware CTA: "Start Free" → `/login`, "Go to Dashboard" → `/dashboard`
- [x] User chip shown in nav when logged in (avatar, name, email from Supabase metadata)
- [x] Feature grid (4 cards)
- [x] Builds and passes ESLint/TypeScript

### Dashboard Layout

- [x] Sidebar with nav links (Dashboard, Bookmarks, Settings)
- [x] Header with search input and view toggle (grid/list)
- [x] User avatar in header dropdown (Settings + Logout)
- [x] Real Supabase user data fetched (avatar, full_name, email)
- [x] Skeleton loading states for user data
- [x] Active route highlight in sidebar

### Dashboard Page (`/dashboard`)

- [x] Stats cards (Total, High Priority, Reading, Completed) — UI exists
- [x] Bookmark card grid/list with skeleton loading
- [x] Empty state component inline
- [x] Search filtering (client-side, against mock data)
- [x] Grid/list view toggle with localStorage persistence
- [ ] **MISSING: Real Supabase data** — currently uses hardcoded `mockBookmarks`
- [ ] **MISSING: Add Bookmark button** — button exists but no Dialog/action wired
- [ ] **MISSING: Edit/Delete** — dropdown items have no handlers

### Bookmarks Page (`/dashboard/bookmarks`)

- [x] Same card UI as dashboard, reuses mock data
- [x] Search filtering (client-side)
- [x] Grid/list view
- [x] Empty state
- [ ] **MISSING: Real Supabase data**
- [ ] **MISSING: Filter by status / priority** — no filter controls rendered
- [ ] **MISSING: CRUD actions**

### Settings Page (`/dashboard/settings`)

- [x] Four tabs: Profile, Notifications, Integrations, Appearance — UI shells
- [x] Profile tab: Name + Email inputs (static, not bound to real user data)
- [x] Slack webhook input — captured in state, not persisted
- [x] Theme buttons — no logic connected
- [ ] **MISSING: Profile tab pre-fills real user data and can save display name**
- [ ] **MISSING: Settings are not persisted anywhere (Supabase)**
- [ ] **MISSING: Theme switching logic** (no ThemeProvider, no dark mode)

### Loading States

- [x] Root `loading.tsx` (PageLoader component)
- [x] Dashboard `loading.tsx`
- [x] Skeleton loading for user avatar in sidebar/header
- [x] Skeleton loading for bookmark cards on dashboard
- [ ] **MISSING: Bookmarks page and settings page have no loading states**

### Types

- [x] Basic `User` and `BasicResponse` types in `src/types/index.ts`
- [ ] **MISSING: `Bookmark` type in shared types** — defined inline in dashboard page only, not shared
- [ ] **MISSING: No Supabase-generated DB types**

### AI

- [x] `src/lib/ai.ts` — Gemini client factory, `getGeminiModel` helper
- [ ] **MISSING: No API route that uses the AI client**
- [ ] **MISSING: No UI that triggers AI summarization**

### Database

- [ ] **MISSING: No `bookmarks` table schema anywhere in the repo** (no SQL migrations, no Supabase schema file)
- [ ] **MISSING: No RLS policies defined in the codebase**
- [ ] **MISSING: No `profiles` table schema**
- [ ] **MISSING: Supabase Realtime subscription** — not wired anywhere

---

## ❌ WHAT IS MISSING (Prioritized by Scope)

### P0 — Core (Blockers, product doesn't work without these)

| #   | What                                                               | Where                                               |
| --- | ------------------------------------------------------------------ | --------------------------------------------------- |
| 1   | **`bookmarks` table + RLS schema**                                 | Supabase SQL (needs to be documented / applied)     |
| 2   | **`profiles` table + trigger for auto-creation**                   | Supabase SQL                                        |
| 3   | **Supabase-generated TypeScript types**                            | `src/types/database.ts`                             |
| 4   | **Bookmark CRUD service layer**                                    | `src/services/bookmarks.ts`                         |
| 5   | **Real data on Dashboard page** — replace mock with Supabase fetch | `src/app/dashboard/page.tsx`                        |
| 6   | **Add Bookmark dialog** — form with all fields, optimistic insert  | `src/components/bookmarks/add-bookmark-dialog.tsx`  |
| 7   | **Edit Bookmark dialog** — pre-filled form, optimistic update      | `src/components/bookmarks/edit-bookmark-dialog.tsx` |
| 8   | **Delete confirmation** — optimistic delete                        | Inline in bookmark card                             |
| 9   | **Realtime subscription** — multi-tab sync                         | `src/hooks/use-bookmarks.ts`                        |

### P1 — Important (product feels broken without these)

| #   | What                                                                                         | Where                                  |
| --- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| 10  | **Status + Priority filter controls** on Bookmarks page                                      | `src/app/dashboard/bookmarks/page.tsx` |
| 11  | **Settings Profile tab** — pre-fill from Supabase, save `display_name`                       | `src/app/dashboard/settings/page.tsx`  |
| 12  | **Settings persistence to Supabase** — save Slack webhook, notifications prefs to `profiles` | `src/app/dashboard/settings/page.tsx`  |
| 13  | **Shared `Bookmark` type** extracted to `src/types/index.ts`                                 | `src/types/index.ts`                   |
| 14  | **Loading states on Bookmarks + Settings pages**                                             | respective page files                  |

### P2 — Polish (nice-to-have, improves quality)

| #   | What                                                                              | Where                               |
| --- | --------------------------------------------------------------------------------- | ----------------------------------- |
| 15  | **Theme switching** — `next-themes` ThemeProvider + Settings appearance tab wired | `src/app/layout.tsx`, settings page |
| 16  | **Reminder_at field** — optional date picker in add/edit dialog                   | Add/edit dialog                     |
| 17  | **AI summary** — button in Add dialog to fetch AI-generated description from URL  | API route + dialog                  |
| 18  | **Slack reminder** — notify via webhook when reminder_at fires                    | Background cron or API route        |
| 19  | **Stats on dashboard** — real numbers from Supabase                               | Dashboard page                      |
| 20  | **README** — setup, env vars, schema instructions                                 | `README.md`                         |

---

## 🏗 IMPLEMENTATION ORDER

### Phase 1 — Database Foundation (do first, everything depends on this)

1. Write `bookmarks` table SQL with RLS
2. Write `profiles` table SQL + trigger
3. Generate/write TypeScript types for DB schema
4. Create `src/services/bookmarks.ts` CRUD service

### Phase 2 — Live Bookmark CRUD (core product loop)

5. `useBookmarks` hook — fetch, realtime subscription, optimistic mutations
6. Replace mock data on Dashboard page
7. Add Bookmark dialog (all fields)
8. Edit + Delete actions on card dropdown
9. Real stats from actual data

### Phase 3 — Filters + Bookmarks Page

10. Status filter (All / Saved / Reading / Completed)
11. Priority filter (All / High / Medium / Low)
12. Wire filters on Bookmarks page (real data)
13. Loading skeletons on Bookmarks + Settings pages

### Phase 4 — Settings Fully Functional

14. Profile tab: load + save display name to `profiles`
15. Slack webhook: persisted to `profiles.slack_webhook`
16. Theme preference: `next-themes`, persisted to `profiles.theme`

### Phase 5 — Optional Enhancements (pick 1-2)

17. AI URL summarization (Gemini — already has client)
18. Slack reminder via webhook

---

## 📐 Database Schema (To Be Applied in Supabase)

```sql
-- profiles table (mirrors auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  slack_webhook text,
  theme text default 'system',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- bookmarks table
create table public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('saved', 'reading', 'completed')) default 'saved',
  reminder_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.bookmarks enable row level security;
create policy "Users can CRUD own bookmarks" on public.bookmarks
  for all using (auth.uid() = user_id);

-- enable realtime
alter publication supabase_realtime add table public.bookmarks;
```

---

## Current State: ~35% Complete

- Auth shell: ✅ 90% done (missing profile auto-creation trigger in DB)
- UI/Layout: ✅ 85% done (missing filters, theme switch)
- Data layer: ❌ 0% done (no DB schema, no service, no real data)
- CRUD: ❌ 0% done
- Realtime: ❌ 0% done
- Settings persistence: ❌ 0% done
