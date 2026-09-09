import { DirectionalLink } from "@/components/ui/actions";
import { RevenueHero, RevenuePage, SectionIntro, StageSequence, StartActions, revenueStyles as styles } from "@/components/revenue/revenue-page";
import { commercialFacts } from "@/config/commercial";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Implementation",
  "Approved AWS savings delivered through the customer's existing engineering workflow.",
);

export default function ImplementationPage() {
  const stages = [
    { name: "SELECT", description: "Choose approved Ledger items for implementation." },
    { name: "PREPARE", description: "Produce the appropriate PR, ticket or configuration change." },
    { name: "REVIEW", description: "Move through the customer's existing engineering review process." },
    { name: "DEPLOY", description: "Customer-controlled deployment follows the existing workflow." },
    { name: "BASELINE", description: "Establish the realised-savings measurement baseline." },
    { name: "VERIFY", description: "Measure the resulting bill reduction against the agreed verification basis." },
  ] as const;

  return (
    <RevenuePage>
      <RevenueHero eyebrow="IMPLEMENTATION" title="Turn approved savings into production changes." summary="HKGpipi turns approved Savings Ledger items into PRs, tickets and configuration changes and works through your existing engineering workflow to deployment and measurement.">
        <p className="technical-label">Starting condition</p><h2>Start with approved work.</h2><p className={styles.tableNote}>Work is validated, prioritised and approved for engineering before implementation begins. Your team retains authority throughout.</p>
      </RevenueHero>

      <section className={styles.sectionSurface} aria-labelledby="implementation-flow">
        <div className="container"><SectionIntro label="01 · Delivery flow" title="From selected opportunity to measured result." titleId="implementation-flow"><p>Every stage stays connected to the approved work and the customer&apos;s controls.</p></SectionIntro><StageSequence stages={stages} testId="implementation-sequence" /></div>
      </section>

      <section className={styles.section} aria-labelledby="evidence-chain">
        <div className="container"><SectionIntro label="02 · Evidence chain" title="The implementation record stays traceable." titleId="evidence-chain"><p>Illustrative workflow — it describes the evidence relationship, not a live repository or ticketing integration.</p></SectionIntro><ol className={styles.evidenceChain} data-testid="implementation-evidence-chain"><li>Ledger item</li><li>IaC or implementation change</li><li>Review</li><li>Deployed</li><li>Measurement</li></ol></div>
      </section>

      <section className={styles.sectionSurface} aria-labelledby="implementation-options">
        <div className="container">
          <SectionIntro label="03 · Commercial routes" title="Two alternatives for approved implementation." titleId="implementation-options"><p>Choose a fixed engagement or an outcome-based model. They are alternatives, not combined standard charges.</p></SectionIntro>
          <div className={styles.offerPair}>
            <article className={styles.offer}><h3>Fixed implementation</h3><p className={styles.offerName}>{commercialFacts.fixedImplementation.name}</p><strong className={styles.price}>{commercialFacts.fixedImplementation.price}</strong><p>A fixed-price implementation engagement for the approved scope.</p></article>
            <article className={styles.offer}><h3>Outcome-based implementation</h3><strong className={styles.price}>{commercialFacts.outcomeImplementation.price}</strong><span className={styles.priceQualifier}>{commercialFacts.outcomeImplementation.qualifier}</span><p>HKGpipi&apos;s fee is calculated from savings that meet the agreed verification definition.</p><p><strong>The contractual verification basis is agreed before outcome-based implementation begins.</strong></p></article>
          </div>
          <div className={`${styles.tableFrame} ${styles.decisionTable}`} data-testid="implementation-comparison">
            <div className={styles.tableCaption}><strong>Structured comparison</strong><span>Known distinctions only</span></div>
            <table className={styles.dataTable}><caption className={styles.tableSemanticCaption}>Known distinctions between fixed and outcome-based implementation</caption><thead><tr><th scope="col">Decision</th><th scope="col">Fixed implementation</th><th scope="col">Outcome-based implementation</th></tr></thead><tbody>
              <tr><th scope="row">Commercial basis</th><td data-label="Fixed implementation">Fixed implementation fee</td><td data-label="Outcome-based implementation">Verified-savings-linked fee</td></tr>
              <tr><th scope="row">Engineering workflow</th><td data-label="Fixed implementation">Existing customer process</td><td data-label="Outcome-based implementation">Existing customer process</td></tr>
              <tr><th scope="row">Verification</th><td data-label="Fixed implementation">Measurement after deployment</td><td data-label="Outcome-based implementation">Measurement after deployment</td></tr>
            </tbody></table>
          </div>
          <StartActions />
        </div>
      </section>

      <section className={styles.sectionInverse} aria-labelledby="engineering-control">
        <div className={`container ${styles.controlGrid}`}><SectionIntro label="04 · Customer control" title="Your engineering process stays in control." titleId="engineering-control"><p>HKGpipi prepares approved work for delivery without bypassing your technical authority.</p></SectionIntro><div><ol className={styles.controlList}><li>Repositories</li><li>Reviews</li><li>CI</li><li>Approval</li><li>Deployment</li></ol><DirectionalLink href="/security">Review security</DirectionalLink></div></div>
      </section>
    </RevenuePage>
  );
}
