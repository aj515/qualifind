// QualiFind - AI-Powered Student Assistance Navigator (Philippine Higher Education Setting)
// Corporate Trust Design System Integration (Modern Enterprise SaaS Aesthetic)

const INITIAL_OPPORTUNITIES = [
  {
    id: "CEBU-LGU-SCHOLARSHIP-2024",
    title: "Cebu City College Scholarship Program (CCCSP)",
    provider: "Cebu City Local Government Unit (LGU)",
    type: "Educational Assistance",
    dept: "Information Technology & Tertiary Education",
    duration: "Per Semester (Renewable)",
    funding: "₱50,000 / yr + Tuition Support",
    annualValue: 50000,
    deadline: "2026-09-30",
    deadlineFormatted: "Sep 30, 2026",
    deadlineDays: 45,
    status: "Active",
    matchScore: 96,
    minGpa: 80.0, // Minimum 80% GPA
    eligible: true,
    eligibilityStatus: "Eligible", // "Eligible" | "Potentially Eligible" | "Not Eligible"
    eligibilityNotes: "Requirements appear to be met (Cebu Resident & 82% GPA)",
    degreeRequired: "Undergraduate (Enrolled in Cebu HEI / SUC)",
    citizenship: "Filipino Citizen (Cebu Resident)",
    leadProf: "Mayor's Scholarship Office",
    teamCount: 4,
    icon: "location_city",
    colorTheme: "emerald",
    summary: "Financial aid and tuition assistance program for qualified resident tertiary students enrolled in accredited colleges and universities across Cebu.",
    whyStrongMatch: [
      "Your current 82% GPA exceeds the 80% minimum requirement for Cebu City tertiary aid.",
      "Matches your location in Cebu (Region VII) and undergraduate 2nd-year standing.",
      "Directly provides tuition assistance and daily transport subsidy for indigent students."
    ],
    requirements: [
      { id: "req-1", title: "Cebu Residency & Voter's Certification", desc: "Must be a bona fide resident of Cebu City.", status: "satisfied", note: "Satisfied: Cebu Resident" },
      { id: "req-2", title: "Academic GPA Cutoff (Min 80%)", desc: "General weighted average of at least 80% with no failing marks.", status: "satisfied", note: "Satisfied: 82% GPA" },
      { id: "req-3", title: "Certificate of Enrollment (COE)", desc: "Proof of enrollment in an accredited Philippine college.", status: "action", note: "Action: Upload 2nd Year COE" },
      { id: "req-4", title: "Barangay Indigency Certificate", desc: "Proof of low or limited family household income.", status: "action", note: "Action: Submit Indigency Slip" }
    ],
    tags: ["Cebu LGU", "Tuition Aid", "Transportation Allowance", "Undergraduate", "Region VII"],
    keywords: ["cebu", "lgu", "scholarship", "tuition", "transportation", "information technology", "undergraduate", "it", "philippines"]
  },
  {
    id: "CIT-STUDENT-ASSISTANT-2024",
    title: "University IT & Computer Lab Student Assistantship",
    provider: "Campus Student Affairs & IT Services Office",
    type: "Student Employment",
    dept: "Computer Science & IT Infrastructure",
    duration: "1 Academic Year (Flexible 15 hrs/wk)",
    funding: "₱42,000 / yr (₱70/hr + Tuition Discount)",
    annualValue: 42000,
    deadline: "2026-09-15",
    deadlineFormatted: "Sep 15, 2026",
    deadlineDays: 30,
    status: "Active",
    matchScore: 94,
    minGpa: 75.0,
    eligible: true,
    eligibilityStatus: "Eligible",
    eligibilityNotes: "Excellent Match: IT Student Skills Match",
    degreeRequired: "2nd to 4th Year IT / Computer Science",
    citizenship: "Enrolled Student",
    leadProf: "Prof. Alan Turing / Head of IT Lab",
    teamCount: 8,
    icon: "laptop_chromebook",
    colorTheme: "indigo",
    summary: "Work-study employment for computing students to assist in university computer labs, software maintenance, and student helpdesk support while earning tuition credits.",
    whyStrongMatch: [
      "Perfect fit for 2nd-year B.S. IT students looking to offset transport expenses through campus hours.",
      "Requires minimum 75% GPA, well below your 82% academic standing.",
      "Flexible schedule tailored around your class timetable."
    ],
    requirements: [
      { id: "req-1", title: "Enrolled in IT / Computing Course", desc: "Currently enrolled in 2nd year or higher.", status: "satisfied", note: "Satisfied: 2nd Year IT" },
      { id: "req-2", title: "Academic Standing (Min 75%)", desc: "Must maintain good standing without academic probation.", status: "satisfied", note: "Satisfied: 82% GPA" },
      { id: "req-3", title: "Student Work Permit & Schedule", desc: "Available for 12-15 hours of lab monitoring per week.", status: "action", note: "Action: Submit Class Timetable" }
    ],
    tags: ["Student Job", "IT Lab Assistant", "Campus Employment", "Tuition Credit"],
    keywords: ["student assistant", "assistantship", "it", "computer lab", "employment", "tuition discount", "cebu", "work study"]
  },
  {
    id: "CHED-TULONG-DUNONG-2024",
    title: "CHED Tulong Dunong Program (TDP-TES)",
    provider: "Commission on Higher Education (CHED) & UniFAST",
    type: "Educational Assistance",
    dept: "Higher Education Priority Disciplines",
    duration: "1 Year (Renewable)",
    funding: "₱15,000 / semester (₱30,000 / yr)",
    annualValue: 30000,
    deadline: "2026-10-15",
    deadlineFormatted: "Oct 15, 2026",
    deadlineDays: 60,
    status: "Active",
    matchScore: 90,
    minGpa: 80.0,
    eligible: true,
    eligibilityStatus: "Eligible",
    eligibilityNotes: "Eligible for Tertiary Education Subsidy",
    degreeRequired: "Undergraduate Student in SUC / LUC / HEI",
    citizenship: "Filipino Citizen",
    leadProf: "CHED Regional Office VII",
    teamCount: 3,
    icon: "account_balance",
    colorTheme: "amber",
    summary: "Government educational subsidy for underprivileged Filipino students enrolled in CHED-recognized higher education institutions to assist with educational living costs.",
    whyStrongMatch: [
      "Targeted for students facing financial constraints to cover books, daily allowances, and school supplies.",
      "Your 82% GPA easily meets the CHED Tulong Dunong threshold."
    ],
    requirements: [
      { id: "req-1", title: "Certificate of True Copy of Grades", desc: "Weighted average of 80% or equivalent.", status: "satisfied", note: "Satisfied: 82% GPA" },
      { id: "req-2", title: "Certificate of Registration", desc: "Certified enrollment in CHED-recognized program.", status: "satisfied", note: "Satisfied: B.S. IT" },
      { id: "req-3", title: "Income Tax Return or BIR Certificate of Exemption", desc: "Combined parental income not exceeding ₱400,000/yr.", status: "action", note: "Action: Submit BIR Certificate" }
    ],
    tags: ["CHED", "UniFAST", "Tulong Dunong", "Educational Grant", "National Aid"],
    keywords: ["ched", "unifast", "tulong dunong", "grant", "subsidy", "philippines", "allowance"]
  },
  {
    id: "DICT-DIGITALJOBS-2024",
    title: "DICT digitaljobsPH & Cloud Skills Certification Voucher",
    provider: "Department of Information and Communications Technology",
    type: "Training & Certification",
    dept: "Information Technology & Cloud Computing",
    duration: "3 - 6 Months Self-Paced",
    funding: "Free Full Certification Voucher (₱25,000 value)",
    annualValue: 25000,
    deadline: "2026-11-01",
    deadlineFormatted: "Nov 01, 2026",
    deadlineDays: 75,
    status: "Active",
    matchScore: 88,
    minGpa: 75.0,
    eligible: true,
    eligibilityStatus: "Eligible",
    eligibilityNotes: "Eligible (Free Industry IT Certification)",
    degreeRequired: "Filipino Youth & College Students",
    citizenship: "Filipino Citizen",
    leadProf: "DICT Regional Cluster - Visayas",
    teamCount: 5,
    icon: "terminal",
    colorTheme: "emerald",
    summary: "Free industry-recognized tech certification vouchers (AWS, Google Cloud, Python, Web Dev) sponsored by DICT to boost employment prospects for tech students.",
    whyStrongMatch: [
      "Directly complements your B.S. Information Technology coursework with zero out-of-pocket costs.",
      "Provides verified credentials that boost candidacy for campus and remote student jobs."
    ],
    requirements: [
      { id: "req-1", title: "Valid Student ID / Government ID", desc: "Proof of identity and student status.", status: "satisfied", note: "Satisfied" },
      { id: "req-2", title: "Online Readiness Assessment", desc: "Short 20-minute digital literacy check.", status: "action", note: "Action: Take 20-Min Quiz" }
    ],
    tags: ["DICT", "Free Certification", "IT Skills", "Cloud Computing", "DigitaljobsPH"],
    keywords: ["dict", "certification", "it", "free voucher", "technology", "python", "cloud", "cebu"]
  },
  {
    id: "DSWD-AICS-STUDENT-2024",
    title: "DSWD AICS Educational & Transport Assistance",
    provider: "Department of Social Welfare and Development (DSWD)",
    type: "Educational Assistance",
    dept: "Student Welfare & Emergency Aid",
    duration: "One-Time Outright Cash Aid (Renewable Annually)",
    funding: "₱5,000 - ₱10,000 Cash Grant",
    annualValue: 10000,
    deadline: "2026-12-15",
    deadlineFormatted: "Dec 15, 2026",
    deadlineDays: 120,
    status: "Active",
    matchScore: 84,
    minGpa: 75.0,
    eligible: true,
    eligibilityStatus: "Potentially Eligible",
    eligibilityNotes: "Potentially Eligible (Requires Social Worker Interview)",
    degreeRequired: "Enrolled in Tertiary Education",
    citizenship: "Filipino Citizen",
    leadProf: "DSWD Field Office VII",
    teamCount: 2,
    icon: "handshake",
    colorTheme: "violet",
    summary: "Assistance to Individuals in Crisis Situations (AICS) providing immediate cash grants for low-income students needing direct assistance for tuition and daily commuting fare.",
    whyStrongMatch: [
      "Directly addresses your urgent need for daily transportation expenses and school fees.",
      "Low GPA threshold (75% passing), focusing on financial need rather than academic rank."
    ],
    requirements: [
      { id: "req-1", title: "Certificate of Enrollment", desc: "Valid enrollment registration.", status: "satisfied", note: "Satisfied" },
      { id: "req-2", title: "Social Worker Assessment & Case Study", desc: "Interview with local DSWD or LGU social welfare desk.", status: "pending", note: "Pending: Schedule Interview" },
      { id: "req-3", title: "Valid Student ID & Barangay Certificate", desc: "Local community endorsement.", status: "action", note: "Action: Submit Barangay Certificate" }
    ],
    tags: ["DSWD", "AICS", "Cash Assistance", "Transportation Fare", "Emergency Aid"],
    keywords: ["dswd", "aics", "financial assistance", "transportation", "indigent", "crisis", "cash grant"]
  },
  {
    id: "DOST-SEI-MERIT-2024",
    title: "DOST-SEI S&T Undergraduate Merit Scholarship",
    provider: "Department of Science and Technology - SEI",
    type: "Scholarship",
    dept: "Priority STEM Disciplines (BS IT / CS)",
    duration: "4 Years (Full College)",
    funding: "₱480,000 / yr + Tuition + Allowance",
    annualValue: 480000,
    deadline: "2026-10-15",
    deadlineFormatted: "Oct 15, 2026",
    deadlineDays: 60,
    status: "Active",
    matchScore: 62,
    minGpa: 90.0, // High 90% GPA requirement
    eligible: false,
    eligibilityStatus: "Not Eligible",
    eligibilityNotes: "Unmet Requirement: Minimum GPA is 90% (Your GPA: 82%)",
    degreeRequired: "Top 5% of Class / Min 90% GPA",
    citizenship: "Natural-Born Filipino Citizen",
    leadProf: "Dr. Josette T. Biyo / SEI Director",
    teamCount: 4,
    icon: "biotech",
    colorTheme: "rose",
    summary: "Competitive national scholarship awarded to students with high aptitude in science and mathematics pursuing priority degree programs.",
    whyStrongMatch: [
      "Your B.S. Information Technology degree is an accredited DOST Priority STEM course.",
      "Filipino citizen studying in a recognized Philippine institution."
    ],
    gapAnalysis: {
      metCount: 3,
      totalCount: 4,
      gapSummary: "You meet 3 of 4 requirements. The program requires a minimum GPA of 90%, while your current GPA is 82%.",
      missingRequirement: "Academic GPA Standing (Min 90% Required)",
      alternativeCategories: ["Educational Assistance", "Student Employment", "Training & Certification"]
    },
    requirements: [
      { id: "req-1", title: "Academic GPA Standing (Min 90%)", desc: "Must maintain a minimum General Weighted Average of 90.0%.", status: "action", note: "Unmet: Your GPA is 82.0%" },
      { id: "req-2", title: "Enrolled in DOST Priority S&T Course", desc: "BS IT / Computer Science / Engineering.", status: "satisfied", note: "Satisfied: BS IT" },
      { id: "req-3", title: "Natural-Born Filipino Citizen", desc: "PSA Birth Certificate verified.", status: "satisfied", note: "Satisfied" },
      { id: "req-4", title: "Good Moral Character", desc: "Certificate of good moral standing from dean.", status: "satisfied", note: "Satisfied" }
    ],
    tags: ["DOST-SEI", "Merit Scholarship", "High GPA", "STEM Priority"],
    keywords: ["dost", "merit", "scholarship", "stem", "it", "computer science", "philippines"]
  },
  {
    id: "LANDBANK-STUDENT-LOAN-2024",
    title: "UniFAST & Landbank I-RESCUE Student Loan Program",
    provider: "Land Bank of the Philippines & CHED UniFAST",
    type: "Student Loan",
    dept: "Higher Education Tuition Financing",
    duration: "Flexible Repayment (Up to 5 years post-grad)",
    funding: "Up to ₱150,000 / yr (Low 5% Interest)",
    annualValue: 150000,
    deadline: "2026-11-30",
    deadlineFormatted: "Nov 30, 2026",
    deadlineDays: 105,
    status: "Active",
    matchScore: 78,
    minGpa: 75.0,
    eligible: true,
    eligibilityStatus: "Potentially Eligible",
    eligibilityNotes: "Potentially Eligible (Requires Co-Maker / Parent Guarantor)",
    degreeRequired: "Undergraduate or Vocational Student",
    citizenship: "Filipino Citizen",
    leadProf: "UniFAST Secretariat",
    teamCount: 2,
    icon: "payments",
    colorTheme: "amber",
    summary: "Government-backed soft student loan program designed to cover unpaid tuition, laptops, and educational devices with grace periods until after graduation.",
    whyStrongMatch: [
      "Enables students facing mid-semester tuition blockages to clear balances.",
      "75% passing grade requirement is met by your 82% standing."
    ],
    requirements: [
      { id: "req-1", title: "Certificate of Assessment / Tuition Bill", desc: "Official school statement of account.", status: "action", note: "Action: Submit Assessment Bill" },
      { id: "req-2", title: "Co-Maker / Parent Guarantor", desc: "Employed or barangay-certified guarantor.", status: "pending", note: "Pending: Co-Maker Sign" }
    ],
    tags: ["Student Loan", "Landbank", "UniFAST", "Tuition Bridge", "Low Interest"],
    keywords: ["loan", "landbank", "unifast", "tuition", "financing", "student loan"]
  },
  {
    id: "DOST-ASTHRDP-GRAD-2024",
    title: "DOST-SEI ASTHRDP Graduate Research Scholarship",
    provider: "DOST-SEI Graduate Consortium",
    type: "Scholarship",
    dept: "Advanced IT & AI Systems",
    duration: "2 Years",
    funding: "₱480,000 / yr + Tuition",
    annualValue: 480000,
    deadline: "2026-08-01",
    deadlineFormatted: "Aug 01, 2026",
    deadlineDays: -13,
    status: "Expired",
    matchScore: 50,
    minGpa: 88.0,
    eligible: false,
    eligibilityStatus: "Not Eligible",
    eligibilityNotes: "Past deadline & Requires Graduate (M.S.) standing",
    degreeRequired: "M.S. STEM Enrolled",
    citizenship: "Filipino Citizen",
    leadProf: "Dr. Jaime C. Montoya",
    teamCount: 4,
    icon: "school",
    colorTheme: "rose",
    summary: "Graduate fellowship for Master's and Ph.D. students conducting advanced technological and scientific research.",
    whyStrongMatch: ["Requires graduate enrollment (M.S./Ph.D.). Shown for historical registry reference."],
    requirements: [],
    tags: ["DOST-SEI", "Graduate Only", "Expired"],
    keywords: ["dost", "graduate", "master", "phd"]
  }
];

