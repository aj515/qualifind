// Cheap, instant, client-side gate against the most trivial junk (empty-ish,
// single "word", keyboard-mash-repeated-char strings) so those never spend an
// API call at all. Deliberately lenient — anything that could plausibly be a
// real short description passes through to the AI, which has the actual
// semantic judgment call (see inputUnderstood below) for subtler nonsense like
// grammatically real-looking words strung together meaninglessly.
export function looksLikeRealDescription(text) {
  const trimmed = (text || '').trim();
  if (trimmed.length < 8) return false;
  const words = trimmed.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length < 2) return false;
  const mostCommonCharRatio = Math.max(...Object.values(
    trimmed.toLowerCase().replace(/\s/g, '').split('').reduce((counts, ch) => {
      counts[ch] = (counts[ch] || 0) + 1;
      return counts;
    }, {})
  )) / Math.max(1, trimmed.replace(/\s/g, '').length);
  if (mostCommonCharRatio > 0.5) return false; // e.g. "aaaaaaaa", "........"
  return true;
}

// Calls the dev-server /api/match endpoint (see vite.config.js + server/aiMatcher.js),
// which forwards to Claude for real semantic relevance scoring against the free-text
// situation, synthesized together with each program's already-computed eligibility
// result, and judges whether the input said anything real in the first place.
// Throws on failure — callers should fall back to calculateMatchForPrompt.
export async function getAIMatches(situationText, programs, profile, eligibilityByProgramId) {
  const response = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ situationText, profile, programs, eligibilityByProgramId })
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `AI matching request failed (${response.status})`);
  }

  const { results = [], inputUnderstood = true, clarificationMessage = null } = await response.json();

  const scoredPrograms = programs.map((program) => {
    const match = results.find((r) => r.id === program.id);
    return {
      ...program,
      calculatedScore: match ? match.matchScore : 50,
      aiMatchReason: match ? match.reason : ''
    };
  });

  return { scoredPrograms, inputUnderstood, clarificationMessage };
}

// Calls the dev-server /api/extract-document endpoint (see vite.config.js +
// server/aiDocumentExtractor.js) which reads an uploaded document (PDF, image,
// or .txt) and returns extracted fields plus a ready-to-paste summary paragraph.
export async function extractDocument(file) {
  const isText = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

  const payload = isText
    ? { fileName: file.name, textContent: await file.text() }
    : { fileName: file.name, mediaType: file.type, base64Data: await fileToBase64(file) };

  return postExtract(payload);
}

// Same endpoint/model as extractDocument, but for the free text a student types
// directly into the matcher prompt instead of an uploaded file — lets typed
// descriptions populate structured fields (course/GPA/location/etc.) the same
// way an uploaded transcript does, so "what I write in the matcher" can also
// drive the saved profile and the editable field view on Opportunities.
export async function extractSituation(situationText) {
  return postExtract({ fileName: 'Situation description', textContent: situationText });
}

