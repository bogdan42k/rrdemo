# CLAUDE.md

## Project Overview

**rrdemo** is a modern, full-stack authentication template built with React Router v7 (framework mode). It demonstrates server-side rendering (SSR), cookie-based authentication, database integration with Prisma, and production-ready deployment patterns using Docker.

This project serves as a starting point for building production-grade React applications with built-in user authentication, session management, and a secure foundation for adding additional features.

---

## Technology Stack

### Frontend
- **React 19.1.1** - Latest React with concurrent features
- **React Router v7.9.2** - Full-stack framework with SSR, data loading, and routing
- **TypeScript 5.9.2** - Strict type safety throughout
- **Tailwind CSS 4.1.13** - Utility-first styling with dark mode support
- **Vite 7.1.7** - Lightning-fast build tool with HMR

### Backend
- **@react-router/node** - Node.js runtime for React Router
- **Prisma 6.18.0** - Type-safe ORM with migrations
- **SQLite** - Development database (PostgreSQL-ready)
- **bcryptjs 3.0.2** - Secure password hashing

### DevOps
- **Docker** - Multi-stage containerized builds
- **GitHub Actions** - CI/CD auto-deployment pipeline
- **Node.js 20 Alpine** - Production runtime

---

## Architecture

### Framework Mode
This project uses React Router v7 in **framework mode**, which means React Router handles:
- Server-side rendering (SSR)
- Data loading via loaders
- Data mutations via actions
- Build tooling and optimization
- Route-based code splitting
- Type generation for routes

This positions React Router as a full-stack framework (evolved from Remix), not just a routing library.

### Server-Side Rendering (SSR)
- Configured in `react-router.config.ts` with `ssr: true`
- Initial page load renders on server
- Hydrates on client for interactivity
- Progressive enhancement - forms work without JavaScript

### Authentication Strategy
- **Cookie-based sessions** (not JWT)
- HttpOnly cookies prevent XSS attacks
- SameSite=lax for CSRF protection
- Secure flag in production (HTTPS only)
- Session data encrypted and stored in cookie
- No database session storage needed

### Database Pattern
- **Prisma ORM** for type-safe database access
- **Singleton pattern** prevents connection pool exhaustion during development
- Global instance reused in development (handles HMR)
- Fresh instance in production

---

### Important Conventions

**`.server.ts` files:**
- Server-only code (automatically excluded from client bundle)
- Used for database access, session management, etc.
- Tree-shaken during build to prevent leaking server code to client

**Path aliases:**
- `~/*` maps to `./app/*`
- Configured in `tsconfig.json` and enabled via `vite-tsconfig-paths`
- Example: `import { db } from "~/utils/db.server"`

**Route type safety:**
- Routes import types from `./+types/{routeName}`
- Auto-generated in `.react-router/types/`
- Provides end-to-end type safety for loaders, actions, and components

---

## Routing

### Route Handler Pattern

Each route exports:
- `meta` - SEO metadata (title, description)
- `loader` - Data fetching (GET)
- `action` - Data mutations (POST/PUT/DELETE)
- `default` - React component

### Protected Routes

Use `requireUserId()` in loader to enforce authentication:

```typescript
export async function loader({ request }: Route.LoaderArgs) {
  await requireUserId(request); // Throws redirect to /login if not authenticated
  // ... rest of loader
}
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # Create if doesn't exist
# Edit .env and set DATABASE_URL, SESSION_SECRET

# Run database migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### Development Server

```bash
npm run dev
# Runs on http://localhost:5173
# HMR enabled
# Auto-generates route types
```

### Type Checking

```bash
npm run typecheck
# Runs route type generation + TypeScript validation
```

### Build for Production

```bash
npm run build
# Outputs to /build directory
# /build/client - Static assets
# /build/server - Server code
```

### Production Server

```bash
npm run start
# Runs production server from build artifacts
```

---

## Docker Deployment

### Multi-Stage Build Strategy

```dockerfile
# Stage 1: Install all dependencies (dev + prod)
FROM node:20-alpine AS development-dependencies-env

# Stage 2: Install only production dependencies
FROM node:20-alpine AS production-dependencies-env

# Stage 3: Build application
FROM development-dependencies-env AS build-env
RUN npm run build

# Stage 4: Final production image
FROM production-dependencies-env
COPY --from=build-env /app/build /app/build
```

**Benefits:**
- Minimal final image size
- No dev dependencies in production
- Cached layers for faster rebuilds
- Based on Alpine Linux (security & size)

### Building & Running

```bash
# Build image
docker build -t rrdemo .

