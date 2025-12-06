import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2B7CB3",
          dark: "#1e5a82",
          light: "#5BA3D0",
        },
        accent: {
          DEFAULT: "#FF7A00",
          dark: "#E66A00",
          light: "#FF9933",
        },
      },
    },
  },
  plugins: [],
};
export default config;
