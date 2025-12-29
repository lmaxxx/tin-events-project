/**
 * Environment variable validation
 * Ensures all required environment variables are present on startup
 */

const requiredEnvVars = ['JWT_SECRET'] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  // Validate JWT_SECRET length (minimum 32 characters for security)
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters long for security.\n' +
        'Generate a secure secret with: openssl rand -base64 32'
    );
  }
}

// Auto-validate on import in production
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}
