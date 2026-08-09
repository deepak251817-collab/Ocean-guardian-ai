/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: "#020b14",
          900: "#050f1f",
          850: "#071526",
          800: "#0a1c2e",
          750: "#0d2137",
          700: "#0f2a45",
          600: "#164e63",
          500: "#0e7490",
          400: "#0891b2",
          300: "#06b6d4",
          200: "#22d3ee",
          100: "#a5f3fc",
        },
        teal: {
          950: "#042f2e",
          900: "#134e4a",
          800: "#115e59",
          700: "#0f766e",
          600: "#0d9488",
          500: "#14b8a6",
          400: "#2dd4bf",
          300: "#5eead4",
          200: "#99f6e4",
          100: "#ccfbf1",
        },
        coral: {
          600: "#dc2626",
          500: "#ef4444",
          400: "#f87171",
        },
        amber: {
          600: "#d97706",
          500: "#f59e0b",
          400: "#fbbf24",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "ocean-gradient": "linear-gradient(135deg, #020b14 0%, #071526 40%, #0a1c2e 70%, #050f1f 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(13,33,55,0.8) 0%, rgba(5,15,31,0.9) 100%)",
        "hero-gradient": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.15) 0%, transparent 60%), linear-gradient(180deg, #020b14 0%, #050f1f 100%)",
        "teal-glow": "radial-gradient(circle at center, rgba(6,182,212,0.12) 0%, transparent 70%)",
      },
      boxShadow: {
        "ocean": "0 0 0 1px rgba(6,182,212,0.1), 0 4px 24px rgba(0,0,0,0.4)",
        "ocean-lg": "0 0 0 1px rgba(6,182,212,0.15), 0 8px 40px rgba(0,0,0,0.5)",
        "card": "0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)",
        "glow-teal": "0 0 20px rgba(6,182,212,0.3), 0 0 60px rgba(6,182,212,0.1)",
        "glow-sm": "0 0 10px rgba(6,182,212,0.2)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