// Quick-suggestion profile tags for AI Matcher (Multi-Select)
const MATCHER_PROFILE_TAGS = [
  { id: "college-student", label: "College Student", icon: "school" },
  { id: "it-student", label: "IT / Computing Major", icon: "terminal" },
  { id: "cebu-resident", label: "Cebu / Region VII", icon: "location_city" },
  { id: "working-student", label: "Working Student", icon: "work_history" },
  { id: "scholarship", label: "Looking for Scholarship", icon: "workspace_premium" },
  { id: "financial-aid", label: "Tuition / Cash Grant", icon: "payments" },
  { id: "assistantship", label: "Campus Assistantship", icon: "laptop_chromebook" },
  { id: "certification", label: "Free Tech Certification", icon: "model_training" },
  { id: "low-income", label: "Low-Income Household", icon: "home" }
];

// User Profiles: Calibrated for Maria (Cebu, 20yo, 2nd-year IT, 82% GPA)
const USER_PROFILES = {
  student: {
    name: "Maria Clara Santos",
    role: "student",
    title: "2nd-Year B.S. Information Technology Student",
    email: "maria.santos@student.cebu.edu.ph",
    avatar: "MS",
    badge: "Student • Cebu",
    location: "Cebu City, Region VII",
    educationLevel: "Undergraduate (2nd Year College)",
    course: "B.S. Information Technology",
    gpa: 82.0,
    gpaFormatted: "82.0% GPA (Good Standing)",
    incomeBracket: "Limited Family Income (< ₱250k/yr)",
    needs: "Tuition Assistance & Daily Transportation Allowance",
    department: "College of Computer Studies • Cebu City",
    institution: "Cebu Technological University / SUC",
    profileStrength: 88,
    skills: ["Basic Web Dev (HTML/JS)", "Python Fundamentals", "Computer Lab Support", "Database Administration (MySQL)"],
    interests: ["Software Engineering", "Campus IT Support", "Digital Certification", "Community Technology"],
    bio: "20-year-old 2nd-year IT student in Cebu seeking financial aid, scholarships, or campus assistantships to support tuition and daily commuting expenses."
  },
  admin: {
    name: "Dr. Ernesto Ramos",
    role: "admin",
    title: "Director of Scholarships & Grants (DOST / CHED Liaison)",
    email: "ernesto.ramos@ched.gov.ph",
    avatar: "ER",
    badge: "Admin • Workstation",
    location: "National Capital Region / Central Visayas",
    educationLevel: "Ph.D. Computer Science",
    course: "Higher Education Administration",
    gpa: 95.0,
    gpaFormatted: "Ph.D. Evaluator",
    incomeBracket: "Agency Administrator",
    needs: "Program Administration",
    department: "Office of Student Financial Assistance (OSFA)",
    institution: "DOST & CHED Higher Education Network",
    profileStrength: 100,
    skills: ["Grant Administration", "CHED TDP-TES Validation", "DOST Priority Screening", "LGU Partnership"],
    interests: ["National Scholarship Expansion", "Indigent Student Aid", "Work-Study Policies"],
    bio: "Lead program coordinator overseeing national higher education subsidies, student employment frameworks, and LGU scholarship accreditation."
  }
};

