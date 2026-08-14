# QualiFind 🇵🇭
### AI-Powered Academic & Research Opportunity Matching Platform (Philippine Higher Education Setting)

QualiFind connects Filipino undergraduate, graduate, and post-doctoral researchers with national and international funding opportunities, fellowships, scholarships, and grants calibrated for Philippine higher education institutions (DOST-SEI, CHED, Philippine Genome Center, DOST-ASTI, SUC Consortiums, and philanthropic foundations).

---

## 🌟 Key Features

### 👤 1. Strict Dual-User Role-Based Architecture
- **Student / Opportunity Seeker** (*Maria Clara Santos* - Graduate Researcher, UP Diliman):
  - **Multi-Device Support**: Optimized for both **Mobile Browsers** and **Desktop Web**.
  - **Natural Language AI Matcher**: Evaluates research interests, GWA, and target stipend to rank relevant opportunities with explainable match metrics.
  - **Eligibility Verification**: Automatic evaluation against Philippine General Weighted Average (GWA) scales and national consortium criteria.
  - **Customized Action Plan**: Actionable milestone roadmap for letters of endorsement, NHRDA concept notes, and clearances.
  - **Academic Profile Management**: Editable skills, transcript records, and Philippine research goals.
- **Administrator / Evaluator** (*Dr. Ernesto Ramos* - Director, Office of Research & Fellowships / DOST-CHED Liaison):
  - **Workstation Access**: Exclusively designed for **Desktop Web** workstations with mobile protective guards.
  - **Registry Analytics**: High-level telemetry on student matching volume and national grant disbursements.
  - **Program Management CRUD**: Add, edit, duplicate, and archive Philippine scholarship/grant registries with line-item funding and deadlines.
  - **Strict Two-Way Access Isolation**: Students cannot access administrative controls or datasets, and administrators work inside an isolated workstation portal.

### 🇵🇭 2. Philippine Higher Education Calibration
- **Philippine Peso (₱ / PHP)** currency representation.
- Realistically modeled Philippine research programs:
  - **DOST-SEI ASTHRDP** (Accelerated Science and Technology Human Resource Development Program)
  - **DOST-ERDT** (Engineering Research and Development for Technology)
  - **Philippine Genome Center (PGC)** Computational Genomics Research Fellowship
  - **DOST-ASTI** AI & Quantum Computing R&D Practicum Grant (COARE Supercomputer access)
  - **CHED SUC** Faculty & Graduate Research Development Grant
  - **Gokongwei Brothers Foundation (GBF)** STEM Leaders Fellowship
  - **Ayala Foundation** Sustainability & Climate Research Grant
  - **DOST-PCHRD** Health Innovation & Tropical Disease Modeling Grant

---

## 🚀 Tech Stack

- **Frontend**: Single-Page Application (SPA) with Vanilla JavaScript, HTML5, and CSS3.
- **Design System & Styling**: Academic Nexus Design System with custom HSL tokens, Tailwind CSS, Google Fonts (*Inter*), and Google Material Symbols.
- **State Management & Persistence**: Client-side reactive router, filter engine, dynamic scoring weighting, and `LocalStorage` sync.

---

## 💻 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aj515/qualifind.git
   cd qualifind
   ```

2. **Serve the application**:
   ```bash
   # Using Python 3:
   python -m http.server 3000
   
   # Or using Node.js / npx:
   npx serve .
   ```

3. Open your browser at `http://localhost:3000`.

---

## 📄 License
MIT License. Developed for Philippine Higher Education Innovation.
