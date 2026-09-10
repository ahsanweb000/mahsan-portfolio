import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#111111",
        "card-bg": "#141414",
        accent: "#00E5FF",
        "text-primary": "#F0F0F0",
        "text-secondary": "#888888",
        "text-muted": "#444444",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        display: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(3.5rem, 8vw, 7rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h1: ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h2: ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.2" }],
        h3: ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.2" }],
        body: ["1rem", { lineHeight: "1.7" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "32px",
        xl: "64px",
        "2xl": "128px",
        "3xl": "192px",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        full: "9999px",
      },
      transitionTimingFunction: {
        slow: "cubic-bezier(0.16, 1, 0.3, 1)",
        page: "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "300ms",
        slow: "600ms",
        page: "800ms",
      },
      screens: {
        mobile: "480px",
        tablet: "768px",
        desktop: "1024px",
        wide: "1440px",
      },
      backdropBlur: {
        glass: "16px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "accent-glow": "0 0 24px rgba(0, 229, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;