const AppState = {
  currentUser: { ...USER_PROFILES.student },
  currentView: "dashboard",
  selectedOpportunityId: "CEBU-LGU-SCHOLARSHIP-2024",
  matcherDocuments: [],
  matcherProfileTags: [],
  opportunities: [...INITIAL_OPPORTUNITIES],
  savedOpportunities: ["CEBU-LGU-SCHOLARSHIP-2024", "CIT-STUDENT-ASSISTANT-2024", "CHED-TULONG-DUNONG-2024"],
  activeFilters: {
    types: ["Scholarship", "Educational Assistance", "Student Employment", "Training & Certification"],
    matchQuality: ["high", "good"],
    searchQuery: "",
    savedOnly: false
  },
  adminFilter: {
    search: "",
    status: "All",
    type: "All"
  },
  editingProgramId: null
};

// LocalStorage Hydration
function loadSavedState() {
  try {
    const savedOpps = localStorage.getItem("qualifind_opps_v2");
    if (savedOpps) AppState.opportunities = JSON.parse(savedOpps);
    
    const savedBookmarks = localStorage.getItem("qualifind_saved_v2");
    if (savedBookmarks) AppState.savedOpportunities = JSON.parse(savedBookmarks);

    const savedUser = localStorage.getItem("qualifind_user_v2");
    if (savedUser) AppState.currentUser = JSON.parse(savedUser);
  } catch (e) {
    console.warn("LocalStorage load error:", e);
  }
}

function saveState() {
  try {
    localStorage.setItem("qualifind_opps_v2", JSON.stringify(AppState.opportunities));
    localStorage.setItem("qualifind_saved_v2", JSON.stringify(AppState.savedOpportunities));
    localStorage.setItem("qualifind_user_v2", JSON.stringify(AppState.currentUser));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }
}

const STUDENT_VIEWS = ["dashboard", "matcher", "opportunities", "saved-applications", "eligibility", "action-plan", "profile"];
const ADMIN_VIEWS = ["admin-dashboard", "admin-programs", "admin-profile"];

function handleBrandClick() {
  if (AppState.currentView === "login") return;
  if (AppState.currentUser.role === "admin") {
    navigateTo("admin-dashboard");
  } else {
    navigateTo("dashboard");
  }
}

// Router & View Switcher
function navigateTo(viewId, payload = null) {
  const currentRole = AppState.currentUser.role || "student";

  // Strict Role Guard (unless navigating to login)
  if (viewId !== "login") {
    if (currentRole === "student" && ADMIN_VIEWS.includes(viewId)) {
      showToast("Access Restricted: Admin privileges required.", "warning");
      viewId = "dashboard";
    } else if (currentRole === "admin" && STUDENT_VIEWS.includes(viewId)) {
      showToast("Access Restricted: Switch to Student profile to view opportunity seeker views.", "warning");
      viewId = "admin-dashboard";
    }
  }

  AppState.currentView = viewId;
  if (payload && payload.opportunityId) {
    AppState.selectedOpportunityId = payload.opportunityId;
  }
  if (payload && payload.filterSaved) {
    AppState.activeFilters.savedOnly = true;
  }

  window.location.hash = viewId;

  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  const targetSection = document.getElementById(`view-${viewId}`);
  if (targetSection) {
    targetSection.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll("[data-nav-view]").forEach(link => {
    const linkView = link.getAttribute("data-nav-view");
    if (linkView === viewId) {
      link.className = "flex items-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all group bg-gradient-to-r from-primary to-secondary text-white shadow-button";
    } else {
      link.className = "flex items-center px-4 py-2.5 rounded-xl text-text-muted hover:text-text-main hover:bg-surface-subtle transition-all font-semibold text-sm";
    }
  });

  renderCurrentView();
}

function updateLayoutForView(viewId) {
  const sidebar = document.getElementById("app-sidebar") || document.querySelector("aside");
  const header = document.getElementById("app-header") || document.querySelector("header");
  const mainWrapper = document.getElementById("main-layout-wrapper");
  const mainEl = document.querySelector("main");

  if (viewId === "login") {
    if (sidebar) {
      sidebar.style.display = "none";
      sidebar.classList.remove("lg:flex");
      sidebar.classList.add("hidden");
    }
    if (header) {
      header.style.display = "none";
      header.classList.add("hidden");
    }
    if (mainWrapper) {
      mainWrapper.classList.remove("lg:pl-72");
      mainWrapper.classList.add("lg:pl-0");
    }
    if (mainEl) {
      mainEl.classList.remove("pt-20");
      mainEl.classList.add("pt-0");
    }
  } else {
    if (sidebar) {
      sidebar.style.display = "";
      sidebar.classList.remove("hidden");
      sidebar.classList.add("lg:flex");
    }
    if (header) {
      header.style.display = "";
      header.classList.remove("hidden");
    }
    if (mainWrapper) {
      mainWrapper.classList.add("lg:pl-72");
      mainWrapper.classList.remove("lg:pl-0");
    }
    if (mainEl) {
      mainEl.classList.add("pt-20");
      mainEl.classList.remove("pt-0");
    }
  }
}

function renderCurrentView() {
  switch (AppState.currentView) {
    case "login":
      renderLogin();
      break;
    case "dashboard":
      renderDashboard();
      break;
    case "matcher":
      renderMatcher();
      break;
    case "opportunities":
      renderOpportunitiesList();
      break;
    case "saved-applications":
      renderSavedApplicationsView();
      break;
    case "eligibility":
      renderEligibilityDetails(AppState.selectedOpportunityId);
      break;
    case "action-plan":
      renderActionPlan(AppState.selectedOpportunityId);
      break;
    case "profile":
      renderProfile();
      break;
    case "admin-dashboard":
      renderAdminDashboard();
      break;
    case "admin-programs":
      renderAdminPrograms();
      break;
    default:
      renderDashboard();
  }
  updateLayoutForView(AppState.currentView);
  updateGlobalBadges();
}

// Dark Mode Toggle
function initTheme() {
  updateThemeToggleUI(document.documentElement.classList.contains("dark"));
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("qualifind_theme", isDark ? "dark" : "light");
  } catch (e) {
    console.warn("LocalStorage theme save error:", e);
  }
  updateThemeToggleUI(isDark);
}

function updateThemeToggleUI(isDark) {
  const icon = document.getElementById("theme-toggle-icon");
  if (icon) icon.textContent = isDark ? "light_mode" : "dark_mode";
}

// Toast System (Corporate Trust Floating Pill)
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  if (type === "success") {
    toastIcon.textContent = "check_circle";
    toastIcon.className = "material-symbols-outlined text-emerald-600 text-[20px]";
  } else if (type === "warning") {
    toastIcon.textContent = "warning";
    toastIcon.className = "material-symbols-outlined text-amber-500 text-[20px]";
  } else {
    toastIcon.textContent = "info";
    toastIcon.className = "material-symbols-outlined text-primary text-[20px]";
  }

  toast.classList.remove("translate-y-20", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0", "pointer-events-none");
    toast.classList.remove("translate-y-0", "opacity-100");
  }, 3200);
}

// Bookmark Action Toggle
function toggleBookmark(oppId, event) {
  if (event) event.stopPropagation();
  const idx = AppState.savedOpportunities.indexOf(oppId);
  if (idx > -1) {
    AppState.savedOpportunities.splice(idx, 1);
    showToast("Removed program from saved drafts", "info");
  } else {
    AppState.savedOpportunities.push(oppId);
    showToast("Saved program to your drafts!");
  }
  saveState();
  renderCurrentView();
}

// Natural Language AI Match Calculation Engine
function calculateMatchForPrompt(userPrompt) {
  const query = userPrompt.toLowerCase();
  const keywords = query.split(/\s+/).filter(w => w.length > 2);
  
  const results = AppState.opportunities.map(opp => {
    let score = 55;
    
    const allKeywords = (opp.keywords || []).concat([
      opp.title.toLowerCase(),
      opp.dept.toLowerCase(),
      opp.type.toLowerCase(),
      opp.provider.toLowerCase()
    ]);

    let matchedKeywordsCount = 0;
    keywords.forEach(kw => {
      if (allKeywords.some(ak => ak.includes(kw) || kw.includes(ak))) {
        matchedKeywordsCount++;
      }
    });

    score += Math.min(35, matchedKeywordsCount * 10);

    // Academic threshold check (Percentage scale: Maria has 82%)
    if (AppState.currentUser.gpa >= (opp.minGpa || 75.0)) {
      score += 10;
    } else {
      score -= 25;
    }

    // Location boost (Cebu Region VII)
    if (query.includes("cebu") && (opp.tags || []).some(t => t.toLowerCase().includes("cebu"))) {
      score += 10;
    }

    score = Math.min(98, Math.max(35, score));

    return {
      ...opp,
      calculatedScore: score
    };
  });

  results.sort((a, b) => b.calculatedScore - a.calculatedScore);
  return results;
}

