// tailwind.config.ts
import tailwindMotion from "tailwindcss-motion";

const config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindMotion],
};

export default config;
