import type { ReactNode } from "react";
import { ActionLink } from "@/components/ui/actions";
import styles from "./trust-page.module.css";

type TrustHeroProps = {
  eyebrow: string;
  title: ReactNode;
  summary: string;
  children?: ReactNode;
};

export function TrustPage({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className={styles.page}
      data-route-stage="trust"
      data-suppress-footer-cta="true"
      tabIndex={-1}
    >
      {children}
    </main>
  );
}

export function TrustHero({ children, eyebrow, summary, title }: TrustHeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="page-title">
      <div className={`container site-grid ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          <p className={styles.heroSummary}>{summary}</p>
        </div>
        {children ? <div className={styles.heroEvidence}>{children}</div> : null}
      </div>
    </section>
  );
}

export function TrustSectionIntro({
  children,
  label,
  title,
  titleId,
}: {
  children?: ReactNode;
  label: string;
  title: string;
  titleId: string;
}) {
  return (
    <div className={styles.sectionIntro}>
      <p className="technical-label">{label}</p>
      <h2 id={titleId}>{title}</h2>
      {children}
    </div>
  );
}

export function TrustActions({ secondary }: { secondary: { href: string; label: string } }) {
  return (
    <div className={styles.actions}>
      <ActionLink href="/start">Start a Savings Sprint</ActionLink>
      <ActionLink href={secondary.href} variant="secondary">{secondary.label}</ActionLink>
    </div>
  );
}

export { styles as trustStyles };
