/**
 * Centralised logging utility.
 * All levels log to console (useful for debugging this personal app).
 */

export const logger = {
  log: (...args: unknown[]): void => {
    console.log('[F1]', ...args);
  },

  warn: (...args: unknown[]): void => {
    console.warn('[F1]', ...args);
  },

  error: (...args: unknown[]): void => {
    console.error('[F1]', ...args);
  },

  debug: (...args: unknown[]): void => {
    console.debug('[F1]', ...args);
  },
};

