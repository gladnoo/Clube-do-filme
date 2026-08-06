import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#14110D",
        bgalt: "#1B1712",
        bgraised: "#221C15",
        paper: "#F6EFDE",
        paperalt: "#EEE3CB",
        papermuted: "#E4D6B8",
        ink: "#241C12",
        inksoft: "#6B5D45",
        red: { DEFAULT: "#B23A2E", dark: "#8C2C22", light: "#CB5A47" },
        gold: { DEFAULT: "#D9A441", dark: "#B8862F", light: "#E8C374" },
        teal: { DEFAULT: "#3E5C58", dark: "#2E4744", light: "#5A8580" },
        line: "#CBB98F",
        linesoft: "rgba(203,185,143,0.35)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,.3), 0 12px 28px -8px rgba(0,0,0,.55)",
        paper: "0 1px 0 rgba(255,255,255,.4) inset, 0 18px 40px -12px rgba(0,0,0,.55)",
        glow: "0 0 0 1px rgba(217,164,65,.35), 0 0 24px -4px rgba(217,164,65,.35)",
        pop: "0 8px 20px -6px rgba(0,0,0,.5)",
      },
      backgroundImage: {
        grain:
          "radial-gradient(rgba(36,28,18,.10) 1px, transparent 1px)",
        spot: "radial-gradient(60% 60% at 50% 0%, rgba(217,164,65,.10), transparent 70%)",
      },
      backgroundSize: {
        grain: "3px 3px",
      },
      letterSpacing: {
        wide2: ".08em",
        wide3: ".16em",
      },
    },
  },
  plugins: [],
};

export default config;
