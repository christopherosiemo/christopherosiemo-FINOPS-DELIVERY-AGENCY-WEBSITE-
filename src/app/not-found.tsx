import { ActionLink, DirectionalLink } from "@/components/ui/actions";

export default function NotFound() {
  return (
    <main className="error-surface" id="main-content">
      <section aria-labelledby="not-found-title" className="container site-grid">
        <div className="error-surface__content">
          <p className="technical-label">Navigation</p>
          <h1 id="not-found-title">Page not found.</h1>
          <p>We could not find the page you requested.</p>
          <div className="error-surface__actions">
            <ActionLink href="/">Return to HKGpipi</ActionLink>
            <DirectionalLink href="/start">Start an enquiry</DirectionalLink>
          </div>
        </div>
      </section>
    </main>
  );
}
