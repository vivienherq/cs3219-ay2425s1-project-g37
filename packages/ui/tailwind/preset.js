const defaultColours = require("tailwindcss/colors");

// @ts-check
/** @type {Partial<import("tailwindcss").Config>} */
module.exports = {
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    fontFamily: {
      sans: '"Overpass", sans-serif',
      mono: '"Overpass Mono", monospace',
    },
    extend: {
      colors: {
        main: defaultColours.stone,
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme("colors.white"),
            '[class~="lead"]': {
              color: theme("colors.white"),
            },
            a: {
              color: theme("colors.white"),
            },
            strong: {
              color: theme("colors.white"),
            },
            h1: {
              color: theme("colors.white"),
            },
            h2: {
              color: theme("colors.white"),
            },
            h3: {
              color: theme("colors.white"),
            },
            h4: {
              color: theme("colors.white"),
            },
            h5: {
              color: theme("colors.white"),
            },
            h6: {
              color: theme("colors.white"),
            },
            pre: {
              backgroundColor: theme("colors.main.800"),
              color: theme("colors.white"),
              padding: "1rem",
              borderRadius: "0.25rem",
              overflowX: "auto",
            },
            code: {
              color: theme("colors.white"),
              backgroundColor: theme("colors.main.800"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
