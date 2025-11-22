/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A8CFF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2ECC71",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FFC857",
          foreground: "#1F2937",
        },
        background: "#F6F9FC",
        foreground: "#1F2937",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Bengali", "sans-serif"],
        bengali: ["Noto Sans Bengali", "sans-serif"],
      },
    },
  },
  plugins: [],
};
