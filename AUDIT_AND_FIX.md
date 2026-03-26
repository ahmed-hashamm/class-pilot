# CLASS PILOT — AUDIT & FIX PROMPT
> Paste this into Cursor or any AI model. It will audit and fix the codebase in focused passes.

---

## INSTRUCTIONS FOR THE MODEL

You are auditing and fixing a Next.js 14 App Router SaaS (Class Pilot) for production readiness.
Stack: Next.js, Supabase, TypeScript, Tailwind CSS, Zod.

**Do NOT refactor everything at once. Work file by file, fix by fix.**
After each fix, state what you changed and why. If a fix requires a schema change, flag it separately — do not auto-apply.

---

## PASS 1 — SECURITY (Fix these first, no exceptions)

Check every server action and fix in this order:

1. **Auth** — Every action must start with `supabase.auth.getUser()`. If it uses `getSession()`, replace it. If it has no auth check, add one.
2. **Input validation** — Every action must parse its input with Zod before touching the DB. If missing, add a schema and `safeParse`.
3. **Ownership** — Before any UPDATE/DELETE, verify the authenticated user owns the resource. If missing, add the check.
4. **Env vars** — Scan all files. Any secret not prefixed `NEXT_PUBLIC_` must never appear in client components. Flag violations.

```ts
// Required shape for every server action
export async function action(payload: unknown) {
  const parsed = Schema.safeParse(payload)
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  // ownership check if mutating
  // business logic
  return { data: result, error: null }
}
```

---

## PASS 2 — DATABASE QUERIES

Scan all Supabase queries and fix:

1. Replace any `.select('*')` with specific column names
2. Replace any `.single()` on queries that could return 0 rows with `.maybeSingle()`
3. Any query that loops and calls DB inside the loop → rewrite as a join or `IN` query
4. Every query must destructure `{ data, error }` and check `error` before using `data`

---

## PASS 3 — COMPONENT QUALITY

For every component that fetches or mutates data:

1. **Loading state** — must exist. If missing, add a skeleton or spinner.
2. **Error state** — must exist. If missing, add an inline error message.
3. **Empty state** — if it renders a list, it must handle the empty array case.
4. **Button actions** — any button calling a server action must be disabled and show loading during the call.
5. **`'use client'` audit** — if a component has no event handlers, browser APIs, or hooks, remove `'use client'` and make it a server component.

---

## PASS 4 — TYPESCRIPT

1. Replace every `any` type with `unknown` + narrowing or a proper interface
2. Confirm `tsconfig.json` has `"strict": true`
3. Any untyped server action return must be typed as `Promise<{ data: T; error: null } | { data: null; error: string }>`

---

## PASS 5 — NEXT.JS SPECIFICS

1. Every page file must export a `metadata` object with `title` and `description`
2. All `<img>` tags → replace with `next/image` with explicit `width` and `height`
3. After every server action mutation, `revalidatePath()` or `revalidateTag()` must be called
4. Check `next.config.js` for security headers — if missing, add this:

```js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
]
// add to headers() in module.exports
```

---

## PASS 6 — CLEANUP

1. Remove all `console.log` calls (replace with structured log or delete)
2. Remove all commented-out code blocks
3. Replace any hardcoded role strings like `'teacher'` or `'student'` with a shared const/enum
4. Any `TODO` comment → either fix it now or convert to a `// KNOWN: <reason>` comment

---

## PASS 7 — COMPONENTIZATION

Goal: pages only fetch data and compose components. All JSX logic lives in components.

**Rules:**
- Any page file over 60 lines → extract the long sections into named components
- Any JSX block that repeats in more than one file → extract to `/components/ui/` and reuse
- Any inline conditional render over 10 lines → extract to its own component
- No JSX nesting deeper than 3 levels — flatten by naming inner blocks as components
- Any repeated `useState + isPending + error + action call` pattern → extract to a custom hook in `/lib/hooks/`

**A finished page must look like this:**
```tsx
export default async function ClassPage({ params }: Props) {
  const { data, error } = await getClassData(params.id)
  if (error) return <ErrorState message={error} />

  return (
    <>
      <PageHeader title={data.name} />
      <ClassStats classId={params.id} />
      <AssignmentList assignments={data.assignments} />
    </>
  )
}
```

Pages do not contain inline JSX logic. They import and compose.

---

## DO NOT TOUCH

- UI layout, design, or Tailwind class choices
- Feature logic that is working correctly
- Any file you are not confident about — flag it instead of guessing

---

## OUTPUT FORMAT

For each fix, respond as:

```
FILE: /actions/classActions.ts
ISSUE: No auth check on deleteClass action
FIX: Added getUser() call at top of action, returns 'Unauthorized' if null
```

If you find something that needs a DB migration or architectural change, respond as:

```
FLAG (needs review): submissions table may be missing grading_status column
REASON: grading fallback logic expects 'pending' | 'completed' | 'failed' values
ACTION NEEDED: Add column via Supabase migration, do not auto-apply
```
