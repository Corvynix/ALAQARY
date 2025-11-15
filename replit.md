# Real Estate Intelligence OS

## Overview

A comprehensive multi-sided real estate intelligence platform that functions like "OpenAI for real estate" - featuring a central AI brain, network effects, and role-based ecosystems. The system serves four distinct user types (Agents, Developers, Clients, and Data Contributors) with specialized dashboards and tools.

**Platform Vision:** Transform real estate through data intelligence, AI-powered insights, and invisible monetization via a credit-based system. Each role contributes to and benefits from the platform's collective intelligence.

### Recent Changes (November 15, 2025)

**Multi-Role Transformation Complete:**
- Migrated from single luxury consultant website to comprehensive multi-sided platform
- Implemented 4 role-based user types with specialized dashboards
- Enhanced registration with role selection and profile management
- Added credit-based economy foundation (accuracyScore, credits tracking)
- Created role-specific routing with access control
- Prepared infrastructure for AI Real Estate Brain and shared features

The platform now supports a complete ecosystem where Agents get leads intelligence, Developers get market insights, Clients get smart recommendations, and Data Contributors earn credits for accurate data.

## User Preferences

Preferred communication style: Simple, everyday language.

## Role-Based Access System

The platform now supports **5 user roles**, each with specialized dashboards and features:

### 1. Admin Role
For testing admin features, an admin account has been created:
- **Username:** admin
- **Password:** admin123

Admin access includes:
- Market Intelligence Dashboard
- Agent Intelligence
- Client Qualification System
- Behavior Insights
- Super Intelligence Dashboard

### 2. Agent Role (`/agent`)
**Purpose:** Sales professionals who need leads intelligence and performance tools

**Dashboard Features:**
- **Leads Intelligence Hub:** High-potential leads analysis with AI scoring
- **AI Scripts Center:** Call scripts and conversation templates
- **Performance Stats:** Conversion rates, call analytics, revenue tracking
- **Client Relationship Manager:** Pipeline and follow-up system

**Registration Fields:** email, phone, fullName, companyName

### 3. Developer Role (`/developer`)
**Purpose:** Real estate developers who need market insights and project validation

**Dashboard Features:**
- **Demand Heatmaps:** Geographic demand visualization with zone scoring
- **Launch Project Checker:** Feasibility analysis for new developments
- **Pricing Recommendation Engine:** AI-powered pricing suggestions
- **Approval Score System:** Project approval probability assessment

**Registration Fields:** email, phone, fullName, companyName

### 4. Client Role (`/client`)
**Purpose:** Property buyers and investors seeking smart recommendations

**Dashboard Features:**
- **Smart Match Questions:** AI-powered property matching system
- **Compare Properties Tool:** Side-by-side comparison with scoring
- **Book Expert Session:** Schedule consultations with specialists
- **Favorites & Saved Searches:** Personal property collections

**Registration Fields:** email, phone, fullName

### 5. Data Contributor Role (`/contributor`)
**Purpose:** Market insiders who provide data in exchange for credits

**Dashboard Features:**
- **Add Data Wizard:** Structured data submission interface
- **Earn Credits System:** Credit rewards for accurate contributions
- **Accuracy Score Tracker:** Performance metrics (0-100% accuracy)
- **Confidential Mode:** Privacy-protected submission system

**Registration Fields:** email, phone, fullName
**Special Features:** accuracyScore tracking, credits balance

### Registration Flow

Users now select their role during registration:
1. **Step 1:** Choose role (Agent, Developer, Client, or Data Contributor)
2. **Step 2:** Provide role-specific profile information
3. **Auto-redirect:** Automatic routing to role-specific dashboard after login

**Note:** All dashboards are protected by role-based access control. Users can only access their designated dashboard.

## System Architecture

### Frontend Architecture

**Framework & Core Technologies**
- **React 18** with **Vite** build system for optimal performance
- **TypeScript** for type safety across the application
- **Wouter** for lightweight client-side routing (not Next.js despite initial requirements - this is a single-page application)
- **TailwindCSS** for utility-first styling with extensive custom theming
- **shadcn/ui** component library (New York style variant) for consistent, accessible UI components

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management, caching, and API interactions
- Custom query client configured with infinite stale time and disabled refetching for manual data control

