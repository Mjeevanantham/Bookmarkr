# Bookmarkr - Smart Bookmark App

> Your bookmarks, finally organized. Simple, fast, and private by default.

A minimal, D2C-focused bookmark manager built with **Next.js 14**, **Supabase**, and **Tailwind CSS**. Designed to simulate a "Notion-like" clean aesthetic with robust real-time capabilities.

## 🚀 Live Demo

- **URL**: [https://bookmarkr-your-vercel-url.vercel.app](https://bookmarkr-your-vercel-url.vercel.app) (Replace with your Vercel URL)
- **Repo**: [https://github.com/your-username/bookmarkr](https://github.com/your-username/bookmarkr)

## ✨ Core Features (Scope of Work)

1.  **Google OAuth Only**: Simplified login flow using Supabase Auth (no email/password clutter).
2.  **Add Bookmarks**: Frictionless creation flow (URL + Title) with optional metadata.
3.  **Private by Default**: Strict Row Level Security (RLS) ensures users only see their own data.
4.  **Real-Time Sync**: Changes reflect instantly across tabs and devices using Supabase Realtime subscriptions.
5.  **D2C Polish**:
    - "Notion-style" collapsible sidebar.
    - Minimal black-and-white aesthetic (Zinc theme).
    - Optimistic UI updates for instant feedback.
6.  **AI-Powered Metadata**: Auto-generate tags, descriptions, priority, and status using Google Gemini AI.
7.  **Theme Customization**: Full support for Light, Dark, and System themes.
8.  **Responsive Layout**: Fully functional on desktop and mobile.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **Styling**: Tailwind CSS, shadcn/ui (Radix Primitives), Lucide Icons
- **State Management**: React Hooks + Supabase Realtime
- **Deployment**: Vercel

## 🧠 Challenges & Solutions (Problem Solving Log)

During development, we encountered and solved several key challenges to ensure a "perfect" implementation:

### 1. Real-Time Interactions & Optimistic Features

- **Problem**: Waiting for server confirmation makes the app feel slow.
- **Solution**: Implemented **Optimistic UI** updates in `useBookmarks`. When a user adds or deletes a bookmark, the UI updates _immediately_ while the server request happens in the background. If the request fails, the changes are rolled back automatically. This creates a "lightning fast" D2C experience.

### 2. Database Schema & Type Safety

- **Problem**: Keeping TypeScript types in sync with the Supabase SQL schema.
- **Solution**: Created a centralized `types/database.ts` file that manually mirrors the SQL schema. We enforced strict `CHECK` constraints in Postgres (e.g., `theme IN ('light', 'dark', 'system')`) and matched them with TypeScript enums to prevents invalid data insertion.

### 3. "Notion-Minimal" Sidebar Layout

- **Problem**: Creating a collapsible sidebar that persists state and handles mobile responsiveness cleanly.
- **Solution**: Built a custom `DashboardLayout` component using Tailwind classes for smooth width transitions (`w-64` to `w-[60px]`). We utilized `Tooltip` components from shadcn/ui to show navigation labels when the sidebar is collapsed, maintaining usability without clutter. The profile section was moved to the bottom to match industry standards.

### 4. Build & Deployment Errors

- **Problem**: Encountered `MODULE_NOT_FOUND` errors with specific dependencies during the Vercel build process.
- **Solution**: Audited `package.json` to ensure peer dependencies for `framer-motion` and `@google/generative-ai` were correctly installed (or removed if unused). Cleaned up unused imports in `src/app` to ensure a zero-warning production build.

## 📦 Getting Started

1.  **Clone the repo**:

    ```bash
    git clone https://github.com/your-username/bookmarkr.git
    cd bookmarkr
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Copy `.env.example` to `.env.local` and add your keys:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_keys
    ```

4.  **Reset Database (Crucial)**:
    Run the `supabase/schema.sql` script in your Supabase SQL Editor to set up tables, triggers, and RLS policies.

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📜 License

MIT