// Render Dashboard View
function renderDashboard() {
  const foundCount = AppState.opportunities.filter(o => o.status === "Active").length;
  const strongCount = AppState.opportunities.filter(o => o.status === "Active" && o.matchScore >= 80).length;
  const potentialCount = AppState.opportunities.filter(o => o.status === "Active" && o.matchScore >= 60 && o.matchScore < 80).length;
  const savedCount = AppState.savedOpportunities.length;

  const foundEl = document.getElementById("dash-stat-found");
  if (foundEl) foundEl.textContent = foundCount;

  const strongEl = document.getElementById("dash-stat-strong");
  if (strongEl) strongEl.textContent = strongCount;

  const totalEl = document.getElementById("dash-stat-total");
  if (totalEl) totalEl.textContent = foundCount;

  const potEl = document.getElementById("dash-stat-potential");
  if (potEl) potEl.textContent = potentialCount;

  const savedEl = document.getElementById("dash-stat-saved");
  if (savedEl) savedEl.textContent = savedCount;

  const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' };
  const todayStr = new Date().toLocaleDateString('en-US', dateOptions);
  const dateEl = document.getElementById("dash-current-date");
  if (dateEl) dateEl.textContent = todayStr;

  // Closing-soonest deadline callout
  const deadlineCard = document.getElementById("dash-next-deadline-card");
  const deadlineTitle = document.getElementById("dash-next-deadline-title");
  const deadlineDays = document.getElementById("dash-next-deadline-days");
  if (deadlineCard && deadlineTitle && deadlineDays) {
    const soonest = AppState.opportunities
      .filter(o => o.status === "Active" && o.deadlineDays >= 0)
      .sort((a, b) => a.deadlineDays - b.deadlineDays)[0];

    if (soonest) {
      deadlineTitle.textContent = soonest.title;
      deadlineDays.textContent = soonest.deadlineDays === 0 ? "Closes today" : `${soonest.deadlineDays} day${soonest.deadlineDays === 1 ? "" : "s"} left`;
      deadlineCard.onclick = () => navigateTo("eligibility", { opportunityId: soonest.id });
    } else {
      deadlineTitle.textContent = "No upcoming deadlines";
      deadlineDays.textContent = "—";
      deadlineCard.onclick = null;
    }
  }

  const strengthEl = document.getElementById("dash-profile-strength-num");
  if (strengthEl) strengthEl.textContent = `${AppState.currentUser.profileStrength}%`;
  
  const circleEl = document.getElementById("dash-profile-strength-circle");
  if (circleEl) {
    circleEl.style.strokeDasharray = `${AppState.currentUser.profileStrength}, 100`;
  }

  // Recommended cards container
  const recContainer = document.getElementById("dash-recommended-list");
  if (!recContainer) return;

  const topMatches = AppState.opportunities
    .filter(o => o.status === "Active")
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  recContainer.innerHTML = topMatches.map(opp => {
    const isSaved = AppState.savedOpportunities.includes(opp.id);
    const scoreColorClass = opp.matchScore >= 80 ? "text-emerald-600" : (opp.matchScore >= 60 ? "text-amber-500" : "text-text-muted");
    
    // Corporate Badge Class
    let badgeClass = "badge-indigo";
    if (opp.type === "Educational Assistance") badgeClass = "badge-violet";
    if (opp.type === "Student Employment") badgeClass = "badge-emerald";
    if (opp.type === "Training & Certification") badgeClass = "badge-indigo";

    return `
      <div class="p-6 hover:bg-surface-subtle/70 transition-all group flex flex-col lg:flex-row gap-6 items-start justify-between relative cursor-pointer" onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })">
        <div class="flex items-start gap-4 flex-1 min-w-0">
          <div class="w-12 h-12 rounded-xl bg-surface border border-border shadow-colored-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-primary">
            <span class="material-symbols-outlined text-[24px]">${opp.icon || 'school'}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="badge-trust ${badgeClass} text-[10px]">${opp.type}</span>
              <span class="text-xs font-medium text-text-muted">${opp.duration} &bull; ${opp.funding}</span>
            </div>
            <h3 class="text-base font-bold text-text-main truncate group-hover:text-primary transition-colors">
              ${opp.title}
            </h3>
            <p class="text-xs text-text-muted line-clamp-2 mt-1 max-w-2xl font-normal leading-relaxed">
              ${opp.summary}
            </p>
          </div>
        </div>

        <div class="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 mt-2 lg:mt-0" onclick="event.stopPropagation()">
          <div class="flex flex-col items-start lg:items-end">
            <span class="text-[10px] font-bold text-text-muted uppercase tracking-wider">AI Match</span>
            <span class="text-2xl font-extrabold ${scoreColorClass}">${opp.matchScore}%</span>
          </div>
          <div class="flex gap-2">
            <button class="w-8 h-8 rounded-lg bg-surface hover:bg-surface-subtle border border-border flex items-center justify-center text-text-muted transition-colors shadow-colored-sm" onclick="toggleBookmark('${opp.id}', event)">
              <span class="material-symbols-outlined text-[18px] ${isSaved ? 'fill text-primary' : ''}">bookmark</span>
            </button>
            <button class="btn-primary btn-primary-sm text-xs" onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })">
              Review Match
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Render AI Matcher Screen & Quick Profile Chips
function renderMatcher() {
  renderMatcherProfileChips();

  const chips = document.querySelectorAll("#matcher-chips button");
  const textarea = document.getElementById("ai-prompt-input");

  chips.forEach(chip => {
    chip.onclick = () => {
      if (textarea) {
        textarea.value = chip.getAttribute("data-prompt") || chip.textContent.trim();
        textarea.focus();
        chip.style.transform = "scale(0.98)";
        setTimeout(() => chip.style.transform = "scale(1)", 120);
      }
    };
  });

  renderMatcherDocChips();
}

function renderMatcherProfileChips() {
  const container = document.getElementById("matcher-profile-chips");
  if (!container) return;

  container.innerHTML = MATCHER_PROFILE_TAGS.map(tag => {
    const isSelected = AppState.matcherProfileTags.includes(tag.id);
    const badgeStyle = isSelected ? "bg-primary text-white border-primary shadow-colored-sm scale-105" : "bg-surface text-text-main border-border hover:bg-surface-subtle";

    return `
      <button type="button" onclick="toggleMatcherTag('${tag.id}')" class="badge-trust ${badgeStyle} cursor-pointer transition-all flex items-center gap-1.5 py-1.5 px-3 text-xs border">
        <span class="material-symbols-outlined text-[16px]">${tag.icon}</span>
        <span>${tag.label}</span>
        ${isSelected ? '<span class="material-symbols-outlined text-[14px]">check</span>' : ''}
      </button>
    `;
  }).join("");
}

function toggleMatcherTag(tagId) {
  const idx = AppState.matcherProfileTags.indexOf(tagId);
  if (idx > -1) {
    AppState.matcherProfileTags.splice(idx, 1);
  } else {
    AppState.matcherProfileTags.push(tagId);
  }
  renderMatcherProfileChips();
}

function buildMatcherPrompt() {
  const textarea = document.getElementById("ai-prompt-input");
  const freeText = textarea ? textarea.value.trim() : "";
  const tagLabels = AppState.matcherProfileTags
    .map(tid => MATCHER_PROFILE_TAGS.find(t => t.id === tid)?.label)
    .filter(Boolean);

  if (tagLabels.length > 0 && freeText) {
    return `${tagLabels.join(", ")}. Additional details: ${freeText}`;
  } else if (tagLabels.length > 0) {
    return tagLabels.join(", ");
  }
  return freeText;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function handleDocumentSelect(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  files.forEach(f => {
    AppState.matcherDocuments.push({ name: f.name, sizeLabel: formatFileSize(f.size) });
  });
  event.target.value = "";

  renderMatcherDocChips();
  showToast(`Attached ${files.length} document${files.length > 1 ? "s" : ""} for AI context.`, "info");
}

function removeMatcherDocument(idx) {
  AppState.matcherDocuments.splice(idx, 1);
  renderMatcherDocChips();
}

function renderMatcherDocChips() {
  const container = document.getElementById("matcher-doc-chips");
  if (!container) return;

  if (AppState.matcherDocuments.length === 0) {
    container.classList.add("hidden");
    container.classList.remove("flex");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("hidden");
  container.classList.add("flex");
  container.innerHTML = AppState.matcherDocuments.map((doc, idx) => `
    <span class="badge-trust badge-indigo text-xs py-1 px-3">
      <span class="material-symbols-outlined text-[16px]">description</span>
      ${doc.name}
      <span class="text-text-muted text-[10px]">(${doc.sizeLabel})</span>
      <button type="button" onclick="removeMatcherDocument(${idx})" class="hover:text-error text-[16px] leading-none font-bold ml-1">&times;</button>
    </span>
  `).join("");
}

const MATCHER_LOADING_STEPS = [
  "Parsing Maria's 2nd-Year IT standing & 82% GPA...",
  "Evaluating Cebu Region VII municipal & institutional aid...",
  "Screening tuition assistance, assistantships & certification grants...",
  "Ranking personalized opportunities..."
];

function handleFindMatches() {
  const promptText = buildMatcherPrompt();

  if (!promptText) {
    showToast("Please enter your situation or select quick tags.", "warning");
    return;
  }

  const textarea = document.getElementById("ai-prompt-input");
  const matchBtn = document.getElementById("btn-find-matches");
  const statusEl = document.getElementById("matcher-loading-status");

  if (matchBtn) matchBtn.disabled = true;
  if (textarea) textarea.disabled = true;
  if (statusEl) statusEl.classList.remove("hidden");

  let step = 0;
  const setStep = () => {
    if (matchBtn) {
      matchBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[16px]">sync</span> Analyzing...`;
    }
    if (statusEl) {
      statusEl.textContent = MATCHER_LOADING_STEPS[step];
    }
    step++;
  };
  setStep();
  const stepInterval = setInterval(() => {
    if (step < MATCHER_LOADING_STEPS.length) {
      setStep();
    } else {
      clearInterval(stepInterval);
    }
  }, 380);

  setTimeout(() => {
    clearInterval(stepInterval);

    if (matchBtn) {
      matchBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">auto_awesome</span> Find Assistance`;
      matchBtn.disabled = false;
    }
    if (textarea) textarea.disabled = false;
    if (statusEl) statusEl.classList.add("hidden");

    const scored = calculateMatchForPrompt(promptText);

    AppState.opportunities.forEach(opp => {
      const match = scored.find(s => s.id === opp.id);
      if (match) {
        opp.matchScore = match.calculatedScore;
      }
    });

    AppState.opportunities.sort((a, b) => b.matchScore - a.matchScore);

    AppState.activeFilters.searchQuery = "";
    const filterInput = document.getElementById("search-opportunities-input");
    if (filterInput) filterInput.value = "";

    AppState.activeFilters.matchQuality = ["high", "good"];
    document.querySelectorAll(".filter-match-checkbox").forEach(cb => cb.checked = true);

    navigateTo("opportunities");
    showToast(`QualiFind AI Match Complete: Ranked ${scored.length} student assistance programs!`);
  }, 1600);
}

