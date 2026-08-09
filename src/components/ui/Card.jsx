import { memo } from "react";
import { motion } from "framer-motion";

// memo + accessible section heading via aria-labelledby
const Card = memo(function Card({ children, className = "", delay = 0, title, subtitle, action }) {
  const headingId = title ? `card-heading-${title.replace(/\s+/g, "-").toLowerCase()}` : undefined;

  return (
    <motion.section
      aria-labelledby={headingId}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={`glass card-hover rounded-2xl border border-ocean-800/60 overflow-hidden ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <div>
            {title && <h3 id={headingId} className="text-sm font-semibold text-slate-200">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={title || action ? "pt-4" : ""}>{children}</div>
    </motion.section>
  );
});

export default Card;
