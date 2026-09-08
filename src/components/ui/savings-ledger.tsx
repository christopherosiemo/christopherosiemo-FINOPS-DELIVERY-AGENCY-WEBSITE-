import { StatusBadge, type Status } from "./status-badge";
import styles from "./savings-ledger.module.css";

type LedgerRow = {
  account: string;
  confidence: string;
  expected: string;
  opportunity: string;
  owner: string;
  risk: string;
  state: Status;
};

const rows: LedgerRow[] = [
  { opportunity: "RDS rightsizing", account: "0987…3210 / payments-api", owner: "Platform", expected: "£4,820 / mo", confidence: "High", risk: "Low", state: "Validated" },
  { opportunity: "NAT architecture", account: "2345…6789 / shared-network", owner: "Core infra", expected: "£2,140 / mo", confidence: "Medium", risk: "Medium", state: "Remediation ready" },
  { opportunity: "Idle EC2", account: "7654…1098 / analytics-sandbox", owner: "Data", expected: "£980 / mo", confidence: "High", risk: "Low", state: "Awaiting approval" },
  { opportunity: "Unused EBS", account: "4567…0123 / ci-builders", owner: "Developer exp.", expected: "£360 / mo", confidence: "High", risk: "Low", state: "Verified" },
];

export function SavingsLedger() {
  return (
    <div className={styles.ledger} aria-label="Illustrative Savings Ledger" data-testid="savings-ledger-specimen">
      <div className={styles.heading}>
        <div>
          <p className="technical-label">Illustrative dataset</p>
          <h3>Savings Ledger concept</h3>
        </div>
        <p className={styles.note}>Static design specimen · not customer evidence</p>
      </div>

      <div className={styles.desktop}>
        <table>
          <caption className={styles.srOnly}>Illustrative AWS savings opportunities</caption>
          <thead>
            <tr>
              <th scope="col">Opportunity</th>
              <th scope="col">Account / service</th>
              <th scope="col">Owner</th>
              <th className={styles.numeric} scope="col">Expected saving</th>
              <th scope="col">Confidence</th>
              <th scope="col">Risk</th>
              <th scope="col">State</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.account}>
                <th scope="row">{row.opportunity}</th>
                <td className={styles.identifier}>{row.account}</td>
                <td>{row.owner}</td>
                <td className={styles.numeric}>{row.expected}</td>
                <td>{row.confidence}</td>
                <td>{row.risk}</td>
                <td><StatusBadge status={row.state} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.mobile}>
        {rows.map((row) => (
          <article className={styles.record} key={row.account}>
            <div className={styles.recordTop}>
              <h4>{row.opportunity}</h4>
              <StatusBadge status={row.state} />
            </div>
            <p className={styles.identifier}>{row.account}</p>
            <dl>
              <div><dt>Expected</dt><dd className={styles.numeric}>{row.expected}</dd></div>
              <div><dt>Owner</dt><dd>{row.owner}</dd></div>
              <div><dt>Confidence</dt><dd>{row.confidence}</dd></div>
              <div><dt>Risk</dt><dd>{row.risk}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
