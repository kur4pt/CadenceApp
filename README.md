# Cadence

Cadence is an open-source student productivity app for managing classes, coursework, deadlines, and reminders in one place.

The goal is simple: import a class schedule or syllabus, review the extracted information, and turn it into a usable schedule. Manual entry will also be supported.

## Status

Cadence is in early development. The current focus is building and verifying the scheduling backend before expanding the frontend.

### Implemented

* Authentication and protected routes
* Supabase and TanStack Query setup
* Course CRUD operations
* Input validation
* Database ownership rules with RLS
* Course integration checks

### Next

* Recurring course meetings
* Today and weekly schedule queries
* Assignments and exams
* Schedule and syllabus imports
* Reminders
* Frontend integration

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* TanStack Query
* Supabase Auth
* PostgreSQL with Row Level Security

## Getting Started

### 1. Clone the repository

For contributions, fork the repository first.

```bash
git clone https://github.com/kur4pt/CadenceApp.git
cd CadenceApp
npm ci
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```dotenv
VITE_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_KEY"
```

Use your own Supabase development project.

Never commit `.env`, service-role keys, secret keys, test credentials, or private student data.

### 3. Set up the database

Apply the migrations in order:

```text
supabase/migrations/202609050000_semesters.sql
supabase/migrations/202609050001_course_persistence.sql
```

Run each file through the Supabase SQL Editor.

The semester migration must be applied before the course migration.

### 4. Start development

```bash
npm run dev
```

## Checks

Run validation without database access:

```bash
npm run check:courses -- --validation-only
```

Build the project:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

### Course Integration Check

Create two confirmed users in your Supabase development project and add their credentials to `.env`:

```dotenv
COURSES_TEST_EMAIL_A="FIRST_TEST_USER_EMAIL"
COURSES_TEST_PASSWORD_A="FIRST_TEST_USER_PASSWORD"

COURSES_TEST_EMAIL_B="SECOND_TEST_USER_EMAIL"
COURSES_TEST_PASSWORD_B="SECOND_TEST_USER_PASSWORD"
```

Then run:

```bash
npm run check:courses
```

This verifies course CRUD, validation, ownership, semester ownership, and anonymous access.

Use dedicated test accounts.

## Project Structure

```text
src/
├── app/                 # Providers, routing, query config
├── components/          # Shared UI and layout
├── features/
│   ├── auth/            # Authentication
│   └── courses/         # Course logic and validation
├── lib/                 # Supabase client and database types
└── pages/               # Route pages

supabase/migrations/     # Database migrations
scripts/                 # Development checks
```

## Contributing

Contributions are welcome.

Before starting larger changes, check the repository issues or open one describing the problem you want to solve.

### Workflow

```bash
git switch main
git pull
git switch -c feat/your-feature
```

Then:

1. Keep the branch focused on one change.
2. Reuse existing patterns before adding new abstractions or dependencies.
3. Make the smallest complete change.
4. Run the relevant checks.
5. Push your branch.
6. Open a pull request into `main`.

Your pull request should explain:

* What problem it solves
* What changed
* How you tested it
* Any related issue

Draft pull requests are welcome for work that needs early feedback.

### Development Principles

* Understand the existing flow before changing it.
* Reuse existing helpers and dependencies.
* Keep changes focused.
* Validate user input.
* Enforce ownership at the database level.
* Handle failures explicitly.
* Add checks for nontrivial logic.
* Keep accessibility in mind.
* Commit migrations and development checks.
* Never commit secrets or private user data.

## Roadmap

1. Recurring course meetings
2. Schedule timezone and semester boundaries
3. Today and weekly schedule queries
4. Assignments and exams
5. Schedule and syllabus extraction
6. Reminders
7. Frontend integration

## License

Cadence is intended to remain open source.

An explicit open-source license has not been selected yet. A `LICENSE` file will be added before the project is formally distributed under a specific license.
