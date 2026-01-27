# Google Authentication Setup Guide

## Implementation Complete ✅

All code changes have been applied. Now you need to configure Google OAuth in Supabase.

## Step 1: Configure Google OAuth in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list and click on it
5. Toggle **Enable Google provider** to ON

## Step 2: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - Choose **External** user type
   - Fill in app name, user support email, developer contact
   - Add scopes: `email`, `profile`
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Your app name
   - Authorized redirect URIs: 
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - For local development: `http://localhost:3000/auth/callback`
7. Copy the **Client ID** and **Client Secret**

## Step 3: Add Credentials to Supabase

1. Back in Supabase Dashboard → Authentication → Providers → Google
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

## Step 4: Add Redirect URL to Google Console

Make sure you've added this redirect URL to your Google OAuth client:
- Production: `https://<your-project-ref>.supabase.co/auth/v1/callback`
- Local: `http://localhost:3000/auth/callback` (if testing locally)

## Step 5: Test the Implementation

1. Start your dev server: `npm run dev`
2. Navigate to `/login`
3. Click "Continue with Google"
4. You should be redirected to Google sign-in
5. After signing in, you'll be redirected back to your dashboard
6. Your avatar should appear in the navbar!

## Features Implemented

✅ Google OAuth sign-in button on login page
✅ Auth callback route to handle OAuth redirects
✅ Avatar display in navbar (from Google profile picture)
✅ Enhanced dropdown with user details
✅ Automatic profile creation for OAuth users
✅ Avatar URL stored in database
✅ Real-time auth state updates

## Troubleshooting

### Images not loading
- Check that `next.config.ts` has the correct `remotePatterns` for Google images
- Verify the avatar URL is being fetched correctly in browser console

### Redirect errors
- Ensure redirect URLs match exactly in both Google Console and Supabase
- Check that the callback route is accessible

### Profile not created
- Check Supabase logs for any database errors
- Verify RLS policies allow inserts to the `users` table

## Database

The `avatar_url` column already exists in your `users` table from the initial migration, so no database changes are needed!

