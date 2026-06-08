/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          50:  "#f0f0f5",
          100: "#e0e1ee",
          200: "#c4c6e0",
          300: "#9b9ec8",
          400: "#7074ad",
          500: "#5155a0",
          600: "#404485",
          700: "#35386d",
          800: "#1e2042",
          900: "#0e1028",
          950: "#070814",
        },
        acid: {
          DEFAULT: "#c8ff3e",
          dark:    "#a8e020",
        },
        danger: "#ff4c6a",
        warn:   "#ffb13d",
        safe:   "#34e0a1",
      },
      backgroundImage: {
        "grid-ink": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 40L40 0M-5 5L5-5M35 45L45 35' stroke='%23ffffff08' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulse2: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.4" },
        },
      },
      animation: {
        shimmer: "shimmer 2.4s linear infinite",
        fadeUp:  "fadeUp 0.5s ease forwards",
        pulse2:  "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
