import type { ReactNode } from "react";
import styles from "./route-scaffold.module.css";

type RouteScaffoldProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function RouteScaffold({ children, eyebrow, title }: RouteScaffoldProps) {
  return (
    <main id="main-content" className={styles.page} data-route-stage="scaffold" tabIndex={-1}>
      <div className={`container site-grid ${styles.content}`}>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className={styles.supporting}>{children}</div>
      </div>
    </main>
  );
}
