import { VerificationLine } from "@/components/ui/verification-line";
import styles from "./home.module.css";

const approvalStages = ["Opportunity", "Ticket / PR", "CI", "Review", "Approval", "Production"];

export function RemediationEvidence() {
  return (
    <section className={styles.majorSection} aria-labelledby="remediation-evidence">
      <div className="container">
        <div className={styles.sectionIntro}>
          <p className="technical-label">03 · Engineering evidence</p>
          <h2 id="remediation-evidence">Not another recommendation.<br />The change required to realise it.</h2>
          <p>A saving only becomes actionable when engineering can see what changes, where it changes and what risk it carries.</p>
        </div>
        <div className={styles.remediation} data-testid="remediation-evidence">
          <div className={styles.remediationFacts}>
            <p className="technical-label">Illustrative</p>
            <dl>
              <div><dt>Opportunity</dt><dd>RDS rightsizing</dd></div>
              <div><dt>Expected saving</dt><dd className="financial-value">£4,820 / mo</dd></div>
              <div><dt>Confidence</dt><dd>High</dd></div>
              <div><dt>Engineering risk</dt><dd>Low</dd></div>
              <div><dt>Owner</dt><dd>Platform</dd></div>
              <div><dt>Evidence</dt><dd>34 days utilisation</dd></div>
              <div><dt>IaC location</dt><dd className="technical-value">infra/prod/rds.tf:118</dd></div>
            </dl>
          </div>
          <figure className={styles.diffSpecimen}>
            <figcaption><span className="technical-label">Illustrative</span><span>Terraform change</span></figcaption>
            <pre aria-label="Illustrative Terraform remediation diff"><code>{`resource "aws_db_instance" "payments" {
- instance_class = "db.r6g.4xlarge"
+ instance_class = "db.r6g.2xlarge"
}`}</code></pre>
          </figure>
        </div>
      </div>
    </section>
  );
}

export function ApprovalPath() {
  return (
    <section className={styles.controlSection} aria-labelledby="customer-controls">
      <div className="container">
        <div className={styles.sectionIntro}>
          <p className="technical-label">04 · Customer control</p>
          <h2 id="customer-controls">Your infrastructure.<br />Your controls.</h2>
          <p>Discovery begins with tightly constrained read-only AWS access. Engineering changes move through your existing repositories, reviews and deployment controls.</p>
        </div>
        <ol className={styles.approvalFlow} aria-label="Customer-controlled implementation flow">
          {approvalStages.map((stage) => <li key={stage}>{stage}</li>)}
        </ol>
        <p className={styles.controlNote}>HKGpipi does not bypass engineering.</p>
        <a className={styles.inlineLink} href="/security">Review our security model <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}

export function VerificationEvidence() {
  return (
    <section className={styles.verificationSection} aria-labelledby="verification-evidence">
      <div className="container">
        <div className={styles.sectionIntro}>
          <p className="technical-label">05 · Measured result</p>
          <h2 id="verification-evidence">A recommendation is estimated.<br />A saving is measured.</h2>
          <p>After deployment we watch billing data, establish the post-change result and report the verified annualised saving.</p>
        </div>
        <div data-testid="homepage-verification-line">
          <VerificationLine label="Illustrative" context="Expected → reconciliation → measured result" />
        </div>
        <div className={styles.equation} aria-label="Baseline spend minus post-change spend equals verified saving">
          <span>Baseline spend</span><b aria-hidden="true">−</b><span>post-change spend</span><b aria-hidden="true">=</b><strong>verified saving</strong>
        </div>
        <p className={styles.verificationNote}>Conceptual explanation only. Final verification accounts for the agreed billing baseline and relevant workload changes.</p>
      </div>
    </section>
  );
}
