# 🚀 Redis Integration Setup Guide

I have integrated Redis caching and rate limiting into **Class Pilot**. This will reduce your AI costs, improve speed, and protect your API from abuse.

## 1. Get Upstash Credentials
1.  Go to [console.upstash.com](https://console.upstash.com/) and log in (or create a free account).
2.  Click **"Create Database"**.
3.  Name it `class-pilot-redis` and select the region closest to your Supabase/Vercel deployment.
4.  Once created, scroll down to the **REST API** section.
5.  Copy the **`UPSTASH_REDIS_REST_URL`** and **`UPSTASH_REDIS_REST_TOKEN`**.

## 2. Update Environment Variables
Add the following to your `.env.local` file:

```bash
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

## 3. How to Verify
Once you've added the variables and restarted your dev server (`npm run dev`), the following features will be active:

- **AI Grading Cache**: The first time you grade a student, it will take the usual time. The *second* time (if you refresh or re-run), it will be near-instant.
- **Rate Limiting**: Teachers are limited to 100 AI grades per hour to prevent accidental cost spikes.
- **Poll Caching**: Poll results are cached for 10 seconds to protect your database during high-traffic voting.

## 🛠️ Internal Implementation Details
- **Location**: `src/lib/redis.ts`
- **Utility**: `src/lib/utils/rate-limit.ts`
- **Safety**: The code uses a `redisSafe` wrapper. If Redis is down, the app **will not crash**—it will simply fall back to querying Supabase or OpenAI directly.

---
**Happy Caching!**
