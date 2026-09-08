import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Contact",
  "The contact route for beginning an AWS Savings Sprint conversation.",
);

export default function ContactPage() {
  return (
    <RouteScaffold eyebrow="Contact" title="Start a Savings Sprint.">
      <p>Begin with a focused conversation about your AWS estate, engineering constraints and current priorities.</p>
    </RouteScaffold>
  );
}
