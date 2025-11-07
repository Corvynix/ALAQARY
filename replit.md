# Luxury Real Estate Consultant Website

## Overview

A premium, conversion-focused luxury real estate consultant website designed to position the owner as the most trusted real estate authority in the region. The platform combines emotional psychology with modern web technologies to transform visitors into clients through strategic trust-building, educational content, and seamless consultation flows.

The website targets property buyers and investors by addressing five key emotional gaps: Trust, Confusion, Risk, Aspiration, and Status. Every element is crafted to feel like a $5M brand experience, from the deep black and luxury gold color scheme to the bilingual Arabic-first content strategy.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- `users` - Admin/user authentication (username, password, role)
- `properties` - Property listings with bilingual content, images array, status tracking
- `market_trends` - Market analysis data with demand levels, price changes
- `leads` - Contact form submissions for conversion tracking
- `content` - Blog posts and educational content with bilingual support

All tables include UUID primary keys and appropriate timestamps.

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