# E-Classroom Platform

A comprehensive e-classroom platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. Features include AI-powered automated grading, real-time updates, group projects, and more.

## Features

- **Authentication**: Secure user authentication with Supabase Auth
- **Classes Management**: Create and join classes with unique class codes
- **Assignments**: Create assignments with due dates, points, and file attachments
- **AI-Powered Grading**: Automated grading using OpenAI GPT-4 with detailed rubrics
- **Rubrics System**: Create and manage grading rubrics with multiple criteria
- **Submissions**: Students can submit assignments with text and/or file uploads
- **Announcements**: Create and pin announcements for classes
- **Materials**: Upload and organize class materials
- **Group Projects**: Manage group projects and collaborations
- **Calendar View**: View assignments and deadlines in a calendar format
- **Real-time Updates**: Supabase Realtime for instant notifications and updates

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI Integration**: OpenAI API for automated grading
- **State Management**: React Hooks + Zustand (optional)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fyp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
   - Create storage buckets:
     - `assignments` (for assignment file uploads)
     - `materials` (for class materials)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
fyp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, signup)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── class/            # Class-related components
│   │   ├── assignment/       # Assignment components
│   │   ├── grading/          # Grading components
│   │   └── calendar/         # Calendar components
│   ├── lib/                  # Utilities and helpers
│   │   ├── supabase/         # Supabase client & helpers
│   │   ├── ai/               # AI grading logic
│   │   └── utils/            # General utilities
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   └── store/                # State management
├── supabase/
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

## Database Schema

The application uses the following main tables:
- `users` - User profiles
- `classes` - Class information
- `class_members` - Class membership
- `assignments` - Assignments
- `submissions` - Student submissions
- `rubrics` - Grading rubrics
- `announcements` - Class announcements
- `materials` - Class materials
- `group_projects` - Group projects
- `notifications` - User notifications

See `supabase/migrations/001_initial_schema.sql` for the complete schema.

## Key Features Implementation

### AI Grading

The AI grading system uses OpenAI GPT-4 to analyze student submissions against rubric criteria. The grading process:

1. Takes the submission content and attached rubric
2. Sends to OpenAI with a detailed prompt
3. Receives scores per criterion and overall feedback
4. Stores results in the database
5. Allows teachers to review and override AI grades

### Real-time Features

Supabase Realtime is used for:
- New announcements
- Assignment submissions
- Grades posted
- New class members

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

## License

This project is for educational purposes (Final Year Project).

## Contributing

This is a final year project. Contributions and suggestions are welcome!
