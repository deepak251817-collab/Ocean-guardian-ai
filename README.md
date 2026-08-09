# Ocean Guardian AI — AI-Powered Ocean Monitoring Platform

Ocean Guardian AI is a real-time, interactive React dashboard designed to monitor global ocean health, track marine biodiversity, analyze chemical/plastic pollution anomalies, and coordinate early warnings for marine conservation.

---

## 🚀 Key Features

- **Interactive Ocean Map**: Map layer tracking global telemetry sensors with color-coded warning, critical, and healthy statuses.
- **Dynamic Ocean Details Drawer**: Swipe-to-close side drawer with real-time stats including pH levels, species count, water temp, and recent alerts.
- **Upgraded Analytics Dashboard**: Includes 9 recharts-based trend visualizations (Ocean Health, Coral Bleaching, Temperature Comparison, and Species Migration trends).
- **AI Assistant Widget**: Floating chat assistant with predefined questions, free-form inputs, HMR compilation, and persistent chat logs.
- **Alert Center**: Early warnings with resolved/dismissed states and Framer Motion slide-out list animations.
- **Reports Catalog**: Weekly, monthly, and annual policy reports with dynamic PDF/CSV download progress trackers.
- **Premium Glassmorphism Design**: High-contrast, dark-mode-first aesthetic with smooth animations, custom scrollbars, and accessible keyboard navigability.

---

## 🛠 Tech Stack

- **Framework**: React 18 & Vite
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Map Visualizations**: Leaflet & React Leaflet
- **Icons**: Lucide React

---

## 📁 Folder Structure

```
OceanGuardianAI/
├── src/
│   ├── components/
│   │   ├── charts/         # PHChart, TemperatureChart, CoralReefHealthChart...
│   │   ├── drawer/         # OceanDetailsDrawer
│   │   ├── layout/         # Sidebar, Navbar, MobileNav, PageHeader
│   │   ├── map/            # OceanMap
│   │   └── ui/             # AIAssistant, ActivityTimeline, ErrorState, Toast
│   ├── context/
│   │   └── ThemeContext.jsx # Theme switcher & local storage state
│   ├── data/
│   │   └── mockData.js     # Merged mock records & metric variables
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PollutionPage.jsx
│   │   ├── BiodiversityPage.jsx
│   │   ├── AlertCenterPage.jsx
│   │   └── ReportsPage.jsx
│   ├── utils/
│   │   ├── useDebounce.js  # Custom performance search debouncing
│   │   └── oceanHealth.js  # Dynamic composite health calculator
│   ├── App.jsx             # Code-split router configuration
│   ├── index.css           # Global keyframes & variables
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 💻 Installation & Setup

1. **Clone & Navigate**:
   ```bash
   git clone https://github.com/Deepak02205/ocean-guardian-ai.git
   cd ocean-guardian-ai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 📊 Screens Overview

- **Landing Page**: Immersive, full-screen entry outlining features and statistics.
- **Ocean Health Dashboard**: Main cockpit featuring live status cards, dynamic dials, active tables, and charts.
- **Pollution Monitor**: Tracks plastic, microplastic, oil spill, and thermal plumes with intervention options.
- **Biodiversity Tracker**: Species censuses, threat level indices, and conservation action items.
- **Alert Center**: Ingest hub for resolving or dismissing early warning triggers.

---

## 🔮 Future Scope

- **Real Live-Data API Integration**: Connecting to NOAA/GEBCO satellite registries.
- **Machine Learning Predictor**: Deploying TensorFlow.js models directly in the client to predict red tide events.
- **User Observations Submissions**: Enabling divers and scientists to upload photos and coordinate validation.

---

## 👥 Contributors & Team

- **Deepak** — Project Architect & Lead Developer
- **Antigravity AI** — Pair Programmer & Architect Assistant
