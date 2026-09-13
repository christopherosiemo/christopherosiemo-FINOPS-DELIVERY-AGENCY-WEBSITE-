import { connection } from "next/server";
import { env } from "cloudflare:workers";
import { StartPage } from "@/components/conversion/start-page";
import { scaffoldMetadata } from "@/config/metadata";
import type { EnquiryRuntimeBindings } from "@/lib/enquiry/bindings";
import { readRuntimeConfig } from "@/lib/enquiry/runtime-config";

export const metadata = scaffoldMetadata(
  "Start a Savings Sprint",
  "Tell HKGpipi about your AWS estate, engineering constraint and savings priority.",
);

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
