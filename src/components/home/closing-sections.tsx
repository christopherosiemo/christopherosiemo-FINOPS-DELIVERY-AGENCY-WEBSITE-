import { ActionLink, DirectionalLink } from "@/components/ui/actions";
import styles from "./home.module.css";

export function SecurityBoundary() {
  return (
    <section className={styles.securitySection} aria-labelledby="security-boundary">
      <div className="container">
        <div className={styles.sectionIntro} data-motion-reveal data-motion-state="pending">
          <p className="technical-label">06 · Access boundary</p>
          <h2 id="security-boundary">Read what we need.<br />Change nothing without you.</h2>
        </div>
        <div className={styles.boundaries} data-motion-reveal data-motion-state="pending">
          <article>
            <p className="technical-label">Discovery</p>
            <h3>Tightly constrained read-only AWS access.</h3>
          </article>
          <article>
            <p className="technical-label">Implementation</p>
            <h3>Changes move through your existing repositories, approvals and deployment controls.</h3>
          </article>
        </div>
        <DirectionalLink href="/security">Review security</DirectionalLink>
      </div>
    </section>
  );
}

export function EngagementPath() {
  return (
    <section className={styles.engagementSection} aria-labelledby="engagement-path">
      <div className="container">
        <div className={styles.sectionIntro} data-motion-reveal data-motion-state="pending">
          <p className="technical-label">07 · First engagement</p>
          <h2 id="engagement-path">Find what is worth changing in 14 days.</h2>
        </div>
        <div className={styles.commercialPath}>
          <article className={styles.sprintOffer} data-motion-reveal data-motion-state="pending">
            <p>Start here</p>
            <h3>14-Day AWS Savings Sprint</h3>
            <strong>£5,000</strong>
            <span>upfront</span>
            <p>Find and validate what is worth changing.</p>
          </article>
          <div className={styles.thenLabel}><span>Then choose how approved work is implemented</span></div>
          <div className={styles.implementationRoutes} data-motion-reveal="follow" data-motion-state="pending">
            <article><p className="technical-label">Fixed implementation</p><h3>Implementation Sprint</h3><strong>£15,000</strong></article>
            <span className={styles.or}>or</span>
            <article><p className="technical-label">Outcome-based</p><h3>Verified-savings model</h3><strong>25%</strong><span>of verified savings</span></article>
          </div>
        </div>
        <div className={styles.engagementActions} data-engagement-actions>
          <ActionLink href="/start">Start a Savings Sprint</ActionLink>
          <ActionLink href="/pricing" variant="secondary">View pricing</ActionLink>
        </div>
      </div>
    </section>
  );
}
