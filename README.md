# Real Estate Consultancy SaaS Platform

[![Tests](https://img.shields.io/badge/tests-14%20passing-brightgreen)]()
[![Production Ready](https://img.shields.io/badge/production-ready-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

An Arabic-first real estate consultancy and market intelligence platform designed to connect clients with trusted property advisors, developers, and AI-driven market insights.

## Features

### For Clients
- **Book Consultations**: Pay 200 EGP consultation fee for personalized advice
- **AI-Powered Insights**: Market analysis and property recommendations
- **Developer Matching**: Connect with verified developers
- **Property Browsing**: Search and filter properties by region, type, price
- **Buyer Profiles**: Detailed investment preferences and risk tolerance

### For Developers
- **Property Listings**: Manage properties with multilingual support
- **Lead Generation**: Receive matched client leads
- **Trust Score System**: Build credibility through verified ratings
- **Analytics Dashboard**: Track property performance

### For Admins
- **User Management**: Manage clients, developers, and permissions
- **Consultation Oversight**: Monitor and manage bookings
- **Payment Tracking**: View transaction history and commissions (2%)
- **Market Data Upload**: Bulk upload market intelligence
- **Analytics**: Platform-wide metrics and insights

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **TanStack Query** for server state management
- **Wouter** for routing
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **Radix UI** for accessible primitives

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** via Neon serverless
- **Drizzle ORM** for type-safe queries
- **Replit OIDC** for user authentication
- **Passport.js** for admin authentication
- **Stripe** for payment processing

### Security & Monitoring
- **Helmet.js** for security headers
- **Pino** for structured logging
- **Rate limiting** (100 req/15min global, 5 req/15min admin)
- **Sentry** integration ready
- **Graceful shutdown** handling

### Testing
- **Vitest** for unit/integration tests
- **Testing Library** for React components
- **Happy DOM** for test environment
- **14 passing tests** covering critical paths

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (or Neon serverless)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-consultancy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and configure:
   
   ```bash
   # Database
   DATABASE_URL=your-postgresql-connection-string
   
   # Session
   SESSION_SECRET=your-secure-random-secret-32-chars-minimum
   
   # Admin
   ADMIN_INIT_SECRET=your-admin-initialization-secret
   
   # Payment (optional)
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # AI Features
   GEMINI_API_KEY=your-gemini-api-key
   
   # Monitoring (optional)
   SENTRY_DSN_SERVER=https://...
   VITE_SENTRY_DSN_CLIENT=https://...
   
   # Environment
   NODE_ENV=development
   ```

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── test/          # Test files
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database interface
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle database schema
├── docs/                  # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── SENTRY_SETUP.md
│   └── PRODUCTION_DEPLOYMENT_CHECKLIST.md
└── PRODUCTION_READINESS_AUDIT.md  # Comprehensive audit
```

## Configuration

### Security Headers

Security headers are configured via Helmet.js:
- Content Security Policy
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

### Rate Limiting

- **Global**: 100 requests per 15 minutes
- **Admin Auth**: 5 requests per 15 minutes

### Session Management

- PostgreSQL-backed sessions
- 7-day TTL
- Automatic cleanup
- Secure, HTTP-only cookies

## API Documentation

See [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) for complete API reference.

### Key Endpoints

- `GET /api/auth/user` - Get current user
- `POST /api/consultations/book` - Book consultation
- `GET /api/properties` - Browse properties
- `GET /health` - Health check
- `GET /health/ready` - Readiness check

## Deployment

See [docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md](docs/PRODUCTION_DEPLOYMENT_CHECKLIST.md) for the complete deployment guide.

### Quick Deploy (Replit)

1. Set environment variables in Replit Secrets
2. Run `npm run db:push` to set up database
3. Click "Deploy" button
4. Configure autoscale deployment

### Production Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] Health checks working
- [ ] Monitoring configured
- [ ] Legal pages accessible
- [ ] Tests passing
- [ ] Security audit completed

## Monitoring

### Health Checks

- `GET /health` - Overall health status with database check
- `GET /health/ready` - Readiness probe for deployment

### Error Tracking

Sentry integration ready. See [docs/SENTRY_SETUP.md](docs/SENTRY_SETUP.md) for setup instructions.

### Logging

Structured logging with Pino:
- Request/response logging
- Error tracking with stack traces
- Performance metrics
- Request ID tracking

## Testing

Current test coverage: 14 tests passing

### Test Structure

- **Unit Tests**: Component logic, utilities, hooks
- **Integration Tests**: Authentication, i18n, theme
- **E2E Tests**: Critical user flows (planned)

### Running Specific Tests

```bash
# Run only auth tests
npm test -- auth.test

# Run tests in watch mode
npm test -- --watch
```

## Legal Compliance

- ✅ Privacy Policy (`/privacy-policy`)
- ✅ Terms of Service (`/terms-of-service`)
- ✅ Cookie Consent Banner
- ⏳ GDPR Compliance (in progress)

## Performance

- **Compression**: Enabled via middleware
- **Code Splitting**: Automatic via Vite
- **Lazy Loading**: Implemented for routes
- **Database Indexes**: 15+ strategic indexes

## Internationalization

- **Primary Language**: Arabic (RTL)
- **Secondary Language**: English (LTR)
- **Dynamic Switching**: Language toggle in UI
- **Persistent Preference**: Stored in localStorage

## Security

- ✅ Helmet.js security headers
- ✅ HTTPS enforced
- ✅ Rate limiting
- ✅ Session security
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Environment variable validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Test coverage for new features

## License

This project is licensed under the MIT License.

## Support

For support, please contact:
- **Email**: support@realestate-consultancy.com
- **Documentation**: See `/docs` folder
- **Issues**: GitHub Issues

## Roadmap

### Q1 2026
- [ ] Achieve 80%+ test coverage
- [ ] Implement Redis caching
- [ ] Add CDN for static assets
- [ ] Complete GDPR compliance

### Q2 2026
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI chat assistant
- [ ] Property comparison tool

### Q3 2026
- [ ] Microservices architecture
- [ ] Multi-language support (French, Spanish)
- [ ] Advanced search filters
- [ ] Virtual property tours

## Acknowledgments

- shadcn/ui for the component library
- Radix UI for accessible primitives
- Drizzle ORM for type-safe database queries
- Replit for hosting and deployment

---

**Built with ❤️ for the real estate community**
