// QualiFind - AI-Powered Academic & Research Opportunity Matching Platform (Philippine Setting)

const INITIAL_OPPORTUNITIES = [
  {
    id: "DOST-ASTHRDP-2024",
    title: "DOST-SEI ASTHRDP Graduate Research Scholarship",
    provider: "Department of Science and Technology - SEI",
    type: "Fellowship",
    dept: "Computer Science & Biotechnology",
    duration: "2 - 3 Years",
    funding: "₱480,000 / yr + Tuition",
    annualValue: 480000,
    deadline: "2024-10-15",
    deadlineFormatted: "Oct 15, 2024",
    deadlineDays: 14,
    status: "Active",
    matchScore: 95,
    minGpa: 1.75, // in PH GWA scale (1.0 is highest, 1.75 is top tier)
    eligible: true,
    eligibilityNotes: "100% Eligible (GWA Verified)",
    degreeRequired: "M.S. / Ph.D. STEM Enrolled",
    citizenship: "Filipino Citizen",
    leadProf: "Dr. Jaime C. Montoya",
    teamCount: 4,
    icon: "biotech",
    colorTheme: "primary",
    summary: "The Accelerated Science and Technology Human Resource Development Program (ASTHRDP) aims to help improve the country's global competitiveness and capacity for high-level STEM innovation.",
    whyStrongMatch: [
      "Your current GWA of 1.35 (UP Diliman) surpasses the DOST-SEI requirement of 1.75 or better.",
      "Your computational biology and AI modeling research aligns directly with National Harmonized R&D Agenda (NHRDA) priorities.",
      "Endorsed by accredited National Science Consortium (NSC) member universities."
    ],
    requirements: [
      { id: "req-1", title: "Academic GWA Standing", desc: "Must have a General Weighted Average of 1.75 or better.", status: "satisfied", note: "Satisfied: GWA 1.35" },
      { id: "req-2", title: "Philippine Citizenship", desc: "Natural-born Filipino citizen without pending immigrant status.", status: "satisfied", note: "Satisfied: Verified PSA Birth Cert" },
      { id: "req-3", title: "Recommendation from 2 Former Professors", desc: "Formal endorsement letters from NSC faculty.", status: "action", note: "Action Required: 1 Letter Pending" },
      { id: "req-4", title: "Approved Research Proposal / Concept Note", desc: "Aligned with DOST Harmonized National R&D Priorities.", status: "pending", note: "Draft in Progress (AI / Genomics)" }
    ],
    tags: ["DOST-SEI", "Full Tuition", "Monthly Stipend ₱33k", "Thesis Grant ₱100k", "National Science Consortium"],
    keywords: ["dost", "asthrdp", "sei", "scholarship", "philippines", "computational biology", "genomics", "machine learning", "stem", "up diliman", "fellowship"]
  },
  {
    id: "DOST-ERDT-2024",
    title: "Engineering Research & Development for Technology (ERDT)",
    provider: "DOST-SEI & ERDT Consortium",
    type: "Fellowship",
    dept: "Engineering & Applied Computing",
    duration: "2 - 3 Years",
    funding: "₱450,000 / yr + Research Grant",
    annualValue: 450000,
    deadline: "2024-10-31",
    deadlineFormatted: "Oct 31, 2024",
    deadlineDays: 30,
    status: "Active",
    matchScore: 91,
    minGpa: 1.75,
    eligible: true,
    eligibilityNotes: "100% Eligible",
    degreeRequired: "M.S. / Ph.D. Engineering & Computing",
    citizenship: "Filipino Citizen",
    leadProf: "Dr. Rizalinda L. De Leon",
    teamCount: 3,
    icon: "terminal",
    colorTheme: "primary",
    summary: "Consortium of eight member universities providing full graduate scholarship, monthly living allowances, book stipend, and international research conference support.",
    whyStrongMatch: [
      "Enrolled in UP COE / DLSU / Ateneo ERDT consortium track in high-performance computing.",
      "High GWA in foundational applied mathematics and algorithmic physics.",
      "Includes ₱200,000 research dissemination and thesis dissemination grant."
    ],
    requirements: [
      { id: "req-1", title: "Consortium University Admission", desc: "Official acceptance into an ERDT consortium institution.", status: "satisfied", note: "Satisfied: UP Diliman" },
      { id: "req-2", title: "Full-Time Student Status", desc: "Willing to render full-time commitment without concurrent employment.", status: "satisfied", note: "Satisfied" },
      { id: "req-3", title: "NBI & Medical Clearance", desc: "Standard government medical and background verification.", status: "action", note: "Action: Submit NBI Clearance" }
    ],
    tags: ["ERDT", "Engineering", "High Performance Computing", "DOST Consortium"],
    keywords: ["erdt", "engineering", "computing", "dost", "up", "dlsu", "fellowship", "thesis grant", "philippines"]
  },
  {
    id: "PGC-COMPGEN-2024",
    title: "Philippine Genome Center (PGC) Research Fellowship",
    provider: "Philippine Genome Center & UP System",
    type: "Research Grant",
    dept: "Genomics & Bioinformatics",
    duration: "1 - 2 Years",
    funding: "₱360,000 / yr + Cloud Compute",
    annualValue: 360000,
    deadline: "2024-11-15",
    deadlineFormatted: "Nov 15, 2024",
    deadlineDays: 45,
    status: "Active",
    matchScore: 94,
    minGpa: 2.0,
    eligible: true,
    eligibilityNotes: "100% Eligible (Top Match)",
    degreeRequired: "Graduate Student or Resident Researcher",
    citizenship: "Open to PH Residents",
    leadProf: "Dr. Cynthia P. Saloma",
    teamCount: 5,
    icon: "biotech",
    colorTheme: "secondary",
    summary: "Hands-on fellowship at PGC Core Facility for Bioinformatics (CFB), conducting genomic epidemiology, next-gen sequencing (NGS), and endemic biodiversity data modeling.",
    whyStrongMatch: [
      "Direct computational genomics and Python/PyTorch modeling expertise.",
      "Project focus directly supports Philippine endemic pathogen surveillance and local agri-genomics."
    ],
    requirements: [
      { id: "req-1", title: "Bioinformatics Pipeline Competency", desc: "Demonstrated RNA-seq / Python NGS workflow experience.", status: "satisfied", note: "Satisfied: GitHub Project Linked" },
      { id: "req-2", title: "Institutional Endorsement", desc: "Endorsement from thesis adviser or department chair.", status: "satisfied", note: "Satisfied" },
      { id: "req-3", title: "Data Ethics & Biosafety Protocol", desc: "Compliance with National Health Research Ethics Committee guidelines.", status: "action", note: "Action: Complete Ethics Form" }
    ],
    tags: ["Philippine Genome Center", "Bioinformatics", "Genomics", "UP Diliman", "NGS"],
    keywords: ["pgc", "philippine genome center", "genomics", "bioinformatics", "python", "pathogen", "up", "health", "philippines"]
  },
  {
    id: "CHED-K12-GRAD-2024",
    title: "CHED SUC Faculty & Graduate Development Grant",
    provider: "Commission on Higher Education (CHED)",
    type: "Scholarship",
    dept: "Higher Education Research",
    duration: "2 Years",
    funding: "₱300,000 / yr",
    annualValue: 300000,
    deadline: "2024-12-01",
    deadlineFormatted: "Dec 01, 2024",
    deadlineDays: 61,
    status: "Active",
    matchScore: 82,
    minGpa: 2.0,
    eligible: true,
    eligibilityNotes: "100% Eligible",
    degreeRequired: "Master's / Ph.D. Candidate",
    citizenship: "Filipino Citizen",
    leadProf: "Dr. J. Prospero E. De Vera III",
    teamCount: 2,
    icon: "school",
    colorTheme: "primary",
    summary: "Scholarship program for developing future tertiary educators and scientific leaders across State Universities and Colleges (SUCs) in the Philippines.",
    whyStrongMatch: [
      "Track record of undergraduate teaching assistantships and university tutoring.",
      "Qualifies under CHED Priority Discipline in Information Technology & Science."
    ],
    requirements: [
      { id: "req-1", title: "Faculty Intent / Return Service", desc: "Willingness to render return service in a Philippine HEI/SUC.", status: "satisfied", note: "Satisfied" },
      { id: "req-2", title: "Certified True Copy of Grades (TCG)", desc: "Official university registrar transcript.", status: "satisfied", note: "Satisfied" },
      { id: "req-3", title: "Barangay & Moral Clearance", desc: "Local clearance certificate.", status: "action", note: "Action: Submit Barangay Certificate" }
    ],
    tags: ["CHED", "Higher Education", "SUC", "Teaching Fellowship"],
    keywords: ["ched", "higher education", "suc", "scholarship", "teaching", "faculty", "philippines", "manila"]
  },
  {
    id: "GBF-STEM-2024",
    title: "Gokongwei Brothers Foundation (GBF) STEM Leaders Fellowship",
    provider: "Gokongwei Brothers Foundation",
    type: "Fellowship",
    dept: "Applied Science & Tech Innovation",
    duration: "2 Years",
    funding: "₱250,000 / yr + Industry Mentorship",
    annualValue: 250000,
    deadline: "2024-11-20",
    deadlineFormatted: "Nov 20, 2024",
    deadlineDays: 50,
    status: "Active",
    matchScore: 89,
    minGpa: 1.75,
    eligible: true,
    eligibilityNotes: "100% Eligible",
    degreeRequired: "M.S. STEM Student",
    citizenship: "Filipino Citizen",
    leadProf: "Engr. Lance Y. Gokongwei",
    teamCount: 3,
    icon: "diversity_3",
    colorTheme: "primary",
    summary: "Supports exceptional Filipino youth dedicated to advancing STEM innovation for community building and Philippine industry transformation.",
    whyStrongMatch: [
      "Strong blend of AI technical depth and community orientation.",
      "Clear intent to contribute to Philippine digital manufacturing & smart technology infrastructure."
    ],
    requirements: [
      { id: "req-1", title: "Leadership & Community Track Record", desc: "Demonstrated involvement in collegiate STEM student chapters.", status: "satisfied", note: "Satisfied" },
      { id: "req-2", title: "Innovation Statement", desc: "500-word essay on solving a Philippine community challenge.", status: "action", note: "Action Required: Draft Essay" }
    ],
    tags: ["GBF", "STEM", "Industry Mentorship", "Filipino Youth", "Fellowship"],
    keywords: ["gbf", "gokongwei", "stem", "philippines", "industry", "innovation", "youth", "fellowship", "scholarship"]
  },
  {
    id: "DOST-ASTI-AI-2024",
    title: "DOST-ASTI AI & Quantum Computing R&D Practicum Grant",
    provider: "DOST - Advanced Science and Technology Institute",
    type: "Research Grant",
    dept: "Artificial Intelligence & Advanced Computing",
    duration: "1 Year",
    funding: "₱420,000 / yr + COARE Supercomputer Access",
    annualValue: 420000,
    deadline: "2024-10-25",
    deadlineFormatted: "Oct 25, 2024",
    deadlineDays: 24,
    status: "Active",
    matchScore: 96,
    minGpa: 1.75,
    eligible: true,
    eligibilityNotes: "Top AI Match",
    degreeRequired: "Graduate Researcher (M.S./Ph.D.)",
    citizenship: "Filipino Citizen",
    leadProf: "Dr. Franz A. De Leon",
    teamCount: 6,
    icon: "memory",
    colorTheme: "primary",
    summary: "Direct grant with access to the COARE High-Performance Computing and Cloud Facility for generative AI, remote sensing, and quantum circuit simulations in the Philippines.",
    whyStrongMatch: [
      "Your specific training in PyTorch and quantum computing frameworks matches ASTI R&D targets.",
      "Includes dedicated GPU cluster allocation on the national COARE facility in Diliman, Quezon City."
    ],
    requirements: [
      { id: "req-1", title: "Supercomputer Project Proposal", desc: "Technical proposal utilizing high-performance GPU resources.", status: "satisfied", note: "Satisfied: Concept Approved" },
      { id: "req-2", title: "Advisor Endorsement", desc: "Endorsement from NSC Graduate Faculty.", status: "satisfied", note: "Satisfied" },
      { id: "req-3", title: "DOST Intellectual Property Agreement", desc: "Standard government IP management agreement.", status: "action", note: "Action: Sign IP Form" }
    ],
    tags: ["DOST-ASTI", "COARE Supercomputer", "AI Research", "HPC", "Quezon City"],
    keywords: ["dost", "asti", "coare", "supercomputing", "ai", "quantum", "machine learning", "gpu", "philippines", "diliman"]
  },
  {
    id: "AYALA-CLIMATE-2024",
    title: "Ayala Foundation Sustainability & Climate Research Grant",
    provider: "Ayala Foundation & AC Energy",
    type: "Research Grant",
    dept: "Sustainability & Environmental Computing",
    duration: "1 Year",
    funding: "₱350,000 / yr",
    annualValue: 350000,
    deadline: "2024-11-10",
    deadlineFormatted: "Nov 10, 2024",
    deadlineDays: 40,
    status: "Active",
    matchScore: 78,
    minGpa: 2.0,
    eligible: true,
    eligibilityNotes: "Eligible (Requires Agri-Environmental focus)",
    degreeRequired: "Graduate Student in Philippine HEI",
    citizenship: "Filipino Citizen",
    leadProf: "Jaime Augusto Zobel de Ayala",
    teamCount: 3,
    icon: "public",
    colorTheme: "secondary",
    summary: "Grants for multidisciplinary student researchers addressing typhoon resilience, renewable energy forecasting, and marine biodiversity in the Philippine archipelago.",
    whyStrongMatch: [
      "AI and geospatial data analytics can be applied to local flood modeling and renewable energy optimization."
    ],
    requirements: [
      { id: "req-1", title: "Sustainability Impact Plan", desc: "Demonstrated application to Philippine environmental resilience.", status: "action", note: "Action: Draft Impact Plan" },
      { id: "req-2", title: "Enrolled in Philippine University", desc: "Recognized CHED accredited program.", status: "satisfied", note: "Satisfied: UP Diliman" }
    ],
    tags: ["Ayala Foundation", "Sustainability", "Climate AI", "Philippine Resilience"],
    keywords: ["ayala", "climate", "sustainability", "philippines", "resilience", "renewable", "energy", "data"]
  },
  {
    id: "DOST-PCHRD-2024",
    title: "DOST-PCHRD Health Innovation & Disease Modeling Grant",
    provider: "Philippine Council for Health Research and Development",
    type: "Research Grant",
    dept: "Public Health & Computational Medicine",
    duration: "2 Years",
    funding: "₱400,000 / yr + Research Budget",
    annualValue: 400000,
    deadline: "2024-12-15",
    deadlineFormatted: "Dec 15, 2024",
    deadlineDays: 75,
    status: "Draft",
    matchScore: 88,
    minGpa: 1.75,
    eligible: true,
    eligibilityNotes: "100% Eligible",
    degreeRequired: "M.S. / Ph.D. Health Sciences or Bioinformatics",
    citizenship: "Filipino Citizen",
    leadProf: "Dr. Jaime C. Montoya",
    teamCount: 4,
    icon: "local_hospital",
    colorTheme: "primary",
    summary: "Supports health research projects addressing tropical diseases (Dengue, Tuberculosis), telemedicine, and health informatics across Philippine regional health hubs.",
    whyStrongMatch: [
      "Computational modeling capabilities for infectious disease progression and local genomic epidemiology.",
      "High GWA (1.35) matching PCHRD evaluation standards."
    ],
    requirements: [
      { id: "req-1", title: "Ethics Review Board (ERB) Approval", desc: "Protocol review from Philippine Health Research Ethics Board.", status: "pending", note: "Pending Board Review" },
      { id: "req-2", title: "Line-Item Budget (LIB)", desc: "Detailed breakdown of equipment and supplies.", status: "action", note: "Action: Submit LIB Document" }
    ],
    tags: ["DOST-PCHRD", "Health Informatics", "Disease Modeling", "Tropical Medicine"],
    keywords: ["pchrd", "health", "dost", "medicine", "bioinformatics", "dengue", "philippines", "manila", "up manila"]
  },
  {
    id: "DOST-PCAARRD-2023",
    title: "DOST-PCAARRD Agri-Aqua Innovation Research Grant",
    provider: "DOST - PCAARRD",
    type: "Research Grant",
    dept: "Agricultural Technology & Aquaculture",
    duration: "1 Year",
    funding: "₱280,000 / yr",
    annualValue: 280000,
    deadline: "2024-08-01",
    deadlineFormatted: "Aug 01, 2024",
    deadlineDays: -13,
    status: "Expired",
    matchScore: 48,
    minGpa: 2.25,
    eligible: false,
    eligibilityNotes: "Past deadline",
    degreeRequired: "Graduate Researcher",
    citizenship: "Filipino Citizen",
    leadProf: "Dr. Reynaldo V. Ebora",
    teamCount: 2,
    icon: "agriculture",
    colorTheme: "tertiary",
    summary: "Focuses on smart farming IoT systems, sustainable fisheries, and crop genome enhancement for Philippine agricultural security.",
    whyStrongMatch: ["Low direct alignment with current focus on quantum computing and human genomics."],
    requirements: [],
    tags: ["DOST-PCAARRD", "Agriculture", "Aquaculture", "Los Baños"],
    keywords: ["pcaarrd", "agriculture", "aqua", "farming", "dost", "los banos", "philippines"]
  }
];

