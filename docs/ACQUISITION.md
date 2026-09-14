# Acquisition

## Principle and gate split

HKGpipi acquisition follows MEASURED: evidence over assertion, precision over spectacle, search intent over keyword stuffing, useful pages over content volume, and technical credibility over generic SEO copy.

- **88–92:** technical acquisition foundation, production metadata, canonical and environment-safe indexing architecture, sitemap, restricted structured data, share presentation, intent mapping, and acquisition-quality tests.
- **92–94:** external search/discovery configuration, production-ready verification surfaces, and independent acquisition approval.

Gate 9A does not change DNS, production routing, Search Console ownership, tracking, attribution, or the approved Privacy Policy.

## Origin and environment boundary

The single canonical production origin is `https://hkgpipi.com`, defined in `src/config/site.ts`. Canonicals, sitemap entries, robots sitemap references, Open Graph URLs, and structured-data identifiers derive from it. URLs use HTTPS, the apex host, lowercase route paths, and framework-normalized trailing slashes; edge redirects remain a Production Qualification responsibility.

Search acquisition is enabled only when `APP_ENVIRONMENT` is exactly `production`. Missing, staging, test, and unknown values fail closed: every page emits `noindex, nofollow`, robots disallows `/`, the sitemap is empty, and structured data is absent. `NODE_ENV=production` is deliberately insufficient because the staging Worker is also a production build. Future production builds must set `APP_ENVIRONMENT=production` explicitly; current staging remains `APP_ENVIRONMENT=staging`.

## Production indexing policy

Indexable production routes are `/`, `/savings-sprint`, `/implementation`, `/pricing`, `/method`, `/verification`, and `/security`. Conversion utilities `/start` and `/contact`, the approved `/privacy` policy, `/design-system`, test/debug paths, and unknown routes remain noindex or excluded. Privacy remains user-accessible; robots is not used to hide it. The production sitemap contains only the seven indexable routes and deliberately omits fabricated freshness dates, change frequencies, and priorities.

## Search-intent map

| Primary intent | Secondary related intent | User question | Route | Conversion path |
| --- | --- | --- | --- | --- |
| AWS cost reduction / cloud cost optimisation | Engineering-led AWS FinOps delivery | How can opportunities become verified reductions on the bill? | `/` | Savings Sprint → `/start` |
| AWS cost audit / savings assessment | Prioritised optimisation roadmap | What will the assessment examine and deliver? | `/savings-sprint` | `/start` |
| AWS FinOps implementation / cost remediation | Infrastructure cost changes | How are approved savings turned into safe production changes? | `/implementation` | `/pricing` → `/start` |
| AWS FinOps / cost optimisation pricing | Savings assessment cost | What does HKGpipi charge for discovery and implementation? | `/pricing` | `/start` |
| How AWS savings are implemented | Cost-reduction engineering method | What evidence moves a saving from estimate to verified result? | `/method` | `/verification` → `/start` |
| AWS savings verification / realised savings | Cloud cost-reduction measurement | How are estimated and verified savings distinguished? | `/verification` | `/pricing` → `/start` |
| AWS FinOps security / read-only access | Cost-optimisation change control | What access is needed and who controls production? | `/security` | `/method` → `/start` |

No search-volume or keyword-difficulty claim is made. The approved pages already answer their mapped intent; Gate 9A adds precise metadata and five contextual link connections rather than new marketing sections, a blog, FAQ filler, or a content hub.

## Metadata model

| Route | Search title | Description | Canonical | Production robots |
| --- | --- | --- | --- | --- |
| `/` | AWS Cloud Margin Recovery \| HKGpipi | Engineering-led AWS cost reduction: HKGpipi prepares production changes and verifies the resulting reduction against the AWS bill. | `https://hkgpipi.com` | index, follow |
| `/savings-sprint` | 14-Day AWS Savings Sprint \| HKGpipi | A 14-day AWS cost assessment that ranks savings opportunities and produces a specific implementation roadmap for approved work. | `https://hkgpipi.com/savings-sprint` | index, follow |
| `/implementation` | AWS Savings Implementation \| HKGpipi | Approved AWS savings work delivered through existing repositories, review, approval and customer-controlled deployment processes. | `https://hkgpipi.com/implementation` | index, follow |
| `/pricing` | AWS Cost Reduction Pricing \| HKGpipi | Review the £5,000 Savings Sprint and the alternative fixed or verified-savings-linked implementation models. | `https://hkgpipi.com/pricing` | index, follow |
| `/method` | AWS Cost Reduction Method \| HKGpipi | How HKGpipi finds, validates, assigns, changes, approves and verifies AWS savings while customers retain production control. | `https://hkgpipi.com/method` | index, follow |
| `/verification` | AWS Savings Verification \| HKGpipi | How expected AWS savings are reconciled with post-change billing evidence to produce a verified annualised result. | `https://hkgpipi.com/verification` | index, follow |
| `/security` | AWS Access & Change Control \| HKGpipi | Read-only AWS discovery access, bounded evidence collection and customer-controlled review, approval and deployment. | `https://hkgpipi.com/security` | index, follow |

