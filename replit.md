# Real Estate Consultancy SaaS Platform

## Overview

This is an Arabic-first real estate consultancy and market intelligence SaaS platform designed to connect clients with trusted property advisors, developers, and AI-driven market insights. The platform operates on a passive consultancy model where clients pay an initial consultation fee (200 EGP) and the platform earns a 2% commission on completed deals.

The system emphasizes behavioral tracking, neuromarketing principles, and trust-building to guide users toward informed real estate investment decisions while preventing bypass of the platform's advisory services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and dev server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management
- Radix UI for accessible component primitives
- Tailwind CSS for styling with custom design system

**Design Principles:**
- Arabic-first with full RTL (Right-to-Left) support
- Bilingual interface (Arabic/English) with dynamic language switching
- Mobile-responsive design with touch-optimized interactions
- Dark mode as default theme with light mode toggle
- Accessibility-first approach with ARIA labels and skip-to-content links

**Key Design Decisions:**
- Color palette: Deep Blue (primary trust color), Gold/Amber (premium accents), White backgrounds
- Typography: Tajawal for Arabic, Inter for English
- Component library: shadcn/ui (customized Radix UI components)
- Error handling: Global Error Boundary with graceful fallbacks
- Toast notifications: Bilingual with automatic RTL positioning

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- RESTful API design
- Session-based authentication with OpenID Connect (Replit Auth)

**Authentication & Authorization:**
- Three-tier role system: Admin, Client, Developer
- JWT-based sessions with secure HTTP-only cookies
- Separate admin authentication layer with password change enforcement
- Role-based access control middleware (isAuthenticated, isAdmin, isDeveloper)

**API Security:**
- Rate limiting on all API endpoints (100 requests per 15 minutes)
- Stricter rate limiting on admin auth (5 attempts per 15 minutes)
- Input validation using Zod schemas
- CSRF protection via session-based auth
- Secure file handling for contract uploads

**Key Architectural Patterns:**
- Storage layer abstraction (server/storage.ts) for database operations
- Separation of concerns: routes, storage, authentication in distinct modules
- Middleware composition for authentication and authorization
- Query client configuration for consistent data fetching

### Data Storage

**Database:**
- PostgreSQL via Neon serverless
- Drizzle ORM for type-safe database queries
- Connection pooling for performance

**Schema Design:**
Core entities:
- Users (multi-role support)
- Developers (trust scores, verification status)
- Properties (listings with multilingual support)
- BuyerProfiles (investment preferences, risk tolerance)
- Consultations (AI session tracking)
- ConsultationBookings (scheduling system)
- Payments (transaction tracking with commission calculation)
- Contracts (document storage and risk analysis)
- Commissions (2% deal tracking)
- MarketData (regional property intelligence)
- BehavioralTracking (user interaction analytics)
- Referrals (reward system)
- Notifications (real-time alerts)
- CmsContent (dynamic content management)
- AdminCredentials (separate admin auth)

**Key Features:**
- Multi-language content fields (titleAr, descriptionAr)
- Timestamp tracking (createdAt, updatedAt)
- Soft deletes where appropriate
- Indexed fields for performance (sessions expire index)
- JSONB fields for flexible metadata storage

### External Dependencies

**AI Integration:**
- Google Gemini AI (via @google/genai package)
- Used for market data extraction, analysis, and consultation
- Objection handling engine for client concerns
- AI-assisted buyer profile builder

**Payment Processing:**
- Stripe integration (@stripe/stripe-js, @stripe/react-stripe-js)
- Vodafone Cash support (Egyptian market)
- Bank transfer and cash payment options

**Authentication:**
- Replit OpenID Connect provider
- OpenID Client library for OAuth flows
- Passport.js strategy for session management

**Session Storage:**
- PostgreSQL-backed sessions (connect-pg-simple)
- 7-day session TTL
- Automatic session cleanup

**Form Validation:**
- Zod schemas for runtime validation
- React Hook Form for form state management
- @hookform/resolvers for Zod integration

**UI Component Libraries:**
- Radix UI primitives (dialogs, dropdowns, tooltips, etc.)
- Lucide React for icons
- class-variance-authority for component variants
- clsx and tailwind-merge for className composition

**Build & Development:**
- esbuild for server bundling
- TypeScript compiler for type checking
- PostCSS with Autoprefixer
- Replit-specific plugins (vite-plugin-runtime-error-modal, cartographer, dev-banner)

