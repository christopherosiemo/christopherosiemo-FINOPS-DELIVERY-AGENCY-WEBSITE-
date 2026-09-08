import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";
import styles from "@/components/site/route-scaffold.module.css";

export const metadata = scaffoldMetadata("Pricing", "Approved starting points for AWS cost-reduction delivery.");

export default function PricingPage() {
  return (
    <RouteScaffold eyebrow="Pricing" title="Start with a 14-day Savings Sprint.">
      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt>Savings Sprint</dt>
          <dd>£5,000</dd>
        </div>
        <div className={styles.fact}>
          <dt>Implementation Sprint</dt>
          <dd>£15,000</dd>
        </div>
        <div className={styles.fact}>
          <dt>Alternative</dt>
          <dd>25% of verified savings</dd>
        </div>
      </dl>
    </RouteScaffold>
  );
}
