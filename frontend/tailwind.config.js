/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-maroon": "var(--primary-maroon)",
        "primary-wine": "var(--primary-wine)",
        "bg-dark": "var(--bg-dark)",
        "bg-card": "var(--bg-card)",
        "bg-accent": "var(--bg-accent)",
      },
    },
  },
  plugins: [],
}
