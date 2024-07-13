/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    "extend": {
      "colors": {
        "orange-theme": {
          "50": "#fff6e6",
          "100": "#ffedcc",
          "200": "#ffdb99",
          "300": "#ffc966",
          "400": "#ffb733",
          "500": "#ffa500",
          "600": "#cc8400",
          "700": "#996300",
          "800": "#664200",
          "900": "#332100"
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}