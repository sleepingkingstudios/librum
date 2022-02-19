const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chiaroscuro: {
          background: colors.zinc[100],
          "background-dark": colors.zinc[900],
          link: colors.blue[500],
          "link-hover": colors.blue[600],
          "link-hover-dark": colors.blue[400],
          text: colors.zinc[800],
          "text-danger": colors.red[600],
          "text-danger-dark": colors.red[800],
          "text-danger-hover": colors.red[700],
          "text-danger-hover-dark": colors.red[700],
          "text-dark": colors.zinc[200],
          "text-muted": colors.zinc[500],
          "text-strong": colors.zinc[900],
          "text-strong-dark": colors.zinc[100],
        },
      },
    },
  },
  plugins: [],
}
