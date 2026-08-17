import Anthropic from "@anthropic-ai/sdk";

// Reads an uploaded document (PDF, image, or plain text — e.g. a transcript,
// certificate of registration, or certificate of indigency) and pulls out the
// fields the matcher/eligibility flow cares about, plus a natural-language
// summary the student can drop straight into the matcher prompt textarea.
const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    hasContent: {
      type: "boolean",
      description:
        "False if the document/text contains no meaningful information about a student's education, finances, or scholarship eligibility " +
        "(e.g. blank, gibberish, keyboard-mash, or entirely unrelated content). True only if there is at least one real, usable detail."
    },
    isRelevant: {
      type: "boolean",
      description:
        "True if this document is directly relevant to scholarship / financial aid / academic matching (e.g. Certificate of Registration, Transcript of Records, Certificate of Indigency, Report Card, ID, Enrollment form). " +
        "False if this document is general school coursework, an assignment, homework, essay, syllabus, or unrelated file that lacks financial aid/eligibility data."
    },
    warning: {
      type: ["string", "null"],
      description:
        "If isRelevant is false or if the file is inappropriate/unrelated for financial aid or scholarship search (e.g. literature homework, random coursework), provide a concise warning explaining why this file may not be suitable for scholarship matching and suggesting what document to upload instead. Null if fully relevant."
    },
    summary: {
      type: "string",
      description:
        "A first-person paragraph (as if the student wrote it) describing their situation using only facts found in the document, " +
        "suitable for pasting directly into the AI matcher's free-text prompt box. If hasContent is false, explain briefly why nothing usable was found instead."
    },
    fields: {
      type: "object",
      properties: {
        fullName: { type: ["string", "null"] },
        educationLevel: { type: ["string", "null"], description: "e.g. college, senior high, graduate" },
        course: { type: ["string", "null"] },
        yearLevel: { type: ["string", "null"] },
        institution: { type: ["string", "null"] },
        gpa: { type: ["number", "null"], description: "GPA/GWA as a number on whatever scale the document uses." },
        location: { type: ["string", "null"], description: "City/province/region." },
        householdIncome: { type: ["string", "null"], description: "Household income or indigency status, if stated." },
        financialNeedMentioned: { type: ["boolean", "null"], description: "True only if the text explicitly says the student/family has limited income, is indigent, or otherwise needs financial assistance." },
        assistanceNeeds: { type: ["string", "null"], description: "Short comma-separated list of the kind of help mentioned (e.g. 'tuition assistance, transportation support'). Null if not mentioned." },
        otherNotes: { type: ["string", "null"], description: "Any other detail relevant to scholarship/aid eligibility." }
      },
      required: ["fullName", "educationLevel", "course", "yearLevel", "institution", "gpa", "location", "householdIncome", "financialNeedMentioned", "assistanceNeeds", "otherNotes"],
      additionalProperties: false
    }
  },
  required: ["hasContent", "isRelevant", "warning", "summary", "fields"],
  additionalProperties: false
};

const SYSTEM_PROMPT = `You extract information from documents Philippine students upload when searching for financial assistance / scholarship programs — such as a Certificate of Registration (COR), Transcript of Records (TOR), Certificate of Indigency, Barangay Certificate, Report Card, Student ID, or Scholarship Application.

Relevance Rules:
- isRelevant: Set to true ONLY if the document is an official academic record or financial aid document that directly helps determine scholarship/aid eligibility. Set to false if the document is a general class assignment, coursework, homework, literature review, syllabus, lecture notes, essay, receipt, or unrelated file.
- warning: If isRelevant is false or if the file lacks financial/academic eligibility information, provide a friendly explanation in 'warning' stating why this file is not suitable for scholarship matching and suggesting they upload a Certificate of Registration (COR), Transcript (TOR), or Certificate of Indigency instead.

Only report facts actually stated in the text. Use null for anything not mentioned — never guess or invent values. Keep the summary grounded strictly in the given text.`;

export async function extractFromDocument({ apiKey, fileName, mediaType, base64Data, textContent }) {
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env or .env.local.");
  }
  if (!base64Data && !textContent) {
    throw new Error("A document (base64Data or textContent) is required.");
  }

  const client = new Anthropic({ apiKey });

  let documentBlock;
  if (textContent) {
    documentBlock = { type: "text", text: textContent };
  } else if (mediaType === "application/pdf") {
    documentBlock = { type: "document", source: { type: "base64", media_type: mediaType, data: base64Data } };
  } else if (mediaType?.startsWith("image/")) {
    documentBlock = { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } };
  } else {
    throw new Error(`Unsupported file type: ${mediaType || "unknown"}. Upload a PDF, image, or .txt file.`);
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    output_config: {
      format: { type: "json_schema", schema: EXTRACT_SCHEMA }
    },
    messages: [
      {
        role: "user",
        content: [documentBlock, { type: "text", text: `Extract the relevant details from this document (file name: "${fileName || "upload"}").` }]
      }
    ]
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("AI response had no text content.");
  }

  return JSON.parse(textBlock.text);
}
