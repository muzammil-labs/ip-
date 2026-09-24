export const COVERAGE: [string, string, string][] = [
 ["Explicit jurisdiction switch, answer sets kept visibly separate","Two columns with separate citations and a leakage metric of zero","ask"],
 ["Classify the formulation with minimum clarifying questions","Three to five adaptive questions across six legal categories","classify"],
 ["Routing across patents, GI, trade marks, copyright, designs, trade secrets, plant varieties","Per-category IP rows, with each regime cited","classify"],
 ["Access-and-Benefit-Sharing compliance helper","Duties computed from material source and who commercialises","classify"],
 ["TKDL and prior-art pointer","Ready-made queries for five databases","tk"],
 ["Paid subscriptions only with explicit, logged permission","Consent dialog, revocable ledger, audit entry","tk"],
 ["Advertising, labelling, food and cosmetic regimes","Claim check against DMR Act, CCPA, FSSAI and Cosmetics Rules","claims"],
 ["Cite the specific statute, rule, treaty article or record","Every sentence carries clause-level citations with version and status","ask"],
 ["Confidence indicator","Three measured factors; the model never grades itself","ask"],
 ["Safe abstention on out-of-scope or uncertain queries","Declines with reasons and missing facts","ask"],
 ["Escalation to a human IP facilitator","Consent-scoped hand-off from any answer","trust"],
 ["Keep the corpus current as law changes","Versioned register with status; Rule 170 timeline","sources"],
 ["Multilingual delivery using Bhashini, and voice","Hindi and Telugu interface, glossary-locked terms, speech input and read-aloud","ask"],
 ["Standing \"information, not legal advice\" disclaimer","Fixed on every screen in the chosen language","overview"],
 ["Privacy, audit and security aligned to DPDP","Session audit trail, consent capture, no formula logging","trust"],
 ["Evaluable on accuracy, citations, abstention and language quality","AyurIP-Bench with six scored metrics","trust"],
 ["Knowledge graph and agentic orchestration, staged build","Three-stage plan and architecture","blueprint"]
];
