# Analytics

Measurement must be explicit, minimal, consent-aware, and tied to genuine product or commercial questions. Every number presented publicly needs provenance; analytics must not manufacture customer evidence.

## Current state

No analytics vendor or tracking script is installed. Event taxonomy, consent model, retention period, data controller details, regional requirements, internal traffic policy, and ownership are **TBD**.

The eventual primary conversion event must reflect the agreed commercial flow, not a vanity interaction. At programme completion, a genuine external commercial conversion must be verifiably recorded.

## Conversion event contract

No analytics provider or event code is installed in Gate 7A. The future `/start` taxonomy is:

- `start_form_view`
- `start_form_submit_attempt`
- `start_form_validation_error`
- `start_form_delivery_success`
- `start_form_delivery_failure`

Only `start_form_delivery_success`, emitted after the authorised delivery adapter confirms success, counts as a completed website enquiry conversion. Event payloads must never include email, name, company, AWS context, or priority. Candidate non-personal properties are `form_version`, `route`, and delivery-provider category. `spend_range` must not be emitted until a privacy review confirms that its combination with other event data is appropriately minimised. Provider, consent, retention, ownership, and internal-traffic rules remain required before implementation.
