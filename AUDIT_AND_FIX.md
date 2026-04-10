# Class Pilot — Pre-Deployment Production Audit

> Work through every section top to bottom. Mark each item `[x]` when confirmed. Do not mark done until you have verified it in the actual code, not from memory.

---

## 1. Security

### 1.1 Authentication & Authorization
- [ ] Every API route checks `supabase.auth.getUser()` before doing anything else
- [ ] No route trusts data from `req.body` to identify the user — only the session
- [ ] Teacher-only routes (create assignment, add poll, manage class) verify `role === 'teacher'` server-side
- [ ] Student-only routes verify `role === 'student'` where applicable
- [ ] No user can access another user's class data — verify `class_id` ownership before every query
- [ ] Chat history is scoped to `user_id + class_id` — a student cannot read another student's history
- [ ] File upload endpoints validate that the uploading user is a member of the target class

### 1.2 Supabase RLS (Row Level Security)
- [ ] RLS is enabled on every table — run this and confirm zero rows returned:
  ```sql
  SELECT tablename FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT DISTINCT tablename FROM pg_policies
    WHERE schemaname = 'public'
  );
  ```
- [ ] `materials` table: only class members can SELECT, only teachers can INSERT/UPDATE/DELETE
- [ ] `assignments` table: students can only SELECT their own class's assignments
- [ ] `submissions` table: students can SELECT/INSERT their own submissions only
- [ ] `chat_history` table: users can only SELECT/DELETE their own rows
- [ ] `material_chunks` table: accessible only via the RPC, not direct SELECT
- [ ] `ai_usage_logs` table: no public read access
- [ ] Admin client (`createAdminClient`) is NEVER used client-side — only in Server Actions and API routes
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is not prefixed with `NEXT_PUBLIC_` — confirm in `.env`

### 1.3 API Routes
- [ ] All POST/PUT/DELETE routes validate input with Zod before processing
- [ ] No route returns raw database errors to the client — catch and return generic messages
- [ ] File upload routes validate file type (whitelist: pdf, docx, pptx, png, jpg) and file size (set a max)
- [ ] Rate limiting is in place for the AI chat endpoint — prevent abuse
- [ ] The `/api/chat/class` route cannot be called with a `classId` the user is not a member of
- [ ] No API keys or secrets are logged with `console.log`

### 1.4 Environment Variables
- [ ] `.env.local` is in `.gitignore` — run `git status` and confirm it never appears
- [ ] No secrets committed in git history — run `git log --all --full-history -- .env*`
- [ ] All required env vars are documented in a `.env.example` file with placeholder values
- [ ] Production env vars are set in Vercel dashboard, not in any committed file
- [ ] `NEXT_PUBLIC_` vars contain nothing sensitive — they are exposed to the browser

### 1.5 Storage
- [ ] Supabase Storage bucket policies prevent users from reading other classes' files
- [ ] Uploaded file paths include the `class_id` and `user_id` to namespace them
- [ ] No bucket is set to fully public unless it serves public assets (e.g. avatars)
- [ ] File download URLs are generated server-side with signed URLs, not exposed raw paths

---

## 2. UI & Design Consistency

### 2.1 Design System
- [ ] Navy (`#0f2044`) and Yellow (`#f5c842`) are used consistently across all components — no rogue blue or green accents
- [ ] All font sizes are consistent — no random `text-[11px]` or `text-[17px]` that breaks the scale
- [ ] Border radius is consistent — `rounded-lg` for cards, `rounded-xl` for inputs and buttons
- [ ] Spacing uses Tailwind classes consistently — no mixed `px-3` and `px-[13px]`
- [ ] All interactive elements have hover and active states
- [ ] All disabled states are visually obvious (opacity-40 minimum)

### 2.2 Responsive Design
- [ ] All pages tested at 375px (iPhone SE), 768px (iPad), 1280px (laptop), 1920px (desktop)
- [ ] No horizontal overflow on any page — check with Chrome DevTools mobile emulation
- [ ] Navigation works on mobile — hamburger or bottom nav if applicable
- [ ] Chat modal displays correctly on mobile (bottom sheet) and desktop (centered modal)
- [ ] Tables and data-heavy views scroll horizontally on small screens rather than breaking layout
- [ ] Touch targets are at least 44x44px on mobile

### 2.3 Loading & Empty States
- [ ] Every data-fetching component has a loading skeleton or spinner
- [ ] Every list that can be empty has a proper empty state with a helpful message (not just blank)
- [ ] Buttons that trigger async actions show a loading spinner and disable during the request
- [ ] Page-level loading states use Next.js `loading.tsx` files where appropriate

