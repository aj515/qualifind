import Anthropic from "@anthropic-ai/sdk";

// Reads a pasted scholarship/program announcement (a press release, a
// Facebook post, a flyer's text) and pulls out the fields an admin would
// otherwise type by hand into the Programs Registry form. Scoped to the
// `programs` table's own columns plus a couple of admin-facing extras
// (provider name, suggested required documents) — it does NOT create
// database rows itself; the admin form stays the single place a program is
// actually saved, same "review before commit" pattern as the student-facing
// document extractor.
// Anthropic's structured-output API caps how many nullable-union
// (type: [X, "null"]) properties one schema can have — 21 plain fields here
// hit that cap and got rejected. Every field below uses a single concrete
// type instead, with a documented "not stated" sentinel (empty string / 0 /
// false) rather than null. The client treats those sentinels as "no info,
// don't overwrite whatever's already in the form" the same way it would
// treat null.
const PROGRAM_EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    fields: {
      type: "object",
      properties: {
        title: { type: "string", description: "Empty string if not stated." },
        type: {
          type: "string",
          description: "One of: Scholarship, Educational Assistance, Student Employment, Student Loan, Training & Certification. Empty string if unclear."
        },
        providerName: { type: "string", description: "The agency/organization offering it. Empty string if not stated." },
        dept: { type: "string", description: "Field of study or focus area it targets. Empty string if not stated." },
        duration: { type: "string", description: "Empty string if not stated." },
        summary: { type: "string", description: "One to two plain-language sentences describing the program. Empty string if not enough info." },
        funding: { type: "string", description: "Display text for the funding amount, e.g. '₱50,000 / yr + Tuition Support'. Empty string if not stated." },
        annualValue: { type: "number", description: "Funding amount as a plain number (no currency symbol/commas). 0 if not statable." },
        deadline: { type: "string", description: "ISO date (YYYY-MM-DD) if a specific deadline is stated, else empty string." },
        minGpa: { type: "number", description: "Minimum GPA/GWA percentage required. 0 if not stated (0 is never a real minimum)." },
        educationReq: { type: "string", description: "'College' or 'Graduate' if the level is stated, else empty string." },
        minYearLevel: { type: "integer", description: "0 if not stated." },
        maxYearLevel: { type: "integer", description: "0 if not stated." },
        ageMin: { type: "integer", description: "0 if not stated." },
        ageMax: { type: "integer", description: "0 if not stated." },
        financialReq: { type: "boolean", description: "True only if the text explicitly requires proof of financial need/indigency, else false." },
        courseReq: {
          type: "string",
          description:
            "Required course(s) if restricted to specific ones, else empty string. If more than one course qualifies, " +
            "separate them with ' / ' (e.g. 'IT / Computer Science / Engineering') — never a comma — since that's the " +
            "separator the app's matching logic splits alternatives on."
        },
        location: { type: "string", description: "Geographic restriction (city/region). Empty string if nationwide or unstated." },
        degreeRequired: { type: "string", description: "Display text for the degree/standing required. Empty string if not stated." },
        citizenship: { type: "string", description: "Empty string if not stated." },
        sourceUrl: { type: "string", description: "The official URL, only if one is actually present in the text, else empty string." },
        tags: { type: "array", items: { type: "string" }, description: "Short display tags, e.g. ['DOST-SEI', 'Merit Scholarship']. Empty array if none obvious." },
        keywords: { type: "array", items: { type: "string" }, description: "Lowercase search keywords for matching. Empty array if none obvious." },
        whyStrongMatch: { type: "array", items: { type: "string" }, description: "1-3 short bullets on what makes a student a strong fit, grounded only in the text. Empty array if not enough info." },
        suggestedDocuments: { type: "array", items: { type: "string" }, description: "Document names the text implies are required (e.g. 'Certificate of Enrollment'). Empty array if none mentioned." }
      },
      required: [
        "title", "type", "providerName", "dept", "duration", "summary", "funding", "annualValue", "deadline",
        "minGpa", "educationReq", "minYearLevel", "maxYearLevel", "ageMin", "ageMax", "financialReq", "courseReq",
        "location", "degreeRequired", "citizenship", "sourceUrl", "tags", "keywords", "whyStrongMatch", "suggestedDocuments"
      ],
      additionalProperties: false
    }
  },
  required: ["fields"],
  additionalProperties: false
};

const SYSTEM_PROMPT = `You extract structured data from a Philippine student-assistance program announcement (scholarship, grant, assistantship, loan, or training program) so an admin doesn't have to type it into a form by hand.

Only report facts actually stated in the text. Use the documented "not stated" sentinel for each field (empty string, 0, or false — see each field's description) for anything not mentioned — never guess, invent, or assume a typical value. This is a draft an admin will review and correct before saving, but it should never fabricate specifics like GPA thresholds or deadlines that aren't actually in the source text.`;

export async function extractProgramFromText({ apiKey, rawText }) {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env or .env.local.");
  }
  if (!rawText || !rawText.trim()) {
    throw new Error("rawText is required.");
  }

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1536,
    system: SYSTEM_PROMPT,
    output_config: {
      format: { type: "json_schema", schema: PROGRAM_EXTRACT_SCHEMA }
    },
    messages: [{ role: "user", content: rawText }]
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("AI response had no text content.");
  }

  return JSON.parse(textBlock.text).fields;
}
