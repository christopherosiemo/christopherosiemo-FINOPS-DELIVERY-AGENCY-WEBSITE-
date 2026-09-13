// Ordinary Next.js development and tests do not run in workerd. Vinext resolves
// cloudflare:workers natively; this alias preserves the existing Next path.
export const env = process.env;
