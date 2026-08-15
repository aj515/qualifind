// Ported from the old app.js's calculateMatchForPrompt — client-side keyword + GWA
// relevance heuristic for the free-text AI Matcher search. Not persisted to the DB,
// same as before; just computed on the fly for the current session.

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

export const MATCHER_PROFILE_TAGS = [
  { id: 'college-student', label: 'College Student', icon: 'school' },
  { id: 'it-student', label: 'IT / Computing Major', icon: 'terminal' },
  { id: 'cebu-resident', label: 'Cebu / Region VII', icon: 'location_city' },
  { id: 'working-student', label: 'Working Student', icon: 'work_history' },
  { id: 'scholarship', label: 'Looking for Scholarship', icon: 'workspace_premium' },
  { id: 'financial-aid', label: 'Tuition / Cash Grant', icon: 'payments' },
  { id: 'assistantship', label: 'Campus Assistantship', icon: 'laptop_chromebook' },
  { id: 'certification', label: 'Free Tech Certification', icon: 'model_training' },
  { id: 'low-income', label: 'Low-Income Household', icon: 'home' }
];

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
