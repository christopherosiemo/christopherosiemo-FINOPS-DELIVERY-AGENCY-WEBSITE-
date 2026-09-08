import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Implementation",
  "Approved AWS savings delivered through the customer's existing engineering workflow.",
);

export default function ImplementationPage() {
  return (
    <RouteScaffold eyebrow="Implementation" title="Turn approved savings into production changes.">
      <p>Produce PRs, tickets and configuration changes through the customer&apos;s existing engineering workflow.</p>
    </RouteScaffold>
  );
}
