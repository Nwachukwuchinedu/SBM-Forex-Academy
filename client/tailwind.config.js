/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        gold: "#6b21a8",
        emerald: "#6b21a8",
        dark: {
          DEFAULT: "#fff",
          lighter: "#fff",
          darker: "#fff",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern":
          'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95)), url("/src/assets/images/forex-bg.jpg")',
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        neumorphic:
          "5px 5px 15px rgba(200, 200, 200, 0.6), -5px -5px 15px rgba(255, 255, 255, 0.9)",
        "neumorphic-inset":
          "inset 5px 5px 10px rgba(200, 200, 200, 0.6), inset -5px -5px 10px rgba(255, 255, 255, 0.9)",
      },
    },
  },
  plugins: [],
};
