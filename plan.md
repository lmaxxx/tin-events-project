Event Management Platform - Implementation Plan

Overview

Full-stack event organization platform with JWT authentication, RBAC (4 roles), event CRUD, attendance tracking, and
admin dashboard.

Tech Stack: Next.js 16 (App Router), React 19, TypeScript, Drizzle ORM, SQLite, React Query, shadcn/ui, Tailwind v4

User Decisions:

- ✅ Custom JWT-based authentication (httpOnly cookies)
- ✅ Full MVP with all features
- ✅ Image URLs only (no file upload)
- ✅ Admin-manageable categories (start with 10 predefined)

 ---
Entity Schema & Relationships

Tables

1. users: id (CUID2), name, email (unique), password (bcrypt), createdAt, updatedAt
2. roles: id, name (guest/user/organizer/admin), description
3. user_roles: userId, roleId (junction, composite PK)
4. event_categories: id, name (unique), description, createdAt
5. events: id, title, description, date, imageUrl, capacity, location, creatorId, categoryId, createdAt, updatedAt
6. event_visitors: eventId, userId, registeredAt (junction, composite PK)

Relationships

- User ←→ Role (ManyToMany via user_roles)
- User → Event (OneToMany as creator)
- User ←→ Event (ManyToMany as visitor via event_visitors)
- Event → EventCategory (ManyToOne)

 ---
Project Structure

project-events/
├── app/
│ ├── (auth)/
│ │ ├── login/page.tsx
│ │ └── register/page.tsx
│ ├── (dashboard)/
│ │ ├── layout.tsx # Shared nav with auth state
│ │ ├── page.tsx # Events listing (home)
│ │ ├── events/
│ │ │ ├── [id]/page.tsx # Event detail + registration
│ │ │ ├── create/page.tsx # Organizer only
│ │ │ └── [id]/edit/page.tsx
│ │ └── my-events/page.tsx # User's created events
│ ├── admin/
│ │ ├── layout.tsx
│ │ ├── dashboard/page.tsx
│ │ ├── users/page.tsx # Manage users & roles
│ │ ├── events/page.tsx # Event moderation
│ │ └── categories/page.tsx # CRUD categories
│ ├── api/
│ │ ├── auth/
│ │ │ ├── register/route.ts
│ │ │ ├── login/route.ts
│ │ │ ├── logout/route.ts
│ │ │ └── me/route.ts
│ │ ├── events/
│ │ │ ├── route.ts # GET (list), POST (create)
│ │ │ ├── [id]/route.ts # GET, PATCH, DELETE
│ │ │ ├── [id]/register/route.ts
│ │ │ └── [id]/unregister/route.ts
│ │ ├── categories/route.ts # GET, POST (admin)
│ │ ├── categories/[id]/route.ts
│ │ ├── users/route.ts # GET (admin)
│ │ ├── users/[id]/route.ts
│ │ └── my/
│ │ ├── events/route.ts
│ │ └── registrations/route.ts
│ ├── providers.tsx # React Query provider
│ ├── layout.tsx
│ └── globals.css
├── components/
│ ├── ui/ # shadcn (already exists)
│ ├── forms/
│ │ ├── EventForm.tsx
│ │ ├── LoginForm.tsx
│ │ └── RegisterForm.tsx
│ ├── events/
│ │ ├── EventCard.tsx
│ │ ├── EventList.tsx
│ │ └── EventFilters.tsx
│ ├── layout/
│ │ ├── Navbar.tsx
│ │ └── Footer.tsx
│ └── admin/
│ ├── UsersTable.tsx
│ ├── EventsTable.tsx
│ └── CategoriesTable.tsx
├── db/
│ ├── schema/
│ │ ├── users.ts
│ │ ├── roles.ts
│ │ ├── events.ts
│ │ ├── categories.ts
│ │ └── relations.ts
│ ├── migrations/
│ ├── seed.ts
│ └── index.ts # DB connection singleton
├── hooks/
│ ├── auth/
│ │ └── useAuth.ts # useAuth, useLogin, useRegister, useLogout
│ ├── events/
│ │ └── useEvents.ts # CRUD + registration hooks
│ ├── categories/
│ │ └── useCategories.ts
│ └── users/
│ └── useUsers.ts # Admin only
├── lib/
│ ├── auth/
│ │ ├── jwt.ts # generateToken, verifyToken
│ │ ├── password.ts # hashPassword, verifyPassword (bcrypt)
│ │ ├── session.ts # Cookie management
│ │ ├── middleware.ts # withAuth wrapper
│ │ └── permissions.ts # RBAC helpers
│ ├── validation/
│ │ └── schemas.ts # Zod schemas for all entities
│ ├── api/
│ │ └── client.ts # Type-safe API client
│ ├── types/
│ │ ├── auth.ts
│ │ ├── events.ts
│ │ └── api.ts
│ └── utils.ts # cn() already exists
├── middleware.ts # Route protection (Next.js)
├── drizzle.config.ts
├── .env.local
└── package.json

 ---
