import Link from "next/link";
import { siteIdentity } from "@/config/site";
import { SiteNavigation } from "./site-navigation";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.wordmark} href="/" aria-label={siteIdentity.accessibleHomeLabel}>
          {siteIdentity.displayMark}
        </Link>
        <SiteNavigation />
      </div>
    </header>
  );
}
