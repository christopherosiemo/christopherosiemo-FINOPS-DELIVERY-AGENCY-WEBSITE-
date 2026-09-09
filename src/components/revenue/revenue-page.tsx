import type { ReactNode } from "react";
import { ActionLink } from "@/components/ui/actions";
import styles from "./revenue-page.module.css";

type RevenueHeroProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children?: ReactNode;
};

type Stage = {
  name: string;
  description: string;
};

export function RevenuePage({ children, suppressFooterCta = false }: { children: ReactNode; suppressFooterCta?: boolean }) {
  return (
    <main
      id="main-content"
      className={styles.page}
      data-route-stage="revenue"
      data-suppress-footer-cta={suppressFooterCta ? "true" : undefined}
      tabIndex={-1}
    >
      {children}
    </main>
  );
}

export function RevenueHero({ children, eyebrow, summary, title }: RevenueHeroProps) {
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

export function SectionIntro({ label, title, titleId, children }: { label: string; title: string; titleId: string; children?: ReactNode }) {
  return (
    <div className={styles.sectionIntro}>
      <p className="technical-label">{label}</p>
      <h2 id={titleId}>{title}</h2>
      {children}
    </div>
  );
}

export function StageSequence({ stages, testId }: { stages: readonly Stage[]; testId: string }) {
  return (
    <ol className={styles.stageSequence} data-testid={testId}>
      {stages.map((stage, index) => (
        <li key={stage.name}>
          <span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>{stage.name}</h3>
            <p>{stage.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function StartActions({ secondary }: { secondary?: { href: string; label: string } }) {
  return (
    <div className={styles.actions}>
      <ActionLink href="/start">Start a Savings Sprint</ActionLink>
      {secondary ? <ActionLink href={secondary.href} variant="secondary">{secondary.label}</ActionLink> : null}
    </div>
  );
}

export { styles as revenueStyles };
