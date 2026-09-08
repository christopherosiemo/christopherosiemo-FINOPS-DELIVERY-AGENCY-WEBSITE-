"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ActionLink } from "@/components/ui/actions";
import { primaryAction, primaryNavigation, siteIdentity } from "@/config/site";
import styles from "./site-navigation.module.css";

const dialogId = "primary-navigation-dialog";

function routeIsActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function openMenu() {
    dialogRef.current?.showModal();
    setMenuOpen(true);
    closeRef.current?.focus();
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  }, [pathname]);

  return (
    <>
      <div className={styles.desktopShell}>
        <nav aria-label="Primary navigation">
          <ul className={styles.desktopList}>
            {primaryNavigation.map((item) => {
              const active = routeIsActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link className={styles.desktopLink} href={item.href} aria-current={active ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <ActionLink href={primaryAction.href}>{primaryAction.label}</ActionLink>
      </div>

      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-label="Open primary navigation"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={menuOpen}
        onClick={openMenu}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        id={dialogId}
        aria-labelledby="mobile-navigation-title"
        onClose={() => {
          setMenuOpen(false);
          triggerRef.current?.focus();
        }}
      >
        <div className={styles.dialogInner}>
          <div className={styles.dialogHeader}>
            <span className={styles.dialogMark}>{siteIdentity.displayMark}</span>
            <button ref={closeRef} className={styles.close} type="button" onClick={closeMenu}>
              <span>Close</span>
              <span className={styles.closeIcon} aria-hidden="true" />
            </button>
          </div>
          <p className={styles.dialogTitle} id="mobile-navigation-title">
            Primary navigation
          </p>
          <nav aria-label="Primary navigation menu">
            <ol className={styles.mobileList}>
              {primaryNavigation.map((item, index) => {
                const active = routeIsActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link className={styles.mobileLink} href={item.href} aria-current={active ? "page" : undefined}>
                      <span className={styles.index} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className={styles.mobileAction}>
            <ActionLink href={primaryAction.href}>{primaryAction.label}</ActionLink>
          </div>
        </div>
      </dialog>
    </>
  );
}
