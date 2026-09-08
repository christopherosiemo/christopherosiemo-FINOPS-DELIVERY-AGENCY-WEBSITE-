import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Start a Savings Sprint",
  "Begin with a 14-day AWS Savings Sprint focused on valuable, credible opportunities.",
);

export default function StartPage() {
  return (
    <RouteScaffold eyebrow="Next step" title="Start a Savings Sprint.">
      <p>
        The AWS Savings Sprint ranks opportunities by monetary value, confidence and engineering risk and produces
        specific remediation and an implementation roadmap.
      </p>
    </RouteScaffold>
  );
}
