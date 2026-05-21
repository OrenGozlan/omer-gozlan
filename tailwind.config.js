/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Barlow Condensed"', 'Heebo', 'system-ui', 'sans-serif'],
        body: ['Barlow', 'Heebo', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
