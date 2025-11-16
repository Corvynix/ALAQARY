# Arabic-First Real Estate SaaS Platform

## Overview

This is an intelligent real estate platform designed for passive investors and agents in Arabic-speaking markets. The platform creates competitive advantages through three core moats:

1. **Behavioral Data Moat**: Tracks user interactions, preferences, and psychology to build detailed buyer profiles
2. **Matching Engine Moat**: Calculates compatibility scores between buyers and properties using 30+ parameters
3. **Trust Score Moat**: Evaluates developer reliability using historical data, complaints, and buyer feedback

The platform serves three user roles:
- **Buyers**: Find properties matched to their preferences via AI-powered recommendations
- **Developers**: Manage properties, view leads, and optimize their trust scores
- **Admins**: Monitor platform analytics, behavioral funnels, and developer performance

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**UI Component System**: Radix UI primitives with shadcn/ui styling patterns, providing accessible components styled with TailwindCSS. The design system uses the "new-york" style variant with CSS variables for theming.

**RTL-First Design**: All layouts are designed primarily for Arabic (RTL) with English (LTR) as a secondary option. The HTML template sets `lang="ar"` and `dir="rtl"` by default. Typography uses IBM Plex Sans Arabic as the primary font for comprehensive Arabic support, with Inter as a fallback for technical content.

**State Management**: 
- TanStack Query (React Query) handles server state, caching, and API synchronization
- React Context for language/i18n state
- React Hook Form with Zod validation for form state

**Routing**: Wouter (lightweight client-side routing)

**Key Features**:
- Bilingual support (Arabic/English) via custom i18n context
- Multi-step profile builder wizard for buyer psychological profiling
- Real-time AI chat interface for property consultation
- Behavioral tracking (scroll depth, hover, dwell time)
- Role-based dashboards (buyer, developer, admin)

### Backend Architecture

**Runtime**: Node.js with Express server

**Type Safety**: Full-stack TypeScript with shared schema definitions

**API Design**: RESTful endpoints organized by resource:
- `/api/auth/*` - Authentication and user management
- `/api/properties/*` - Property listings and details
- `/api/developers/*` - Developer profiles and trust scores
- `/api/buyer-profiles/*` - Buyer psychological profiles
- `/api/matches/*` - Property-buyer matching scores
- `/api/ai-closer/*` - AI conversation sessions
- `/api/behavioral/*` - User interaction tracking
- `/api/admin/*` - Platform analytics

**Authentication**: Replit Auth (OpenID Connect) with Passport.js strategy, session-based authentication using PostgreSQL session store

**Core Business Logic**:
- **Matching Engine** (`server/services/matchingEngine.ts`): Calculates match scores based on budget fit (25%), location match (20%), property type (20%), risk alignment (15%), developer trust (10%), and behavioral signals (10%)
- **Trust Score Calculator**: Evaluates developers using contract completion rate, complaint history, average ratings, and years in business
- **AI Service** (`server/services/aiService.ts`): Integrates Google Gemini AI for conversational property recommendations and objection handling

### Data Storage

**Database**: PostgreSQL (via Neon serverless)

**ORM**: Drizzle ORM with type-safe query builder

**Key Schema Design Decisions**:

1. **Sessions Table**: Required for Replit Auth session persistence
2. **Users Table**: Stores authentication data and role-based access (buyer/developer/admin)
3. **Buyer Profiles**: Captures psychological attributes (risk tolerance, decision type, urgency, budget, preferences, psychological tags)
4. **Developers**: Tracks trust metrics (total/completed contracts, complaints, ratings, years in business)
5. **Properties**: Links to developers, stores images array, risk indicators, pricing, specifications
6. **Property Matches**: Junction table storing calculated match scores and timestamps
7. **AI Closer Sessions**: Stores conversation history as JSONB, tracks purchase probability
8. **Behavioral Events**: Time-series data for user interactions (event type, property/page context, metadata)
9. **Contracts**: File storage references with risk scores and parsed clauses
10. **Objection Responses**: AI interaction effectiveness tracking

**Data Relationships**:
- One-to-one: User → Buyer Profile, User → Developer
- One-to-many: Developer → Properties, Buyer Profile → Property Matches, Buyer → AI Sessions
- Many-to-many: Properties ↔ Buyers (via Property Matches)

### External Dependencies

**AI/ML Services**:
- **Google Gemini AI** (`@google/genai`): Powers the AI Closer conversational interface, generates property recommendations, handles objections, and estimates purchase probability. Requires `GEMINI_API_KEY` environment variable.

**Database Infrastructure**:
- **Neon Serverless PostgreSQL** (`@neondatabase/serverless`): Serverless PostgreSQL with WebSocket connections for edge deployments. Requires `DATABASE_URL` environment variable.

**Authentication**:
- **Replit Auth (OpenID Connect)**: Handles user authentication via OAuth. Requires `REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` environment variables.

**UI Component Libraries**:
- **Radix UI**: Headless accessible component primitives (dialogs, dropdowns, popovers, tooltips, etc.)
- **shadcn/ui**: Pre-styled component patterns built on Radix UI
- **Lucide React**: Icon library

**Form Handling**:
- **React Hook Form**: Form state management
- **Zod**: Runtime schema validation
- **@hookform/resolvers**: Zod integration for React Hook Form

**Styling**:
- **TailwindCSS**: Utility-first CSS framework with custom theme
- **class-variance-authority**: Type-safe variant styling
- **clsx** + **tailwind-merge**: Conditional class composition

**Development Tools**:
- **Vite**: Build tool and dev server
- **Drizzle Kit**: Database migration tool
- **TypeScript**: Static type checking across stack

**Session Storage**:
- **connect-pg-simple**: PostgreSQL session store for Express sessions

**Fonts**:
- **Google Fonts CDN**: IBM Plex Sans Arabic, Inter (loaded in HTML template)