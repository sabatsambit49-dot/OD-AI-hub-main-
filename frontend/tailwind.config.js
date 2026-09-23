/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4A6B4E",
        "primary-container": "#4A6B4E",
        "on-primary": "#ffffff",
        "on-primary-container": "#ffffff",
        "secondary": "#B08D3E",
        "secondary-container": "#B08D3E",
        "on-secondary": "#ffffff",
        "tertiary": "#4A6B4E",
        "tertiary-container": "#B08D3E",
        "on-tertiary": "#ffffff",
        "cream": "#F7F4EC",
        "background": "#F7F4EC",
        "surface": "#ffffff",
        "on-surface": "#1b1c1d",
        "on-surface-variant": "#434653",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f4",
        "surface-container": "#efedee",
        "surface-container-high": "#e9e8e9",
        "surface-container-highest": "#e3e2e3",
        "surface-dim": "#dbdadb",
        "outline": "#737784",
        "outline-variant": "#c3c6d5",
        "error": "#ba1a1a"
      },
      fontFamily: {
        headline: ["Noto Serif", "serif"],
        display: ["Noto Serif", "serif"],
        body: ["Inter", "sans-serif"],
        label: ["Public Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}