async function postExtract(payload) {
  const response = await fetch('/api/extract-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Extraction request failed (${response.status})`);
  }

  return response.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Shared "builder" shape used both by the Matcher page's guided form and by the
// editable field view on Opportunities: { yearLevel, course, location, gpa,
// financialNeed, interests }. mapExtractedFieldsToBuilder() converts an
// extraction result's `fields` (see aiDocumentExtractor.js) into that shape.
export function mapExtractedFieldsToBuilder(fields) {
  return {
    yearLevel: fields?.yearLevel || '',
    course: fields?.course || '',
    location: fields?.location || '',
    gpa: fields?.gpa != null ? String(fields.gpa) : '',
    financialNeed: !!fields?.financialNeedMentioned,
    interests: fields?.assistanceNeeds || ''
  };
}

export function composeBuilderSentence(builder) {
  const parts = [];

  const who = [builder.yearLevel, builder.course].filter(Boolean).join(' ');
  if (who) {
    parts.push(`I'm a ${who} student${builder.location ? ` in ${builder.location}` : ''}${builder.gpa ? ` with a ${builder.gpa}% GWA` : ''}.`);
  } else if (builder.location) {
    parts.push(`I'm based in ${builder.location}.`);
  }

  if (builder.financialNeed) {
    parts.push("My family has limited income and I need financial assistance.");
  }

  if (builder.interests) {
    parts.push(`I'm looking for help with ${builder.interests}.`);
  }

  return parts.join(' ');
}

function parseBuilderYearLevel(value) {
  const match = String(value).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

export const PROFILE_UPDATE_LABELS = {
  course: 'Course',
  location: 'Location',
  gpa: 'GWA/GPA',
  year_level: 'Year level',
  is_financially_disadvantaged: 'Financial need'
};

// Maps the shared builder shape onto the saved-profile fields eligibility checks
// actually compare against (see AuthContext's STUDENTS_FIELDS).
export function buildProfileUpdatesFromBuilder(builder) {
  const updates = {};
  if (builder.course) updates.course = builder.course;
  if (builder.location) updates.location = builder.location;
  if (builder.gpa) {
    const gpaNum = parseFloat(builder.gpa);
    if (!Number.isNaN(gpaNum)) updates.gpa = gpaNum;
  }
  if (builder.yearLevel) {
    const year = parseBuilderYearLevel(builder.yearLevel);
    if (year) updates.year_level = year;
  }
  if (builder.financialNeed) updates.is_financially_disadvantaged = true;
  return updates;
}

// Offline fallback (also the original implementation, ported from the old app.js's
// calculateMatchForPrompt) — client-side keyword + GWA relevance heuristic, used
// when the AI call fails (no API key, network issue, rate limit). Not persisted to
// the DB; just computed on the fly for the current session.
export function calculateMatchForPrompt(userPrompt, programs, userGpa) {
  const query = userPrompt.toLowerCase();
  const keywords = query.split(/\s+/).filter((w) => w.length > 2);

  const results = programs.map((program) => {
    let score = 55;

    const allKeywords = (program.keywords || []).concat([
      (program.title || '').toLowerCase(),
      (program.dept || '').toLowerCase(),
      (program.type || '').toLowerCase(),
      (program.providers?.name || '').toLowerCase()
    ]);

    let matchedKeywordsCount = 0;
    keywords.forEach((kw) => {
      if (allKeywords.some((ak) => ak.includes(kw) || kw.includes(ak))) {
        matchedKeywordsCount++;
      }
    });

    score += Math.min(35, matchedKeywordsCount * 10);

    if (userGpa >= (program.min_gpa ?? 75.0)) {
      score += 10;
    } else {
      score -= 25;
    }

    if (query.includes('cebu') && (program.tags || []).some((t) => t.toLowerCase().includes('cebu'))) {
      score += 10;
    }

    score = Math.min(98, Math.max(35, score));

    return { ...program, calculatedScore: score };
  });

  results.sort((a, b) => b.calculatedScore - a.calculatedScore);
  return results;
}

export const MATCHER_DEMO_PRESETS = [
  {
    label: "🌟 Maria's Demo Story (Cebu 2nd-Yr IT, 82% GPA)",
    prompt:
      "I'm Maria, 20 years old, a 2nd-year IT student in Cebu with an 82% GPA. My family has limited income, and I'm looking for assistance to cover my tuition fees and daily transportation expenses."
  },
  {
    label: 'DOST-SEI ASTHRDP & ERDT Scholarships',
    prompt: 'Looking for DOST-SEI ASTHRDP or ERDT graduate scholarships with monthly stipends around ₱35,000 in AI, genomics, and computing.'
  },
  {
    label: 'CHED Tulong Dunong & Cebu LGU Grants',
    prompt: 'Seeking CHED Tulong Dunong or Cebu City LGU college financial grants for undergraduate tuition assistance.'
  },
  {
    label: 'University IT Student Assistantships',
    prompt: 'Find campus student assistantships and IT technical support work-study programs.'
  }
];
