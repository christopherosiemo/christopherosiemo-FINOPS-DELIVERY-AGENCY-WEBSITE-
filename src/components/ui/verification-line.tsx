import styles from "./verification-line.module.css";

export function VerificationLine({ animated = false }: { animated?: boolean }) {
  return (
    <figure className={styles.figure} data-motion={animated ? "animated" : "static"}>
      <figcaption className={styles.caption}>
        <span className="technical-label">Illustrative values</span>
        <span>{animated ? "Motion-enabled demonstration" : "Static demonstration"}</span>
      </figcaption>
      <div className={styles.values}>
        <div className={styles.value}>
          <span>Expected annualised saving</span>
          <strong>£184,000</strong>
        </div>
        <div className={`${styles.value} ${styles.verified}`}>
          <span>Verified annualised saving</span>
          <strong>£176,420</strong>
        </div>
      </div>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.line} data-testid="verification-line-animation" />
        <span className={styles.expectedMarker} />
        <span className={styles.verifiedMarker} />
      </div>
      <p className={styles.description}>
        Expected £184,000 annualised. Verified £176,420 annualised. Illustrative only.
      </p>
    </figure>
  );
}
