import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: '"Overpass", sans-serif',
      mono: '"Overpass Mono", monospace',
    },
    extend: {},
  },
  plugins: [],
};

export default config;
