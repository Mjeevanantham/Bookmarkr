# Bookmarkr

Smart Bookmark App.

## Getting Started

1.  **Clone the repository** (if not already)

2.  **Install dependencies**:

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**:
    Copy `.env.example` to `.env` and fill in your Supabase credentials.

    ```bash
    cp .env.example .env
    ```

    You need:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY` (Server-side/Scripts only)
    - `NEXT_PUBLIC_APP_URL` (e.g., http://localhost:3000)

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Architecture

- **Next.js 14 App Router**: Utilizing React Server Components (RSC) by default.
- **Supabase**:
  - `src/lib/supabase/client.ts`: Browser client using `@supabase/ssr`.
  - `src/lib/supabase/server.ts`: Server client using `@supabase/ssr` with cookie handling.
  - `src/lib/supabase/middleware.ts`: Session management for middleware.
- **Styling**:
  - **Tailwind CSS**: Utility-first CSS.
  - `src/styles/globals.css`: Global styles, variables, and glassmorphism utility.
  - `tailwind.config.ts`: Custom theme configuration.
- **Type Safety**:
  - Strict TypeScript configuration (`noImplicitAny`, `noUncheckedIndexedAccess`).
  - Zod for environment variable validation (`src/config/env.ts`).
- **Quality Assurance**:
  - ESLint (`next/core-web-vitals`, strict rules).
  - Prettier (formatting).
  - Husky & Lint-staged (pre-commit hooks).

## Folder Structure

- `src/app`: App Router pages and API routes.
- `src/components`: UI, Layout, and Feature components.
- `src/lib`: Core libraries (Supabase, Utils).
- `src/config`: Configuration (Env).
- `src/hooks`: Custom React hooks.
- `src/services`: Business logic services.
- `src/types`: TypeScript definitions.
- `src/styles`: Global styles.

## Commands

- `npm run lint`: Run ESLint.
- `npm run lint:fix`: Fix lint errors.
- `npm run format`: Format code with Prettier.
- `npm run type-check`: Run TypeScript check.
