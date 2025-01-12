/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.js"],
  theme: {
    extend: {
      colors: {
        accent: "#EC7C6A", // Your accent color
        "accent-dark": "#D66A58", // Darker version of accent color
      },
    },
  },
  plugins: [],
};