**Design System**
- Custom dark luxury theme with deep blacks (#0D0D0D) and luxury gold (#D4AF37)
- Bilingual support: Arabic (RTL, primary) and English (LTR, secondary)
- Typography: Playfair Display (headings), Inter (body), Cairo/Noto Kufi Arabic (Arabic text)
- Animation-driven UX with gold gradient glows, scroll-triggered counters, and fade-up transitions
- Responsive grid layouts with RTL awareness

**Component Architecture**
- Modular, reusable components organized by feature
- Bilingual prop-based language switching throughout
- Separation of presentation (UI components) and business logic (pages)
- Example components provided for each major UI element

### Backend Architecture

**Server Framework**
- **Express.js** server with TypeScript
- Custom Vite middleware integration for development with HMR
- Session-based architecture preparation (connect-pg-simple for sessions)

**API Design**
- RESTful API endpoints under `/api` prefix
- CRUD operations for: Properties, Market Trends, Leads, Content
- Zod schema validation on all incoming data
- Centralized storage layer abstraction for database operations

**Database Layer**
- **Drizzle ORM** for type-safe database interactions
- **Neon Serverless Postgres** (@neondatabase/serverless) as the database provider
- WebSocket-based connection pooling for serverless environments
- Schema-first design with automatic TypeScript type inference

**Database Schema**

**Core Tables:**
- `users` - Multi-role authentication system with profile fields:
  - Roles: admin, agent, developer, client, data_contributor
  - Profile: email, phone, fullName, companyName
  - Credits economy: credits (decimal), accuracyScore (decimal)
  - Preferences: profileComplete (boolean), preferences (jsonb)
- `properties` - Property listings with bilingual content, images array, status tracking
- `market_trends` - Market analysis data with demand levels, price changes
- `leads` - Contact form submissions for conversion tracking
- `content` - Blog posts and educational content with bilingual support

**New Platform Tables:**
- `creditTransactions` - Track credit earnings and spending
  - userId, amount, transactionType (earn/spend), description
- `userFavorites` - Save favorite properties per user
  - userId, propertyId, notes, createdAt
- `expertSessions` - Book consultation sessions
  - userId, sessionType, scheduledFor, status, notes

All tables use `varchar` UUID primary keys for consistency. ID columns are NEVER changed from their established type to maintain data integrity.

### Build & Deployment Strategy

**Development Workflow**
- `npm run dev` - Runs Express server with Vite middleware in development mode
- TypeScript compilation checking via `npm run check`
- Database schema pushing via `npm run db:push` (Drizzle Kit)

**Production Build**
- Frontend: Vite builds React SPA to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js` (ESM format)
- Single production command: `npm start` runs the built Express server serving static files

**File Structure Philosophy**
- `/client` - All frontend code (React components, pages, styles)
- `/server` - Backend code (routes, database, storage layer)
- `/shared` - Shared types, schemas, and validation (used by both client and server)
- Path aliases configured: `@/` for client, `@shared/` for shared code

### Design Philosophy Implementation

**Conversion Flow Architecture**
- Hero section with emotional headline and primary CTA ("Free Consultation")
- WhatsApp floating button for instant communication
- Contact forms integrated throughout with lead capture to database
- Trust-building sections with animated counters (500+ clients, 98% satisfaction)
- Property cards with "Learn the Story" emotional anchor CTAs

**Content Strategy**
- Manual data entry system (no automated scraping)
- Bilingual content management (Arabic primary, English secondary)
- Seed data provided for market trends and sample properties
- Educational "Real Estate Mindset" positioning throughout

## External Dependencies

### Core UI Libraries
- **Radix UI primitives** - Comprehensive set of accessible, unstyled components (accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, switch, tabs, toast, toggle, tooltip)
- **shadcn/ui** - Pre-built component library based on Radix UI with custom theming
- **Lucide React** - Icon library for consistent iconography
- **React Icons** - Additional icons (WhatsApp, social media)

### Form Handling
- **React Hook Form** - Form state management
- **@hookform/resolvers** - Zod integration for form validation
- **Zod** - Schema validation library (via drizzle-zod)

### Styling & Animation
- **TailwindCSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional class name utilities
- **PostCSS** with Autoprefixer

### Database & ORM
- **Drizzle ORM** - Type-safe database toolkit
- **@neondatabase/serverless** - Serverless Postgres driver with WebSocket support
- **drizzle-zod** - Automatic Zod schema generation from Drizzle schemas
- **ws** - WebSocket library for Neon connection

### Build Tools & Development
- **Vite** - Fast build tool and dev server
- **@vitejs/plugin-react** - React support for Vite
- **esbuild** - Fast JavaScript bundler for server build
- **TypeScript** - Type safety across the stack
- **tsx** - TypeScript execution for development

### Data Fetching
- **TanStack Query** - Async state management and caching
- **date-fns** - Date formatting and manipulation

### Additional Utilities
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel/slider functionality (for testimonials)
- **nanoid** - Unique ID generation

### Replit-Specific Integrations
- **@replit/vite-plugin-runtime-error-modal** - Enhanced error reporting
- **@replit/vite-plugin-cartographer** - Development tooling (dev mode only)
- **@replit/vite-plugin-dev-banner** - Development banner (dev mode only)

### Asset Management
- Custom asset organization with stock images and generated images stored in `/attached_assets`
- Vite alias configured for `@assets` path resolution
- Image optimization handled through Vite's asset pipeline