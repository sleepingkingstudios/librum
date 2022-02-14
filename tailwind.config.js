const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: colors.zinc[50],
        "background-dark": colors.zinc[900],
        muted: colors.zinc[500],
        text: {
          primary: colors.zinc[800],
          "primary-dark": colors.zinc[300],
          strong: colors.zinc[900],
          "strong-dark": colors.zinc[200],
        },
      },
    },
  },
  plugins: [],
}
