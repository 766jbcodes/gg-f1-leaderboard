/**
 * Environment configuration
 *
 * Centralised configuration for API endpoints and other environment variables.
 * Falls back to sensible defaults if environment variables are not set.
 */

const adminEmailsRaw = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;
const adminEmails = adminEmailsRaw
  ? adminEmailsRaw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean)
  : [];

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.jolpi.ca/ergast/f1',
    fallbackUrl: import.meta.env.VITE_FALLBACK_API_URL || 'https://ergast.com/api/f1',
  },
  cache: {
    storageKey: 'f1_standings_cache',
    memoryCacheDuration: 5 * 60 * 1000, // 5 minutes
    localStorageDuration: 24 * 60 * 60 * 1000, // 24 hours
    throttleDelay: 1000, // 1 second between requests
  },
  admin: {
    /** If non-empty, only these emails can open Admin. Empty = no gating. */
    allowedEmails: adminEmails,
  },
} as const;

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  if (config.admin.allowedEmails.length === 0) return true;
  return config.admin.allowedEmails.includes(email.trim().toLowerCase());
}

