/**
 * Environment configuration utilities
 */

/**
 * Get the base URL for API calls
 * Priority: NEXT_PUBLIC_API_URL > NEXTAUTH_URL > WALINE_SITE_URL > localhost fallback
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: prefer public environment variable or current origin
    return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
  }

  // Server-side: check various environment variables
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.WALINE_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3000'
  );
}

/**
 * Get the domain/host from environment
 */
export function getDomain(): string {
  const baseUrl = getBaseUrl();
  try {
    return new URL(baseUrl).host;
  } catch {
    return 'localhost:3000';
  }
}

/**
 * Check if we're in production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in development environment
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}