"use client";

import { ActionLink, Button } from "@/components/ui/actions";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ retry }: ErrorPageProps) {
  return (
    <main className="error-surface" id="main-content">
      <section aria-labelledby="error-title" className="container site-grid">
        <div className="error-surface__content">
          <p className="technical-label">Request interrupted</p>
          <h1 id="error-title">Something went wrong.</h1>
          <p>We could not complete this page request.</p>
          <div className="error-surface__actions">
            <Button onClick={retry}>Try again</Button>
            <ActionLink href="/" variant="secondary">Return to HKGpipi</ActionLink>
          </div>
        </div>
      </section>
    </main>
  );
}
