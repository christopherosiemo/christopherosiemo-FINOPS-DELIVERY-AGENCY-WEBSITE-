import { DirectionalLink } from "@/components/ui/actions";
import { EnquiryForm } from "./enquiry-form";
import styles from "./start-page.module.css";

type StartPageProps = {
  issuedAt: number;
  deliveryScenario?: string;
};

export function StartPage({ issuedAt, deliveryScenario }: StartPageProps) {
  return (
    <main
      className={styles.page}
      data-route-stage="conversion"
      data-suppress-footer-cta="true"
      id="main-content"
      tabIndex={-1}
    >
      <section className={styles.start} aria-labelledby="page-title">
        <div className={`container site-grid ${styles.layout}`}>
          <div className={styles.context}>
            <p className="eyebrow">Start a Savings Sprint</p>
            <h1 id="page-title">Tell us where AWS spend is getting in the way.</h1>
            <p className={styles.summary}>
              Give us enough context to understand your AWS estate, the engineering constraint and what you want to
              change. We will use it to determine whether a Savings Sprint is the right first step.
            </p>

            <aside className={styles.commercial} aria-labelledby="sprint-reminder">
              <p className="technical-label">First engagement</p>
              <h2 id="sprint-reminder">14-Day AWS Savings Sprint</h2>
              <p className={`financial-value ${styles.price}`}>£5,000 upfront</p>
              <dl className={styles.facts}>
                <div><dt>Duration</dt><dd>14 days</dd></div>
                <div><dt>Discovery</dt><dd>Read-only</dd></div>
                <div><dt>Authority</dt><dd>No infrastructure change</dd></div>
              </dl>
              <DirectionalLink href="/savings-sprint">Review the Savings Sprint</DirectionalLink>
            </aside>
          </div>

          <div className={styles.formColumn}>
            <EnquiryForm issuedAt={issuedAt} deliveryScenario={deliveryScenario} />
          </div>
        </div>
      </section>

      <nav className={`container ${styles.trustLinks}`} aria-label="Enquiry supporting information">
        <DirectionalLink href="/savings-sprint">How the Sprint works</DirectionalLink>
        <DirectionalLink href="/security">Security</DirectionalLink>
        <DirectionalLink href="/verification">Verification</DirectionalLink>
      </nav>
    </main>
  );
}
