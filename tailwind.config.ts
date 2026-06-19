import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#20BD5A",
          light: "#DCFCE7",
        },
        ink: {
          DEFAULT: "#0a0a0a",
          muted: "#525252",
          faint: "#a3a3a3",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-arabic)",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 40px -12px rgba(0, 0, 0, 0.08)",
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 20px 50px -12px rgba(37, 211, 102, 0.15)",
        luxury: "0 25px 80px -20px rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37, 211, 102, 0.08), transparent)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
