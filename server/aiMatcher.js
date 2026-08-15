import Anthropic from "@anthropic-ai/sdk";

// Scoped narrowly to RELEVANCE ranking from free text — eligibility (GPA, year
// level, location, etc.) is already computed deterministically and persisted by
// src/lib/eligibility.js / DataContext.computeAndPersistEligibility. Duplicating
// that here with an LLM would make it less reliable, not more.
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
          reason: { type: "string", description: "One sentence, in the student's own terms, on why this program relates (or doesn't) to what they described." }
        },
        required: ["id", "matchScore", "reason"],
        additionalProperties: false
      }
    }
  },
  required: ["results"],
  additionalProperties: false
};

const SYSTEM_PROMPT = `You rank Philippine student financial-assistance programs (scholarships, government/LGU aid, campus assistantships, training grants, student loans) by relevance to a student's free-text description of their situation and needs.

This is a RELEVANCE ranking, not an eligibility check — eligibility is computed and shown separately. Score purely on topical/practical fit: the type of assistance they're describing, their field of study, location, funding need, and any keywords they mention.

Rules:
- matchScore (0-100): how well the program's purpose matches what the student described.
- reason: one sentence, specific to this student's own words, explaining the relevance connection — not an eligibility statement.
- Return every program id from the input, once each.`;

export async function scorePrograms({ apiKey, situationText, profile, programs }) {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env or .env.local.");
  }
  if (!situationText || !Array.isArray(programs) || programs.length === 0) {
    throw new Error("situationText and a non-empty programs array are required.");
  }

  const client = new Anthropic({ apiKey });

  const trimmedPrograms = programs.map((p) => ({
    id: p.id,
    title: p.title,
    type: p.type,
    dept: p.dept,
    summary: p.summary,
    funding: p.funding,
    tags: p.tags,
    keywords: p.keywords,
    provider: p.providers?.name
  }));

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