Implementation Phases (20 Days)

Phase 1: Database & Infrastructure (Days 1-2)

Goal: Establish data layer

Tasks:

1. Install dependencies: @paralleldrive/cuid2, bcryptjs, @types/bcryptjs, jose, react-hook-form, @hookform/resolvers,
   zod, sonner
2. Create drizzle.config.ts (schema: ./db/schema/*, out: ./db/migrations, dialect: sqlite)
3. Create Drizzle schema files:

- db/schema/users.ts - User table with CUID2 IDs
- db/schema/roles.ts - Role table + user_roles junction
- db/schema/events.ts - Event table + event_visitors junction
- db/schema/categories.ts - EventCategory table
- db/schema/relations.ts - All Drizzle relations

4. Create db/index.ts - Database connection singleton (better-sqlite3 + drizzle)
5. Create db/seed.ts - Seed roles (guest/user/organizer/admin), 10 categories, demo admin user
6. Add scripts to package.json: db:generate, db:migrate, db:seed, db:studio
7. Run: npm run db:generate && npm run db:migrate && npm run db:seed

Validation: Query database with npm run db:studio, verify seed data

Critical Files:

- /db/schema/users.ts
- /db/index.ts
- /drizzle.config.ts

 ---
Phase 2: Authentication System (Days 3-4)

Goal: Complete JWT auth with RBAC

Tasks:

1. Create .env.local with JWT_SECRET (use: openssl rand -base64 32)
2. Create lib/auth/jwt.ts:

- generateToken(payload: { userId, email, roles }) using jose
- verifyToken(token: string) returns payload or null
- 7-day expiry

3. Create lib/auth/password.ts:

- hashPassword(password) - bcrypt with 12 rounds
- verifyPassword(password, hash) - bcrypt compare

4. Create lib/auth/session.ts:

- setAuthCookie(token) - httpOnly, secure in prod, 7-day max age
- getAuthToken() - read from cookies
- clearAuthCookie() - delete cookie
- getCurrentUser() - verify token + fetch user from DB

5. Create lib/auth/middleware.ts:

- withAuth(handler, { roles? }) - wrapper for API routes

6. Create lib/auth/permissions.ts:

- hasRole(userRoles, role), canManageEvent(user, event)

7. Create lib/validation/schemas.ts:

- registerSchema (name: 2-100, email, password: 8-100)
- loginSchema (email, password)

8. Create API routes:

- app/api/auth/register/route.ts - Hash password, create user with 'user' role, generate JWT, set cookie
- app/api/auth/login/route.ts - Verify password, generate JWT, set cookie
- app/api/auth/logout/route.ts - Clear cookie
- app/api/auth/me/route.ts - Return current user with roles

9. Create lib/types/auth.ts - TypeScript types for User, JWTPayload, etc.

Validation: Test with curl/Postman: register → login → /api/auth/me

Critical Files:

- /lib/auth/jwt.ts
- /lib/auth/password.ts
- /app/api/auth/register/route.ts
- /app/api/auth/login/route.ts

 ---
Phase 3: Events API (Days 5-6)

Goal: Complete events CRUD with authorization

Tasks:

1. Add to lib/validation/schemas.ts:

- createEventSchema (title: 3-200, description: 10-5000, date: datetime, imageUrl: url optional, capacity: positive int,
  location: 3-200, categoryId: cuid2)
- updateEventSchema (partial of createEventSchema)

2. Create API routes:

- app/api/events/route.ts:
    - GET: Public, paginated, filter by categoryId, return events with creator/category/visitor count
    - POST: Organizer+ only (withAuth), create event
- app/api/events/[id]/route.ts:
    - GET: Public, return full event with relations
    - PATCH: Owner or admin only, update event
    - DELETE: Owner or admin only, delete event
- app/api/events/[id]/register/route.ts:
    - POST: Authenticated user, check capacity, prevent duplicates, add to event_visitors
- app/api/events/[id]/unregister/route.ts:
    - DELETE: Authenticated user, remove from event_visitors
- app/api/my/events/route.ts:
    - GET: Authenticated, return user's created events
- app/api/my/registrations/route.ts:
    - GET: Authenticated, return events user registered for

3. Create lib/errors.ts - ApiError classes (UnauthorizedError, ForbiddenError, NotFoundError, ValidationError,
   ConflictError)
4. Implement pagination (page, pageSize params, return total count)

Validation: Test all CRUD operations with different roles, test capacity limits, test duplicate registration prevention

Critical Files:

- /app/api/events/route.ts
- /app/api/events/[id]/route.ts
- /app/api/events/[id]/register/route.ts

 ---
Phase 4: Frontend Auth & Layout (Days 7-8)

Goal: User-facing auth and navigation

Tasks:

1. Create app/providers.tsx:

- QueryClientProvider with React Query
- Configure staleTime: 60s, refetchOnWindowFocus: false
- Add ReactQueryDevtools (dev only)

2. Update app/layout.tsx:

- Wrap children with <Providers>
- Update metadata (title, description)

3. Create lib/api/client.ts:

- ApiClient class with get/post/patch/delete methods
- Include credentials (cookies), Content-Type: application/json
- Handle errors, throw ApiError

4. Create hooks/auth/useAuth.ts:

- useAuth() - useQuery for /api/auth/me
- useLogin() - useMutation for /api/auth/login, invalidate auth queries
- useRegister() - useMutation for /api/auth/register
- useLogout() - useMutation for /api/auth/logout, clear queries

5. Create app/(auth)/login/page.tsx:

- Form with email, password (react-hook-form + Zod)
- Use useLogin hook
- Redirect to / on success
- Show toast on error (sonner)

6. Create app/(auth)/register/page.tsx:

- Form with name, email, password
- Use useRegister hook
- Redirect to /login on success

7. Create components/layout/Navbar.tsx:

- Use useAuth to show user state
- Links: Home, Login/Register (unauthenticated)
- Links when authenticated: Create Event (organizer+), My Events, Admin (admin only), user menu with logout

8. Create middleware.ts (root):

- Public paths: /, /login, /register, /events/*
- Protected paths: /my-events, /events/create, /events/*/edit
- Admin paths: /admin/*
- Redirect to /login if unauthenticated
- Check roles for admin paths

Validation: Register user, login, see navbar change, logout works, protected routes redirect

Critical Files:

- /app/providers.tsx
- /hooks/auth/useAuth.ts
- /app/(auth)/login/page.tsx
- /components/layout/Navbar.tsx
- /middleware.ts

 ---
Phase 5: Events Frontend (Days 9-11)

Goal: Public event browsing and management

Tasks:

1. Create hooks/events/useEvents.ts:

- useEvents(filters?) - useQuery with pagination, categoryId filter
- useEvent(id) - useQuery for single event
- useCreateEvent() - useMutation
- useUpdateEvent() - useMutation
- useDeleteEvent() - useMutation, invalidate queries
- useRegisterForEvent() - useMutation
- useUnregisterFromEvent() - useMutation
- useMyEvents() - user's created events
- useMyRegistrations() - user's registrations

2. Create components/events/EventCard.tsx:

- Display image, title, category badge, date, location
- Show capacity (X/Y registered)
- "View Details" button

3. Create components/events/EventFilters.tsx:

- Category dropdown (all categories)
- Search by title (future enhancement)

4. Create app/(dashboard)/layout.tsx:

- Include Navbar
- Main content wrapper

5. Create app/(dashboard)/page.tsx:

- Event listing (home page)
- Use EventFilters + EventList
- Pagination controls
- Loading skeletons

6. Create app/(dashboard)/events/[id]/page.tsx:

- Full event details
- Creator info, category, attendees list
- "Register" button (authenticated users, check capacity)
- "Unregister" button (if registered)
- "Edit" button (if owner or admin)

7. Create components/forms/EventForm.tsx:

- Reusable form component
- Fields: title, description, date picker, imageUrl, capacity, location, category select
- react-hook-form + Zod validation

8. Create app/(dashboard)/events/create/page.tsx:

- Use EventForm
- useCreateEvent hook
- Redirect to event detail on success

9. Create app/(dashboard)/events/[id]/edit/page.tsx:

- Load event data
- Check ownership (owner or admin)
- Use EventForm with defaultValues
- useUpdateEvent hook

10. Create app/(dashboard)/my-events/page.tsx:

- Tab 1: Created events (useMyEvents)
- Tab 2: Registered events (useMyRegistrations)
- Actions: Edit/Delete own events, Unregister from events

Validation: Browse events, register/unregister, create event as organizer, edit own event, delete event

Critical Files:

- /hooks/events/useEvents.ts
- /app/(dashboard)/page.tsx
- /app/(dashboard)/events/[id]/page.tsx
- /components/forms/EventForm.tsx
- /app/(dashboard)/events/create/page.tsx

 ---
Phase 6: Categories System (Days 12-13)

Goal: Admin category management

Tasks:

1. Add to lib/validation/schemas.ts:

- categorySchema (name: 2-100, description: 500 optional)

2. Create API routes:

- app/api/categories/route.ts:
    - GET: Public, return all categories
    - POST: Admin only (withAuth roles: ['admin']), create category
- app/api/categories/[id]/route.ts:
    - PATCH: Admin only, update category
    - DELETE: Admin only, delete category (check if used by events first)

3. Create hooks/categories/useCategories.ts:

- useCategories() - useQuery
- useCreateCategory() - useMutation (admin)
- useUpdateCategory() - useMutation (admin)
- useDeleteCategory() - useMutation (admin)

4. Create components/admin/CategoriesTable.tsx:

- Table with name, description, # events
- Edit/Delete actions (admin only)
- Add category form

5. Create app/admin/categories/page.tsx:

- Use CategoriesTable
- CRUD UI with modals/dialogs

6. Update EventFilters to use categories

Validation: Admin can create/edit/delete categories, categories appear in event filters

Critical Files:

- /app/api/categories/route.ts
- /app/admin/categories/page.tsx

 ---
Phase 7: Admin Panel (Days 14-15)

Goal: Complete admin functionality

Tasks:

1. Create API routes:

- app/api/users/route.ts:
    - GET: Admin only, paginated user list with roles
- app/api/users/[id]/route.ts:
    - GET: Admin only, user details
    - PATCH: Admin only, update user (name, email)
    - DELETE: Admin only, soft delete or hard delete user
- app/api/users/[id]/roles/route.ts:
    - PATCH: Admin only, update user roles (add/remove)

2. Create hooks/users/useUsers.ts:

- useUsers() - paginated list (admin)
- useUser(id) - single user (admin)
- useUpdateUser() - useMutation (admin)
- useUpdateUserRoles() - useMutation (admin)
- useDeleteUser() - useMutation (admin)

3. Create app/admin/layout.tsx:

- Admin sidebar navigation
- Check admin role, redirect if not admin

4. Create components/admin/UsersTable.tsx:

- Table with name, email, roles, created date
- Edit roles action (multi-select: guest, user, organizer, admin)
- Delete user action

5. Create app/admin/users/page.tsx:

- Use UsersTable
- Pagination
- Search by email/name

6. Create components/admin/EventsTable.tsx:

- All events with creator, attendees, capacity
- Delete action (moderation)

7. Create app/admin/events/page.tsx:

- Use EventsTable
- Filter by category, creator

8. Create app/admin/dashboard/page.tsx:

- Stats cards: Total users, total events, upcoming events, registrations
- Recent activity

9. Update admin navigation to link all pages

Validation: Admin can view/edit users, manage roles, moderate events, view dashboard stats

Critical Files:

- /app/api/users/[id]/roles/route.ts
- /app/admin/users/page.tsx
- /app/admin/dashboard/page.tsx

 ---
Phase 8: Polish & UX (Days 16-17)

Goal: Professional user experience

Tasks:

1. Add loading skeletons to all pages (events list, event detail, admin tables)
2. Implement optimistic updates:

- Event registration (instant UI update)
- Event creation (add to list immediately)

3. Add toast notifications (sonner):

- Success messages (event created, registered, etc.)
- Error messages with user-friendly text

4. Improve form validation:

- Real-time validation feedback
- Field-level error messages
- Disable submit when invalid

5. Add dark mode toggle (Tailwind already supports it):

- Theme switcher in navbar
- Persist preference in localStorage

6. Responsive design:

- Mobile-friendly navbar (hamburger menu)
- Responsive event cards (grid → stack)
- Mobile-optimized tables (stack columns)

7. Performance optimization:

- Implement React Query caching strategy
- Pagination on all lists (10-20 items per page)
- Lazy load images

8. Empty states:

- No events found
- No registrations
- No users (admin)

9. Add confirmation dialogs:

- Delete event
- Delete user (admin)
- Unregister from event

10. Improve error handling:

- Network errors → retry button
- 404 pages
- Unauthorized → redirect to login

Validation: Smooth UX, proper loading states, error handling, responsive on mobile

 ---
Phase 9: Security & Testing (Days 18-19)

Goal: Production-ready security

Tasks:

1. Security audit:

- SQL injection testing (Drizzle prevents this with parameterized queries)
- XSS testing (React escapes by default, validate imageUrl)
- CSRF protection (SameSite cookies)
- Rate limiting on auth endpoints (optional: use middleware)
- Password strength requirements enforced

2. RBAC testing:

- Guest: Can only browse events
- User: Can register for events
- Organizer: Can create/edit own events
- Admin: Full access to all features

3. Edge case testing:

- Event capacity limits (prevent over-registration)
- Duplicate registration prevention
- Concurrent registration handling
- Event with 0 capacity
- Past event registration (should fail)

4. Validation testing:

- All Zod schemas tested with invalid data
- API error responses validated

5. Database integrity:

- Foreign key constraints working (cascade deletes)
- Unique constraints (email, category name)

6. Add environment validation:

- Check JWT_SECRET exists on startup
- Validate DATABASE_URL

Validation: All security tests pass, RBAC enforced, edge cases handled

 ---
Phase 10: Documentation & Deployment (Day 20)

Goal: Production deployment ready

Tasks:

1. Create comprehensive README.md:

- Project description
- Features list
- Tech stack
- Setup instructions (npm install, env vars, db setup)
- Development commands
- Deployment guide

2. Create .env.example:

- Template for all required environment variables
- Comments explaining each variable

3. Document API endpoints:

- Create API.md with all routes, methods, auth requirements
- Request/response examples

4. Add JSDoc comments to complex functions
5. Production configuration:

- Set NODE_ENV=production
- Generate production JWT_SECRET
- Configure secure cookies (https, sameSite: strict)
- Database backup strategy

6. Create production build:

- npm run build
- Test production build locally

7. Deployment checklist:

- Environment variables configured
- Database migrations run
- Seed admin user created
- HTTPS enabled
- Error logging configured

Validation: Complete documentation, production build succeeds, deployment checklist complete

 ---
Security Considerations

Authentication

- ✅ bcrypt with 12 salt rounds
- ✅ JWT with 7-day expiry (jose library)
- ✅ httpOnly cookies (prevent XSS)
- ✅ Secure flag in production (HTTPS only)
- ✅ SameSite: Lax (CSRF protection)

Authorization

- ✅ Role-based access control (4 roles)
- ✅ API route protection (withAuth middleware)
- ✅ Frontend route protection (Next.js middleware)
- ✅ Resource ownership checks (event creator)

Data Protection

- ✅ Password hashing (never store plain text)
- ✅ Input validation (Zod on client + server)
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS prevention (React auto-escaping)

Performance

- ✅ Database indexing (email, eventId, categoryId)
- ✅ Pagination (prevent large queries)
- ✅ React Query caching (60s stale time)
- ✅ Optimistic updates (instant UI feedback)

 ---
Dependencies to Install

Add to package.json:
{
"dependencies": {
"@paralleldrive/cuid2": "^2.2.2",
"bcryptjs": "^2.4.3",
"jose": "^5.2.0",
"react-hook-form": "^7.50.1",
"@hookform/resolvers": "^3.3.4",
"zod": "^3.22.4",
"sonner": "^1.4.0"
},
"devDependencies": {
"@types/bcryptjs": "^2.4.6"
}
}

Scripts to add:
{
"scripts": {
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:seed": "tsx db/seed.ts",
"db:studio": "drizzle-kit studio"
}
}

 ---
Critical Success Factors

1. Database Schema: Proper relationships and constraints from the start
2. JWT Security: Secure token generation, httpOnly cookies, proper expiry
3. RBAC Implementation: Consistent authorization checks on API and UI
4. Type Safety: End-to-end TypeScript with Drizzle schema inference
5. Error Handling: Comprehensive error handling on API and frontend
6. User Experience: Loading states, optimistic updates, toast notifications

 ---
Testing Checkpoints

After each phase, validate:

- ✅ Phase 1: Database queryable, seed data exists
- ✅ Phase 2: Auth flow works (register → login → protected route)
- ✅ Phase 3: Events CRUD with proper authorization
- ✅ Phase 4: Frontend auth UI functional
- ✅ Phase 5: Complete event lifecycle (create → view → register → edit → delete)
- ✅ Phase 6: Categories manageable by admin
- ✅ Phase 7: Admin panel fully functional
- ✅ Phase 8: Professional UX, responsive design
- ✅ Phase 9: Security audit passed
- ✅ Phase 10: Production-ready with documentation

 ---
Estimated Timeline

- Database & Auth: 4 days (Phases 1-2)
- API Development: 4 days (Phases 3, 6)
- Frontend Development: 7 days (Phases 4-5, 7)
- Polish & Security: 4 days (Phases 8-9)
- Documentation: 1 day (Phase 10)

Total: 20 days for full MVP with all features