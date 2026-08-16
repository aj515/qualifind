import Anthropic from "@anthropic-ai/sdk";

// Scores RELEVANCE from free text, and separately synthesizes a one-paragraph
// explanation that weaves relevance together with eligibility. Eligibility
// itself (GPA, year level, location, etc.) is still computed deterministically
// by src/lib/eligibility.js / DataContext.computeAndPersistEligibility and
// passed in here as ground truth — the model is told not to recompute or
// contradict it, only to explain it in the student's own terms alongside why
// the program is relevant to what they described. Duplicating the eligibility
// *logic* here with an LLM would make it less reliable, not more; but writing
// it up in plain language, personalized to the student's own words, is exactly
// what an LLM is good at and a rules engine isn't.
const MATCH_SCHEMA = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "The program id, copied exactly from the input list." },
          matchScore: { type: "integer", description: "0-100 relevance score between the student's free-text situation and this program." },
          reason: {
            type: "string",
            description:
              "One to two sentences, in the student's own terms, synthesizing (a) why this program relates to what they described and " +
              "(b) what their given eligibility status means for them here. Must agree with the eligibility status provided — never contradict " +
              "or re-derive it, just explain it naturally alongside the relevance."
          }
        },
        required: ["id", "matchScore", "reason"],
        additionalProperties: false
      }
    }
  },
  required: ["results"],
  additionalProperties: false
};

const SYSTEM_PROMPT = `You help Philippine students understand Philippine student financial-assistance programs (scholarships, government/LGU aid, campus assistantships, training grants, student loans) in response to their free-text description of their situation and needs.

For each program you are given its ALREADY-COMPUTED eligibility status and explanation (eligible / potentially_eligible / not_eligible, from a deterministic rules check) — treat this as ground truth. Never contradict it, soften it, or imply a different outcome.

Your job for each program:
- matchScore (0-100): purely topical/practical relevance between the student's free-text situation and the program (field of study, location, funding need, keywords) — independent of eligibility.
- reason: one to two sentences, in the student's own terms, that read as ONE cohesive explanation combining (1) why this program is or isn't relevant to what they described, and (2) what their given eligibility status concretely means for them (e.g. cite the specific gap from the eligibility explanation if not_eligible, or confirm they're clear to proceed if eligible). Do not use the words "eligible"/"not eligible" as a bare label — explain the substance instead, naturally.

Rules:
- Never state or imply an eligibility outcome other than the one you were given for that program.
- Return every program id from the input, once each.`;

export async function scorePrograms({ apiKey, situationText, profile, programs, eligibilityByProgramId }) {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env or .env.local.");
  }
  if (!situationText || !Array.isArray(programs) || programs.length === 0) {
    throw new Error("situationText and a non-empty programs array are required.");
  }

  const client = new Anthropic({ apiKey });

  const trimmedPrograms = programs.map((p) => {
    const eligibility = eligibilityByProgramId?.[p.id];
    return {
      id: p.id,
      title: p.title,
      type: p.type,
      dept: p.dept,
      summary: p.summary,
      funding: p.funding,
      tags: p.tags,
      keywords: p.keywords,
      provider: p.providers?.name,
      eligibilityStatus: eligibility?.result || "unknown",
      eligibilityExplanation: eligibility?.explanation || "Not yet determined — treat as unknown, do not guess."
    };
  });

  const userContent = JSON.stringify({
    studentProfile: {
      gpa: profile?.gpa,
      educationLevel: profile?.education_level,
      course: profile?.course,
      location: profile?.location,
      institution: profile?.institution,
      interests: profile?.interests
    },
    situationText,
    programs: trimmedPrograms
  });

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    output_config: {
      format: { type: "json_schema", schema: MATCH_SCHEMA }
    },
    messages: [{ role: "user", content: userContent }]
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("AI response had no text content.");
  }

  const parsed = JSON.parse(textBlock.text);
  return parsed.results || [];
}
