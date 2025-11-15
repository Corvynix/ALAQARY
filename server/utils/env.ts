/**
 * Validates required environment variables
 */
export function validateEnv() {
  const required = ['DATABASE_URL'];
  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  // Validate DATABASE_URL format
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.warn('Warning: DATABASE_URL should start with postgresql://');
  }

  // Set defaults for optional variables
  if (!process.env.PORT) {
    process.env.PORT = '5000';
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }

  console.log('Environment validation passed');
}

