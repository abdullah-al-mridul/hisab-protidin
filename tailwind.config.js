/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: "#FAFAFA",
        foreground: "#111827",
        card: "#FFFFFF",
        "card-foreground": "#111827",
        border: "#E5E7EB",

        // Dark mode will use CSS variables
        primary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#8B5CF6",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Bengali", "sans-serif"],
        bengali: ["Noto Sans Bengali", "sans-serif"],
      },
    },
  },
  plugins: [],
};