// Quick-suggestion profile tags for the AI Matcher screen. Multi-select; feed into the
// same free-text prompt that calculateMatchForPrompt() already scores against, so no
// change to the matching/eligibility logic itself.
const MATCHER_PROFILE_TAGS = [
  { id: "college-student", label: "College Student", icon: "school" },
  { id: "high-school-student", label: "High School Student", icon: "menu_book" },
  { id: "working-student", label: "Working Student", icon: "work_history" },
  { id: "job-seeker", label: "Job Seeker", icon: "work" },
  { id: "scholarship", label: "Looking for Scholarship", icon: "workspace_premium" },
  { id: "financial-aid", label: "Looking for Financial Aid", icon: "payments" },
  { id: "internship", label: "Looking for Internship", icon: "business_center" },
  { id: "training", label: "Looking for Training", icon: "model_training" },
  { id: "pwd", label: "Person with Disability", icon: "accessible" },
  { id: "senior-citizen", label: "Senior Citizen", icon: "elderly" },
  { id: "parent", label: "Parent", icon: "family_restroom" },
  { id: "low-income", label: "Low-Income Household", icon: "home" }
];

// App State
const AppState = {
  currentUser: {
    name: "Maria Clara Santos",
    role: "student", // "student" | "admin"
    title: "Graduate Researcher (M.S. Computer Science & Bioinformatics, Year 2)",
    email: "maria.santos@up.edu.ph",
    avatar: "person",
    gpa: 1.35, // Philippine GWA (General Weighted Average)
    gpaFormatted: "1.35 GWA (92% / 3.85 GPA Equivalent)",
    degree: "M.S. Computer Science (Bioinformatics Track)",
    department: "Department of Computer Science & Philippine Genome Center",
    institution: "University of the Philippines Diliman",
    profileStrength: 88,
    skills: ["Bioinformatics & Genomics", "Python / PyTorch", "COARE Supercomputer", "Qiskit Quantum", "Data Modeling (R)"],
    bio: "Second-year graduate researcher at UP Diliman specializing in computational genomics, AI-driven epidemic simulation, and high-performance computing in the Philippine setting."
  },
  currentView: "dashboard",
  selectedOpportunityId: "DOST-ASTHRDP-2024",
  matcherDocuments: [],
  matcherProfileTags: [],
  opportunities: [...INITIAL_OPPORTUNITIES],
  savedOpportunities: ["DOST-ASTHRDP-2024", "DOST-ASTI-AI-2024", "PGC-COMPGEN-2024"],
  activeFilters: {
    types: ["Research Grant", "Fellowship", "Scholarship"],
    matchQuality: ["high", "good"],
    deadline: "Any Time",
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
    const savedOpps = localStorage.getItem("qualifind_opps");
    if (savedOpps) AppState.opportunities = JSON.parse(savedOpps);
    
    const savedBookmarks = localStorage.getItem("qualifind_saved");
    if (savedBookmarks) AppState.savedOpportunities = JSON.parse(savedBookmarks);

    const savedUser = localStorage.getItem("qualifind_user");
    if (savedUser) AppState.currentUser = JSON.parse(savedUser);
  } catch (e) {
    console.warn("LocalStorage load error:", e);
  }
}

