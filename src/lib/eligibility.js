// Eligibility is now computed per-student against normalized program fields
// (see supabase/migrations/0003_normalize_schema.sql) instead of reading a single
// static column shared by every student. computeEligibility() is the source of
// truth; DataContext calls it for every active program and upserts the result
// into eligibility_results for persistence/admin analytics.

export function formatDeadline(deadline) {
  if (!deadline) return { formatted: '—', daysLeft: null };
  const target = new Date(`${deadline}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((target - today) / 86400000);
  const formatted = target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return { formatted, daysLeft };
}

export function formatVerifiedDate(dateStr) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function calcAge(birthdate) {
  if (!birthdate) return null;
  const dob = new Date(`${birthdate}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

// Compares a student profile against a program's requirement fields.
// Returns { result: 'eligible'|'potentially_eligible'|'not_eligible', explanation }.
// Hard mismatches (GPA, education level, year level, age, course, location) → not_eligible.
// Missing student data needed to check a requirement, or an unmet financial-need
// flag, → potentially_eligible (can't confirm either way yet). Otherwise eligible.
export function computeEligibility(student, program) {
  const reasons = [];
  const needsVerification = [];

  if (program.min_gpa != null) {
    if (student?.gpa == null) {
      needsVerification.push(`your GPA hasn't been added to your profile yet (this program requires at least ${program.min_gpa}%)`);
    } else if (student.gpa < program.min_gpa) {
      reasons.push(`your GPA (${student.gpa}%) is below the required minimum of ${program.min_gpa}%`);
    }
  }

  if (program.education_req) {
    if (!student?.education_level) {
      needsVerification.push(`your education level hasn't been added to your profile yet (this program requires ${program.education_req})`);
    } else if (student.education_level.toLowerCase() !== program.education_req.toLowerCase()) {
      reasons.push(`this program is limited to ${program.education_req}-level students`);
    }
  }

  if (program.min_year_level != null || program.max_year_level != null) {
    if (student?.year_level == null) {
      needsVerification.push("your year level hasn't been added to your profile yet");
    } else if (program.min_year_level != null && student.year_level < program.min_year_level) {
      reasons.push(`this program requires at least year ${program.min_year_level} standing`);
    } else if (program.max_year_level != null && student.year_level > program.max_year_level) {
      reasons.push(`this program is limited to year ${program.max_year_level} and below`);
    }
  }

  if (program.age_min != null || program.age_max != null) {
    const age = calcAge(student?.birthdate);
    if (age == null) {
      needsVerification.push("your birthdate hasn't been added to your profile yet");
    } else if (program.age_min != null && age < program.age_min) {
      reasons.push(`this program requires applicants at least ${program.age_min} years old`);
    } else if (program.age_max != null && age > program.age_max) {
      reasons.push(`this program is limited to applicants ${program.age_max} and under`);
    }
  }

  if (program.course_req) {
    if (!student?.course) {
      needsVerification.push(`your course/program hasn't been added to your profile yet (this program requires ${program.course_req})`);
    } else {
      const studentCourse = student.course.toLowerCase();
      const required = program.course_req.toLowerCase();
      const matches = required.split('/').some((part) => studentCourse.includes(part.trim()) || part.trim().includes(studentCourse));
      if (!matches) {
        reasons.push(`this program is limited to ${program.course_req} students`);
      }
    }
  }

  if (program.location && program.location.toLowerCase() !== 'nationwide') {
    if (!student?.location) {
      needsVerification.push(`your location hasn't been added to your profile yet (this program is limited to ${program.location})`);
    } else if (!student.location.toLowerCase().includes(program.location.toLowerCase())) {
      reasons.push(`this program is limited to students located in ${program.location}`);
    }
  }

  if (program.financial_req && !student?.is_financially_disadvantaged) {
    needsVerification.push('financial need documentation (e.g. an indigency certificate) still needs verification');
  }

  const typeLabel = (program.type || 'program').toLowerCase();

  if (reasons.length > 0) {
    return { result: 'not_eligible', explanation: `You may not qualify for this ${typeLabel} because ${reasons[0]}.` };
  }
  if (needsVerification.length > 0) {
    return { result: 'potentially_eligible', explanation: `Most requirements look good, but ${needsVerification[0]}.` };
  }
  return { result: 'eligible', explanation: `Your profile meets all requirements for this ${typeLabel}.` };
}

// Extends a not_eligible explanation with alternative category suggestions, e.g.
// "...but you may still pursue Educational Assistance or Student Employment."
export function withAlternativeSuggestion(explanation, alternativeTypes) {
  if (!alternativeTypes || alternativeTypes.length === 0) return explanation;
  const categories = alternativeTypes.slice(0, 2).join(' or ');
  return `${explanation.replace(/\.$/, '')}, but you may still pursue ${categories}.`;
}

const ELIGIBILITY_STYLES = {
  eligible: { badgeClass: 'badge-mint', icon: 'check_circle', label: 'Eligible' },
  potentially_eligible: { badgeClass: 'badge-amber', icon: 'pending', label: 'Potentially Eligible' },
  not_eligible: { badgeClass: 'badge-pink', icon: 'cancel', label: 'Not Eligible' }
};

export function getEligibilityStyle(result) {
  return ELIGIBILITY_STYLES[result] || ELIGIBILITY_STYLES.not_eligible;
}

export const ELIGIBILITY_RANK = { eligible: 0, potentially_eligible: 1, not_eligible: 2 };
