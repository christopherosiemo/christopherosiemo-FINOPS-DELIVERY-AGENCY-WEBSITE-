import { RouteScaffold } from "@/components/site/route-scaffold";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Verification",
  "Realised AWS reductions verified against billing data after deployment.",
);

export default function VerificationPage() {
  return (
    <RouteScaffold eyebrow="Verification" title="A recommendation is estimated. A saving is measured.">
      <p>We verify realised reductions against billing data after deployment.</p>
    </RouteScaffold>
  );
}
