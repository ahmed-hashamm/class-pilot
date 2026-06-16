# Class Pilot

![Class Pilot](public/og-image.png)

**Class Pilot** is a comprehensive, AI-driven educational platform built with Next.js 16, TypeScript, Tailwind CSS, and Supabase. It revolutionizes classroom management by integrating intelligent automation and real-time collaboration features.

## ✨ Features

- **Automated AI Grading**: GPT-4 powered grading system that reads student submissions, compares them to custom rubrics, and provides instant, detailed feedback.
- **Real-Time Discussions**: Live class feeds and chat powered by Supabase Realtime and Upstash Redis.
- **Complete Class Management**: Join via unique codes, manage members, and organize cohorts securely.
- **Advanced Rubric Builder**: Create highly structured grading rubrics tailored for specific assignments.
- **Dynamic Materials & Assignments**: Seamless file uploads, due date tracking, and rich text instructions.
- **Secure Authentication**: Built on Supabase Auth, keeping student and teacher data isolated and secure.
- **Responsive & Accessible UI**: A dark-mode first, glassmorphic design that works perfectly on desktop and mobile.
- **Analytics Dashboard**: Track student progress and class performance with detailed insights.
- **Document Processing**: Support for PDF, Word, and PowerPoint file analysis with AI.

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database & Auth**: Supabase (PostgreSQL, Storage, Realtime, RLS)
- **AI Engine**: OpenAI API (GPT-4 Turbo)
- **State Management**: React Query, Context API
- **Form Handling**: React Hook Form with Zod validation
- **Realtime / Cache**: Upstash Redis
- **Emails / Auth Links**: Resend
- **Animations**: Framer Motion
- **Testing**: Vitest
- **Deployment**: Optimized for Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- [Supabase](https://supabase.com/) account
- [OpenAI](https://openai.com/) API key
- [Upstash Redis](https://upstash.com/) Database
- [Resend](https://resend.com/) API key

### Local Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ahmed-hashamm/class-pilot.git
cd class-pilot
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up local environment variables:**

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_OPENAI_MODEL=gpt-4-turbo

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@class-pilot.com

# Core App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_BETA=false
```

4. **Initialize Supabase:**

```bash
# Link to your Supabase project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push

# Create storage buckets (via Supabase Dashboard)
# - assignments
# - materials
# - avatars
```

5. **Start the Development Server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Production Deployment

Class Pilot is optimized for deployment on Vercel.

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Supply **all** environment variables exactly as they appear in `.env.local`. Set `NEXT_PUBLIC_APP_URL` to your production domain.
4. Ensure your Supabase Dashboard "Redirect URLs" accept your new Vercel domain.
5. If using Cloudflare for DNS, remember to use **DNS Only (Grey Cloud)** for the Vercel `A` and `CNAME` records to let Vercel handle SSL certificates.

## 🏛️ Project Structure

```
class-pilot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── [...routes]/
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   │   ├── classroom/
│   │   │   ├── assignments/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── api/               # API routes
│   │   │   ├── auth/
│   │   │   ├── classroom/
│   │   │   ├── assignments/
│   │   │   ├── ai/
│   │   │   └── notifications/
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   │
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── layout/            # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   ├── features/          # Feature-specific components
│   │   │   ├── classroom/
│   │   │   ├── assignments/
│   │   │   ├── analytics/
│   │   │   └── ai/
│   │   ├── home/              # Home page components
│   │   │   ├── hero.tsx
│   │   │   ├── features.tsx
│   │   │   ├── pricing.tsx
│   │   │   └── testimonials.tsx
│   │   ├── illustrations/     # SVG illustrations
│   │   └── providers/         # React context providers
│   │       ├── auth-provider.tsx
│   │       ├── theme-provider.tsx
│   │       └── query-provider.tsx
│   │
│   ├── actions/               # Server actions
│   │   ├── auth.ts
│   │   ├── classroom.ts
│   │   ├── assignments.ts
│   │   ├── ai.ts
│   │   └── users.ts
│   │
│   ├── lib/                   # Utility functions
│   │   ├── api-client.ts      # API request utilities
│   │   ├── auth.ts            # Authentication utilities
│   │   ├── utils.ts           # General utilities
│   │   ├── validators.ts      # Zod schema validators
│   │   ├── constants.ts       # App constants
│   │   ├── storage.ts         # LocalStorage utilities
│   │   ├── ai/
│   │   │   ├── openai-client.ts
│   │   │   ├── prompts.ts
│   │   │   └── processors.ts
│   │   └── db/
│   │       ├── supabase-client.ts
│   │       └── queries.ts
│   │
│   ├── types/                 # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── classroom.ts
│   │   ├── assignment.ts
│   │   ├── user.ts
│   │   ├── ai.ts
│   │   └── api.ts
│   │
│   ├── contexts/              # React Context
│   │   ├── auth-context.tsx
│   │   ├── theme-context.tsx
│   │   └── classroom-context.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-classroom.ts
│   │   ├── use-assignments.ts
│   │   ├── use-ai.ts
│   │   └── use-local-storage.ts
│   │
│   ├── middleware.ts          # Next.js middleware
│   └── styles/
│       └── globals.css
│
├── supabase/                  # Supabase database & migrations
│   ├── migrations/
│   │   ├── 001_auth_tables.sql
│   │   ├── 002_classroom_tables.sql
│   │   ├── 003_assignments_tables.sql
│   │   └── ...
│   └── seed.sql               # Database seed data
│
├── public/                    # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.example               # Environment variables template
├── .gitignore
├── components.json            # Shadcn/ui components config
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Project dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── PROJECT_STRUCTURE.md       # Detailed structure guide
└── README.md                  # This file
```

### Directory Organization

#### `/src/app` - Routing & API

- **App Router Pages**: Organized by route groups `(auth)`, `(dashboard)`
- **API Routes**: RESTful endpoints in `/api`
- **Middleware**: Authentication and request handling

#### `/src/components` - UI Layer

- **ui/**: Atomic, reusable components (Button, Card, Input, etc.)
- **layout/**: Layout wrapper components (Header, Sidebar, Footer)
- **features/**: Domain-specific components with business logic
- **home/**: Landing page components
- **providers/**: Context providers and wrappers

#### `/src/lib` - Business Logic

- **utilities**: Helper functions, formatters, validators
- **ai/**: OpenAI integration and prompt management
- **db/**: Supabase client and query builders
- **validators**: Zod schemas for data validation

#### `/src/types` - Type Definitions

Centralized TypeScript types organized by domain:

- `auth.ts` - Authentication types
- `classroom.ts` - Classroom and member types
- `assignment.ts` - Assignment and submission types
- `user.ts` - User profile types
- `ai.ts` - AI feature types
- `api.ts` - API response types

#### `/src/hooks` - Custom Hooks

Reusable React hooks following the `use-*` naming convention:

- `use-auth.ts` - Authentication state
- `use-classroom.ts` - Classroom operations
- `use-assignments.ts` - Assignment management
- `use-ai.ts` - AI features
- `use-local-storage.ts` - Client storage

## 🔒 Security Principles

- **Server-Side Verification**: Authentication heavily utilizes `@supabase/ssr` server checks.
- **Row Level Security (RLS)**: Users can only read/mutate data belonging to classes they are a confirmed member of.
- **Zod Validation**: Every server action validates requests against strict schemas before touching the DB.
- **Environment Isolation**: Sensitive keys are server-only; public keys are prefixed with `NEXT_PUBLIC_`
- **CSRF Protection**: Built-in Next.js CSRF protection for forms and actions

## 🧪 Testing

Run tests with:

```bash
npm run test
```

View test coverage:

```bash
npm run test:ui
```

## 📝 Code Quality

Lint code:

```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and style:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is developed as an advanced classroom management solution (Final Year Project).

## 📧 Contact & Support

For queries, bugs, or feature requests, please:

- Open an issue on GitHub
- Check the [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed architecture guide
- Visit our website: [class-pilot-wheat.vercel.app](https://class-pilot-wheat.vercel.app)

---

**Built with ❤️ for educators and students**
