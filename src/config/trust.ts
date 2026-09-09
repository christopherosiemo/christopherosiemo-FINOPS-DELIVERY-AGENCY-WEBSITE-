export const trustFacts = {
  accessBoundary: "tightly constrained read-only AWS access",
  measurementView: "30-day measurement view",
  operatingStages: [
    {
      name: "FIND",
      purpose: "Identify economically meaningful AWS cost opportunities.",
      evidence: "Billing and cost data, waste, commitment exposure and architecture patterns.",
      output: "Candidate opportunity",
    },
    {
      name: "VALIDATE",
      purpose: "Test whether the opportunity remains worth acting on after usage, commitment and engineering-risk context.",
      evidence: "Usage evidence, relevant commitments and engineering-risk context.",
      output: "Validated opportunity",
    },
    {
      name: "ASSIGN",
      purpose: "Connect the opportunity to the responsible workload, owner and implementation location where identifiable.",
      evidence: "Workload, team and infrastructure context.",
      output: "Accountable owner / implementation context",
    },
    {
      name: "CHANGE",
      purpose: "Define the engineering remediation required.",
      evidence: "PR, ticket, configuration change or specific implementation instruction, as appropriate.",
      output: "Change-ready work",
    },
    {
      name: "APPROVE",
      purpose: "Move the work through the customer's existing engineering and change-control process.",
      evidence: "Customer review, checks and approval authority.",
      output: "Customer-approved work",
    },
    {
      name: "VERIFY",
      purpose: "Measure the post-deployment economic result against the agreed baseline.",
      evidence: "Baseline and post-change billing evidence under the agreed verification basis.",
      output: "Verified saving",
    },
  ],
} as const;
