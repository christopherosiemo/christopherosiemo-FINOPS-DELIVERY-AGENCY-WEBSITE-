import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Security",
  "Constrained AWS discovery and customer-controlled engineering changes.",
);

export default function SecurityPage() {
  return (
    <RouteScaffold eyebrow="Security" title="Read what we need. Change nothing without you.">
      <p>
        Discovery begins with tightly constrained read-only AWS access. Engineering changes move through the
        customer&apos;s existing controls.
      </p>
    </RouteScaffold>
  );
}
