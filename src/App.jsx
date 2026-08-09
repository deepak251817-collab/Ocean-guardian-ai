import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/Toast";

// Lazy-loaded route pages for code splitting & performance optimization
const LandingPage = lazy(() => import("./pages/LandingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const PollutionPage = lazy(() => import("./pages/PollutionPage"));
const BiodiversityPage = lazy(() => import("./pages/BiodiversityPage"));
const AlertCenterPage = lazy(() => import("./pages/AlertCenterPage"));
const ReportsPage = lazy(() => import("./pages/ReportsPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-ocean-gradient flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-ocean-300/30 border-t-ocean-300 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium tracking-wide">Loading Ocean Guardian AI…</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"             element={<LandingPage />} />
          <Route path="/dashboard"    element={<DashboardPage />} />
          <Route path="/pollution"    element={<PollutionPage />} />
          <Route path="/biodiversity" element={<BiodiversityPage />} />
          <Route path="/alerts"       element={<AlertCenterPage />} />
          <Route path="/reports"      element={<ReportsPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        {/* Global toast notifications */}
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}
