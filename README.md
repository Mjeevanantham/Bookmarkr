# Bookmarkr 🔖

**Your bookmarks, finally organized.**
Simple, fast, and private by default. Bookmarkr simulates a "Notion-like" aesthetic with robust real-time capabilities.

---

## 🚀 Key Features

- **AI-Powered**: Auto-magically tags and categorizes links using **Google Gemini AI**.
- **Infinite Marquee**: Smooth, CSS-only infinite scrolling for feature showcases.
- **Private by Default**: Row Level Security (RLS) ensures your data is yours alone.
- **Real-Time Sync**: Updates instantly across devices via **Supabase Realtime**.
- **Optimistic UI**: Interactions feel instant; we handle the server in the background.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS & Framer Motion
- **AI**: Google Gemini (Generative AI SDK)
- **Validation**: Zod & React Hook Form

---

## 🧠 Challenges & Solutions

Building a polished app isn't just about writing code; it's about solving specific hurdles. Here are a few we faced:

### 1. The "Infinite Marquee" Illusion

**Problem:** We wanted a buttery-smooth, infinite scrolling logo/feature strip without using heavy JavaScript libraries.
**Solution:** We implemented a pure CSS animation. By duplicating the feature array in the DOM and translating it exactly `-50%` over time, we achieved a seamless loop. We added `mask-image` gradients to fade the edges, giving it that premium "production-grade" feel.

### 2. Strict Linting vs. Rapid Development

**Problem:** Our CI/CD pipeline (Vercel) rejected builds due to strict ESLint rules (import order, `no-any`, `no-console`), which halted deployment.
**Solution:** Instead of disabling rules, we leaned into them. We ran `eslint --fix` to auto-sort imports and manually refactored `analyze.ts` and `add-bookmark-dialog.tsx` to remove `console.log` and replace `any` types with strict Zod-inferred types. This ensures the codebase stays maintainable long-term.

### 3. Secure AI Integration

**Problem:** We needed to use Google's Gemini API for auto-tagging, but exposing the API key on the client is a security risk.
**Solution:** We moved all AI logic to a **Server Action** (`src/actions/analyze.ts`). The client simply invokes the function, and the server handles the secure communication with Google, returning only the processed JSON metadata to the UI.

### 4. Database Type Sync

**Problem:** Keeping TypeScript interfaces in sync with our Supabase SQL schema is often a manual pain.
**Solution:** We defined a "source of truth" in `src/types/database.ts` that mirrors our SQL schema. We then used these shared types across our Zod schemas and API calls, preventing invalid data from ever reaching the database.

---

## 📦 Getting Started

1.  **Clone & Install**

    ```bash
    git clone https://github.com/Mjeevanantham/Bookmarkr.git
    cd bookmarkr
    npm install
    ```

2.  **Environment Setup**
    Copy `.env.example` to `.env.local` and add your keys:

    ```bash
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    GOOGLE_GENERATIVE_AI_API_KEY=...
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```

---

## 📜 License

MIT © 2026 Bookmarkr
