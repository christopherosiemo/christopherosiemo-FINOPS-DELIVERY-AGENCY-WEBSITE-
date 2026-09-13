export { EnquiryRateLimiter } from "../../src/lib/enquiry/rate-limit-do";

const worker = { fetch: () => new Response("ok") };

export default worker;
