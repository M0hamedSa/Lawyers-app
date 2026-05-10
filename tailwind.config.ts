import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f4",
          100: "#ebe8df",
          200: "#dad6cc",
          300: "#9e9c92",
          400: "#6a6960",
          600: "#4a4940",
          700: "#3b3a34",
          800: "#252520",
          900: "#161611",
          950: "#0a0a09"
        },
        brass: {
          100: "#f2e6c9",
          400: "#d4af37",
          500: "#b89145",
          600: "#9d7c3b",
          700: "#755c2d"
        }
      },
      boxShadow: {
        soft: "0 16px 48px rgba(22, 22, 17, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
