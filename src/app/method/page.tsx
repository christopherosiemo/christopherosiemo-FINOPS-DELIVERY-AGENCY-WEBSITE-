import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Method",
  "A measured path from AWS savings opportunity to verified reduction.",
);

export default function MethodPage() {
  return (
    <RouteScaffold eyebrow="Method" title="From opportunity to verified saving.">
      <p>Find → Validate → Assign → Change → Approve → Verify</p>
    </RouteScaffold>
  );
}
