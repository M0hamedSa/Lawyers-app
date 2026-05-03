import type { Config } from "tailwindcss";

const config: Config = {
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
          700: "#3b3a34",
          900: "#161611"
        },
        brass: {
          100: "#f2e6c9",
          500: "#b89145",
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
