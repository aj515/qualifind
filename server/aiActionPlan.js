import Anthropic from "@anthropic-ai/sdk";

// Personalizes the Action Plan's "recommended next action" callout. The plan's
// STRUCTURE (which steps exist, their order, their titles/descriptions) is fixed,
// admin-authored data — this call never touches that. Eligibility (result +
// explanation) is likewise already computed deterministically and passed in as
// ground truth. The model's only job is to look at the specific gap and the
// specific remaining steps/documents, and write one or two sentences telling
// the student what to actually prioritize right now and why — replacing a
// generic "resolve this before the deadline" with something concrete to them.
const ACTION_PLAN_SCHEMA = {
  type: "object",
  properties: {
    recommendedAction: {
      type: "string",
      description:
        "One to two sentences, addressed to the student, naming the single most useful thing to do next given their specific " +
        "eligibility gap and which steps/documents are still outstanding. Concrete and specific — cite the actual gap or missing " +
        "item by name, not a generic reminder. Must not contradict the given eligibility status."
    }
  },
  required: ["recommendedAction"],
  additionalProperties: false
};

const SYSTEM_PROMPT = `You help a Philippine student figure out what to prioritize next on their application checklist for a specific financial-assistance program.

You are given: the program, their ALREADY-COMPUTED eligibility status and explanation (ground truth — never contradict or re-derive it), the program's required documents, its application steps, and which steps the student has already completed.

Write one to two sentences naming the single most useful next action. Be concrete: reference the specific gap (e.g. a GPA shortfall, a missing document) or the specific next uncompleted step by name — not generic advice like "review the requirements." If they're fully eligible and steps remain, point at the next uncompleted step. If all steps are done, tell them to do a final check and submit.`;

export async function narrateActionPlan({ apiKey, program, eligibility, documents, steps, completedStepNumbers }) {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env or .env.local.");
  }
  if (!program || !Array.isArray(steps)) {
    throw new Error("program and a steps array are required.");
  }

  const client = new Anthropic({ apiKey });

  const userContent = JSON.stringify({
    program: { title: program.title, type: program.type, deadline: program.deadline },
    eligibilityStatus: eligibility?.result || "unknown",
    eligibilityExplanation: eligibility?.explanation || "Not yet determined.",
    requiredDocuments: (documents || []).map((d) => d.name),
    steps: steps.map((s) => ({ stepNumber: s.step_number, title: s.title, completed: (completedStepNumbers || []).includes(s.step_number) })),
    allStepsCompleted: steps.length > 0 && steps.every((s) => (completedStepNumbers || []).includes(s.step_number))
  });

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    output_config: {
      format: { type: "json_schema", schema: ACTION_PLAN_SCHEMA }
    },
    messages: [{ role: "user", content: userContent }]
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("AI response had no text content.");
  }

  return JSON.parse(textBlock.text);
}
