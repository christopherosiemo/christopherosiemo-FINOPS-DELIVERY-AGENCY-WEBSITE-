import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ActionLink, Button, DirectionalLink } from "@/components/ui/actions";
import { SavingsLedger } from "@/components/ui/savings-ledger";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { TextField } from "@/components/ui/text-field";
import { VerificationLine } from "@/components/ui/verification-line";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Internal Design System | Cloud Margin Recovery",
  description: "Internal calibration specimen for the MEASURED design system.",
  robots: { index: false, follow: false },
};

const statuses: Status[] = [
  "Discovered",
  "Validated",
  "Assigned",
  "Remediation ready",
  "Awaiting approval",
  "Approved",
  "Deployed",
  "Measuring",
  "Verified",
];

const colours = [
  ["Canvas", "#F5F5F0", "Page ground"],
  ["Surface", "#FFFFFF", "Primary evidence surface"],
  ["Text primary", "#11120F", "Primary content"],
  ["Text secondary", "#60625C", "Supporting content"],
  ["Border", "#D8D9D2", "Structural separation"],
  ["Signal", "#3157FF", "Action and focus"],
  ["Verified", "#17744A", "Verified state only"],
  ["Attention", "#A76513", "Accent and fill"],
  ["Attention text", "#8A4A0A", "Accessible caution text"],
];

const contrasts = [
  ["Primary / canvas", "#11120F", "#F5F5F0", "17.19:1"],
  ["Secondary / canvas", "#60625C", "#F5F5F0", "5.65:1"],
  ["Primary / surface", "#11120F", "#FFFFFF", "18.80:1"],
  ["Secondary / surface", "#60625C", "#FFFFFF", "6.18:1"],
  ["Inverse / inverse surface", "#FFFFFF", "#22231F", "15.81:1"],
  ["Signal / canvas", "#3157FF", "#F5F5F0", "4.88:1"],
  ["Verified text / verified surface", "#0D5C39", "#E5F3EC", "7.04:1"],
  ["Attention text / attention surface", "#8A4A0A", "#F8EAD9", "5.80:1"],
];

const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160];

