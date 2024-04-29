/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { 
    fontFamily: {
      workSans: ["Work Sans", "sans-serif"],
      inter: ["Inter", "sans-serif"],
      labGrotesque: ["Lab Grotesque", "sans-serif"],
      firacode: ["Fira Code", "sans-serif"],
    },
  },
  plugins: [],
}