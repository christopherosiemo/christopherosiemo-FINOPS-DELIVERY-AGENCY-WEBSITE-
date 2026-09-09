import styles from "./home.module.css";

const gapStates = ["Opportunity", "Validated", "Assigned", "Change ready", "Approved", "Deployed", "Verified"];

const methodStages = [
  ["01", "Find", "Locate economically meaningful AWS savings opportunities."],
  ["02", "Validate", "Check the opportunity against usage, commitments and engineering risk."],
  ["03", "Assign", "Connect the saving to the responsible service, team and infrastructure."],
  ["04", "Change", "Produce the remediation, IaC change, ticket or pull-request-ready work."],
  ["05", "Approve", "Move through the customer's existing engineering and deployment controls."],
  ["06", "Verify", "Measure the resulting reduction against the agreed billing baseline."],
] as const;

export function RecommendationGap() {
  return (
    <section className={styles.majorSection} aria-labelledby="recommendation-gap">
      <div className="container">
        <div className={styles.sectionIntro} data-motion-reveal data-motion-state="pending">
          <p className="technical-label">01 · From estimate to outcome</p>
          <h2 id="recommendation-gap">Recommendations aren&apos;t savings.<br />Shipped changes are.</h2>
          <p>The value is lost between identifying an opportunity and getting a safe change into production. HKGpipi owns the path from discovery to measurement.</p>
        </div>
        <div className={styles.statePath} data-motion-sequence data-motion-state="pending" data-testid="recommendation-gap-path">
          <p className="technical-label">Illustrative</p>
          <ol>
            {gapStates.map((state, index) => (
              <li key={state}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{state}</strong>
              </li>
            ))}
          </ol>
          <p className={styles.pathNote}>Identified value is not realised value.</p>
        </div>
      </div>
    </section>
  );
}

export function MethodSequence() {
  return (
    <section className={styles.methodSection} aria-labelledby="method-sequence">
      <div className="container">
        <div className={styles.sectionIntro} data-motion-reveal data-motion-state="pending">
          <p className="technical-label">02 · Operating method</p>
          <h2 id="method-sequence">One accountable path from opportunity to bill.</h2>
        </div>
        <ol className={styles.methodList} data-motion-reveal data-motion-state="pending" data-testid="method-sequence-list">
          {methodStages.map(([number, title, description]) => (
            <li key={number}>
              <span className={styles.stageNumber}>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
