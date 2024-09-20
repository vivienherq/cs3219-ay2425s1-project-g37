const defaultColours = require("tailwindcss/colors");

// @ts-check
/** @type {Partial<import("tailwindcss").Config>} */
module.exports = {
  theme: {
    fontFamily: {
      sans: '"Overpass", sans-serif',
      mono: '"Overpass Mono", monospace',
    },
    extend: {
      colors: {
        main: defaultColours.stone,
      },
    },
  },
  plugins: [],
};
