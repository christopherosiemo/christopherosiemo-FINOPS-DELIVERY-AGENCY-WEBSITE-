import { RouteScaffold } from "@/components/site/route-scaffold";
import { ActionLink } from "@/components/ui/actions";
import { DirectionalLink } from "@/components/ui/actions";
import { routeMetadata } from "@/config/metadata";

export const metadata = routeMetadata("/contact");

export default function ContactPage() {
  return (
    <RouteScaffold eyebrow="Contact" title="Talk to HKGpipi.">
      <p>For AWS savings and implementation enquiries, start with the Savings Sprint enquiry.</p>
      <ActionLink href="/start">Start an enquiry</ActionLink>
      <p>Alternatively, email <DirectionalLink href="mailto:enquiries@hkgpipi.com">enquiries@hkgpipi.com</DirectionalLink>.</p>
    </RouteScaffold>
  );
}
