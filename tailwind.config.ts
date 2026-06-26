import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070A13",
          900: "#0B1020",
          850: "#10172A",
          800: "#151F33",
          700: "#22304D",
        },
        aurora: {
          500: "#8B5CF6",
          400: "#A78BFA",
          300: "#C4B5FD",
        },
        cyanSoft: {
          500: "#22D3EE",
          300: "#67E8F9",
        },
      },
      boxShadow: {
        soft: "0 24px 90px rgba(0, 0, 0, 0.28)",
        glow: "0 18px 70px rgba(139, 92, 246, 0.18)",
      },
      borderRadius: {
        xxl: "1.75rem",
      },
      backgroundImage: {
        "radial-dashboard":
          "radial-gradient(circle at top left, rgba(139,92,246,.26), transparent 34%), radial-gradient(circle at top right, rgba(34,211,238,.18), transparent 26%)",
      },
    },
  },
  plugins: [],
};

export default config;
