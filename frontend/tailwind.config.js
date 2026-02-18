/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B3D91",
        accent: "#1E5EFF",
        background: "#F4F7FC",
        "high-risk": "#E53935",
        "medium-risk": "#FFB300",
        "low-risk": "#2E7D32",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
