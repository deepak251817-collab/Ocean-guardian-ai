// src/components/layout/PageHeader.jsx
import { memo } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const PageHeader = memo(function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  action,
}) {
  return (
    <div className="sticky top-0 z-20 glass border-b border-ocean-800/40 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1">
          <Link to="/" className="hover:text-ocean-300 transition-colors flex items-center gap-1" aria-label="Home">
            <Home size={11} aria-hidden="true" />
            <span>Home</span>
          </Link>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-1.5">
                <ChevronRight size={10} className="text-slate-600" aria-hidden="true" />
                {item.href ? (
                  <Link to={item.href} className="hover:text-ocean-300 transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-slate-300 font-medium"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
});

export default PageHeader;

