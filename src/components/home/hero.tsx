import { ActionLink } from "@/components/ui/actions";
import { SavingsLedger } from "@/components/ui/savings-ledger";
import styles from "./home.module.css";

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className={`container site-grid ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Cloud Margin Recovery</p>
          <h1 className="type-display-xl" id="page-title">Turn AWS waste into verified savings.</h1>
          <p className={styles.heroSummary}>
            We find the savings, produce the engineering changes, work through your existing approval process and verify the reduction on your AWS bill.
          </p>
          <div className={styles.heroActions}>
            <ActionLink href="/start">Start a Savings Sprint</ActionLink>
            <ActionLink href="/verification" variant="secondary">See how verification works</ActionLink>
          </div>
          <p className={styles.commercialLine}>14-day Savings Sprint · £5,000 · tightly constrained read-only access</p>
        </div>
        <div className={styles.heroEvidence} data-testid="homepage-ledger">
          <SavingsLedger
            headingLevel={2}
            label="Illustrative"
            note="Ranked by value, confidence and engineering risk."
            title="Savings Ledger"
          />
        </div>
      </div>
    </section>
  );
}
