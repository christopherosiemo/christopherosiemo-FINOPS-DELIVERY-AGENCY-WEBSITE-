import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./actions.module.css";

type ActionVariant = "primary" | "secondary" | "quiet";

type ActionLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: ActionVariant;
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ActionVariant;
};

export function ActionLink({ children, className = "", href, variant = "primary" }: ActionLinkProps) {
  return (
    <Link className={`${styles.control} ${styles[variant]} ${className}`} href={href}>
      {children}
    </Link>
  );
}

export function Button({ children, className = "", type = "button", variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={`${styles.control} ${styles[variant]} ${className}`} type={type} {...props}>
      {children}
    </button>
  );
}

export function DirectionalLink({ children, href }: Omit<ActionLinkProps, "variant">) {
  return (
    <Link className={styles.directional} href={href}>
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
