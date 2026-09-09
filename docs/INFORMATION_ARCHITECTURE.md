# Information architecture

## Working global navigation

The approved shell navigation is deliberately focused:

1. Method — `/method`: operating chain from opportunity to verified saving.
2. Savings Sprint — `/savings-sprint`: the bounded discovery engagement.
3. Implementation — `/implementation`: delivery through the customer's engineering workflow.
4. Verification — `/verification`: measurement of realised billing reductions.
5. Security — `/security`: access and change-control posture.
6. Pricing — `/pricing`: approved engagement starting points.

The `HKGpipi` wordmark is the home control and links to `/`; there is no textual Home item. The primary action, “Start a Savings Sprint”, has its own `/start` route so qualification and conversion can later mature independently from editorial contact content. `/contact` remains available in the footer.

`HKGpipi` is the operator-provided public identity and `hkgpipi.com` is a known domain reference. The retired `CMR` mark was only a working placeholder. Site identity and navigation remain centralised in `src/config/site.ts`.

## Route maturity

- `/`: live foundation page; final homepage narrative begins after Global Shell approval.
- `/savings-sprint`, `/implementation`, `/pricing`: independently approved Revenue Pages; retained as `noindex, nofollow` pending legal review, conversion readiness, and release approval.
- `/method`, `/verification`, `/security`: independently approved Trust narratives; retained as `noindex, nofollow` pending release approval.
- `/start`: canonical production-quality enquiry interface and server boundary; retained as `noindex, nofollow` while authorised delivery, privacy, durable anti-abuse, and external verification remain blocked.
- `/contact`: a small route directing AWS savings and implementation enquiries to `/start`; no competing form or pipeline; retained as `noindex, nofollow`.
- `/design-system`: internal calibration specimen; `noindex, nofollow`, absent from public navigation, and subject to removal or access control before production launch.

This is the approved shell IA. Deeper content and composition are specified in `REVENUE_PAGES.md`, `TRUST.md`, and `CONVERSION.md`.

## Deferred architecture

Resources and Company are not exposed in primary navigation because neither has a mature route or approved content architecture. Adding empty dropdowns would misrepresent the current breadth of the public site. Legal routes, evidence/case-study policy, and authorised conversion delivery remain required before launch but are not fabricated at this gate.

Metadata still requires an approved canonical protocol/www policy, Open Graph destinations/assets, social identities, a production logo master, and appropriate organisation data before acquisition and production gates. None is inferred solely from the domain reference.
