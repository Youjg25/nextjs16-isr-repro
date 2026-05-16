// Stub for production logger.
export const logger = {
  warn: (scope: string, msg: string, ctx?: unknown) => {
    console.warn(`[${scope}]`, msg, ctx);
  },
  error: (scope: string, msg: string, ctx?: unknown) => {
    console.error(`[${scope}]`, msg, ctx);
  },
};
