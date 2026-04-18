import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // Redis (Upstash)
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

  // Email (Resend)
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),

  // App URL
  NEXT_PUBLIC_APP_URL: z.string().url().default("https://theclasspilot.com"),

  // Node Env
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

/**
 * Validate all environment variables at startup.
 * Throws a helpful error if any required variables are missing or invalid.
 */
export const validateEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      JSON.stringify(parsed.error.format(), null, 2)
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

export const env = validateEnv();