**Utilities:**
- bcryptjs for password hashing
- date-fns for date formatting
- memoizee for caching
- nanoid for unique ID generation
- ws (WebSocket) for Neon serverless connections

## Production Readiness (Added November 2025)

### Security Hardening

**Helmet.js Integration:**
- Content Security Policy (CSP) configured
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options protection
- X-Content-Type-Options protection
- Complete security headers suite

**Environment Validation:**
- Runtime validation of all required environment variables
- Production-specific checks for sensitive secrets
- Fail-fast on missing or insecure configuration
- Clear error messages for configuration issues

**CORS & Compression:**
- CORS properly configured with origin whitelist
- Compression middleware for bandwidth optimization
- Request size limits (10MB)
- Secure cookie configuration

### Monitoring & Observability

**Structured Logging (Pino):**
- JSON-formatted logs for easy parsing
- Log levels: debug, info, warn, error
- Request ID tracking for distributed debugging
- Performance metrics (response times, duration)
- Development-friendly pretty printing
- Production-optimized JSON output

**Health Checks:**
- `/health` - Overall system health with database connectivity
- `/health/ready` - Readiness probe for deployments
- Memory usage tracking
- Uptime monitoring
- Environment information

**Error Tracking Ready:**
- Sentry integration points configured
- Error boundary with capture hooks
- Request context preservation
- Stack trace collection
- User context attachment

**Graceful Shutdown:**
- SIGTERM/SIGINT signal handling
- Connection cleanup (database, server)
- 30-second timeout for graceful shutdown
- Unhandled rejection/exception logging

### Testing Infrastructure

**Vitest Setup:**
- 14 passing tests (unit + integration)
- React Testing Library for component tests
- Happy DOM test environment
- Test coverage reporting capability
- Test UI available (`npm run test:ui`)

**Test Coverage:**
- Authentication flow testing
- Internationalization (i18n) testing
- Theme switching testing
- Component rendering tests

### Legal Compliance

**Privacy & Terms:**
- Privacy Policy page (`/privacy-policy`)
- Terms of Service page (`/terms-of-service`)
- Both pages with Arabic + English bilingual content
- Comprehensive coverage of data collection, rights, and policies

**Cookie Consent:**
- Cookie consent banner component
- Accept/Decline functionality
- LocalStorage-based preference tracking
- Link to privacy policy
- Bilingual (Arabic/English) messaging

### Documentation

**Comprehensive Guides:**
- `docs/SENTRY_SETUP.md` - Complete Sentry integration guide
- `docs/API_DOCUMENTATION.md` - Full REST API reference
- `docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md` - Deployment guide
- `PRODUCTION_READINESS_AUDIT.md` - Full system audit
- `README.md` - Project overview and getting started

### Performance Optimizations

**Implemented:**
- Compression middleware for response optimization
- Database connection pooling
- 15+ strategic database indexes
- Code splitting via Vite
- Lazy loading for route components

**Monitoring:**
- Request/response time logging
- Database query performance tracking
- Memory usage monitoring
- Request ID correlation

### Production Deployment

**Deployment Configuration:**
- Autoscale deployment type configured
- Build process optimized
- Production environment detection
- Environment-specific configurations

**Production Checklist:**
- Environment variables validation
- Security headers enabled
- Rate limiting configured
- Health checks accessible
- Graceful shutdown implemented
- Structured logging active
- Tests passing (14/14)
- Legal pages deployed

### Recent Changes (November 2025)

**Security Enhancements:**
- Added helmet.js for comprehensive security headers
- Implemented environment variable validation
- Added request ID tracking for debugging
- Enhanced CORS configuration

**Monitoring & Reliability:**
- Implemented Pino structured logging
- Added health check endpoints
- Implemented graceful shutdown
- Added error tracking integration points

**Testing & Quality:**
- Set up Vitest testing infrastructure
- Created 14 passing tests
- Configured test coverage reporting
- Added test UI for better developer experience

**Legal & Compliance:**
- Created Privacy Policy page
- Created Terms of Service page
- Implemented cookie consent banner
- Added bilingual legal content

**Documentation:**
- Created comprehensive README
- Added API documentation
- Created Sentry setup guide
- Added production deployment checklist
- Completed production readiness audit