The route H1s remain independently approved and need not duplicate search titles. Each indexable route has one unique title, description, canonical, robots policy, and Open Graph title/description/URL/site name/type. No keyword meta list or unapproved social-account claim is present.

## Internal linking and structured data

The contextual route path is Homepage → Savings Sprint → Method → Verification → Pricing → Start. Implementation connects to Method, Verification, and Pricing; Security connects to Method and Start. Links use existing reader-facing phrases and do not create repeated SEO link rows.

Production-only JSON-LD uses a single graph containing `Organization`, `WebSite`, and `Service`. Established facts are limited to HKGpipi, `https://hkgpipi.com`, `enquiries@hkgpipi.com`, Cloud Margin Recovery, and the service type “AWS cloud cost reduction”. There are no offers, ratings, reviews, FAQs, LocalBusiness claims, identifiers, dates, employee counts, awards, customers, certifications, social profiles, or private forwarding addresses.

## Share and icon presentation

The framework-generated 1200×630 PNG uses the approved warm canvas, primary ink, structural border, signal accent, textual HKGpipi identity, Cloud Margin Recovery, and the evidence-led line “Engineering-led AWS cost reduction, verified against the bill.” It contains no stock imagery, gradient, cloud artwork, AWS logo, customer mark, or performance claim. The small SVG browser icon is a restrained typographic `H`, not a replacement vector logo master.

## Qualification

Gate 9A tests production and non-production policies independently. They cover metadata uniqueness, canonical correctness, route indexing, robots switching, sitemap membership/exclusion and HTTP output, restricted structured data, rendered head output, share assets, staging fail-closed behavior, workers.dev/private-data absence, and the absence of analytics/tracking. Existing accessibility, performance, cross-browser, visual, Cloudflare, and privacy suites remain release requirements.

External Google/Bing verification, production DNS/redirect behavior, Search Console configuration, field acquisition measurement, CSP/HSTS, and independent Gate 9B approval remain unresolved by design.

Gate 9A implementation commit `bf3649b941953e711ad4cd84451fdaa5edb8041a` passed GitHub Actions run `34774769806`. Read-only staging version `7fd6f06c-0368-443a-be07-e5f50091e1dc` confirmed the fail-closed indexing contract without a form submission or email. Machine-readable review evidence is generated under `outputs/gate-9a-review/`.

## External search ownership

The `hkgpipi.com` Google Search Console Domain property is verified through a root DNS TXT record. Bing Webmaster Tools contains the canonical `https://hkgpipi.com/` site, imported from the verified Google property with read-only Search Console access. The import found zero submitted sitemaps. Verification values, account identifiers, OAuth credentials, and browser-session data are external configuration and must never enter source control or review evidence.

The Google verification TXT record must remain in DNS. No application metadata or public verification file is required. This ownership work added no analytics, pixels, cookies, Tag Manager, tracking script, application route, production Worker binding, or change to application-routing or email DNS records.

Ownership is controllable; crawling, indexing, ranking, impressions, and their timing are not. Before production activation, zero impressions, zero indexed pages, or an unknown-URL result is expected external state rather than an application defect. Search ranking, traffic, clicks, impressions, and backlinks are outcomes, not gate conditions.

## Post-cutover search operations

Run these steps in order only after Production Qualification authorizes `hkgpipi.com`:

1. Verify `https://hkgpipi.com` returns the approved production site.
2. Verify canonical host and redirect rules: HTTP redirects to HTTPS, and `www` redirects to the approved non-`www` canonical if `www` exists.
3. Verify the intended production indexable routes return HTTP 200.
4. Verify `/robots.txt` returns the production policy.
5. Verify `/sitemap.xml` returns the seven production URLs.
6. Verify production pages emit `index, follow` where intended, the correct canonical and Open Graph URL, the correct JSON-LD, and no `workers.dev` identity.
7. Verify `/start`, `/contact`, and `/privacy` remain `noindex`.
8. Confirm the hard 404 response.
9. Submit `https://hkgpipi.com/sitemap.xml` in Google Search Console.
10. Submit the production sitemap in Bing Webmaster Tools if it was not imported automatically.
11. Use Google URL Inspection on the homepage once the production site is live.
12. Request indexing of the homepage only if the inspector shows it is eligible and the operator wants to accelerate discovery.
13. Do not repeatedly request indexing.
14. Monitor pages/indexing, sitemap processing, crawl errors, search queries and impressions, and structured-data warnings.

Do not promise indexing times. Until the sequence's production prerequisites pass, sitemap submission and all Google, Bing, URL Submission API, and IndexNow URL submissions remain deferred. IndexNow is not justified for the current small, stable seven-route site; reconsider it only if HKGpipi later introduces frequently changing editorial or product content.