# Run container
docker run -p 3000:3000 \
  -e SESSION_SECRET="your-secret" \
  -e DATABASE_URL="postgresql://..." \
  rrdemo
```

### Platform Deployment

Compatible with:
- AWS ECS / Fargate
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway
- Render

---

## Extending the Application

### Adding a New Route

1. Create route file in `app/routes/`:

```typescript
// app/routes/profile.tsx
import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Profile" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  return <div>Profile: {loaderData.user.email}</div>;
}
```

2. Register in `app/routes.ts`:

```typescript
export default [
  index("routes/dashboard.tsx"),
  route("/profile", "routes/profile.tsx"), // Add this
  route("/register", "routes/register.tsx"),
  // ...
] satisfies RouteConfig;
```

3. Types auto-generate on save (during `npm run dev`)

### Adding Database Models

1. Edit `prisma/schema.prisma`:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model User {
  // ... existing fields
  posts     Post[]  // Add relation
}
```

2. Create migration:

```bash
npx prisma migrate dev --name add_posts
```

3. Use in routes:

```typescript
import { db } from "~/utils/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  const posts = await db.post.findMany({
    include: { author: true }
  });
  return { posts };
}
```

### Adding API Endpoints

React Router routes can return JSON:

```typescript
// app/routes/api.users.tsx
export async function loader({ request }: Route.LoaderArgs) {
  const users = await db.user.findMany({
    select: { id: true, email: true, name: true }
  });
  return json({ users });
}
```

Access at `/api/users` - returns JSON response.

---

## Production Readiness Checklist

### Security
- [ ] Set unique `SESSION_SECRET` in production
- [ ] Use HTTPS (secure cookies enabled automatically)
- [ ] Enable CORS if needed for API routes
- [ ] Add rate limiting for auth endpoints
- [ ] Implement CSRF tokens for sensitive actions
- [ ] Add email verification for registration
- [ ] Implement password reset flow
- [ ] Add account lockout after failed login attempts

### Database
- [ ] Migrate to PostgreSQL (or production-ready database)
- [ ] Set up connection pooling
- [ ] Configure backups
- [ ] Add database indexes for performance
- [ ] Enable query logging and monitoring

### Monitoring
- [ ] Add error tracking (Sentry, Bugsnag, etc.)
- [ ] Set up application monitoring (New Relic, DataDog, etc.)
- [ ] Configure logging (Winston, Pino, etc.)
- [ ] Add health check endpoint
- [ ] Set up uptime monitoring

### Performance
- [ ] Enable response compression
- [ ] Add CDN for static assets
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Add image optimization

### DevOps
- [ ] Set up staging environment
- [ ] Configure environment-specific variables
- [ ] Implement blue-green or rolling deployments
- [ ] Add automated testing (unit, integration, e2e)
- [ ] Set up database migration strategy for production

---

## Troubleshooting

### Type Generation Issues

```bash
# Manually regenerate route types
npm run typecheck
```

### Build Failures

```bash
# Clear build cache
rm -rf build .react-router

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Session Issues

- Check `SESSION_SECRET` is set
- Verify cookies are enabled in browser
- Check HTTPS in production (secure flag)
- Clear browser cookies and retry

---

## Testing Strategy

### Unit Testing (Not Yet Implemented)

Recommended setup:
- **Vitest** for unit tests
- **Testing Library** for component tests
- **MSW** for API mocking

### Integration Testing

Test route handlers:

```typescript
import { loader } from "./routes/dashboard";

test("dashboard loader requires authentication", async () => {
  const request = new Request("http://localhost/");
  await expect(loader({ request })).rejects.toThrow();
});
```

### E2E Testing

Recommended tools:
- **Playwright** for end-to-end tests
- Test complete user flows (registration → login → dashboard)

---

## Performance Characteristics

### Build Output
- Client bundle: ~150KB gzipped
- Server bundle: ~500KB
- Initial page load: <100ms (SSR)
- Time to Interactive: <1s

### Runtime
- Node.js server handles 1000+ req/s (simple routes)
- SQLite suitable for <100 concurrent users
- PostgreSQL recommended for production scale

### Optimization Opportunities
- Add Redis for session storage at scale
- Implement caching layer (Redis, Memcached)
- Use CDN for static assets
- Add response compression middleware
- Optimize database queries with indexes

---
