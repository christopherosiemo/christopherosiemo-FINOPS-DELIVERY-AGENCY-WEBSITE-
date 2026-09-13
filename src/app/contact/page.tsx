import { RouteScaffold } from "@/components/site/route-scaffold";
import { ActionLink } from "@/components/ui/actions";
import { DirectionalLink } from "@/components/ui/actions";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Talk to HKGpipi",
  "For AWS savings and implementation enquiries, use the canonical Savings Sprint enquiry.",
);

export default function ContactPage() {
  return (
    <RouteScaffold eyebrow="Contact" title="Talk to HKGpipi.">
      <p>For AWS savings and implementation enquiries, start with the Savings Sprint enquiry.</p>
      <ActionLink href="/start">Start an enquiry</ActionLink>
      <p>Alternatively, email <DirectionalLink href="mailto:enquiries@hkgpipi.com">enquiries@hkgpipi.com</DirectionalLink>.</p>
    </RouteScaffold>
  );
}
