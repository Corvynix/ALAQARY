import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Fail-fast guard for admin initialization security (production only)
  const isProduction = process.env.NODE_ENV === 'production';
  const adminInitSecret = process.env.ADMIN_INIT_SECRET;
  const forbiddenPlaceholders = ['CHANGE_ME_IN_PRODUCTION', 'admin', 'secret'];
  
  if (isProduction && (!adminInitSecret || forbiddenPlaceholders.includes(adminInitSecret))) {
    console.error('\n============================================');
    console.error('FATAL ERROR: Invalid ADMIN_INIT_SECRET');
    console.error('============================================');
    console.error('');
    console.error('The ADMIN_INIT_SECRET environment variable must be set to a secure, unique value in production.');
    console.error('This secret is required to initialize the admin account securely.');
    console.error('');
    console.error('To fix this:');
    console.error('1. Set ADMIN_INIT_SECRET in your environment variables to a strong, random value');
    console.error('2. Do NOT use placeholder values like "CHANGE_ME_IN_PRODUCTION", "admin", or "secret"');
    console.error('3. Generate a secure secret: use a password generator or run: openssl rand -base64 32');
    console.error('');
    console.error('Example: ADMIN_INIT_SECRET=your-secure-random-secret-here');
    console.error('============================================\n');
    process.exit(1);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
