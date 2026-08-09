// src/components/layout/Sidebar.jsx
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Fish, Globe, BarChart3, AlertTriangle,
  Settings, HelpCircle, Waves, ChevronRight, FlaskConical, FileText,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard", mode: "summary" },
  { icon: Globe,           label: "Ocean Map",    href: "/dashboard?view=ocean-map", mode: "ocean-map" },
  { icon: FlaskConical,    label: "Pollution",    href: "/pollution" },
  { icon: Fish,            label: "Biodiversity", href: "/biodiversity" },
  { icon: BarChart3,       label: "Analytics",    href: "/dashboard?view=analytics", mode: "analytics" },
  { icon: AlertTriangle,   label: "Alerts",       href: "/alerts",   badge: "3" },
  { icon: FileText,        label: "Reports",      href: "/reports" },
];

const bottomItems = [
  { icon: Settings,   label: "Settings",   href: "/dashboard" },
  { icon: HelpCircle, label: "Help & Docs", href: "/dashboard" },
];

// Individual nav link memoized to prevent full-list re-renders on route change
const NavLink = memo(function NavLink({ icon: Icon, label, href, badge, isActive }) {
  return (
    <Link
      to={href}
      className={`nav-item ${isActive ? "active" : ""} group`}
      aria-current={isActive ? "page" : undefined}
      aria-label={badge ? `${label} — ${badge} active alerts` : label}
    >
      <Icon className="w-4.5 h-4.5 shrink-0" size={18} aria-hidden="true" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span
          className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-400/15 text-red-400 border border-red-400/20"
          aria-hidden="true"
        >
          {badge}
        </span>
      )}
      {!badge && (
        <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" aria-hidden="true" />
      )}
    </Link>
  );
});

const Sidebar = memo(function Sidebar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get("view") || "summary";

  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-screen sticky top-0 glass border-r border-ocean-800/60 shrink-0"
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-ocean-800/60">
        <div className="relative" aria-hidden="true">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center shadow-glow-sm">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-ocean-900" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Ocean Guardian</p>
          <p className="text-[10px] text-ocean-300 font-medium tracking-wide mt-0.5">AI Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Main menu">
        <p className="section-label px-3 mb-3" aria-hidden="true">Navigation</p>
        {navItems.map(({ icon, label, href, badge, mode }) => (
          <NavLink
            key={label}
            icon={icon}
            label={label}
            href={href}
            badge={badge}
            isActive={mode
              ? location.pathname === "/dashboard" && currentView === mode
              : location.pathname === href
            }
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-ocean-800/60 pt-3" role="navigation" aria-label="Support navigation">
        {bottomItems.map(({ icon: Icon, label, href }) => (
          <Link key={label} to={href} className="nav-item" aria-label={label}>
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}

        {/* User profile */}
        <div className="mt-3 mx-0 p-3 rounded-xl glass-light flex items-center gap-3" role="status" aria-label="Logged in as Marine Research, Pro Plan">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white shrink-0" aria-hidden="true">
            MR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Marine Research</p>
            <p className="text-[10px] text-slate-400 truncate">Pro Plan</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-teal-400 shrink-0" aria-label="Online status: online" />
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;