function saveState() {
  try {
    localStorage.setItem("qualifind_opps", JSON.stringify(AppState.opportunities));
    localStorage.setItem("qualifind_saved", JSON.stringify(AppState.savedOpportunities));
    localStorage.setItem("qualifind_user", JSON.stringify(AppState.currentUser));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }
}

const STUDENT_VIEWS = ["dashboard", "matcher", "opportunities", "saved-applications", "eligibility", "action-plan", "profile"];
const ADMIN_VIEWS = ["admin-dashboard", "admin-programs", "admin-profile"];

function handleBrandClick() {
  if (AppState.currentUser.role === "admin") {
    navigateTo("admin-dashboard");
  } else {
    navigateTo("dashboard");
  }
}

// Router & View Switcher with Strict Role Separation
function navigateTo(viewId, payload = null) {
  const currentRole = AppState.currentUser.role || "student";

  // Strict Role Guard
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
      link.classList.add("bg-primary-container", "text-on-primary-container", "font-bold", "shadow-sm");
      link.classList.remove("text-on-surface-variant");
    } else {
      link.classList.remove("bg-primary-container", "text-on-primary-container", "font-bold", "shadow-sm");
      link.classList.add("text-on-surface-variant");
    }
  });

  renderCurrentView();
}

function renderCurrentView() {
  switch (AppState.currentView) {
    case "dashboard":
      renderDashboard();
      break;
    case "login":
      renderLogin();
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

// Dark Mode
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
  const btn = document.getElementById("theme-toggle-btn");
  if (btn) btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

// Toast System
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  if (type === "success") {
    toastIcon.textContent = "check_circle";
    toastIcon.className = "material-symbols-outlined text-success text-[20px]";
  } else if (type === "warning") {
    toastIcon.textContent = "warning";
    toastIcon.className = "material-symbols-outlined text-warning text-[20px]";
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
    showToast("Removed opportunity from saved drafts", "info");
  } else {
    AppState.savedOpportunities.push(oppId);
    showToast("Saved opportunity to your drafts!");
  }
  saveState();
  renderCurrentView();
}

// Match Calculation Engine (Philippine Grading & Context)
function calculateMatchForPrompt(userPrompt) {
  const query = userPrompt.toLowerCase();
  const keywords = query.split(/\s+/).filter(w => w.length > 2);
  
  const results = AppState.opportunities.map(opp => {
    let score = 52;
    
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

    score += Math.min(42, matchedKeywordsCount * 14);

    // In PH, GWA <= minGpa (e.g., 1.35 <= 1.75 is honors level)
    if (AppState.currentUser.gpa <= opp.minGpa) {
      score += 10;
    } else {
      score -= 15;
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

  document.getElementById("dash-stat-found").textContent = foundCount;
  document.getElementById("dash-stat-strong").textContent = strongCount;
  document.getElementById("dash-stat-total").textContent = foundCount;
  document.getElementById("dash-stat-potential").textContent = potentialCount;
  document.getElementById("dash-stat-saved").textContent = savedCount;

  // Render Philippine Date
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
      deadlineCard.classList.add("cursor-pointer", "hover:shadow-md", "hover:border-primary/40", "transition-all");
    } else {
      deadlineTitle.textContent = "No upcoming deadlines";
      deadlineDays.textContent = "—";
      deadlineCard.onclick = null;
    }
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
    const scoreColorClass = opp.matchScore >= 80 ? "text-success" : (opp.matchScore >= 60 ? "text-warning" : "text-on-surface-variant");
    const containerClass = opp.colorTheme === "secondary" ? "bg-secondary-container text-on-secondary-container" : "bg-primary-container text-on-primary-container";

    return `
      <div class="p-lg hover:bg-surface-container-low transition-colors group flex flex-col lg:flex-row gap-lg items-start border-b border-surface-variant/50 last:border-0 relative cursor-pointer" onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })">
        <div class="w-16 h-16 rounded-xl ${containerClass} flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform">
          <span class="material-symbols-outlined text-[28px]">${opp.icon || 'school'}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-sm mb-1">
            <span class="text-label-sm font-label-sm text-primary uppercase tracking-wider font-semibold">${opp.dept}</span>
            <span class="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span class="text-body-sm font-body-sm text-on-surface-variant font-medium">${opp.duration} &bull; ${opp.funding}</span>
          </div>
          <h3 class="text-headline-sm font-headline-sm text-on-surface mb-2 truncate group-hover:text-primary transition-colors">
            ${opp.title}
          </h3>
          <p class="text-body-sm font-body-sm text-on-surface-variant line-clamp-2 max-w-3xl">
            ${opp.summary}
          </p>
        </div>
        <div class="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-md lg:gap-4 mt-4 lg:mt-0" onclick="event.stopPropagation()">
          <div class="flex flex-col items-start lg:items-end">
            <span class="text-label-sm font-label-sm text-outline-variant uppercase tracking-widest mb-1">Match Score</span>
            <span class="text-headline-md font-headline-md ${scoreColorClass} font-bold">${opp.matchScore}%</span>
          </div>
          <div class="flex gap-2">
            <button class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors" onclick="toggleBookmark('${opp.id}', event)">
              <span class="material-symbols-outlined ${isSaved ? 'fill text-primary' : ''}">bookmark</span>
            </button>
            <button class="bg-surface-container text-on-surface hover:bg-surface-variant font-label-md text-label-md px-4 py-2 rounded-lg transition-colors font-semibold" onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })">
              Review Match
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Render AI Matcher Screen
function renderMatcher() {
  const chips = document.querySelectorAll("#matcher-chips button");
  const textarea = document.getElementById("ai-prompt-input");

  chips.forEach(chip => {
    chip.onclick = () => {
      if (textarea) {
        textarea.value = chip.getAttribute("data-prompt") || chip.textContent.trim();
        textarea.focus();
        chip.style.transform = "scale(0.95)";
        setTimeout(() => chip.style.transform = "scale(1)", 120);
      }
    };
  });

  renderMatcherDocChips();
  renderMatcherProfileChips();
}

// Toggle a quick-suggestion profile chip (multi-select; click again to deselect)
function toggleMatcherProfileTag(tagId) {
  const idx = AppState.matcherProfileTags.indexOf(tagId);
  if (idx > -1) {
    AppState.matcherProfileTags.splice(idx, 1);
  } else {
    AppState.matcherProfileTags.push(tagId);
  }
  renderMatcherProfileChips();
}

function renderMatcherProfileChips() {
  const container = document.getElementById("matcher-profile-chips");
  if (!container) return;

  container.innerHTML = MATCHER_PROFILE_TAGS.map(tag => {
    const selected = AppState.matcherProfileTags.includes(tag.id);
    return `
      <button type="button" onclick="toggleMatcherProfileTag('${tag.id}')" aria-pressed="${selected}" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all ${selected ? 'bg-primary text-on-primary border-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant border-outline-variant/30 hover:bg-primary-container/20 hover:text-on-surface'}">
        <span class="material-symbols-outlined text-[16px] ${selected ? 'fill' : ''}">${tag.icon}</span>
        ${tag.label}
        ${selected ? '<span class="material-symbols-outlined text-[14px] -mr-1">close</span>' : ''}
      </button>
    `;
  }).join("");
}

// Combines selected quick-suggestion chips with the free-text box into a single prompt,
// e.g. "Selected profile: College Student, Looking for Scholarship. Additional description: ..."
// This combined string is what gets passed into calculateMatchForPrompt() below — the
// existing matching logic is unchanged, it just receives a richer prompt.
function buildMatcherPrompt() {
  const textarea = document.getElementById("ai-prompt-input");
  const freeText = textarea ? textarea.value.trim() : "";
  const selectedLabels = MATCHER_PROFILE_TAGS
    .filter(tag => AppState.matcherProfileTags.includes(tag.id))
    .map(tag => tag.label);

  const parts = [];
  if (selectedLabels.length) parts.push(`Selected profile: ${selectedLabels.join(", ")}.`);
  if (freeText) parts.push(`Additional description: ${freeText}`);
  return parts.join(" ");
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
  showToast(`Attached ${files.length} document${files.length > 1 ? "s" : ""} for context.`, "info");
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
    <span class="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-primary-container/15 text-primary text-label-sm font-label-sm font-semibold">
      <span class="material-symbols-outlined text-[16px]">description</span>
      ${doc.name}
      <span class="text-outline font-normal">(${doc.sizeLabel})</span>
      <button type="button" onclick="removeMatcherDocument(${idx})" class="hover:text-error text-[16px] leading-none font-bold ml-1">&times;</button>
    </span>
  `).join("");
}

const MATCHER_LOADING_STEPS = [
  "Reading your research interests...",
  "Scanning DOST, CHED & foundation registry...",
  "Comparing against your GWA & profile...",
  "Ranking matches..."
];

function handleFindMatches() {
  const textarea = document.getElementById("ai-prompt-input");
  const hasFreeText = textarea && textarea.value.trim().length > 0;
  const hasTags = AppState.matcherProfileTags.length > 0;

  if (!hasFreeText && !hasTags) {
    showToast("Select what applies to you, or describe your situation.", "warning");
    return;
  }

  const promptText = buildMatcherPrompt();

  const matchBtn = document.getElementById("btn-find-matches");
  const statusEl = document.getElementById("matcher-loading-status");

  if (matchBtn) matchBtn.disabled = true;
  if (textarea) textarea.disabled = true;
  if (statusEl) statusEl.classList.remove("hidden");

  let step = 0;
  const setStep = () => {
    if (matchBtn) {
      matchBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]">sync</span> Analyzing...`;
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
      matchBtn.innerHTML = `<span class="material-symbols-outlined text-[20px] fill">auto_awesome</span> Find Matches`;
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

    AppState.activeFilters.matchQuality = ["high", "good", "low"];
    document.querySelectorAll(".filter-match-checkbox").forEach(cb => cb.checked = true);

    navigateTo("opportunities");
    showToast(`QualiFind AI Match Complete: Ranked ${scored.length} Philippine programs!`);
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
      <div class="col-span-12 bg-surface-container-lowest rounded-2xl p-2xl text-center flex flex-col items-center justify-center border border-outline-variant/30">
        <span class="material-symbols-outlined text-6xl text-outline mb-md">search_off</span>
        <h3 class="text-headline-sm font-headline-sm text-on-surface mb-xs">No opportunities match your filters</h3>
        <p class="text-body-md text-on-surface-variant max-w-md mb-lg">Try expanding your search terms or checking different Philippine scholarship types.</p>
        <button class="bg-primary text-on-primary px-lg py-2.5 rounded-full font-label-md" onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(opp => {
    const isSaved = AppState.savedOpportunities.includes(opp.id);
    const scoreColor = opp.matchScore >= 80 ? "text-success" : (opp.matchScore >= 60 ? "text-warning" : "text-on-surface-variant");
    const strokeClass = opp.matchScore >= 80 ? "text-success" : (opp.matchScore >= 60 ? "text-warning" : "text-outline");
    const borderHighlight = !opp.eligible ? "border-error/30" : (opp.matchScore >= 80 ? "border-success/30" : "border-outline-variant/30");

    return `
      <div class="opportunity-card bg-surface-container-lowest rounded-2xl p-lg shadow-sm hover:shadow-md border ${borderHighlight} flex flex-col h-full relative overflow-hidden group cursor-pointer" onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })">
        <div class="absolute top-0 right-0 w-24 h-24 ${opp.matchScore >= 80 ? 'bg-success/5' : 'bg-primary/5'} rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
        
        <div class="flex justify-between items-start mb-md">
          <span class="px-3 py-1 bg-surface-container rounded-full font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            ${opp.type}
          </span>
          <button class="text-outline hover:text-primary transition-colors p-1" onclick="toggleBookmark('${opp.id}', event)">
            <span class="material-symbols-outlined ${isSaved ? 'fill text-primary' : ''}">bookmark</span>
          </button>
        </div>

        <h3 class="font-headline-sm text-headline-sm text-on-surface mb-xs group-hover:text-primary transition-colors font-bold">
          ${opp.title}
        </h3>
        <p class="font-body-md text-body-md text-on-surface-variant mb-lg font-medium">${opp.provider}</p>

        <div class="grid grid-cols-2 gap-md mb-xl mt-auto pt-md border-t border-outline-variant/20">
          <div>
            <p class="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Grant / Stipend</p>
            <p class="font-label-md text-label-md text-on-surface font-bold">${opp.funding}</p>
          </div>
          <div>
            <p class="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Deadline</p>
            <p class="font-label-md text-label-md text-on-surface font-semibold">${opp.deadlineFormatted}</p>
          </div>
        </div>

        <div class="flex items-center justify-between bg-surface-container-low rounded-xl p-md">
          <div class="flex items-center gap-md">
            <div class="relative w-12 h-12 flex items-center justify-center">
              <svg class="absolute inset-0 w-full h-full radial-progress" viewBox="0 0 36 36">
                <path class="text-outline-variant/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                <path class="${strokeClass} progress-ring-circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="${opp.matchScore}, 100" stroke-linecap="round" stroke-width="3"></path>
              </svg>
              <span class="font-label-md text-label-md ${scoreColor} relative z-10 font-bold">${opp.matchScore}%</span>
            </div>
            <div>
              <p class="font-label-md text-label-md text-on-surface leading-none mb-1 font-semibold">${opp.matchScore >= 80 ? 'Excellent Match' : 'Good Match'}</p>
              <p class="font-label-sm text-label-sm ${opp.eligible ? 'text-success' : 'text-error'} flex items-center gap-1 font-medium">
                <span class="material-symbols-outlined text-[14px]">${opp.eligible ? 'check_circle' : 'cancel'}</span>
                ${opp.eligibilityNotes}
              </p>
            </div>
          </div>

          <button class="w-10 h-10 rounded-full bg-surface-container-highest hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors text-on-surface-variant">
            <span class="material-symbols-outlined">arrow_forward</span>
          </button>
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
  const btn = document.getElementById("btn-toggle-filters");
  if (!panel) return;

  const isHidden = panel.classList.contains("hidden");
  const shouldShow = forceState !== undefined ? forceState : isHidden;

  if (shouldShow) {
    panel.classList.remove("hidden");
    if (btn) btn.classList.add("bg-primary-container", "text-on-primary-container", "border-primary");
  } else {
    panel.classList.add("hidden");
    if (btn) btn.classList.remove("bg-primary-container", "text-on-primary-container", "border-primary");
  }
}

// Render Dedicated Saved Applications View Page
function renderSavedApplicationsView() {
  const container = document.getElementById("saved-applications-list");
  if (!container) return;

  const savedList = AppState.opportunities.filter(opp => AppState.savedOpportunities.includes(opp.id));

  if (savedList.length === 0) {
    container.innerHTML = `
      <div class="col-span-12 bg-surface-container-lowest rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-outline-variant/30">
        <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-4xl">bookmark_border</span>
        </div>
        <h3 class="text-xl font-bold text-on-surface mb-2">No Saved Applications Yet</h3>
        <p class="text-sm text-on-surface-variant max-w-md mb-6">Explore Philippine grants, scholarships, and R&amp;D programs, and click the bookmark icon to save them here for easy access.</p>
        <button onclick="navigateTo('opportunities')" class="bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm px-6 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">search_insights</span> Explore Opportunities
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = savedList.map(opp => {
    const scoreColor = opp.matchScore >= 80 ? "text-success" : (opp.matchScore >= 60 ? "text-warning" : "text-on-surface-variant");
    const borderHighlight = !opp.eligible ? "border-error/30" : (opp.matchScore >= 80 ? "border-success/30" : "border-outline-variant/30");

    return `
      <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm hover:shadow-md border ${borderHighlight} flex flex-col justify-between relative overflow-hidden group transition-all">
        <div>
          <div class="flex justify-between items-start mb-3">
            <span class="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider">
              ${opp.type}
            </span>
            <button class="text-primary hover:text-error transition-colors p-1" title="Remove from saved" onclick="toggleBookmark('${opp.id}', event)">
              <span class="material-symbols-outlined text-[22px] fill">bookmark</span>
            </button>
          </div>

          <h3 class="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
            ${opp.title}
          </h3>
          <p class="text-xs font-medium text-on-surface-variant mb-4">${opp.provider}</p>

          <div class="p-3 bg-surface-container-low rounded-xl flex items-center justify-between mb-4">
            <div>
              <span class="text-[10px] text-outline uppercase font-semibold block">Funding / Stipend</span>
              <span class="text-xs font-bold text-on-surface">${opp.funding}</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-outline uppercase font-semibold block">Match Score</span>
              <span class="text-sm font-extrabold ${scoreColor}">${opp.matchScore}%</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-3 border-t border-outline-variant/20">
          <button onclick="navigateTo('eligibility', { opportunityId: '${opp.id}' })" class="flex-1 bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[16px]">visibility</span> Review Match
          </button>
          <button onclick="navigateTo('action-plan', { opportunityId: '${opp.id}' })" class="flex-1 bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold py-2.5 rounded-xl transition-all border border-outline-variant/30 flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[16px]">checklist</span> Action Plan
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function resetFilters() {
  AppState.activeFilters = {
    types: ["Research Grant", "Fellowship", "Scholarship", "Postdoc Position"],
    matchQuality: ["high", "good", "low"],
    deadline: "Any Time",
    searchQuery: "",
    savedOnly: false
  };
  
  const searchInput = document.getElementById("search-opportunities-input");
  if (searchInput) searchInput.value = "";
  
  const savedCb = document.getElementById("filter-saved-only-checkbox");
  if (savedCb) savedCb.checked = false;

  renderOpportunitiesList();
}

// Computes a live GWA comparison between the current user and a program, recalculated on every render
function computeGwaReason(opp) {
  const gwa = AppState.currentUser.gpa;
  const meets = gwa <= opp.minGpa;
  return {
    meets,
    title: meets ? "Academic GWA Standing" : "GWA Above Requirement",
    text: meets
      ? `Your current GWA of ${gwa.toFixed(2)} meets the ${opp.provider} requirement of ${opp.minGpa.toFixed(2)} or better (lower is stronger on the PH scale).`
      : `Your current GWA of ${gwa.toFixed(2)} does not meet the required ${opp.minGpa.toFixed(2)} for this program. You may still apply, but expect this to weaken your standing.`
  };
}

// Render Eligibility Detail View
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

  const gwaReason = computeGwaReason(opp);
  const liveEligible = opp.status !== "Expired" && gwaReason.meets;

  document.getElementById("eligibility-title").textContent = opp.title;
  document.getElementById("eligibility-provider").textContent = opp.provider;
  document.getElementById("eligibility-summary").textContent = opp.summary;
  document.getElementById("eligibility-score").textContent = `${opp.matchScore}%`;
  document.getElementById("eligibility-funding").textContent = opp.funding;
  document.getElementById("eligibility-deadline").textContent = opp.deadlineFormatted;

  const statusBadge = document.getElementById("eligibility-status-badge");
  const statusIcon = document.getElementById("eligibility-status-icon");
  if (statusBadge) {
    statusBadge.textContent = liveEligible
      ? "Status: Eligible (GWA Verified Live)"
      : (opp.status === "Expired" ? "Status: Deadline Passed" : "Status: GWA Does Not Meet Cutoff");
  }
  if (statusIcon) {
    statusIcon.textContent = liveEligible ? "check_circle" : "error";
    statusIcon.className = `material-symbols-outlined text-3xl ${liveEligible ? 'text-secondary-container' : 'text-warning'}`;
    statusIcon.style.fontVariationSettings = "'FILL' 1";
  }

  // Why Strong Match Points — GWA comparison is computed live; everything else is supporting program context
  const reasonsContainer = document.getElementById("eligibility-reasons-grid");
  if (reasonsContainer) {
    const reasons = [
      { title: gwaReason.title, text: gwaReason.text, ok: gwaReason.meets }
    ];

    if (opp.status === "Expired") {
      reasons.push({
        title: "Application Deadline Passed",
        text: `This program's deadline (${opp.deadlineFormatted}) has already passed. It's shown for reference only.`,
        ok: false
      });
    }

    (opp.whyStrongMatch || [])
      .filter(r => !/\bGWA\b/i.test(r))
      .forEach(r => reasons.push({ title: "Program Alignment", text: r, ok: true }));

    reasonsContainer.innerHTML = reasons.map(r => `
      <div class="bg-surface-container-lowest p-lg rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-24 h-24 ${r.ok ? 'bg-primary/10 group-hover:bg-primary/20' : 'bg-warning/10 group-hover:bg-warning/20'} rounded-full blur-xl -mr-8 -mt-8 transition-colors"></div>
        <div class="flex items-center gap-md mb-md relative z-10">
          <div class="w-10 h-10 rounded-full ${r.ok ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'} flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined">${r.ok ? 'check_circle' : 'warning'}</span>
          </div>
          <h3 class="text-headline-sm font-headline-sm text-on-surface font-bold">${r.title}</h3>
        </div>
        <p class="text-body-md font-body-md text-on-surface-variant relative z-10 leading-relaxed font-medium">
          ${r.text}
        </p>
      </div>
    `).join("");
  }

  // Checklist
  const checklistContainer = document.getElementById("eligibility-checklist-items");
  if (checklistContainer) {
    checklistContainer.innerHTML = (opp.requirements || []).map(req => {
      let iconColor = "bg-success text-on-primary";
      let iconSymbol = "check";
      let badgeClass = "bg-surface-container-low text-success";

      if (req.status === "action") {
        iconColor = "bg-warning text-on-primary";
        iconSymbol = "priority_high";
        badgeClass = "bg-warning/10 text-warning";
      } else if (req.status === "pending") {
        iconColor = "bg-surface-container-high text-outline-variant";
        iconSymbol = "schedule";
        badgeClass = "bg-surface-container text-on-surface-variant";
      }

      return `
        <div class="flex items-start gap-md">
          <div class="w-6 h-6 rounded-full ${iconColor} flex items-center justify-center shrink-0 mt-1 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">${iconSymbol}</span>
          </div>
          <div class="flex-1">
            <h4 class="text-label-md font-label-md text-on-surface font-semibold">${req.title}</h4>
            <p class="text-body-sm font-body-sm text-on-surface-variant mt-xs">${req.desc}</p>
            <div class="mt-xs inline-flex items-center px-2 py-1 rounded text-label-sm font-label-sm ${badgeClass} font-semibold">
              ${req.note}
            </div>
          </div>
        </div>
      `;
    }).join(`<div class="w-full h-px bg-outline-variant/30"></div>`);
  }

  const bookmarkBtn = document.getElementById("eligibility-bookmark-btn");
  if (bookmarkBtn) {
    const isSaved = AppState.savedOpportunities.includes(opp.id);
    bookmarkBtn.innerHTML = `
      <span class="material-symbols-outlined ${isSaved ? 'fill text-primary' : ''}">bookmark</span>
      ${isSaved ? 'Saved in Drafts' : 'Save for Later'}
    `;
    bookmarkBtn.onclick = (e) => {
      toggleBookmark(opp.id, e);
      renderEligibilityDetails(opp.id);
    };
  }
}

// Render Action Plan Screen
function renderActionPlan(oppId) {
  const opp = AppState.opportunities.find(o => o.id === oppId);
  if (!opp) {
    showToast("That program isn't in the registry anymore.", "warning");
    navigateTo("opportunities");
    return;
  }

  const titleEl = document.getElementById("action-plan-target-title");
  if (titleEl) titleEl.textContent = opp.title;

  const gwa = AppState.currentUser.gpa;
  const pendingReqs = (opp.requirements || []).filter(r => r.status !== "satisfied");

  const planDescEl = document.getElementById("action-plan-recommendation-text");
  if (planDescEl) {
    const nextStep = pendingReqs[0]
      ? pendingReqs[0].title.toLowerCase()
      : "final document review";
    planDescEl.textContent = `Based on your ${opp.matchScore}% match score and GWA of ${gwa.toFixed(2)}, the highest-leverage next step is ${nextStep}. ${pendingReqs.length} of ${opp.requirements.length} requirements still need action.`;
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
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container/20 text-primary font-label-md text-label-md font-semibold">
        ${skill}
        <button type="button" onclick="removeSkill(${idx})" class="hover:text-error text-[16px] leading-none font-bold">&times;</button>
      </span>
    `).join("") + `
      <span class="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/50 focus-within:border-primary transition-colors">
        <input type="text" id="new-skill-input" placeholder="Add a skill..." onkeydown="if(event.key==='Enter'){event.preventDefault();addSkill();}" class="bg-transparent px-3 py-1.5 text-label-md font-label-md text-on-surface placeholder:text-outline focus:outline-none w-32"/>
        <button type="button" onclick="addSkill()" class="pr-3 text-primary hover:text-primary-container">
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
        </button>
      </span>
    `;
  }
}

function saveProfile(event) {
  if (event) event.preventDefault();
  
  AppState.currentUser.name = document.getElementById("profile-name-input").value;
  AppState.currentUser.email = document.getElementById("profile-email-input").value;
  AppState.currentUser.gpa = parseFloat(document.getElementById("profile-gpa-input").value) || 1.35;
  AppState.currentUser.department = document.getElementById("profile-dept-input").value;
  AppState.currentUser.bio = document.getElementById("profile-bio-input").value;

  let strength = 70;
  if (AppState.currentUser.gpa <= 1.75) strength += 10;
  if (AppState.currentUser.skills.length >= 4) strength += 10;
  if (AppState.currentUser.bio.length > 20) strength += 8;
  AppState.currentUser.profileStrength = Math.min(100, strength);

  saveState();
  showToast("QualiFind profile updated successfully!");
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
    const refocused = document.getElementById("new-skill-input");
    if (refocused) refocused.focus();
  }
}

// Render Admin Dashboard
function renderAdminDashboard() {
  const total = AppState.opportunities.length;
  const active = AppState.opportunities.filter(o => o.status === "Active").length;
  const inReview = AppState.opportunities.filter(o => o.status === "In Review" || o.status === "Draft").length;
  const expired = AppState.opportunities.filter(o => o.status === "Expired").length;

  document.getElementById("admin-stat-total").textContent = total;
  document.getElementById("admin-stat-active").textContent = active;
  document.getElementById("admin-stat-review").textContent = inReview;
  document.getElementById("admin-stat-expired").textContent = expired;

  const tbody = document.getElementById("admin-recent-programs-tbody");
  if (!tbody) return;

  const recent = AppState.opportunities.slice(0, 4);
  tbody.innerHTML = recent.map(opp => {
    let statusClass = "bg-success/10 text-success";
    let statusDot = "bg-success";
    if (opp.status === "Expired") {
      statusClass = "bg-error-container/30 text-error";
      statusDot = "bg-error";
    } else if (opp.status === "In Review" || opp.status === "Draft") {
      statusClass = "bg-warning/10 text-warning";
      statusDot = "bg-warning";
    }

    return `
      <tr class="hover:bg-surface-container-lowest/80 transition-colors">
        <td class="py-4 px-xl">
          <div class="flex items-center gap-md">
            <div class="w-10 h-10 rounded bg-primary-container/20 flex items-center justify-center text-primary font-bold">
              ${opp.title.charAt(0)}
            </div>
            <div>
              <div class="font-label-md text-label-md text-on-surface font-semibold">${opp.title}</div>
              <div class="text-on-surface-variant text-label-sm mt-0.5">Ref: ${opp.id}</div>
            </div>
          </div>
        </td>
        <td class="py-4 px-md">${opp.dept}</td>
        <td class="py-4 px-md">
          <span class="inline-flex items-center gap-xs px-2.5 py-1 rounded-full ${statusClass} font-label-sm text-label-sm font-semibold">
            <span class="w-1.5 h-1.5 rounded-full ${statusDot}"></span>
            ${opp.status}
          </span>
        </td>
        <td class="py-4 px-md text-on-surface-variant font-medium">${opp.deadlineFormatted}</td>
        <td class="py-4 px-xl text-right">
          <button class="p-2 text-outline hover:text-primary transition-colors rounded-full hover:bg-surface-container" onclick="openEditProgramModal('${opp.id}')">
            <span class="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Render Admin Programs Management Screen
function renderAdminPrograms() {
  const tbody = document.getElementById("admin-programs-full-tbody");
  if (!tbody) return;

  const searchQuery = (AppState.adminFilter.search || "").toLowerCase();
  const statusFilter = AppState.adminFilter.status;

  const filtered = AppState.opportunities.filter(opp => {
    if (statusFilter !== "All" && opp.status !== statusFilter) return false;
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

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-on-surface-variant">
          No programs found matching your search.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(opp => {
    let statusBadge = `<span class="inline-flex items-center gap-xs px-3 py-1 bg-success/10 text-success rounded-full font-label-sm font-semibold"><span class="w-2 h-2 rounded-full bg-success"></span>Active</span>`;
    if (opp.status === "Expired") {
      statusBadge = `<span class="inline-flex items-center gap-xs px-3 py-1 bg-error-container/30 text-error rounded-full font-label-sm font-semibold"><span class="w-2 h-2 rounded-full bg-error"></span>Expired</span>`;
    } else if (opp.status === "In Review" || opp.status === "Draft") {
      statusBadge = `<span class="inline-flex items-center gap-xs px-3 py-1 bg-warning/10 text-warning rounded-full font-label-sm font-semibold"><span class="w-2 h-2 rounded-full bg-warning"></span>${opp.status}</span>`;
    }

    return `
      <tr class="hover:bg-surface-container-lowest/50 transition-colors group cursor-pointer">
        <td class="px-lg py-md">
          <div class="w-5 h-5 rounded border border-outline-variant bg-surface flex items-center justify-center"></div>
        </td>
        <td class="px-lg py-md">
          <div class="flex items-center gap-md">
            <div class="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-headline-sm text-headline-sm font-bold">
              ${opp.title.charAt(0)}
            </div>
            <div class="flex flex-col">
              <span class="font-headline-sm text-headline-sm text-on-surface line-clamp-1 font-bold">${opp.title}</span>
              <span class="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">Ref: ${opp.id}</span>
            </div>
          </div>
        </td>
        <td class="px-lg py-md font-body-sm text-body-sm text-on-surface font-medium">${opp.provider}</td>
        <td class="px-lg py-md">
          <span class="px-3 py-1 bg-surface-container-high text-on-surface rounded-full font-label-sm text-label-sm font-semibold">${opp.type}</span>
        </td>
        <td class="px-lg py-md">
          <div class="flex flex-col">
            <span class="font-body-sm text-body-sm text-on-surface font-semibold">${opp.deadlineFormatted}</span>
            <span class="font-label-sm text-label-sm ${opp.deadlineDays < 0 ? 'text-error' : (opp.deadlineDays < 20 ? 'text-warning' : 'text-on-surface-variant')} font-medium">
              ${opp.deadlineDays < 0 ? 'Past due' : `In ${opp.deadlineDays} days`}
            </span>
          </div>
        </td>
        <td class="px-lg py-md">${statusBadge}</td>
        <td class="px-lg py-md text-right" onclick="event.stopPropagation()">
          <div class="flex items-center justify-end gap-sm">
            <button class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors" title="Edit Program" onclick="openEditProgramModal('${opp.id}')">
              <span class="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors" title="Duplicate" onclick="duplicateProgram('${opp.id}')">
              <span class="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
            <button class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition-colors" title="Delete" onclick="deleteProgram('${opp.id}')">
              <span class="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

// Program Modal (Add/Edit)
function openAddProgramModal() {
  AppState.editingProgramId = null;
  document.getElementById("program-modal-title").textContent = "Add Philippine Program / Grant";
  document.getElementById("program-form").reset();
  document.getElementById("prog-id-input").value = `DOST-GRANT-${Math.floor(100 + Math.random() * 900)}`;
  
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
      minGpa: 1.75,
      eligible: true,
      eligibilityNotes: "New Philippine Program",
      leadProf: "Dr. Faculty Adviser",
      teamCount: 2,
      icon: "school",
      colorTheme: "primary",
      requirements: [
        { id: "req-1", title: "Eligibility", desc: "General Philippine HEI criteria met.", status: "satisfied", note: "Satisfied" }
      ],
      keywords: [title.toLowerCase(), provider.toLowerCase(), dept.toLowerCase(), "philippines"]
    };
    AppState.opportunities.unshift(newProgram);
    showToast("New program added to QualiFind registry!");
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

// Explicit Multi-User Profiles
const USER_PROFILES = {
  student: {
    name: "Maria Clara Santos",
    role: "student",
    title: "Graduate Researcher (UP Diliman)",
    email: "maria.santos@up.edu.ph",
    avatar: "MS",
    badge: "Student • Web & Mobile",
    platformSupport: "Mobile & Desktop Web Supported",
    gpa: 1.35,
    gpaFormatted: "1.35 GWA (92% / 3.85 GPA Equivalent)",
    degree: "M.S. Computer Science (Bioinformatics Track)",
    department: "Department of Computer Science & Philippine Genome Center",
    institution: "University of the Philippines Diliman",
    profileStrength: 88,
    skills: ["Bioinformatics & Genomics", "Python / PyTorch", "COARE Supercomputer", "Qiskit Quantum", "Data Modeling (R)"],
    bio: "Second-year graduate researcher at UP Diliman specializing in computational genomics, AI-driven epidemic simulation, and high-performance computing in the Philippine setting."
  },
  admin: {
    name: "Dr. Ernesto Ramos",
    role: "admin",
    title: "Director of Research & Fellowships Office (DOST / CHED Liaison)",
    email: "ernesto.ramos@up.edu.ph",
    avatar: "ER",
    badge: "Admin • Web Only",
    platformSupport: "Desktop Web Workstation Only",
    gpa: 1.0,
    gpaFormatted: "Ph.D. Computer Science",
    degree: "Ph.D. Computer Science & AI Systems",
    department: "Office of the Vice Chancellor for Research & Development",
    institution: "University of the Philippines Diliman",
    profileStrength: 100,
    skills: ["Grant Administration", "DOST NHRDA Evaluation", "CHED SUC Accreditation", "Curriculum Review"],
    bio: "Lead program coordinator overseeing national science fellowships, high-performance computing allocations, and Philippine government R&D grant disbursements."
  }
};

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
      showToast("Switched to Admin Portal (Desktop Web Optimized)");
      navigateTo("admin-dashboard");
    } else {
      showToast("Switched to Student Portal (Mobile & Web Supported)");
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
    if (studentBtn) studentBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-surface-container-lowest text-primary shadow-sm";
    if (adminBtn) adminBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface";
    if (emailInput && !emailInput.value.includes("ernesto")) emailInput.value = "maria.santos@up.edu.ph";
  } else {
    if (adminBtn) adminBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-surface-container-lowest text-secondary shadow-sm";
    if (studentBtn) studentBtn.className = "flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 text-on-surface-variant hover:text-on-surface";
    if (emailInput && !emailInput.value.includes("maria")) emailInput.value = "ernesto.ramos@up.edu.ph";
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

function renderLogin() {
  const role = AppState.currentUser.role || "student";
  selectLoginRole(role);
}

function toggleRole() {
  if (AppState.currentUser.role === "student") {
    setRole("admin");
  } else {
    setRole("student");
  }
}

function updateRoleUI() {
  const isStudent = AppState.currentUser.role === "student";
  
  // Strict Navigation Group Toggling
  const studentNavGroup = document.getElementById("student-nav-group");
  const adminNavGroup = document.getElementById("admin-nav-group");
  const studentMobileNav = document.getElementById("student-mobile-nav");
  const appSubtitle = document.getElementById("sidebar-app-subtitle");

  if (studentNavGroup) studentNavGroup.classList.toggle("hidden", !isStudent);
  if (adminNavGroup) adminNavGroup.classList.toggle("hidden", isStudent);
  if (studentMobileNav) studentMobileNav.style.display = isStudent ? "" : "none";
  if (appSubtitle) appSubtitle.textContent = isStudent ? "Student Portal" : "DOST / CHED Admin";

  // Update header labels
  const roleLabel = document.getElementById("header-user-role");
  if (roleLabel) roleLabel.textContent = isStudent ? "Student • Mobile & Web" : "Admin • Desktop Web Only";

  const nameLabel = document.getElementById("header-user-name");
  if (nameLabel) nameLabel.textContent = AppState.currentUser.name;

  const headerAvatar = document.getElementById("header-user-avatar");
  if (headerAvatar) {
    headerAvatar.textContent = AppState.currentUser.avatar || (isStudent ? "MS" : "ER");
    headerAvatar.className = `w-6 h-6 rounded-full ${isStudent ? 'bg-primary' : 'bg-secondary'} text-on-primary flex items-center justify-center text-[10px] font-bold`;
  }

  // Update sidebar labels
  const sidebarName = document.getElementById("sidebar-user-name");
  if (sidebarName) sidebarName.textContent = AppState.currentUser.name;

  const sidebarBadge = document.getElementById("sidebar-user-badge");
  if (sidebarBadge) {
    sidebarBadge.textContent = isStudent ? "Student • Web & Mobile" : "Admin • Web Only";
    sidebarBadge.className = `inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${isStudent ? 'bg-primary/10 text-primary' : 'bg-secondary-container text-on-secondary-container'}`;
  }

  const sidebarAvatar = document.getElementById("sidebar-user-avatar");
  if (sidebarAvatar) {
    sidebarAvatar.textContent = AppState.currentUser.avatar || (isStudent ? "MS" : "ER");
    sidebarAvatar.className = `w-8 h-8 rounded-full ${isStudent ? 'bg-primary' : 'bg-secondary'} text-on-primary flex items-center justify-center font-bold text-xs shrink-0`;
  }

  const roleSwitchBtn = document.getElementById("role-switch-btn");
  if (roleSwitchBtn) {
    roleSwitchBtn.innerHTML = isStudent 
      ? `<span class="material-symbols-outlined text-[18px]">admin_panel_settings</span> Switch to Admin View`
      : `<span class="material-symbols-outlined text-[18px]">school</span> Switch to Student View`;
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

// Expose interactive methods globally for HTML event handlers in Vite ES Module mode
window.navigateTo = navigateTo;
window.handleBrandClick = handleBrandClick;
window.handleFindMatches = handleFindMatches;
window.handleDocumentSelect = handleDocumentSelect;
window.removeMatcherDocument = removeMatcherDocument;
window.selectLoginRole = selectLoginRole;
window.togglePasswordVisibility = togglePasswordVisibility;
window.handleLoginFormSubmit = handleLoginFormSubmit;
window.quickLoginAs = quickLoginAs;
window.renderLogin = renderLogin;
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
window.toggleRole = toggleRole;
window.setRole = setRole;
window.openUserSwitchModal = openUserSwitchModal;
window.closeUserSwitchModal = closeUserSwitchModal;
window.showToast = showToast;
window.toggleDarkMode = toggleDarkMode;

// App Initialization (Supports direct load & DOMContentLoaded)
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
