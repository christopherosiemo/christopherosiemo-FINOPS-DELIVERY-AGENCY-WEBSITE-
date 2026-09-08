import styles from "./verification-line.module.css";

const expectedSaving = 184_000;
const verifiedSaving = 176_420;
const variance = verifiedSaving - expectedSaving;
const varianceRatio = variance / expectedSaving;

const currency = new Intl.NumberFormat("en-GB", {
  currency: "GBP",
  maximumFractionDigits: 0,
  style: "currency",
});

const percentage = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 1,
  signDisplay: "always",
  style: "percent",
});

function withMathematicalMinus(value: string) {
  return value.replace("-", "−");
}

export function VerificationLine({ animated = false }: { animated?: boolean }) {
  const expected = currency.format(expectedSaving);
  const verified = currency.format(verifiedSaving);
  const varianceAmount = withMathematicalMinus(currency.format(variance));
  const variancePercent = withMathematicalMinus(percentage.format(varianceRatio));

  return (
    <figure className={styles.figure} data-motion={animated ? "animated" : "static"} data-testid="verification-line-specimen">
      <figcaption className={styles.caption}>
        <span className="technical-label">Illustrative values</span>
        <span>{animated ? "Motion-enabled demonstration" : "Static demonstration"}</span>
      </figcaption>
      <div className={styles.values}>
        <div className={styles.value}>
          <span>Expected annualised saving</span>
          <strong>{expected}</strong>
        </div>
        <div className={`${styles.value} ${styles.verified}`}>
          <span>Verified annualised saving</span>
          <strong>{verified}</strong>
        </div>
      </div>
      <div className={styles.reconciliation} aria-hidden="true">
        <span className={styles.line} />
        <span className={styles.expectedMarker} />
        <span className={styles.variance} data-testid="verification-line-animation">
          <span>Variance to expected</span>
          <strong>{varianceAmount} · {variancePercent}</strong>
        </span>
        <span className={styles.verifiedMarker} />
      </div>
      <p className={styles.description}>
        Illustrative reconciliation: expected annualised saving {expected}; verified annualised saving {verified}; variance to expected {varianceAmount} ({variancePercent}).
      </p>
    </figure>
  );
}
