/**
 * Centralised logging utility
 * 
 * In development, all logs are shown. In production:
 * - log() calls are suppressed
 * - warn() and error() calls are preserved for debugging
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Log informational messages (only in development)
   */
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log warning messages (always shown)
   */
  warn: (...args: unknown[]): void => {
    console.warn(...args);
  },

  /**
   * Log error messages (always shown)
   */
  error: (...args: unknown[]): void => {
    console.error(...args);
  },

  /**
   * Log debug messages (only in development)
   */
  debug: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

