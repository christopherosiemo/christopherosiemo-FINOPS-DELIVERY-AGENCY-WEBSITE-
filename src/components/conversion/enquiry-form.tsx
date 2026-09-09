"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitEnquiry } from "@/app/start/actions";
import { ActionLink, Button, DirectionalLink } from "@/components/ui/actions";
import {
  initialEnquiryState,
  spendRangeOptions,
  type EnquiryField,
  type EnquirySubmissionState,
} from "@/lib/enquiry/types";
import styles from "./start-page.module.css";

const fieldOrder: { name: EnquiryField; label: string }[] = [
  { name: "email", label: "Work email" },
  { name: "name", label: "Name" },
  { name: "company", label: "Company" },
  { name: "awsContext", label: "What should we know about your AWS estate?" },
  { name: "priority", label: "What do you want to change?" },
  { name: "spendRange", label: "Approximate monthly AWS spend" },
];

type EnquiryFormProps = {
  issuedAt: number;
  deliveryScenario?: string;
};

function describedBy(name: EnquiryField, hint: boolean, state: EnquirySubmissionState) {
  return [hint ? `${name}-hint` : "", state.errors[name] ? `${name}-error` : ""]
    .filter(Boolean)
    .join(" ") || undefined;
}

function FieldError({ name, state }: { name: EnquiryField; state: EnquirySubmissionState }) {
  const error = state.errors[name];
  return error ? (
    <p className={styles.fieldError} id={`${name}-error`}>
      <span aria-hidden="true">!</span> {error}
    </p>
  ) : null;
}

export function EnquiryForm({ issuedAt, deliveryScenario }: EnquiryFormProps) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialEnquiryState, "/start");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "idle") resultRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        className={`${styles.result} ${styles.success}`}
        data-submission-result="success"
        ref={resultRef}
        tabIndex={-1}
      >
        <p className="technical-label">Delivery confirmed</p>
        <h2>Enquiry received.</h2>
        <p>Thanks. We have what we need to review the context you sent.</p>
        {state.requestId ? (
          <p className={styles.reference}>Reference: <span>{state.requestId}</span></p>
        ) : null}
        <div className={styles.resultActions}>
          <ActionLink href="/">Return to HKGpipi</ActionLink>
          <DirectionalLink href="/method">Review the method</DirectionalLink>
        </div>
      </div>
    );
  }

  const invalidFields = fieldOrder.filter(({ name }) => state.errors[name]);
  return (
    <div className={styles.formSurface}>
      <div className={styles.formIntro}>
        <p className="technical-label">Commercial enquiry</p>
        <h2 id="enquiry-form-title">Start an enquiry</h2>
        <p>Required fields are marked <span aria-hidden="true">*</span><span className={styles.srOnly}>required</span>.</p>
      </div>

      {state.status === "validation-error" ? (
        <div
          aria-labelledby="error-summary-title"
          className={styles.errorSummary}
          ref={resultRef}
          role="alert"
          tabIndex={-1}
        >
          <h3 id="error-summary-title">Check the following fields.</h3>
          <ul>
            {invalidFields.map(({ name, label }) => (
              <li key={name}><a href={`#${name}`}>{label}: {state.errors[name]}</a></li>
            ))}
          </ul>
        </div>
      ) : state.status === "delivery-failure" ? (
        <div
          aria-labelledby="delivery-error-title"
          className={styles.errorSummary}
          data-submission-result="failure"
          ref={resultRef}
          role="alert"
          tabIndex={-1}
        >
          <h3 id="delivery-error-title">We could not send your enquiry.</h3>
          <p>Your information has not been confirmed as delivered. Please try again.</p>
          {state.requestId ? <p className={styles.reference}>Reference: <span>{state.requestId}</span></p> : null}
        </div>
      ) : null}

      <form action={formAction} aria-labelledby="enquiry-form-title" className={styles.form} noValidate>
        <input type="hidden" name="__issuedAt" value={issuedAt} />
        {deliveryScenario ? <input type="hidden" name="__deliveryScenario" value={deliveryScenario} /> : null}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Work email <span aria-hidden="true">*</span></label>
          <input
            aria-describedby={describedBy("email", false, state)}
            aria-invalid={state.errors.email ? true : undefined}
            autoComplete="email"
            defaultValue={state.values.email}
            id="email"
            maxLength={254}
            name="email"
            required
            type="email"
          />
          <FieldError name="email" state={state} />
        </div>

        <div className={styles.field}>
          <label htmlFor="name">Name <span aria-hidden="true">*</span></label>
          <input
            aria-describedby={describedBy("name", false, state)}
            aria-invalid={state.errors.name ? true : undefined}
            autoComplete="name"
            defaultValue={state.values.name}
            id="name"
            maxLength={100}
            name="name"
            required
            type="text"
          />
          <FieldError name="name" state={state} />
        </div>

        <div className={styles.field}>
          <label htmlFor="company">Company <span aria-hidden="true">*</span></label>
          <input
            aria-describedby={describedBy("company", false, state)}
            aria-invalid={state.errors.company ? true : undefined}
            autoComplete="organization"
            defaultValue={state.values.company}
            id="company"
            maxLength={160}
            name="company"
            required
            type="text"
          />
          <FieldError name="company" state={state} />
        </div>

        <div className={styles.field}>
          <label htmlFor="awsContext">What should we know about your AWS estate? <span aria-hidden="true">*</span></label>
          <p className={styles.hint} id="awsContext-hint">Approximate scale, major services or where cost pressure is showing up.</p>
          <textarea
            aria-describedby={describedBy("awsContext", true, state)}
            aria-invalid={state.errors.awsContext ? true : undefined}
            defaultValue={state.values.awsContext}
            id="awsContext"
            maxLength={2000}
            minLength={20}
            name="awsContext"
            required
            rows={6}
          />
          <p className={styles.securityNote}>Do not include credentials, secrets or AWS access keys.</p>
          <FieldError name="awsContext" state={state} />
        </div>

        <div className={styles.field}>
          <label htmlFor="priority">What do you want to change? <span aria-hidden="true">*</span></label>
          <p className={styles.hint} id="priority-hint">Tell us what is blocked, expensive or already known to need engineering work.</p>
          <textarea
            aria-describedby={describedBy("priority", true, state)}
            aria-invalid={state.errors.priority ? true : undefined}
            defaultValue={state.values.priority}
            id="priority"
            maxLength={2000}
            minLength={20}
            name="priority"
            required
            rows={6}
          />
          <FieldError name="priority" state={state} />
        </div>

        <div className={styles.field}>
          <label htmlFor="spendRange">Approximate monthly AWS spend <span className={styles.optional}>(optional)</span></label>
          <select
            aria-describedby={describedBy("spendRange", false, state)}
            aria-invalid={state.errors.spendRange ? true : undefined}
            defaultValue={state.values.spendRange}
            id="spendRange"
            name="spendRange"
          >
            {spendRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <FieldError name="spendRange" state={state} />
        </div>

        <div className={styles.boundary}>
          <p>Submitting this form is an enquiry. It does not create an engagement or authorise AWS access.</p>
          <p>We will use the information you submit to respond to this enquiry and assess whether a HKGpipi engagement is appropriate.</p>
        </div>

        <Button aria-disabled={pending} className={styles.submit} disabled={pending} type="submit">
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
      </form>
    </div>
  );
}