### 2.4 Error States
- [ ] Every `try/catch` in client components shows a user-facing error message, not just `console.error`
- [ ] Form validation errors are shown inline next to the relevant field, not only as a toast
- [ ] Network errors (failed fetch) show a retry option where possible
- [ ] 404 and 500 pages are custom branded — not the default Next.js error pages
- [ ] `error.tsx` and `not-found.tsx` exist at the app level

### 2.5 Typography
- [ ] No ALL CAPS text in UI outside of intentional label/badge usage
- [ ] No mixed case inconsistencies (e.g. `GROP2` vs `Group Alpha`)
- [ ] Text truncates with `truncate` class when overflowing containers — no text bleeding outside cards
- [ ] Long unbroken strings (URLs, file names) use `break-words` or `overflow-hidden`

### 2.6 Forms
- [ ] All form inputs have visible labels (not just placeholders)
- [ ] Required fields are marked clearly
- [ ] Form submission is prevented on Enter where unintended (e.g. search inputs)
- [ ] Forms disable submit button and show loading state on submission
- [ ] Success and error feedback is shown after every form submission
- [ ] Input fields clear or reset appropriately after successful submission

---

## 3. Performance

### 3.1 Images
- [ ] All images use Next.js `<Image>` component — not raw `<img>` tags
- [ ] Images have explicit `width` and `height` to prevent layout shift (CLS)
- [ ] User avatars and profile photos are resized before storage, not full-resolution originals
- [ ] No images above 200KB on initial page load

### 3.2 Bundle Size
- [ ] Run `next build` and check the output — no page should exceed 500KB first load JS
- [ ] Heavy libraries (e.g. pdf parsers, chart libraries) are dynamically imported where possible:
  ```typescript
  const HeavyComponent = dynamic(() => import('./HeavyComponent'), { ssr: false })
  ```
- [ ] No unused dependencies in `package.json` — run `npx depcheck`
- [ ] `console.log` statements removed from production code (or guarded by `process.env.NODE_ENV !== 'production'`)

### 3.3 Database Queries
- [ ] No N+1 queries — data fetched in parallel with `Promise.all` where possible
- [ ] Supabase queries select only needed columns — no `select('*')` in production routes
- [ ] Paginated lists use `.range()` or `.limit()` — never fetch unbounded rows
- [ ] Indexes exist on frequently queried foreign keys:
  ```sql
  -- Check existing indexes
  SELECT tablename, indexname, indexdef
  FROM pg_indexes
  WHERE schemaname = 'public'
  ORDER BY tablename;
  ```
- [ ] `material_chunks` table has a vector index (ivfflat or hnsw) for fast similarity search:
  ```sql
  SELECT indexname FROM pg_indexes
  WHERE tablename = 'material_chunks';
  ```

### 3.4 AI / API Calls
- [ ] OpenAI calls have a timeout — they should not hang indefinitely
- [ ] Failed AI calls fall back gracefully — error message to user, not a blank response
- [ ] Token usage is logged for every AI call (you have this — confirm it works in production)
- [ ] Enrichment step skips correctly for live-data questions (regex gate is working)
- [ ] No API keys are passed from client to server — all AI calls happen server-side only

---

## 4. Code Quality

### 4.1 TypeScript
- [ ] Run `npx tsc --noEmit` — zero type errors
- [ ] No `any` types in critical paths (auth, AI routes, database queries) — replace with proper types
- [ ] Supabase generated types (`database.types.ts`) are up to date — regenerate if schema changed:
  ```bash
  npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
  ```
- [ ] All Server Actions and API route handlers have typed request/response shapes


### 4.2 Dead Code
- [ ] No commented-out code blocks in production files (the old `retrieve-context.ts` comment block is removed)
- [ ] No unused imports — run ESLint and fix all warnings
- [ ] No unused state variables or hooks
- [ ] No `TODO` or `FIXME` comments that relate to security or core functionality

### 4.3 Error Handling
- [ ] Every `async/await` block has a `try/catch` or uses `.catch()`
- [ ] Fire-and-forget operations (chat history saves) log errors but never throw to the user
- [ ] Supabase query results always check for `error` before using `data`
- [ ] The `match_material_chunks` RPC error is handled — empty result fallback works correctly

### 4.4 Server Actions
- [ ] All Server Actions validate input with Zod before processing
- [ ] All Server Actions check authentication before performing mutations
- [ ] No Server Action returns sensitive data (passwords, keys, full user records) to the client
- [ ] `revalidatePath` or `revalidateTag` called after mutations that affect cached pages

### 4.5 Code Structure
- [ ] All Pages must be under 100-150 lines of code, divide them into componenets so the code says clean and understandable
- [ ] Make the components reusable where possible and make sure that there is no redundant code and the reuseable componenets are used
- [ ] Make sure you check and scan every file of code while refactoring


---

## 5. Accessibility (Basic)

