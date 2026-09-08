import styles from "./status-badge.module.css";

export type Status =
  | "Discovered"
  | "Validated"
  | "Assigned"
  | "Remediation ready"
  | "Awaiting approval"
  | "Approved"
  | "Deployed"
  | "Measuring"
  | "Verified";

export function StatusBadge({ status }: { status: Status }) {
  const tone = status === "Verified" ? "verified" : status === "Awaiting approval" || status === "Measuring" ? "attention" : "neutral";

  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      <span className={styles.marker} aria-hidden="true" />
      {status}
    </span>
  );
}
