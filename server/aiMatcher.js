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
    inputUnderstood: {
      type: "boolean",
      description:
        "False if situationText contains no real, usable information about the student's situation or needs — e.g. it's " +
        "gibberish, keyboard-mash, random unrelated words, or otherwise too vague/meaningless to judge relevance from. " +
        "True otherwise, even if the description is short, as long as it says something real."
    },
    clarificationMessage: {
      type: ["string", "null"],
      description:
        "Only set when inputUnderstood is false: one short, friendly sentence asking the student to describe their situation " +
        "in real terms (e.g. course, year level, location, what kind of help they need). Null when inputUnderstood is true."
    },
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
  required: ["inputUnderstood", "clarificationMessage", "results"],
  additionalProperties: false
};

const SYSTEM_PROMPT = `You help Philippine students understand Philippine student financial-assistance programs (scholarships, government/LGU aid, campus assistantships, training grants, student loans) in response to their free-text description of their situation and needs.

First, judge whether situationText actually says anything real about the student (inputUnderstood). Gibberish, keyboard-mash, or content unrelated to a student's situation should be marked not understood, with a short clarificationMessage asking for a real description — do not try to force a plausible-sounding relevance judgment out of meaningless text. A short but genuine description (even a single real sentence) counts as understood — including when it describes a course, institution, year level, or location that DIFFERS from the studentProfile on file. That is not gibberish; the student may simply be describing a different or updated situation than their saved profile. Never mark inputUnderstood false, and never use clarificationMessage, just because situationText conflicts with studentProfile — score normally against what the student actually wrote. A separate part of the app already asks the student whether to save such changes to their profile, so you don't need to flag or resolve the conflict yourself.

For each program you are given its ALREADY-COMPUTED eligibility status and explanation (eligible / potentially_eligible / not_eligible, from a deterministic rules check) — treat this as ground truth. Never contradict it, soften it, or imply a different outcome.

Your job for each program:
- matchScore (0-100): how well the program's actual PURPOSE matches what the student specifically asked for — independent of eligibility. Weight this by specificity, not just topic overlap:
  - If the student names a distinct, concrete need (a laptop/device, transportation, tuition, housing, a certification, etc.), a program whose funding/purpose DIRECTLY addresses that specific need should score much higher (80-100) than a program that's merely in the same general field (e.g. same course/institution) but doesn't actually address it (which should score in the 30-55 range even if broadly on-topic) — being "for IT students" is not enough to score highly against "I need a laptop" if the program isn't actually about devices.
  - If the student's description is broad/general (no specific need named), general topical/field/location fit is the right signal to score on.
  - Do not let field-of-study keyword overlap alone inflate a score for a program that ignores the specific thing the student asked for.
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
  return {
    results: parsed.results || [],
    inputUnderstood: parsed.inputUnderstood !== false,
    clarificationMessage: parsed.clarificationMessage || null
  };
}
