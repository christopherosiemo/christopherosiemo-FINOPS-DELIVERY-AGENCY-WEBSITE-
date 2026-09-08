import Link from "next/link";
import { ActionLink } from "@/components/ui/actions";
import { footerNavigation, primaryAction, siteIdentity } from "@/config/site";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer} id="site-footer">
      <div className={`container ${styles.cta}`}>
        <h2>Find what is worth changing.</h2>
        <ActionLink href={primaryAction.href}>{primaryAction.label}</ActionLink>
      </div>
      <nav className={`container ${styles.architecture}`} aria-label="Footer navigation">
        {footerNavigation.map((group) => (
          <div key={group.label}>
            <p className={styles.groupTitle}>{group.label}</p>
            <ul className={styles.links}>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className={`container ${styles.bottom}`}>
        <span className={styles.mark}>{siteIdentity.displayMark}</span>
        <p>Engineering-led AWS cost reduction.</p>
      </div>
    </footer>
  );
}
