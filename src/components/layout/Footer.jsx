import { Link } from "react-router-dom";
import { Waves, Code2, MessageSquare, Globe } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Ocean Map", to: "/dashboard?view=ocean-map" },
    { label: "Species Tracker", to: "/biodiversity" },
    { label: "Alerts", to: "/alerts" },
    { label: "Analytics", to: "/dashboard?view=analytics" },
  ],
  Science: [
    { label: "Methodology", to: "/#research" },
    { label: "Data Sources", to: "/#data" },
    { label: "Research Papers", to: "/#research" },
    { label: "API Reference", to: "/reports" },
  ],
  Organization: [
    { label: "About", to: "/#how-it-works" },
    { label: "Blog", to: "/#research" },
    { label: "Careers", to: "/#cta-heading" },
    { label: "Press Kit", to: "/#features" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/#cta-heading" },
    { label: "Terms of Service", to: "/#cta-heading" },
    { label: "Cookie Policy", to: "/#cta-heading" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-ocean-800/60 mt-24" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">
                Ocean Guardian <span className="text-ocean-300">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-5">
              AI-powered ocean health monitoring for scientists, conservationists, and policymakers worldwide.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Code2, label: "GitHub" },
                { icon: MessageSquare, label: "Twitter" },
                { icon: Globe, label: "Website" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="p-2 rounded-lg glass-light border border-ocean-800/40 text-slate-400 hover:text-ocean-300 transition-all hover:border-ocean-300/30"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                {section}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith("/") ? (
                      <Link className="text-sm text-slate-500 hover:text-slate-300 transition-colors text-left" to={link.to}>
                        {link.label}
                      </Link>
                    ) : (
                      <a className="text-sm text-slate-500 hover:text-slate-300 transition-colors text-left" href={link.to}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-ocean-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2024 Ocean Guardian AI. All rights reserved. Built for a healthier ocean.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-slow" />
            <span className="text-xs text-slate-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
