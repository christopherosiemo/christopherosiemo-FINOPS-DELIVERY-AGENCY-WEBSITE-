export const siteIdentity = {
  displayMark: "HKGpipi",
  accessibleHomeLabel: "HKGpipi home",
  brandName: "HKGpipi",
  categoryDescriptor: "Cloud Margin Recovery",
  defaultDescription: "Engineering-led AWS cost reduction, verified against the bill.",
  domainReference: "hkgpipi.com",
  status: "provided-brand",
} as const;

export const primaryNavigation = [
  { label: "Method", href: "/method" },
  { label: "Savings Sprint", href: "/savings-sprint" },
  { label: "Implementation", href: "/implementation" },
  { label: "Verification", href: "/verification" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
] as const;

export const primaryAction = {
  label: "Start a Savings Sprint",
  href: "/start",
} as const;

export const footerNavigation = [
  {
    label: "Engagements",
    links: [
      { label: "Savings Sprint", href: "/savings-sprint" },
      { label: "Implementation", href: "/implementation" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    label: "Method",
    links: [
      { label: "Method", href: "/method" },
      { label: "Verification", href: "/verification" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    label: "Contact",
    links: [{ label: "Contact", href: "/contact" }],
  },
] as const;
