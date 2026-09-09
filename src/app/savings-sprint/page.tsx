import { DirectionalLink } from "@/components/ui/actions";
import { RevenueHero, RevenuePage, SectionIntro, StageSequence, StartActions, revenueStyles as styles } from "@/components/revenue/revenue-page";
import { commercialFacts } from "@/config/commercial";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Savings Sprint",
  "A 14-day AWS Savings Sprint that ranks opportunities and creates an implementation roadmap.",
);

export default function SavingsSprintPage() {
  const stages = [
    { name: "ACCESS", description: "Customer provides tightly constrained read-only AWS access." },
    { name: "FIND", description: "Identify economically meaningful opportunities across cost, waste, commitments and architecture." },
    { name: "VALIDATE", description: "Assess value, confidence, engineering risk and relevant commitment exposure." },
    { name: "MAP", description: "Connect opportunities to services, teams and IaC locations where identifiable." },
    { name: "REMEDIATE", description: "Document the specific engineering changes required." },
    { name: "PRIORITISE", description: "Return a ranked Savings Ledger and implementation roadmap." },
  ] as const;

  const reviewMatrix = [
    ["SAVINGS OPPORTUNITIES", "Ranked by monetary value, confidence and engineering risk."],
    ["COMMITMENTS", "Savings Plan / commitment exposure."],
    ["IDLE / WASTE", "Infrastructure with unnecessary ongoing cost."],
    ["ARCHITECTURE", "Expensive architecture patterns."],
    ["REMEDIATION", "Specific engineering steps."],
    ["IAC", "Repository / infrastructure-as-code locations where identifiable."],
  ] as const;

  return (
    <RevenuePage>
      <RevenueHero eyebrow="14-DAY AWS SAVINGS SPRINT" title="Find what is worth changing in 14 days." summary="A focused engineering and cost review that ranks the AWS opportunities worth acting on and produces a specific implementation roadmap.">
        <p className="technical-label">{commercialFacts.savingsSprint.name}</p>
        <strong className={styles.price}>{commercialFacts.savingsSprint.price}</strong>
        <span className={styles.priceQualifier}>{commercialFacts.savingsSprint.qualifier}</span>
        <StartActions secondary={{ href: "/implementation", label: "See what happens next" }} />
        <p className={styles.microcopy}>Tightly constrained read-only access.</p>
      </RevenueHero>

      <section className={styles.sectionSurface} aria-labelledby="sprint-sequence">
        <div className="container">
          <SectionIntro label="01 · Engagement sequence" title="A bounded review from access to a ranked plan." titleId="sprint-sequence">
            <p>Six explicit stages turn AWS cost evidence into decisions your engineering team can act on.</p>
          </SectionIntro>
          <StageSequence stages={stages} testId="sprint-sequence" />
          <aside className={styles.boundaryNote}>
            <strong>No deployment within the Sprint.</strong>
            <p>The Savings Sprint produces discovery evidence and a specific implementation roadmap. It does not independently deploy changes.</p>
          </aside>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="review-scope">
        <div className="container">
          <SectionIntro label="02 · Review scope" title="The review follows cost through engineering consequence." titleId="review-scope">
            <p>Each category is assessed as decision material, not as an isolated recommendation list.</p>
          </SectionIntro>
          <dl className={styles.matrix}>
            {reviewMatrix.map(([term, description]) => <div className={styles.matrixItem} key={term}><dt>{term}</dt><dd>{description}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className={styles.sectionSurface} aria-labelledby="ledger-deliverable">
        <div className="container">
          <SectionIntro label="03 · Primary deliverable" title="You leave with a ranked Savings Ledger." titleId="ledger-deliverable">
            <p>A decision record that preserves value, confidence, risk, accountability and remediation state.</p>
          </SectionIntro>
          <div className={styles.tableFrame} data-testid="sprint-ledger">
            <div className={styles.tableCaption}><strong>Illustrative</strong><span>Decision-quality fields, not a customer result</span></div>
            <table className={styles.dataTable}>
              <thead><tr><th>Priority</th><th>Opportunity</th><th>Expected saving</th><th>Confidence</th><th>Engineering risk</th><th>Owner</th><th>Remediation status</th></tr></thead>
              <tbody><tr><td data-label="Priority">01</td><td data-label="Opportunity">Opportunity description</td><td data-label="Expected saving">Estimated value</td><td data-label="Confidence">Evidence level</td><td data-label="Engineering risk">Assessed risk</td><td data-label="Owner">Accountable team</td><td data-label="Remediation status">Required change mapped</td></tr></tbody>
            </table>
          </div>
          <p className={styles.tableNote}>The Ledger becomes the implementation backlog. The example shows the structure used to support a decision; it is not a real report, live account or customer result.</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="team-requirements">
        <div className="container">
          <SectionIntro label="04 · Inputs" title="What we need from your team." titleId="team-requirements"><p>Access is deliberately narrow. Context helps the review stay connected to operational reality.</p></SectionIntro>
          <div className={styles.requirements}>
            <article className={styles.requirement}><p className="technical-label">Required</p><h3>Read-only AWS access</h3><p>Tightly constrained access is required to examine relevant cost and service evidence.</p></article>
            <article className={styles.requirement}><p className="technical-label">Typically useful</p><h3>A technical point of contact</h3><p>Architecture and operational context are typically useful for validating risk, ownership and constraints.</p></article>
          </div>
        </div>
      </section>

      <section className={styles.sectionInverse} aria-labelledby="discovery-boundary">
        <div className="container">
          <SectionIntro label="05 · Control boundary" title="Discovery, not uncontrolled change." titleId="discovery-boundary"><p>The Sprint does not independently deploy. Any later engineering change remains within your repositories, review, approval and deployment controls.</p></SectionIntro>
        </div>
      </section>

      <section className={styles.closingSection} aria-labelledby="implementation-branches">
        <div className="container">
          <SectionIntro label="06 · After the Sprint" title="When the Ledger is ready, choose how approved work gets implemented." titleId="implementation-branches"><p>The first engagement identifies what is worth changing. Approved work can then follow one of two implementation routes.</p></SectionIntro>
          <div className={styles.offerPair}>
            <article className={styles.offer}><p className="technical-label">Fixed implementation</p><h3>{commercialFacts.fixedImplementation.name}</h3><strong className={styles.price}>{commercialFacts.fixedImplementation.price}</strong><p>A fixed-price implementation engagement for the approved scope.</p></article>
            <article className={styles.offer}><p className="technical-label">Outcome-based implementation</p><h3>{commercialFacts.outcomeImplementation.name}</h3><strong className={styles.price}>{commercialFacts.outcomeImplementation.price}</strong><span className={styles.priceQualifier}>{commercialFacts.outcomeImplementation.qualifier}</span><p>An alternative commercial model linked to savings that meet the agreed verification definition.</p></article>
          </div>
          <div className={styles.actions}><DirectionalLink href="/implementation">Compare implementation options</DirectionalLink></div>
          <StartActions />
        </div>
      </section>
    </RevenuePage>
  );
}