// Render Opportunities Catalog View
function renderOpportunitiesList() {
  const container = document.getElementById("opportunities-grid");
  const countEl = document.getElementById("opp-count-badge");
  if (!container) return;

  let filtered = AppState.opportunities.filter(opp => {
    if (AppState.activeFilters.savedOnly && !AppState.savedOpportunities.includes(opp.id)) {
      return false;
    }

    if (AppState.activeFilters.types.length > 0 && !AppState.activeFilters.types.includes(opp.type)) {
      return false;
    }

    const isHigh = opp.matchScore >= 80;
    const isGood = opp.matchScore >= 60 && opp.matchScore < 80;
    const isLow = opp.matchScore < 60;

    const allowsHigh = AppState.activeFilters.matchQuality.includes("high");
    const allowsGood = AppState.activeFilters.matchQuality.includes("good");
    const allowsLow = AppState.activeFilters.matchQuality.includes("low");

    if (isHigh && !allowsHigh) return false;
    if (isGood && !allowsGood) return false;
    if (isLow && !allowsLow) return false;

    if (AppState.activeFilters.searchQuery) {
      const q = AppState.activeFilters.searchQuery.toLowerCase();
      const match = opp.title.toLowerCase().includes(q) ||
                    opp.provider.toLowerCase().includes(q) ||
                    opp.dept.toLowerCase().includes(q) ||
                    (opp.keywords || []).some(k => k.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-12 card-elevated p-12 text-center flex flex-col items-center justify-center">
        <span class="material-symbols-outlined text-5xl text-text-muted mb-4">search_off</span>
        <h3 class="text-lg font-bold text-text-main mb-1">No programs match your filters</h3>
        <p class="text-xs text-text-muted max-w-md mb-6">Try broadening your search or resetting category filters.</p>
        <button class="btn-primary" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(opp => {
    const isSaved = AppState.savedOpportunities.includes(opp.id);
    const scoreColor = opp.matchScore >= 80 ? "text-emerald-600" : (opp.matchScore >= 60 ? "text-amber-500" : "text-text-muted");
    
    // 3-Tier Status Badge (Eligible / Potentially Eligible / Not Eligible)
    let statusBadge = `<span class="badge-trust badge-emerald text-[9px]"><span class="material-symbols-outlined text-[13px]">check_circle</span> Eligible</span>`;
    if (opp.eligibilityStatus === "Potentially Eligible") {
      statusBadge = `<span class="badge-trust badge-amber text-[9px]"><span class="material-symbols-outlined text-[13px]">pending</span> Potentially Eligible</span>`;
    } else if (opp.eligibilityStatus === "Not Eligible" || !opp.eligible) {
      statusBadge = `<span class="badge-trust badge-rose text-[9px]"><span class="material-symbols-outlined text-[13px]">cancel</span> Not Eligible</span>`;
    }

    let typeBadge = "badge-indigo";
    if (opp.type === "Educational Assistance") typeBadge = "badge-violet";
    if (opp.type === "Student Employment") typeBadge = "badge-emerald";
    if (opp.type === "Training & Certification") typeBadge = "badge-indigo";

    return `
      <div class="card-elevated p-6 flex flex-col justify-between group cursor-pointer" onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })">
        <div>
          <div class="flex justify-between items-start mb-3">
            <span class="badge-trust ${typeBadge} text-[10px]">
              ${opp.type}
            </span>
            <button class="w-8 h-8 rounded-lg bg-surface-subtle hover:bg-primary-light border border-border flex items-center justify-center text-text-muted hover:text-primary transition-colors shadow-colored-sm" onclick="toggleBookmark('${opp.id}', event)">
              <span class="material-symbols-outlined text-[16px] ${isSaved ? 'fill text-primary' : ''}">bookmark</span>
            </button>
          </div>

          <h3 class="text-base font-bold text-text-main mb-1 group-hover:text-primary transition-colors">
            ${opp.title}
          </h3>
          <p class="text-xs text-text-muted mb-4 font-normal">${opp.provider}</p>

          <div class="grid grid-cols-2 gap-3 p-3 bg-surface-subtle rounded-xl border border-border/80 mb-4">
            <div>
              <span class="text-[10px] font-bold text-text-muted uppercase">Stipend / Value</span>
              <p class="text-xs font-bold text-text-main mt-0.5">${opp.funding}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-text-muted uppercase">Deadline</span>
              <p class="text-xs font-bold text-text-main mt-0.5">${opp.deadlineFormatted}</p>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-border flex items-center justify-between">
          <div class="flex items-center gap-2">
            ${statusBadge}
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[10px] font-bold text-text-muted uppercase">Score</span>
            <span class="text-sm font-extrabold ${scoreColor}">${opp.matchScore}%</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function toggleSavedOnlyFilter(isSavedOnly) {
  AppState.activeFilters.savedOnly = isSavedOnly;
  renderOpportunitiesList();
}

function toggleFilterDrawer(forceState) {
  const panel = document.getElementById("filter-drawer-panel");
  if (!panel) return;

  const isHidden = panel.classList.contains("hidden");
  const shouldShow = forceState !== undefined ? forceState : isHidden;

  if (shouldShow) {
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
}

// Render Dedicated Saved Applications View Page
function renderSavedApplicationsView() {
  const container = document.getElementById("saved-applications-list");
  if (!container) return;

  const savedList = AppState.opportunities.filter(opp => AppState.savedOpportunities.includes(opp.id));

  if (savedList.length === 0) {
    container.innerHTML = `
      <div class="col-span-12 card-elevated p-12 text-center flex flex-col items-center justify-center">
        <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-3xl">bookmark_border</span>
        </div>
        <h3 class="text-lg font-bold text-text-main mb-1">No Saved Applications Yet</h3>
        <p class="text-xs text-text-muted max-w-md mb-6">Explore scholarships, LGU assistance, and campus assistantships, and bookmark them for fast access.</p>
        <button onclick="navigateTo('opportunities')" class="btn-primary">
          <span class="material-symbols-outlined text-[16px]">search_insights</span> Explore Opportunities
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = savedList.map(opp => {
    const scoreColor = opp.matchScore >= 80 ? "text-emerald-600" : (opp.matchScore >= 60 ? "text-amber-500" : "text-text-muted");

    return `
      <div class="card-elevated p-6 flex flex-col justify-between group">
        <div>
          <div class="flex justify-between items-start mb-3">
            <span class="badge-trust badge-indigo text-[10px]">
              ${opp.type}
            </span>
            <button class="w-8 h-8 rounded-lg bg-surface-subtle hover:bg-rose-50 border border-border flex items-center justify-center text-primary hover:text-error transition-colors shadow-colored-sm" title="Remove from saved" onclick="toggleBookmark('${opp.id}', event)">
              <span class="material-symbols-outlined text-[16px] fill">bookmark</span>
            </button>
          </div>

          <h3 class="text-base font-bold text-text-main mb-1 group-hover:text-primary transition-colors">
            ${opp.title}
          </h3>
          <p class="text-xs text-text-muted mb-4 font-normal">${opp.provider}</p>

          <div class="p-3 bg-surface-subtle rounded-xl border border-border flex items-center justify-between mb-4">
            <div>
              <span class="text-[10px] font-bold text-text-muted uppercase block">Value</span>
              <span class="text-xs font-bold text-text-main">${opp.funding}</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-text-muted uppercase block">AI Match</span>
              <span class="text-sm font-extrabold ${scoreColor}">${opp.matchScore}%</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-border">
          <button onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })" class="btn-primary btn-primary-sm text-xs flex-1">
            Review Match
          </button>
          <button onclick="navigateTo('action-plan', { opportunityId: '${opp.id}' })" class="btn-secondary btn-primary-sm text-xs flex-1">
            Action Plan
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function resetFilters() {
  AppState.activeFilters = {
    types: ["Scholarship", "Educational Assistance", "Student Employment", "Training & Certification"],
    matchQuality: ["high", "good", "low"],
    searchQuery: "",
    savedOnly: false
  };
  
  const searchInput = document.getElementById("search-opportunities-input");
  if (searchInput) searchInput.value = "";
  
  const savedCb = document.getElementById("filter-saved-only-checkbox");
  if (savedCb) savedCb.checked = false;

  renderOpportunitiesList();
}

// Render Eligibility Detail View with 3-Tier Status, Gap Diagnosis, & Alternatives
function renderEligibilityDetails(oppId) {
  const opp = AppState.opportunities.find(o => o.id === oppId);
  const notFoundEl = document.getElementById("eligibility-not-found");
  const contentEl = document.getElementById("eligibility-content");

  if (!opp) {
    if (notFoundEl) notFoundEl.classList.remove("hidden");
    if (contentEl) contentEl.classList.add("hidden");
    return;
  }
  if (notFoundEl) notFoundEl.classList.add("hidden");
  if (contentEl) contentEl.classList.remove("hidden");

  document.getElementById("eligibility-title").textContent = opp.title;
  document.getElementById("eligibility-provider").textContent = opp.provider;
  document.getElementById("eligibility-summary").textContent = opp.summary;
  document.getElementById("eligibility-score").textContent = `${opp.matchScore}%`;
  document.getElementById("eligibility-funding").textContent = opp.funding;
  document.getElementById("eligibility-deadline").textContent = opp.deadlineFormatted;

  const statusBadge = document.getElementById("eligibility-status-badge");
  const statusIcon = document.getElementById("eligibility-status-icon");
  
  // 3-Tier Status Setting
  if (statusBadge && statusIcon) {
    if (opp.eligibilityStatus === "Eligible") {
      statusBadge.textContent = "Status: Eligible (Requirements Met)";
      statusBadge.className = "badge-trust badge-emerald text-xs";
      statusIcon.textContent = "check_circle";
      statusIcon.className = "material-symbols-outlined text-2xl text-emerald-600";
    } else if (opp.eligibilityStatus === "Potentially Eligible") {
      statusBadge.textContent = "Status: Potentially Eligible (Verification Needed)";
      statusBadge.className = "badge-trust badge-amber text-xs";
      statusIcon.textContent = "pending";
      statusIcon.className = "material-symbols-outlined text-2xl text-amber-500";
    } else {
      statusBadge.textContent = "Status: Not Eligible (Unmet Requirement)";
      statusBadge.className = "badge-trust badge-rose text-xs";
      statusIcon.textContent = "cancel";
      statusIcon.className = "material-symbols-outlined text-2xl text-rose-500";
    }
  }

  // Requirement & Gap Identification Cards
  const reasonsContainer = document.getElementById("eligibility-reasons-grid");
  if (reasonsContainer) {
    const reasons = [];

    if (opp.gapAnalysis) {
      reasons.push({
        title: "Requirement Gap Identified",
        text: opp.gapAnalysis.gapSummary,
        ok: false
      });
    } else {
      reasons.push({
        title: "Academic Standing Match",
        text: `Your current GPA of ${AppState.currentUser.gpa.toFixed(1)}% satisfies the program requirement (minimum ${opp.minGpa || 75}%).`,
        ok: true
      });
    }

    (opp.whyStrongMatch || []).forEach(r => {
      reasons.push({ title: "Profile Alignment", text: r, ok: true });
    });

    reasonsContainer.innerHTML = reasons.map(r => `
      <div class="card-elevated p-5 bg-surface flex flex-col justify-between">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-7 h-7 rounded-lg ${r.ok ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[16px]">${r.ok ? 'check' : 'warning'}</span>
          </div>
          <h3 class="text-xs font-bold text-text-main">${r.title}</h3>
        </div>
        <p class="text-xs text-text-muted leading-relaxed font-normal">
          ${r.text}
        </p>
      </div>
    `).join("");
  }

  // Alternative Assistance Recommendation (Preventing Dead End for Ineligible Students)
  const altContainer = document.getElementById("eligibility-alternatives-container");
  const altList = document.getElementById("eligibility-alternatives-list");
  if (altContainer && altList) {
    if (opp.eligibilityStatus === "Not Eligible" || !opp.eligible) {
      altContainer.classList.remove("hidden");
      
      const altOpportunities = AppState.opportunities.filter(o => o.id !== opp.id && o.eligible).slice(0, 3);
      altList.innerHTML = altOpportunities.map(alt => `
        <div class="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between hover:bg-surface-subtle transition-colors cursor-pointer shadow-colored-sm" onclick="navigateTo('eligibility', { opportunityId: '${alt.id}' })">
          <div class="flex items-center gap-3">
            <span class="badge-trust badge-emerald text-[9px]">Potential Match</span>
            <div>
              <h4 class="text-xs font-bold text-text-main">${alt.title}</h4>
              <p class="text-[11px] text-text-muted">${alt.type} • ${alt.funding}</p>
            </div>
          </div>
          <button class="btn-secondary btn-primary-sm text-[11px] py-1 px-3">
            View Alternative &rarr;
          </button>
        </div>
      `).join("");
    } else {
      altContainer.classList.add("hidden");
    }
  }

  // Checklist
  const checklistContainer = document.getElementById("eligibility-checklist-items");
  if (checklistContainer) {
    checklistContainer.innerHTML = (opp.requirements || []).map(req => {
      let iconColor = "bg-emerald-50 text-emerald-600";
      let iconSymbol = "check";
      let badgeClass = "badge-emerald";

      if (req.status === "action") {
        iconColor = "bg-amber-50 text-amber-600";
        iconSymbol = "priority_high";
        badgeClass = "badge-amber";
      } else if (req.status === "pending") {
        iconColor = "bg-surface-subtle text-text-muted";
        iconSymbol = "schedule";
        badgeClass = "badge-indigo";
      }

      return `
        <div class="flex items-start gap-3">
          <div class="w-6 h-6 rounded-md ${iconColor} flex items-center justify-center shrink-0 mt-0.5">
            <span class="material-symbols-outlined text-[14px] font-bold">${iconSymbol}</span>
          </div>
          <div class="flex-1">
            <h4 class="text-xs font-bold text-text-main">${req.title}</h4>
            <p class="text-[11px] text-text-muted mt-0.5 font-normal">${req.desc}</p>
            <span class="badge-trust ${badgeClass} text-[9px] mt-1">
              ${req.note}
            </span>
          </div>
        </div>
      `;
    }).join(`<div class="w-full h-px bg-border/80"></div>`);
  }

  const bookmarkBtn = document.getElementById("eligibility-bookmark-btn");
  if (bookmarkBtn) {
    const isSaved = AppState.savedOpportunities.includes(opp.id);
    bookmarkBtn.innerHTML = `
      <span class="material-symbols-outlined text-[16px] ${isSaved ? 'fill text-primary' : ''}">bookmark</span>
      ${isSaved ? 'Saved in Drafts' : 'Save for Later'}
    `;
    bookmarkBtn.onclick = (e) => {
      toggleBookmark(opp.id, e);
      renderEligibilityDetails(opp.id);
    };
  }
}

// Render Action Plan Screen (5-Point Plan)
function renderActionPlan(oppId) {
  const opp = AppState.opportunities.find(o => o.id === oppId);
  if (!opp) {
    showToast("That program isn't in the registry anymore.", "warning");
    navigateTo("opportunities");
    return;
  }

  const titleEl = document.getElementById("action-plan-target-title");
  if (titleEl) titleEl.textContent = opp.title;

  const deadlineTag = document.getElementById("action-plan-deadline-tag");
  if (deadlineTag) deadlineTag.textContent = opp.deadlineFormatted;

  const portalName = document.getElementById("action-plan-portal-name");
  if (portalName) portalName.textContent = `${opp.provider} Application Desk`;

  const nextStepEl = document.getElementById("action-plan-next-step-title");
  const planDescEl = document.getElementById("action-plan-recommendation-text");
  
  if (nextStepEl && planDescEl) {
    if (opp.type === "Student Employment") {
      nextStepEl.textContent = "Your Next Step: Submit your 2nd Year class timetable to the IT lab supervisor";
      planDescEl.textContent = `Based on your 82% GPA and IT skills, secure your lab shift slot before the ${opp.deadlineFormatted} cutoff.`;
    } else if (opp.type === "Educational Assistance") {
      nextStepEl.textContent = "Your Next Step: Secure your Barangay Certificate of Indigency and 2nd Year COE";
      planDescEl.textContent = `Gather your municipal certification slips to finalize your tuition grant application for ${opp.provider}.`;
    } else {
      nextStepEl.textContent = "Your Next Step: Prepare your Certificate of Enrollment and latest grades";
      planDescEl.textContent = `Download your latest registrar grade report before launching the online submission portal.`;
    }
  }

  const stepsContainer = document.getElementById("action-plan-steps-container");
  if (stepsContainer) {
    stepsContainer.innerHTML = `
      <div class="card-elevated p-5 bg-surface flex gap-4 items-start">
        <div class="w-8 h-8 rounded-lg bg-indigo-50 text-primary font-bold text-xs flex items-center justify-center shrink-0">
          01
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-bold text-text-main">Download and Prepare Required Documents</h4>
          <p class="text-xs text-text-muted mt-1 font-normal">Obtain Certificate of Enrollment (COE) and official True Copy of Grades from university registrar.</p>
          <div class="mt-2 inline-flex items-center gap-1 badge-trust badge-emerald text-[9px]">
            <span class="material-symbols-outlined text-[13px]">check</span> In Progress
          </div>
        </div>
      </div>

      <div class="card-elevated p-5 bg-surface flex gap-4 items-start">
        <div class="w-8 h-8 rounded-lg bg-violet-50 text-secondary font-bold text-xs flex items-center justify-center shrink-0">
          02
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-bold text-text-main">Fill Out Official Application Form</h4>
          <p class="text-xs text-text-muted mt-1 font-normal">Complete the online registry submission at ${opp.provider} portal.</p>
          <div class="mt-2 inline-flex items-center gap-1 badge-trust badge-amber text-[9px]">
            <span class="material-symbols-outlined text-[13px]">schedule</span> Due ${opp.deadlineFormatted}
          </div>
        </div>
      </div>

      <div class="card-elevated p-5 bg-surface flex gap-4 items-start">
        <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0">
          03
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-bold text-text-main">Confirmation &amp; Document Endorsement</h4>
          <p class="text-xs text-text-muted mt-1 font-normal">Receive application reference number and retain receipt for university financial clearance.</p>
          <div class="mt-2 inline-flex items-center gap-1 badge-trust badge-indigo text-[9px]">
            Final Step
          </div>
        </div>
      </div>
    `;
  }
}

// Render Profile Screen
function renderProfile() {
  const user = AppState.currentUser;
  
  const nameInput = document.getElementById("profile-name-input");
  const emailInput = document.getElementById("profile-email-input");
  const gpaInput = document.getElementById("profile-gpa-input");
  const deptInput = document.getElementById("profile-dept-input");
  const bioInput = document.getElementById("profile-bio-input");

  if (nameInput) nameInput.value = user.name;
  if (emailInput) emailInput.value = user.email;
  if (gpaInput) gpaInput.value = user.gpa;
  if (deptInput) deptInput.value = user.department;
  if (bioInput) bioInput.value = user.bio;

  const skillsContainer = document.getElementById("profile-skills-list");
  if (skillsContainer) {
    skillsContainer.innerHTML = user.skills.map((skill, idx) => `
      <span class="badge-trust badge-indigo text-xs py-1 px-3">
        ${skill}
        <button type="button" onclick="removeSkill(${idx})" class="hover:text-error text-[16px] leading-none font-bold ml-1">&times;</button>
      </span>
    `).join("") + `
      <span class="inline-flex items-center gap-1 rounded-lg border border-dashed border-border focus-within:border-primary">
        <input type="text" id="new-skill-input" placeholder="Add a skill..." onkeydown="if(event.key==='Enter'){event.preventDefault();addSkill();}" class="bg-transparent px-3 py-1 text-xs font-semibold text-text-main placeholder:text-text-muted focus:outline-none w-28"/>
        <button type="button" onclick="addSkill()" class="pr-2 text-primary">
          <span class="material-symbols-outlined text-[16px]">add_circle</span>
        </button>
      </span>
    `;
  }
}

function saveProfile(event) {
  if (event) event.preventDefault();
  
  AppState.currentUser.name = document.getElementById("profile-name-input").value;
  AppState.currentUser.email = document.getElementById("profile-email-input").value;
  AppState.currentUser.gpa = parseFloat(document.getElementById("profile-gpa-input").value) || 82.0;
  AppState.currentUser.department = document.getElementById("profile-dept-input").value;
  AppState.currentUser.bio = document.getElementById("profile-bio-input").value;

  let strength = 70;
  if (AppState.currentUser.gpa >= 80) strength += 10;
  if (AppState.currentUser.skills.length >= 3) strength += 10;
  if (AppState.currentUser.bio.length > 20) strength += 8;
  AppState.currentUser.profileStrength = Math.min(100, strength);

  saveState();
  showToast("QualiFind student profile updated successfully!");
  updateGlobalBadges();
}

function removeSkill(idx) {
  AppState.currentUser.skills.splice(idx, 1);
  saveState();
  renderProfile();
}

function addSkill() {
  const input = document.getElementById("new-skill-input");
  const newSkill = input ? input.value.trim() : "";
  if (newSkill) {
    AppState.currentUser.skills.push(newSkill);
    saveState();
    renderProfile();
  }
}

// Render Admin Dashboard
function renderAdminDashboard() {
  const total = AppState.opportunities.length;
  const active = AppState.opportunities.filter(o => o.status === "Active").length;
  const inReview = AppState.opportunities.filter(o => o.status === "In Review" || o.status === "Draft").length;
  const expired = AppState.opportunities.filter(o => o.status === "Expired").length;

  const statTotal = document.getElementById("admin-stat-total");
  if (statTotal) statTotal.textContent = total;

  const statActive = document.getElementById("admin-stat-active");
  if (statActive) statActive.textContent = active;

  const statReview = document.getElementById("admin-stat-review");
  if (statReview) statReview.textContent = inReview;

  const statExpired = document.getElementById("admin-stat-expired");
  if (statExpired) statExpired.textContent = expired;

  const tbody = document.getElementById("admin-recent-programs-tbody");
  if (!tbody) return;

  const recent = AppState.opportunities.slice(0, 4);
  tbody.innerHTML = recent.map(opp => {
    let statusBadge = `<span class="badge-trust badge-emerald text-[9px]">${opp.status}</span>`;
    if (opp.status === "Expired") {
      statusBadge = `<span class="badge-trust badge-rose text-[9px]">${opp.status}</span>`;
    } else if (opp.status === "In Review" || opp.status === "Draft") {
      statusBadge = `<span class="badge-trust badge-amber text-[9px]">${opp.status}</span>`;
    }

    return `
      <tr class="hover:bg-surface-subtle transition-colors">
        <td class="py-3 px-6">
          <div class="font-bold text-xs text-text-main">${opp.title}</div>
          <div class="text-text-muted text-[10px]">Ref: ${opp.id}</div>
        </td>
        <td class="py-3 px-4 text-xs font-medium text-text-main">${opp.type}</td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-xs text-text-muted">${opp.deadlineFormatted}</td>
        <td class="py-3 px-6 text-right">
          <button class="w-7 h-7 rounded-lg bg-surface border border-border inline-flex items-center justify-center text-text-muted hover:text-primary transition-colors shadow-colored-sm" onclick="openEditProgramModal('${opp.id}')">
            <span class="material-symbols-outlined text-[14px]">edit</span>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Render Admin Programs Full Management Screen
function renderAdminPrograms() {
  const tbody = document.getElementById("admin-programs-full-tbody");
  if (!tbody) return;

  const searchQuery = (AppState.adminFilter.search || "").toLowerCase();

  const filtered = AppState.opportunities.filter(opp => {
    if (searchQuery) {
      const match = opp.title.toLowerCase().includes(searchQuery) ||
                    opp.provider.toLowerCase().includes(searchQuery) ||
                    opp.id.toLowerCase().includes(searchQuery);
      if (!match) return false;
    }
    return true;
  });

  const countBadge = document.getElementById("admin-programs-count");
  if (countBadge) countBadge.textContent = `${filtered.length} Philippine Programs`;

  tbody.innerHTML = filtered.map(opp => {
    let statusBadge = `<span class="badge-trust badge-emerald text-[9px]">Active</span>`;
    if (opp.status === "Expired") {
      statusBadge = `<span class="badge-trust badge-rose text-[9px]">Expired</span>`;
    } else if (opp.status === "In Review" || opp.status === "Draft") {
      statusBadge = `<span class="badge-trust badge-amber text-[9px]">${opp.status}</span>`;
    }

    return `
      <tr class="hover:bg-surface-subtle transition-colors group">
        <td class="px-6 py-3.5">
          <div class="w-3.5 h-3.5 rounded border border-border bg-surface"></div>
        </td>
        <td class="px-6 py-3.5 font-bold text-xs text-text-main">${opp.title}</td>
        <td class="px-6 py-3.5 text-xs text-text-muted">${opp.provider}</td>
        <td class="px-6 py-3.5 text-xs font-semibold text-text-main">${opp.type}</td>
        <td class="px-6 py-3.5 text-xs text-text-muted">${opp.deadlineFormatted}</td>
        <td class="px-6 py-3.5">${statusBadge}</td>
        <td class="px-6 py-3.5 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button class="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted hover:text-primary transition-colors shadow-colored-sm" title="Edit" onclick="openEditProgramModal('${opp.id}')">
              <span class="material-symbols-outlined text-[14px]">edit</span>
            </button>
            <button class="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted hover:text-amber-500 transition-colors shadow-colored-sm" title="Duplicate" onclick="duplicateProgram('${opp.id}')">
              <span class="material-symbols-outlined text-[14px]">content_copy</span>
            </button>
            <button class="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted hover:text-error transition-colors shadow-colored-sm" title="Delete" onclick="deleteProgram('${opp.id}')">
              <span class="material-symbols-outlined text-[14px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Program Modal Functions
function openAddProgramModal() {
  AppState.editingProgramId = null;
  document.getElementById("program-modal-title").textContent = "Add Philippine Assistance Program";
  document.getElementById("program-form").reset();
  document.getElementById("prog-id-input").value = `PH-GRANT-${Math.floor(100 + Math.random() * 900)}`;
  
  const modal = document.getElementById("program-modal");
  if (modal) modal.classList.remove("hidden");
}

function openEditProgramModal(progId) {
  AppState.editingProgramId = progId;
  const opp = AppState.opportunities.find(o => o.id === progId);
  if (!opp) return;

  document.getElementById("program-modal-title").textContent = "Edit Program";
  document.getElementById("prog-id-input").value = opp.id;
  document.getElementById("prog-title-input").value = opp.title;
  document.getElementById("prog-provider-input").value = opp.provider;
  document.getElementById("prog-type-input").value = opp.type;
  document.getElementById("prog-dept-input").value = opp.dept;
  document.getElementById("prog-funding-input").value = opp.funding;
  document.getElementById("prog-deadline-input").value = opp.deadline;
  document.getElementById("prog-status-input").value = opp.status;
  document.getElementById("prog-desc-input").value = opp.summary;

  const modal = document.getElementById("program-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeProgramModal() {
  const modal = document.getElementById("program-modal");
  if (modal) modal.classList.add("hidden");
}

function handleSaveProgram(event) {
  if (event) event.preventDefault();

  const id = document.getElementById("prog-id-input").value;
  const title = document.getElementById("prog-title-input").value;
  const provider = document.getElementById("prog-provider-input").value;
  const type = document.getElementById("prog-type-input").value;
  const dept = document.getElementById("prog-dept-input").value;
  const funding = document.getElementById("prog-funding-input").value;
  const deadline = document.getElementById("prog-deadline-input").value;
  const status = document.getElementById("prog-status-input").value;
  const summary = document.getElementById("prog-desc-input").value;

  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
  const deadlineFormatted = deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (AppState.editingProgramId) {
    const idx = AppState.opportunities.findIndex(o => o.id === AppState.editingProgramId);
    if (idx > -1) {
      AppState.opportunities[idx] = {
        ...AppState.opportunities[idx],
        title, provider, type, dept, funding, deadline, deadlineFormatted, deadlineDays: diffDays, status, summary
      };
      showToast("Philippine program updated successfully!");
    }
  } else {
    const newProgram = {
      id,
      title,
      provider,
      type,
      dept,
      funding,
      deadline,
      deadlineFormatted,
      deadlineDays: diffDays,
      status,
      summary,
      matchScore: 88,
      minGpa: 80.0,
      eligible: true,
      eligibilityStatus: "Eligible",
      eligibilityNotes: "New Registered Program",
      icon: "school",
      colorTheme: "indigo",
      requirements: [
        { id: "req-1", title: "General Eligibility", desc: "Criteria verified.", status: "satisfied", note: "Satisfied" }
      ],
      keywords: [title.toLowerCase(), provider.toLowerCase(), dept.toLowerCase(), "philippines"]
    };
    AppState.opportunities.unshift(newProgram);
    showToast("New assistance program added to QualiFind registry!");
  }

  saveState();
  closeProgramModal();
  renderAdminDashboard();
  renderAdminPrograms();
}

function duplicateProgram(progId) {
  const opp = AppState.opportunities.find(o => o.id === progId);
  if (!opp) return;

  const clone = {
    ...opp,
    id: `PH-GRANT-${Math.floor(100 + Math.random() * 900)}`,
    title: `${opp.title} (Copy)`,
    status: "Draft"
  };

  AppState.opportunities.unshift(clone);
  saveState();
  showToast("Program duplicated as Draft.");
  renderAdminPrograms();
  renderAdminDashboard();
}

function deleteProgram(progId) {
  if (confirm("Are you sure you want to delete this program from the QualiFind registry?")) {
    AppState.opportunities = AppState.opportunities.filter(o => o.id !== progId);
    saveState();
    showToast("Program deleted.");
    renderAdminPrograms();
    renderAdminDashboard();
  }
}

// User / Role Switcher
function openUserSwitchModal() {
  const modal = document.getElementById("user-switch-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeUserSwitchModal() {
  const modal = document.getElementById("user-switch-modal");
  if (modal) modal.classList.add("hidden");
}

function setRole(roleName) {
  if (USER_PROFILES[roleName]) {
    AppState.currentUser = { ...USER_PROFILES[roleName] };
    saveState();
    updateRoleUI();
    
    if (roleName === "admin") {
      showToast("Switched to Admin Portal (Desktop Workstation)");
      navigateTo("admin-dashboard");
    } else {
      showToast("Switched to Student Portal (Maria • Cebu 2nd-Yr IT)");
      navigateTo("dashboard");
    }
  }
}

// Login Page Handlers
function selectLoginRole(role) {
  const roleInput = document.getElementById("login-selected-role");
  const studentBtn = document.getElementById("login-role-student-btn");
  const adminBtn = document.getElementById("login-role-admin-btn");
  const emailInput = document.getElementById("login-email-input");

  if (roleInput) roleInput.value = role;

  if (role === "student") {
    if (studentBtn) {
      studentBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-surface text-primary shadow-sm";
    }
    if (adminBtn) {
      adminBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-text-muted hover:text-text-main";
    }
    if (emailInput && !emailInput.value.includes("ernesto")) emailInput.value = "maria.santos@student.cebu.edu.ph";
  } else {
    if (adminBtn) {
      adminBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-surface text-secondary shadow-sm";
    }
    if (studentBtn) {
      studentBtn.className = "flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 text-text-muted hover:text-text-main";
    }
    if (emailInput && !emailInput.value.includes("maria")) emailInput.value = "ernesto.ramos@ched.gov.ph";
  }
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById("login-password-input");
  const toggleIcon = document.getElementById("password-toggle-icon");
  if (!pwdInput) return;

  if (pwdInput.type === "password") {
    pwdInput.type = "text";
    if (toggleIcon) toggleIcon.textContent = "visibility_off";
  } else {
    pwdInput.type = "password";
    if (toggleIcon) toggleIcon.textContent = "visibility";
  }
}

function handleLoginFormSubmit(event) {
  if (event) event.preventDefault();
  const selectedRole = document.getElementById("login-selected-role")?.value || "student";
  quickLoginAs(selectedRole);
}

function quickLoginAs(roleName) {
  setRole(roleName);
  const profileName = USER_PROFILES[roleName]?.name || "User";
  showToast(`Welcome back, ${profileName}!`);
}

function handleLogout() {
  navigateTo("login");
  showToast("Signed out of QualiFind.", "info");
}

function renderLogin() {
  const role = AppState.currentUser.role || "student";
  selectLoginRole(role);
}

function updateRoleUI() {
  const isStudent = AppState.currentUser.role === "student";
  
  const studentNavGroup = document.getElementById("student-nav-group");
  const adminNavGroup = document.getElementById("admin-nav-group");
  const studentMobileNav = document.getElementById("student-mobile-nav");
  const appSubtitle = document.getElementById("sidebar-app-subtitle");

  if (studentNavGroup) studentNavGroup.classList.toggle("hidden", !isStudent);
  if (adminNavGroup) adminNavGroup.classList.toggle("hidden", isStudent);
  if (studentMobileNav) studentMobileNav.style.display = isStudent ? "" : "none";
  if (appSubtitle) appSubtitle.textContent = isStudent ? "Student Portal" : "DOST / CHED Admin";

  const roleLabel = document.getElementById("header-user-role");
  if (roleLabel) roleLabel.textContent = isStudent ? "Student • Mobile & Web" : "Admin • Workstation";

  const nameLabel = document.getElementById("header-user-name");
  if (nameLabel) nameLabel.textContent = AppState.currentUser.name;

  const headerAvatar = document.getElementById("header-user-avatar");
  if (headerAvatar) {
    headerAvatar.textContent = AppState.currentUser.avatar || (isStudent ? "MS" : "ER");
    headerAvatar.className = `w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-[10px] font-bold`;
  }

  const sidebarName = document.getElementById("sidebar-user-name");
  if (sidebarName) sidebarName.textContent = AppState.currentUser.name;

  const sidebarBadge = document.getElementById("sidebar-user-badge");
  if (sidebarBadge) {
    sidebarBadge.textContent = isStudent ? "Student • Cebu" : "Admin • Workstation";
    sidebarBadge.className = `badge-trust ${isStudent ? 'badge-indigo' : 'badge-violet'} text-[10px] py-0.5 px-2 mt-0.5`;
  }

  const sidebarAvatar = document.getElementById("sidebar-user-avatar");
  if (sidebarAvatar) {
    sidebarAvatar.textContent = AppState.currentUser.avatar || (isStudent ? "MS" : "ER");
    sidebarAvatar.className = `w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-colored-sm`;
  }
}

function updateGlobalBadges() {
  const count = AppState.savedOpportunities.length;
  const savedBadge = document.getElementById("nav-saved-count");
  if (savedBadge) savedBadge.textContent = count;

  const headerSavedBadge = document.getElementById("header-saved-badge");
  if (headerSavedBadge) headerSavedBadge.textContent = count;

  const dashSavedStat = document.getElementById("dash-stat-saved");
  if (dashSavedStat) dashSavedStat.textContent = count;

  const savedCb = document.getElementById("filter-saved-only-checkbox");
  if (savedCb) savedCb.checked = !!AppState.activeFilters.savedOnly;
}

// Global Filter Listeners
function setupFilterListeners() {
  const filterCheckboxes = document.querySelectorAll(".filter-type-checkbox");
  filterCheckboxes.forEach(cb => {
    cb.onchange = () => {
      const activeTypes = [];
      filterCheckboxes.forEach(c => {
        if (c.checked) activeTypes.push(c.value);
      });
      AppState.activeFilters.types = activeTypes;
      renderOpportunitiesList();
    };
  });

  const matchCheckboxes = document.querySelectorAll(".filter-match-checkbox");
  matchCheckboxes.forEach(cb => {
    cb.onchange = () => {
      const activeMatch = [];
      matchCheckboxes.forEach(c => {
        if (c.checked) activeMatch.push(c.value);
      });
      AppState.activeFilters.matchQuality = activeMatch;
      renderOpportunitiesList();
    };
  });

  const searchInput = document.getElementById("search-opportunities-input");
  if (searchInput) {
    searchInput.oninput = (e) => {
      AppState.activeFilters.searchQuery = e.target.value;
      renderOpportunitiesList();
    };
  }

  const globalSearchInput = document.getElementById("global-search-input");
  if (globalSearchInput) {
    globalSearchInput.onkeypress = (e) => {
      if (e.key === "Enter") {
        AppState.activeFilters.searchQuery = e.target.value;
        navigateTo("opportunities");
      }
    };
  }

  const adminSearch = document.getElementById("admin-search-input");
  if (adminSearch) {
    adminSearch.oninput = (e) => {
      AppState.adminFilter.search = e.target.value;
      renderAdminPrograms();
    };
  }
}

// Expose interactive methods globally for HTML event handlers
window.navigateTo = navigateTo;
window.handleBrandClick = handleBrandClick;
window.handleFindMatches = handleFindMatches;
window.handleDocumentSelect = handleDocumentSelect;
window.removeMatcherDocument = removeMatcherDocument;
window.toggleBookmark = toggleBookmark;
window.toggleSavedOnlyFilter = toggleSavedOnlyFilter;
window.toggleFilterDrawer = toggleFilterDrawer;
window.renderSavedApplicationsView = renderSavedApplicationsView;
window.resetFilters = resetFilters;
window.saveProfile = saveProfile;
window.removeSkill = removeSkill;
window.addSkill = addSkill;
window.openAddProgramModal = openAddProgramModal;
window.openEditProgramModal = openEditProgramModal;
window.closeProgramModal = closeProgramModal;
window.handleSaveProgram = handleSaveProgram;
window.duplicateProgram = duplicateProgram;
window.deleteProgram = deleteProgram;
window.setRole = setRole;
window.openUserSwitchModal = openUserSwitchModal;
window.closeUserSwitchModal = closeUserSwitchModal;
window.showToast = showToast;
window.toggleDarkMode = toggleDarkMode;
window.selectLoginRole = selectLoginRole;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleLoginFormSubmit = handleLoginFormSubmit;
window.quickLoginAs = quickLoginAs;
window.handleLogout = handleLogout;
window.toggleMatcherTag = toggleMatcherTag;

// App Initialization
function initApp() {
  initTheme();
  loadSavedState();
  updateRoleUI();

  const hash = window.location.hash.replace("#", "") || "dashboard";
  navigateTo(hash);

  setupFilterListeners();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
