import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

// Enforce server-side variables in server environment
if (typeof window === 'undefined') {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is missing in server environment');
  }
}

export const env = _env.data;