function SpecimenSection({ children, eyebrow, id, title }: { children: ReactNode; eyebrow: string; id: string; title: string }) {
  return (
    <section className={styles.section} aria-labelledby={id}>
      <header className={styles.sectionHeader}>
        <p className="technical-label">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className={styles.page} id="main-content" tabIndex={-1}>
      <div className="container">
        <header className={styles.intro}>
          <div className="site-grid">
            <div className={styles.introCopy} data-testid="design-system-intro-copy">
              <p className="technical-label">Internal Design System · Gate 2B</p>
              <h1 className="type-display-xl">MEASURED</h1>
              <p className="type-body-large measure-compact">
                A calibration instrument for large, calm architectural space surrounding dense technical evidence.
              </p>
            </div>
            <dl className={styles.introMeta} data-testid="design-system-intro-meta">
              <div><dt>Status</dt><dd>Implementation review</dd></div>
              <div><dt>Indexing</dt><dd>Noindex · nofollow</dd></div>
              <div><dt>Audience</dt><dd>Internal</dd></div>
            </dl>
          </div>
        </header>

        <SpecimenSection eyebrow="A · Doctrine" id="doctrine" title="Evidence shapes the interface.">
          <ol className={styles.doctrine}>
            <li>Evidence over assertion.</li>
            <li>Precision over spectacle.</li>
            <li>Reduction over addition.</li>
            <li>Engineering before marketing.</li>
            <li>Every number has provenance.</li>
            <li>Every recommendation has a path to production.</li>
            <li>Every claimed saving ends at the bill.</li>
          </ol>
        </SpecimenSection>

        <SpecimenSection eyebrow="B · Colour system" id="colour" title="A small palette with explicit jobs.">
          <div className={styles.swatches}>
            {colours.map(([name, value, use]) => (
              <article className={styles.swatch} key={name}>
                <span className={styles.swatchColour} style={{ backgroundColor: value }} />
                <div><h3>{name}</h3><code>{value}</code><p>{use}</p></div>
              </article>
            ))}
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="C · Contrast" id="contrast" title="Measured combinations, not assumed compliance.">
          <div className={styles.contrastGrid}>
            {contrasts.map(([name, foreground, background, ratio]) => (
              <article className={styles.contrastSample} key={name} style={{ backgroundColor: background, color: foreground }}>
                <span>{name}</span><strong>{ratio}</strong><small>WCAG AA normal text</small>
              </article>
            ))}
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="D · Typography" id="typography" title="Restrained scale, purposeful density.">
          <div className={styles.typeStack}>
            <div><span>Display XL · 48–84</span><p className="type-display-xl">Verified at the bill.</p></div>
            <div><span>Display L · 40–64</span><p className="type-display-l">Engineering before marketing.</p></div>
            <div><span>Heading 1 · 36–48</span><p className="type-heading-1">Cloud Margin Recovery</p></div>
            <div><span>Heading 2 · 32–40</span><p className="type-heading-2">A path to production</p></div>
            <div><span>Heading 3 · 26–32</span><p className="type-heading-3">Savings opportunity</p></div>
            <div><span>Heading 4 · 22–24</span><p className="type-heading-4">Engineering validation</p></div>
            <div><span>Body large · 18–20</span><p className="type-body-large measure-prose">Recommendations are estimated opportunities. Shipped changes can become verified savings.</p></div>
            <div><span>Body · 16</span><p className="measure-prose">Readable prose stays within a deliberate measure so financially precise explanations remain easy to scan.</p></div>
            <div><span>Body small · 14</span><p className="type-body-small">Supporting detail preserves clarity without competing with the primary decision.</p></div>
            <div><span>Technical label · 12</span><p className="technical-label">Account / service · confidence · risk</p></div>
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="E · Financial typography" id="financial" title="Values stay aligned as evidence changes.">
          <div className={styles.financialGrid} data-testid="financial-typography-specimen">
            <article><span>Expected monthly</span><strong>£14,380</strong><small>/ month</small></article>
            <article><span>Annualised</span><strong>£172,560</strong><small>/ year</small></article>
            <article><span>Confidence</span><strong>92.4%</strong><small>validated</small></article>
            <article><span>AWS account</span><strong className={styles.identifier}>0987 6543 3210</strong><small>illustrative</small></article>
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="F · Spacing" id="spacing" title="A bounded four-pixel-led scale.">
          <div className={styles.spacingScale}>
            {spacing.map((value) => (
              <div key={value}><span>{value}</span><i style={{ width: `${value}px` }} /></div>
            ))}
          </div>
          <p className={styles.annotation}>Optical exceptions require a documented reason; new near-duplicate tokens do not.</p>
        </SpecimenSection>

        <SpecimenSection eyebrow="G · Grid" id="grid" title="Four, eight, twelve—without JavaScript.">
          <div className={styles.gridDemo} aria-label="Responsive grid demonstration">
            {Array.from({ length: 12 }, (_, index) => <span key={index}>{index + 1}</span>)}
          </div>
          <p className={styles.annotation}>4 columns below 768px · 8 from 768px · 12 from 1280px.</p>
        </SpecimenSection>

        <SpecimenSection eyebrow="H · Section rhythm" id="rhythm" title="Quiet macro space. Dense micro information.">
          <div className={styles.rhythmGrid}>
            <article><span>Standard</span><strong>88 / 112 / 128</strong><p>Ordinary narrative section separation.</p></article>
            <article><span>Major</span><strong>96 / 120 / 160</strong><p>Meaningful shift in narrative or evidence.</p></article>
            <article><span>Tight group</span><strong>16</strong><p>Closely related labels, values, and controls.</p></article>
            <article><span>Data density</span><strong>12</strong><p>Ledger rows and compact technical evidence.</p></article>
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="I · Surfaces" id="surfaces" title="Structure comes from boundaries, not theatre.">
          <div className={styles.surfaceGrid}>
            <article className={styles.squareSurface}><span>Architectural panel</span><p>Square edges are valid at full-grid scale.</p></article>
            <article className={styles.panelSurface}><span>Panel · 12px</span><p>Use when the contained relationship benefits from grouping.</p></article>
            <article className={`${styles.inverseSurface} surface-inverse`}><span>Inverse surface</span><p>Reserved for deliberate contrast, not page mimicry.</p><a href="#buttons">Focusable link</a></article>
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="J · Buttons" id="buttons" title="Controls acknowledge intent.">
          <div className={styles.controlRows} data-testid="control-specimen">
            <div><span>Primary</span><ActionLink href="/contact">Start a Savings Sprint</ActionLink></div>
            <div><span>Secondary</span><ActionLink href="#verification" variant="secondary">See how verification works</ActionLink></div>
            <div><span>Quiet</span><Button variant="quiet">Inspect details</Button></div>
            <div><span>Disabled</span><Button disabled>Unavailable action</Button></div>
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="K · Links" id="links" title="Navigation remains unmistakable.">
          <div className={styles.linkRow}>
            <DirectionalLink href="#ledger">Inspect the ledger specimen</DirectionalLink>
            <a href="#motion">Standard inline link</a>
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="L · Focus" id="focus" title="One visible, offset focus language.">
          <p className="measure-prose">Use the Tab key: controls retain a two-pixel signal outline with three-pixel offset. Inverse surfaces switch to the inverse focus token.</p>
          <div className={styles.focusRow}><Button>Focusable button</Button><a href="#inputs">Focusable inline link</a></div>
        </SpecimenSection>

        <SpecimenSection eyebrow="M · Input specimen" id="inputs" title="Labels and errors carry the meaning.">
          <div className={styles.formGrid}>
            <TextField id="specimen-reference" label="Reference name" hint="Neutral specimen field; not a qualification question." defaultValue="Architecture review" />
            <TextField id="specimen-error" label="Example identifier" error="Enter a reference identifier." />
            <TextField id="specimen-disabled" label="Disabled example" hint="Unavailable in this specimen." defaultValue="Locked value" disabled />
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="N · Status states" id="statuses" title="Text leads; colour supports.">
          <div className={styles.statusList}>{statuses.map((status) => <StatusBadge key={status} status={status} />)}</div>
        </SpecimenSection>

        <SpecimenSection eyebrow="O · Dense data" id="dense-data" title="Technical evidence remains scannable.">
          <dl className={styles.dataGrid}>
            <div><dt>Resource</dt><dd className="technical-value">arn:aws:rds:eu-west-2:09876543210:db:payments-prod</dd></div>
            <div><dt>IaC path</dt><dd className="technical-value">infra/services/payments/rds.tf:48</dd></div>
            <div><dt>Monthly run rate</dt><dd className="financial-value">£38,420 / month</dd></div>
            <div><dt>Annualised opportunity</dt><dd className="financial-value">£57,840 / year</dd></div>
            <div><dt>Confidence</dt><dd className="numeric">92.4%</dd></div>
            <div><dt>Observed</dt><dd className="numeric">08 Sep 2026</dd></div>
          </dl>
          <p className={styles.annotation}>Illustrative values only. Not customer evidence.</p>
        </SpecimenSection>

        <SpecimenSection eyebrow="P · Savings Ledger" id="ledger" title="Expected value needs an accountable path.">
          <SavingsLedger />
        </SpecimenSection>

        <SpecimenSection eyebrow="Q · Verification Line" id="verification" title="Expected and verified are distinct economic states.">
          <div className={styles.verificationGrid}><VerificationLine /><VerificationLine animated /></div>
        </SpecimenSection>

        <SpecimenSection eyebrow="R · Motion" id="motion" title="Subtle, finite, never required for meaning.">
          <div className={styles.motionPanel}>
            <span className={styles.motionMarker} data-testid="motion-specimen-marker" aria-hidden="true" />
            <div><strong>560ms narrative transition</strong><p>One restrained movement demonstrates timing. The explanatory state is always present.</p></div>
          </div>
        </SpecimenSection>

        <SpecimenSection eyebrow="S · Reduced motion" id="reduced-motion" title="The final state is the accessible state.">
          <p className="measure-prose">With reduced motion enabled, non-essential transforms and reveals resolve immediately. Navigation, status, and financial meaning never depend on animation.</p>
          <div className={styles.finalNote}><span className="technical-label">Production boundary</span><p>This internal route must be removed, access-controlled, or otherwise excluded from the public production experience before launch.</p></div>
        </SpecimenSection>
      </div>
    </main>
  );
}
