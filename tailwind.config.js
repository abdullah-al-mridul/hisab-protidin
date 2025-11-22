/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#F9FAFB", // Light Gray Background
        foreground: "#111827", // Dark Gray Text
        card: "#FFFFFF",
        "card-foreground": "#111827",
        border: "#E5E7EB",

        primary: {
          DEFAULT: "#3B82F6", // Brand Blue
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981", // Brand Green
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#EF4444", // Brand Red
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#1F2937",
        },
        muted: {
          DEFAULT: "#F9FAFB",
          foreground: "#6B7280",
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
