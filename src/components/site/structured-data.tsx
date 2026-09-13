import { createStructuredData } from "@/config/acquisition";

export function StructuredData() {
  const data = createStructuredData();
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
