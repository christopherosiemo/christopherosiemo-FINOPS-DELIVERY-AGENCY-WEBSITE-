import { connection } from "next/server";
import { StartPage } from "@/components/conversion/start-page";
import { scaffoldMetadata } from "@/config/metadata";

export const metadata = scaffoldMetadata(
  "Start a Savings Sprint",
  "Tell HKGpipi about your AWS estate, engineering constraint and savings priority.",
);

type PageProps = {
  searchParams: Promise<{ scenario?: string }>;
};

export default async function StartRoute({ searchParams }: PageProps) {
  await connection();
  const { scenario } = await searchParams;
  const deliveryScenario = process.env.ENQUIRY_TEST_MODE === "1" ? scenario : undefined;
  // Request time is intentional: this value supports the fast-submit heuristic.
  // eslint-disable-next-line react-hooks/purity
  const issuedAt = Date.now();

  return <StartPage issuedAt={issuedAt} deliveryScenario={deliveryScenario} />;
}
