import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Savings Sprint",
  "A 14-day AWS Savings Sprint that ranks opportunities and creates an implementation roadmap.",
);

export default function SavingsSprintPage() {
  return (
    <RouteScaffold eyebrow="Savings Sprint · £5,000 upfront" title="Find what is worth changing in 14 days.">
      <p>
        The AWS Savings Sprint ranks opportunities by monetary value, confidence and engineering risk and produces
        specific remediation and an implementation roadmap.
      </p>
    </RouteScaffold>
  );
}
