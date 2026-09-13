export type EmailAddress = { email: string; name?: string };

export type EmailMessageBuilder = {
  to?: string | EmailAddress | Array<string | EmailAddress>;
  from: string | EmailAddress;
  subject: string;
  text: string;
  replyTo?: string | EmailAddress;
};

export interface EnquiryEmailBinding {
  send(message: EmailMessageBuilder): Promise<{ messageId: string }>;
}

export interface EnquiryRuntimeBindings {
  APP_ENVIRONMENT?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_EXPECTED_HOSTNAME?: string;
  RATE_LIMIT_HMAC_SECRET?: string;
  ENQUIRY_RATE_LIMITER?: DurableObjectNamespace;
  ENQUIRY_EMAIL?: EnquiryEmailBinding;
}
