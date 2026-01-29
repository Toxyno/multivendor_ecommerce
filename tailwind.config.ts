import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add your tokens so classes like bg-orange-background work
        "orange-background": "var(--orange-background)",
        "orange-hover": "var(--orange-hover)",
        "main-primary": "var(--main-primary)",
      },
    },
  },
  plugins: [],
} satisfies Config;
