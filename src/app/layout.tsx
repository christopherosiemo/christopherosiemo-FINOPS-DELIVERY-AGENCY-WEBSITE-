import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { siteIdentity } from "@/config/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: `${siteIdentity.brandName} — ${siteIdentity.categoryDescriptor}`,
    template: `%s | ${siteIdentity.brandName}`,
  },
  description: siteIdentity.defaultDescription,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
