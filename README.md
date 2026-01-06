

### One-Command Setup

```bash
# Clone repository
git clone <repo-url>
cd project-events

# Install dependencies
npm install

# Setup database and start server
npm run start:seed
```

This will:
1. Generate database schema
2. Run migrations (create tables)
3. Seed 29 users, 50 events, and ~200 registrations
4. Start dev server at [http://localhost:3000](http://localhost:3000)

### Login

Open [http://localhost:3000](http://localhost:3000) and login with:

- **Admin**: `admin@example.com` / `admin123`
- **Organizer**: `organizer@example.com` / `organizer123`
- **User**: `user@example.com` / `user123`

---

## Environment Configuration

### Create .env.local File

Create a `.env.local` file in the project root with the following content:

```env
# Database
DATABASE_URL=./sqlite.db

# Authentication
JWT_SECRET=DQD2vcoIVQcscX4wbddaHoDvTAbCekrDDresEpUlRAw=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Note**: This file should already exist in your project. If not, create it manually or copy from `.env.local.example` if available.

### Generate New JWT Secret (Optional)

For production or unique secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Database Setup

### Automatic Setup (Recommended)

```bash
npm run start:seed
```

### Manual Setup (Step by Step)

```bash
# 1. Generate migrations from schema
npm run db:generate

# 2. Apply migrations (create tables)
npm run db:migrate

# 3. Seed database
npm run seed:all

# 4. Start development server
npm run dev
```

### Seeding Options

```bash
# Basic seed (3 demo users only)
npm run db:seed

# Full dataset (29 users + 50 events)
npm run db:seed-full

# Complete seeding (TypeScript + SQL)
npm run seed:all
```

### Additional Test Accounts

26 additional users available with password: `Password123!`

**Admins (5):**
- sarah.johnson@example.com
- michael.chen@example.com
- emily.rodriguez@example.com
- david.kim@example.com
- lisa.anderson@example.com

**Organizers (10):**
- james.wilson@example.com
- maria.garcia@example.com
- robert.taylor@example.com
- jennifer.lee@example.com
- william.brown@example.com
- patricia.martinez@example.com
- christopher.davis@example.com
- linda.miller@example.com
- thomas.moore@example.com
- nancy.jackson@example.com

**Regular Users (11):**
- daniel.white@example.com - paul.scott@example.com

See `ACCOUNTS.md` for the complete list.

---

## Project Structure

```
project-events/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Internationalization routes
│   ├── api/               # API routes
│   └── ...
├── db/                    # Database
│   ├── migrations/        # Drizzle migration files
│   ├── schema/            # Database schema definitions
│   ├── seed.ts           # TypeScript seeder (basic)
│   ├── seed-full.sql     # SQL seeder (full dataset)
│   └── index.ts          # Database connection
├── scripts/              # Utility scripts
├── public/               # Static files
├── lib/                  # Utilities and helpers
├── messages/             # i18n messages
├── .env.local            # Environment variables
└── sqlite.db            # SQLite database (generated)
```

---

## Tech Stack

### Core
- **Framework**: [Next.js 16.1.1](https://nextjs.org/) (React 19.2.3)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://www.sqlite.org/) + [Drizzle ORM 0.45.1](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Authentication**: JWT with [jose](https://github.com/panva/jose)

### Key Libraries
- **State Management**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **Forms**: [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **UI Components**: [@base-ui/react](https://base-ui.com/), [shadcn](https://ui.shadcn.com/)
- **Icons**: [@hugeicons/react](https://www.npmjs.com/package/@hugeicons/react)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **Dates**: [date-fns](https://date-fns.org/)
- **Toasts**: [sonner](https://sonner.emilkowal.ski/)

---

## Troubleshooting

### "sqlite3: command not found"

Install SQLite3:
```bash
# macOS
brew install sqlite3

# Ubuntu/Debian
sudo apt-get install sqlite3
```

### Login Fails

Re-seed the database:
```bash
npm run db:seed-full
```

Then try: `admin@example.com` / `admin123`
