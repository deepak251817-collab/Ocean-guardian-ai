// src/components/layout/MobileNav.jsx
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Fish, AlertTriangle, FlaskConical, FileText } from "lucide-react";

const tabs = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FlaskConical,    label: "Pollution",  href: "/pollution" },
  { icon: Fish,            label: "Species",    href: "/biodiversity" },
  { icon: AlertTriangle,   label: "Alerts",     href: "/alerts" },
  { icon: FileText,        label: "Reports",    href: "/reports" },
];

const MobileNav = memo(function MobileNav() {
  const location = useLocation();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-ocean-800/60"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {tabs.map(({ icon: Icon, label, href }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={label}
              to={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                isActive ? "text-ocean-300" : "text-slate-500 hover:text-slate-300"
              }`}
              aria-current={isActive ? "page" : undefined}
              aria-label={label === "Alerts" ? "Alerts — 3 active" : label}
            >
              <div className={`relative p-1.5 rounded-lg transition-all ${isActive ? "bg-ocean-300/10" : ""}`}>
                <Icon size={18} aria-hidden="true" />
                {label === "Alerts" && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full border border-ocean-900"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

export default MobileNav;
