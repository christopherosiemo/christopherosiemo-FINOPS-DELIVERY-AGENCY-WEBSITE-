import { connection } from "next/server";
import { env } from "cloudflare:workers";
import { StartPage } from "@/components/conversion/start-page";
import { routeMetadata } from "@/config/metadata";
import type { EnquiryRuntimeBindings } from "@/lib/enquiry/bindings";
import { readRuntimeConfig } from "@/lib/enquiry/runtime-config";

export const metadata = routeMetadata("/start");

type PageProps = {
  searchParams: Promise<{ scenario?: string }>;
};

export default async function StartRoute({ searchParams }: PageProps) {
  await connection();
  const config = readRuntimeConfig(env as unknown as EnquiryRuntimeBindings);
  const { scenario } = await searchParams;
  const deliveryScenario = config.testMode ? scenario : undefined;

  return <StartPage deliveryScenario={deliveryScenario} siteKey={config.siteKey} testMode={config.testMode} />;
}
