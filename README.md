This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### First Time Setup

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd project-events
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Seed database and start development server
   ```bash
   npm run start:seed
   ```

This will:
- Create database schema
- Seed 30 users, 50 events, and ~200 registrations
- Start the development server at [http://localhost:3000](http://localhost:3000)

### Demo Accounts

- **Admin**: admin@example.com / admin123
- **Organizer**: organizer@example.com / organizer123
- **User**: user@example.com / user123

### Development

To start the development server (without seeding):

```bash
npm run dev
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Database Commands

- `npm run db:generate` - Generate migrations
- `npm run db:migrate` - Run migrations (create schema)
- `npm run db:seed` - Seed basic data (3 users, roles, categories)
- `npm run db:seed-full` - Seed full dataset (30 users, 50 events)
- `npm run seed:all` - Run all seeding steps
- `npm run start:seed` - Seed database and start dev server
- `npm run db:studio` - Open Drizzle Studio for database inspection

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
