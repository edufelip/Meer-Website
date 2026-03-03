/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D97706",
        secondary: "#14532D",
        cream: "#FDFBF7",
        "off-white": "#F9F9F9",
        "background-light": "#F5EFE6",
        "background-dark": "#1C1917",
        "surface-light": "#FFFFFF",
        "surface-dark": "#292524",
        "text-body": "#374151",
        "text-body-dark": "#D1D5DB",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        body: ["var(--font-body)", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      keyframes: {
        "slide-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "slide-left": "slide-left 60s linear infinite",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
