# Sentry Error Tracking Setup Guide

## Overview

Sentry provides real-time error tracking, performance monitoring, and user crash reports for production environments. This guide walks you through setting up Sentry for the Real Estate Consultancy Platform.

## 1. Install Sentry SDKs

```bash
npm install @sentry/node @sentry/react @sentry/profiling-node
```

## 2. Create Sentry Project

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project
   - Platform: Node.js (for backend)
   - Platform: React (for frontend)
3. Copy your DSN (Data Source Name)

## 3. Backend Integration (server/index.ts)

Add this at the very top of `server/index.ts`:

```typescript
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";

// Initialize Sentry FIRST, before any other imports
Sentry.init({
  dsn: process.env.SENTRY_DSN_SERVER,
  environment: process.env.NODE_ENV || 'development',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Profiling
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new ProfilingIntegration(),
  ],
  
  // Filter sensitive data
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
    }
    return event;
  },
});

// Add request handler middleware (after helmet, before routes)
app.use(Sentry.Handlers.requestHandler());

// Add tracing middleware
app.use(Sentry.Handlers.tracingHandler());

// ... your routes here ...

// Add error handler middleware (AFTER all routes, BEFORE other error handlers)
app.use(Sentry.Handlers.errorHandler());
```

## 4. Frontend Integration (client/src/main.tsx)

Add at the top of `client/src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN_CLIENT,
  environment: import.meta.env.MODE,
  
  // Performance monitoring
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Performance
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  
  // Session replay (for debugging user issues)
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Filter sensitive data
  beforeSend(event) {
    // Don't send events in development
    if (import.meta.env.DEV) {
      return null;
    }
    return event;
  },
});
```

## 5. Update Error Boundary (client/src/components/error-boundary.tsx)

Replace the TODO comment with:

```typescript
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error('Error caught by boundary:', error, errorInfo);
  
  // Send to Sentry
  import('@sentry/react').then(Sentry => {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  });
}
```

## 6. Environment Variables

Add to your `.env` file:

```bash
# Server-side Sentry DSN
SENTRY_DSN_SERVER=https://your-server-dsn@sentry.io/project-id

# Client-side Sentry DSN (must be prefixed with VITE_)
VITE_SENTRY_DSN_CLIENT=https://your-client-dsn@sentry.io/project-id
```

**Important:** Never commit these to Git. Add to `.env.example` as placeholders.

## 7. Manual Error Capturing

### Backend Example (routes, middleware):

```typescript
import * as Sentry from "@sentry/node";

try {
  await processPayment(paymentData);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      payment_method: paymentData.method,
      user_id: user.id,
    },
    level: 'error',
  });
  throw error;
}
```

### Frontend Example (components, hooks):

```typescript
import * as Sentry from "@sentry/react";

const handleBooking = async () => {
  try {
    await bookConsultation(data);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        booking_type: data.type,
        user_role: user.role,
      },
      user: {
        id: user.id,
        email: user.email,
      },
    });
    toast.error("Booking failed");
  }
};
```

## 8. Source Maps Upload

For better error stack traces in production, upload source maps:

### Install Sentry CLI:

```bash
npm install --save-dev @sentry/webpack-plugin
```

### Update vite.config.ts:

```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    // ... other plugins
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "your-org",
      project: "your-project",
    }),
  ],
});
```

### Add to .env:

```bash
SENTRY_AUTH_TOKEN=your-auth-token
```

## 9. Performance Monitoring

### Track Custom Transactions:

```typescript
import * as Sentry from "@sentry/node";

const transaction = Sentry.startTransaction({
  op: "ai_consultation",
  name: "Generate AI Consultation",
});

try {
  const result = await generateConsultation(data);
  transaction.setStatus('ok');
  return result;
} catch (error) {
  transaction.setStatus('internal_error');
  throw error;
} finally {
  transaction.finish();
}
```

### Track Database Queries:

```typescript
const span = transaction.startChild({
  op: "db.query",
  description: "SELECT * FROM properties WHERE region = ?",
});

const results = await db.query.properties.findMany({
  where: eq(properties.region, region),
});

span.finish();
```

## 10. Alerting Rules

Configure in Sentry dashboard:

1. **High Error Rate Alert**
   - Condition: Error count > 50 in 1 hour
   - Action: Email, Slack notification

2. **New Release Issues**
   - Condition: New error appears after deployment
   - Action: Immediate Slack notification

3. **Performance Degradation**
   - Condition: P95 response time > 2s for 15 minutes
   - Action: Email notification

4. **Critical Payment Errors**
   - Condition: Any error with tag `payment_critical`
   - Action: PagerDuty alert

## 11. Testing Sentry Integration

### Test Backend:

```bash
# In development
curl http://localhost:5000/api/test-sentry-error
```

Create a test endpoint:

```typescript
app.get('/api/test-sentry-error', (req, res) => {
  throw new Error('Test Sentry error from backend');
});
```

### Test Frontend:

Add a test button in development:

```typescript
<Button onClick={() => {
  throw new Error('Test Sentry error from frontend');
}}>
  Test Sentry
</Button>
```

## 12. Production Checklist

Before deploying:

- [ ] Sentry DSNs configured in environment variables
- [ ] Source maps upload configured
- [ ] Error filtering configured (no sensitive data)
- [ ] Alerts configured
- [ ] Tested error reporting in staging
- [ ] Sampling rates configured (10% for production)
- [ ] Team members added to Sentry project

## 13. Cost Optimization

- Use 10% sampling for traces in production
- Enable session replay only for errors (100%) and 10% of normal sessions
- Set up data retention limits (90 days recommended)
- Filter out known non-critical errors

## Resources

- [Sentry Node.js Docs](https://docs.sentry.io/platforms/node/)
- [Sentry React Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Performance Monitoring](https://docs.sentry.io/product/performance/)
- [Session Replay](https://docs.sentry.io/product/session-replay/)
