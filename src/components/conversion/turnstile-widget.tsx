"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { TURNSTILE_ACTION } from "@/lib/enquiry/runtime-config";
import styles from "./start-page.module.css";

declare global {
  interface Window {
    turnstile?: {
      render(container: HTMLElement, options: Record<string, unknown>): string;
      reset(widgetId: string): void;
      remove(widgetId: string): void;
    };
  }
}

type TurnstileWidgetProps = {
  resetKey: string;
  siteKey?: string;
  testMode: boolean;
  testToken?: string;
};

export function TurnstileWidget({ resetKey, siteKey, testMode, testToken = "test-success" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [token, setToken] = useState(testMode ? testToken : "");
  const contextId = useId();

  const renderWidget = useCallback(() => {
    if (testMode || !siteKey || !containerRef.current || !window.turnstile || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: TURNSTILE_ACTION,
      theme: "light",
      size: "flexible",
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, [siteKey, testMode]);

  useEffect(() => {
    if (testMode) return;
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      const timer = window.setTimeout(() => setToken(""), 0);
      return () => window.clearTimeout(timer);
    }
  }, [resetKey, testMode, testToken]);

  useEffect(() => () => {
    if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
  }, []);

  return (
    <div className={styles.verification} aria-describedby={contextId}>
      <p className={styles.verificationLabel}>Submission verification</p>
      <p className={styles.verificationContext} id={contextId}>This security check helps protect the enquiry form from automated abuse.</p>
      <input name="cf-turnstile-response" type="hidden" value={token} readOnly />
      {testMode ? (
        <div className={styles.testTurnstile} data-turnstile-state="ready">Verification ready</div>
      ) : (
        <>
          <Script
            id="cloudflare-turnstile"
            onReady={renderWidget}
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
          />
          <div className={styles.turnstileFrame} ref={containerRef} />
        </>
      )}
    </div>
  );
}
