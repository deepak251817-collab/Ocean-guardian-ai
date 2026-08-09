import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Waves, Bell, Search, Menu, X, ChevronRight, LayoutDashboard, AlertTriangle, Thermometer, Fish, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { mockNotifications } from "../../data/mockData";
import { useTheme } from "../../context/ThemeContext";

const mobileLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "/#features" },
  { label: "About", href: "/" },
];

export default function Navbar({ variant = "landing", searchQuery, setSearchQuery }) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const isDashboard = variant === "dashboard";

  const surfaceClass = theme === "light"
    ? "bg-white/90 border border-cyan-200/70 text-slate-900 shadow-lg shadow-cyan-100/30"
    : "glass border border-ocean-800/60 text-white";

  const textMutedClass = theme === "light" ? "text-slate-600" : "text-slate-400";
  const panelClass = theme === "light"
    ? "absolute right-0 mt-2 w-80 bg-white/95 border border-cyan-100 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
    : "absolute right-0 mt-2 w-80 glass border border-ocean-800/60 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right";

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full ${
          isDashboard
            ? surfaceClass + " h-16"
            : surfaceClass
        }`}
        role="banner"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
              <Waves className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white hidden sm:block">
              Ocean Guardian <span className="text-ocean-300">AI</span>
            </span>
          </Link>

          {/* Dashboard: search */}
          {isDashboard && (
            <div className="hidden md:flex flex-1 max-w-xs">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="search"
                  value={searchQuery || ""}
                  onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                  placeholder="Search stations, species…"
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm focus:outline-none transition-all ${
                    theme === "light"
                      ? "bg-white text-slate-900 border-cyan-200 placeholder:text-slate-500 focus:border-cyan-400"
                      : "bg-ocean-800/50 border-ocean-800/60 text-slate-300 placeholder:text-slate-600 focus:border-ocean-300/40 focus:bg-ocean-800/70"
                  }`}
                  aria-label="Search"
                />
              </div>
            </div>
          )}

          {/* Landing nav links */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Landing navigation">
                  {[
                    { label: "Features", href: "#features" },
                    { label: "How It Works", href: "#how-it-works" },
                    { label: "Data", href: "#data" },
                    { label: "Research", href: "#research" },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      className={`px-3 py-2 text-sm rounded-lg transition-all font-medium ${theme === "light" ? "text-slate-600 hover:text-slate-900 hover:bg-cyan-50" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                    >
                      {label}
                    </a>
                  ))}
            </nav>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${theme === "light" ? "hover:bg-cyan-50 text-slate-600 hover:text-slate-900" : "hover:bg-ocean-800/60 text-slate-400 hover:text-white"}`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-500" />}
            </button>

            {isDashboard && (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`relative p-2 rounded-xl transition-all ${theme === "light" ? "hover:bg-cyan-50 text-slate-600 hover:text-slate-900" : "hover:bg-ocean-800/60 text-slate-400 hover:text-white"}`}
                    aria-label="Notifications (3 unread)"
                  >
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-ocean-900" />
                  </button>
                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={panelClass}
                      >
                        <div className="p-3 border-b border-ocean-800/60 flex items-center justify-between">
                          <h3 className={`text-sm font-semibold ${theme === "light" ? "text-slate-900" : "text-white"}`}>Notifications</h3>
                          <span className={`text-xs cursor-pointer ${theme === "light" ? "text-cyan-700 hover:text-cyan-900" : "text-ocean-300 hover:text-ocean-200"}`}>Mark all read</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto divide-y divide-ocean-800/40">
                          {mockNotifications.map(n => {
                            const Icon = { AlertTriangle, Thermometer, Fish }[n.icon] || Bell;
                            return (
                              <div key={n.id} className="p-3 hover:bg-ocean-800/20 transition-colors flex gap-3 cursor-pointer">
                                <div className={`mt-0.5 p-2 rounded-lg bg-ocean-800/50 shrink-0 ${n.status === 'critical' ? 'text-red-400' : n.status === 'warning' ? 'text-amber-400' : 'text-teal-400'}`}>
                                  <Icon size={14} />
                                </div>
                                <div>
                                  <p className={`text-sm font-medium mb-0.5 ${theme === "light" ? "text-slate-900" : "text-slate-200"}`}>{n.title}</p>
                                  <p className={`text-xs line-clamp-2 leading-relaxed mb-1 ${textMutedClass}`}>{n.description}</p>
                                  <p className="text-[10px] text-slate-500">{n.time}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer">
                  MR
                </div>
              </>
            )}

            {!isDashboard && (
              <>
                <Link
                  to="/dashboard"
                  className="hidden md:inline-flex btn-secondary text-xs py-2 px-4"
                >
                  Sign In
                </Link>
                <Link
                  to="/dashboard"
                  className="hidden md:inline-flex btn-primary text-xs py-2 px-4"
                >
                  <LayoutDashboard size={14} />
                  Open Dashboard
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            {!isDashboard && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-ocean-800/60 transition-all text-slate-400 hover:text-white"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && !isDashboard && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-16 z-30 glass md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {mobileLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  to={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-ocean-800/60 transition-all font-medium"
                >
                  {label}
                  <ChevronRight size={16} className="text-slate-500" />
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-secondary justify-center">
                  Sign In
                </Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-primary justify-center">
                  Open Dashboard
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
