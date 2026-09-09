import { DirectionalLink } from "@/components/ui/actions";
import { RevenueHero, RevenuePage, SectionIntro, StartActions, revenueStyles as styles } from "@/components/revenue/revenue-page";
import { commercialFacts } from "@/config/commercial";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata("Pricing", "A bounded first engagement and two alternative implementation routes for AWS cost-reduction delivery.");

export default function PricingPage() {
  return (
    <RevenuePage>
      <RevenueHero eyebrow="PRICING" title="A bounded first step. Two ways to implement." summary="Start with the 14-Day AWS Savings Sprint. Once approved work is defined, choose fixed or outcome-based implementation." />

      <section className={styles.sectionSurface} aria-labelledby="pricing-sequence">
        <div className="container">
          <div className={styles.commercialSequence} data-testid="pricing-sequence">
            <article className={styles.firstStep}><p className="technical-label">Start</p><h2 id="pricing-sequence">{commercialFacts.savingsSprint.name}</h2><strong className={styles.price}>{commercialFacts.savingsSprint.price}</strong><span className={styles.priceQualifier}>{commercialFacts.savingsSprint.qualifier}</span><p>Find, validate and rank what is worth changing.</p></article>
            <div className={styles.then}>Then choose</div>
            <div className={styles.implementationBranches}>
              <article className={styles.offer}><p className="technical-label">Fixed implementation</p><h3>{commercialFacts.fixedImplementation.name}</h3><strong className={styles.price}>{commercialFacts.fixedImplementation.price}</strong><p>Turn the agreed implementation scope into engineering changes and work through deployment.</p></article>
              <span className={styles.or}>or</span>
              <article className={styles.offer}><p className="technical-label">Outcome-based implementation</p><h3>{commercialFacts.outcomeImplementation.name}</h3><strong className={styles.price}>{commercialFacts.outcomeImplementation.price}</strong><span className={styles.priceQualifier}>{commercialFacts.outcomeImplementation.qualifier}</span><p>Outcome-based implementation priced against verified savings under the agreed verification basis.</p></article>
            </div>
          </div>
          <StartActions secondary={{ href: "/implementation", label: "Compare implementation options" }} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="verified-pricing">
        <div className="container"><SectionIntro label="02 · Verification basis" title="How verified savings affect pricing." titleId="verified-pricing"><p>Outcome-based fees use a verification basis agreed before implementation. Expected savings are estimates; verified savings are measured after deployed changes against the agreed baseline.</p></SectionIntro><div className={styles.verificationNote}><p>The detailed contractual basis remains to be agreed before outcome-based implementation begins.</p><DirectionalLink href="/verification">See how verification works</DirectionalLink></div></div>
      </section>
    </RevenuePage>
  );
}
