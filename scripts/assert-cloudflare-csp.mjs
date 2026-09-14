import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const artifactRoot = path.resolve("dist/server");
const expectedPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

async function artifactFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return artifactFiles(entryPath);
    return /\.(?:js|json|mjs)$/.test(entry.name) ? [entryPath] : [];
  }));
  return files.flat();
}

const files = await artifactFiles(artifactRoot);
const exactHeaderFound = (await Promise.all(files.map(async (file) => {
  const content = await readFile(file, "utf8");
  return content.includes("Content-Security-Policy") && content.includes(expectedPolicy);
}))).some(Boolean);

if (!exactHeaderFound) {
  throw new Error("Cloudflare artifact is missing the approved Content-Security-Policy header.");
}

console.log("Cloudflare artifact CSP assertion passed.");