- [ ] All images have meaningful `alt` text — not empty, not "image"
- [ ] All interactive elements are keyboard-accessible (Tab, Enter, Space)
- [ ] Color is not the only indicator of status — badges also have text labels
- [ ] Form inputs have associated `<label>` elements (via `htmlFor` or wrapping)
- [ ] Focus ring is visible on all focusable elements — not removed with `outline: none` without replacement
- [ ] Page has a single `<h1>` per route
- [ ] Contrast ratio is sufficient — navy on white and white on navy both pass WCAG AA (they do — confirm yellow on navy passes too)

---

## 6. SEO & Metadata

- [ ] Every page has a unique `<title>` via Next.js metadata API
- [ ] Every page has a `description` meta tag
- [ ] `opengraph` metadata is set for the landing/marketing pages
- [ ] `robots.txt` exists and is correctly configured — authenticated app routes should be `noindex`
- [ ] `favicon.ico` and app icons are set
- [ ] No broken links in navigation or footer

---

## 7. Infrastructure & Deployment

### 7.1 Vercel Configuration
- [ ] All environment variables are set in Vercel project settings (not just locally)
- [ ] Production and Preview environments have separate Supabase projects or at minimum separate API keys
- [ ] Vercel deployment region matches Supabase region to minimize latency
- [ ] `next.config.js` has no development-only settings leaking into production

### 7.2 Supabase
- [ ] Email confirmation is enabled for new signups
- [ ] Password reset flow works end-to-end
- [ ] Supabase project is not on the free tier pause policy — confirm it won't auto-pause after 1 week of inactivity
- [ ] Database backups are enabled (Pro plan) or you have a manual backup strategy
- [ ] `match_material_chunks` function has `SECURITY DEFINER` or correct permissions set
- [ ] Storage bucket CORS policy allows only your production domain

### 7.3 Redis (Upstash)
- [ ] Redis connection string is set in production env vars
- [ ] Redis cache keys are namespaced by environment (`prod:`, `dev:`) to prevent cross-contamination
- [ ] TTL is set on all cached keys — no keys that live forever
- [ ] Redis errors are caught and fall back to uncached behavior — a Redis outage should not crash the app

### 7.4 Domain & HTTPS
- [ ] Custom domain is configured and HTTPS is enforced
- [ ] `www` redirects to non-`www` (or vice versa) — no duplicate URLs
- [ ] HSTS header is set

---

## 8. Final Smoke Tests

Run these manually in the browser before signing off:

### Student Flow
- [ ] Sign up as a new student → receive confirmation email → confirm → land on dashboard
- [ ] Join a class with a class code
- [ ] View the class feed — assignments, announcements, polls, attendance all display correctly
- [ ] Submit an assignment
- [ ] Open Class Pilot AI chat → ask about an uploaded material → get a correct answer
- [ ] Ask about upcoming deadlines → get correct response
- [ ] Ask a casual question ("am I following along?") → get a conversational response
- [ ] Clear chat history → reopen chat → history is gone
- [ ] Attempt to access another class's URL directly → get 403 or redirect

### Teacher Flow
- [ ] Create a class
- [ ] Create an assignment with a due date → verify it appears as upcoming for students
- [ ] Upload a material → toggle AI sync → verify it becomes queryable in the chat
- [ ] Create a poll → close it → verify it disappears from active polls
- [ ] Open attendance → close it → verify status updates
- [ ] Post an announcement → verify it appears in the feed
- [ ] Create student groups

### AI Chat
- [ ] Ask about a specific material by filename → correct answer
- [ ] Ask about a specific material by title → correct answer
- [ ] Ask a follow-up question without referencing the document → resolves from context
- [ ] Ask when no materials are synced → "no materials found" response, not an error
- [ ] Ask about a past assignment → correctly identified as past, not upcoming

### Edge Cases
- [ ] Upload a very large file (>10MB) → handled gracefully with a size limit message
- [ ] Submit a form with empty fields → validation fires, not a server error
- [ ] Open the app with slow network throttling (Chrome DevTools: Slow 3G) → loading states appear, app does not look broken
- [ ] Log out → try to access a protected route directly → redirected to login

---

## 9. Pre-Launch Checklist

- [ ] Remove all `console.log` debug statements
- [ ] Remove the commented-out old code in `retrieve-context.ts`
- [ ] Remove the embedding debug log added during development
- [ ] Set `NODE_ENV=production` in Vercel
- [ ] Run `next build` locally — zero errors, zero warnings
- [ ] Run `npx tsc --noEmit` — zero type errors
- [ ] Test on a real mobile device, not just Chrome DevTools emulation
- [ ] Share with one real user (classmate or friend) and watch them use it — fix what confuses them

---

> **Audit completed by:** ________________  
> **Date:** ________________  
> **Build commit:** ________________  
> **Status:** Not started / In progress / Ready for deployment
