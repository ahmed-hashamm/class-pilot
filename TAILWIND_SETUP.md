# Tailwind CSS Configuration Notes

## Current Setup

Your project is using **Tailwind CSS v4**, but your `globals.css` file uses **Tailwind v3 syntax** (`@tailwind` directives).

## Two Options:

### Option 1: Use Tailwind v3 (Recommended if you want to keep current CSS syntax)

If you want to keep the `@tailwind` directives in your CSS, you should downgrade to Tailwind v3:

```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3 postcss autoprefixer
```

Then update `postcss.config.mjs`:
```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Option 2: Update CSS for Tailwind v4 (Recommended for future-proofing)

If you want to use Tailwind v4, update the first lines of `globals.css`:

**Change from:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**To:**
```css
@import "tailwindcss";
```

## Current Configuration

I've created a `tailwind.config.ts` file that:
- Maps all your CSS variables to Tailwind colors
- Configures custom colors (navy, yellow, sidebar, etc.)
- Sets up dark mode support
- Configures font families

## CSS Variables Mapping

All your CSS variables in HSL format are now mapped in the Tailwind config:
- `--background` → `bg-background`
- `--foreground` → `text-foreground`
- `--navy` → `bg-navy` or `text-navy`
- `--navy-light` → `bg-navy-light`
- `--accent` → `bg-accent`
- And all other variables...

## Usage

You can now use classes like:
- `bg-navy` for navy background
- `text-primary-foreground` for white text on navy
- `bg-accent` for yellow background
- `text-accent-foreground` for dark text on yellow
- All standard Tailwind utilities work with your custom colors

## Note

The linter warnings about `@tailwind` and `@apply` are normal - they're Tailwind-specific directives that the CSS linter doesn't recognize, but they work fine at build time.

