import { expect, test } from "@playwright/test";

import { productionContentSecurityPolicy } from "../../src/config/security-headers";

const routes = ["/", "/start", "/security", "/privacy", "/gate-10b2-hard-404"];

test("the deployable vinext Worker emits the approved security headers", async ({ request }) => {
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.status()).toBe(route.includes("hard-404") ? 404 : 200);

    const headers = response.headers();
    const csp = headers["content-security-policy"] ?? "";
    expect(csp).toBe(productionContentSecurityPolicy);
    expect(csp).toContain("script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com");
    expect(csp).toContain("frame-src https://challenges.cloudflare.com");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toMatch(/(?:^|\s)\*(?:;|\s|$)/);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-powered-by"]).toBeUndefined();
    expect(headers["strict-transport-security"]).toBeUndefined();
  }
});
