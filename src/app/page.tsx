import { EngagementPath, SecurityBoundary } from "@/components/home/closing-sections";
import { ApprovalPath, RemediationEvidence, VerificationEvidence } from "@/components/home/evidence-sections";
import { HomeHero } from "@/components/home/hero";
import { MethodSequence, RecommendationGap } from "@/components/home/narrative-sections";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeHero />
      <RecommendationGap />
      <MethodSequence />
      <RemediationEvidence />
      <ApprovalPath />
      <VerificationEvidence />
      <SecurityBoundary />
      <EngagementPath />
    </main>
  );
}
