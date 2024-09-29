const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{html,ts}"],
    theme: {
        colors: {
            ...colors,
            beeColor: colors.neutral,
            beeDarkColor: colors.neutral,
        },
        extend: {
            fontFamily: {
                sans: ["Poppins", ...defaultTheme.fontFamily.sans],
            },
            gridColumn: {
                "span-13": "span 13 / span 13",
                "span-16": "span 16 / span 16",
            },
            gridTemplateColumns: {
                // Simple 16 column grid
                16: "repeat(16, minmax(0, 1fr))",
            },
            keyframes: {
                indeterminateAnimation: {
                    "0%": {
                        transform: "translateX(0) scaleX(0)",
                    },
                    "40%": {
                        transform: "translateX(0) scaleX(0.4)",
                    },
                    "100%": {
                        transform: "translateX(100%) scaleX(0.5)",
                    },
                },
            },
            animation: {
                indeterminateAnimation: "indeterminateAnimation 1s infinite linear",
            },
            typography: ({theme}) => ({
                DEFAULT: {
                    css: {
                        // '--tw-prose-body': theme('colors.pink[800]'),
                        // '--tw-prose-headings': theme('colors.pink[900]'),
                        // '--tw-prose-lead': theme('colors.pink[700]'),
                        '--tw-prose-links': theme('colors.yellow[500]'),
                        // '--tw-prose-bold': theme('colors.pink[900]'),
                        // '--tw-prose-counters': theme('colors.pink[600]'),
                        // '--tw-prose-bullets': theme('colors.pink[400]'),
                        // '--tw-prose-hr': theme('colors.pink[300]'),
                        // '--tw-prose-quotes': theme('colors.pink[900]'),
                        // '--tw-prose-quote-borders': theme('colors.pink[300]'),
                        // '--tw-prose-captions': theme('colors.pink[700]'),
                        // '--tw-prose-code': theme('colors.pink[900]'),
                        // '--tw-prose-pre-code': theme('colors.pink[100]'),
                        // '--tw-prose-pre-bg': theme('colors.pink[900]'),
                        // '--tw-prose-th-borders': theme('colors.pink[300]'),
                        // '--tw-prose-td-borders': theme('colors.pink[200]'),
                        // '--tw-prose-invert-body': theme('colors.pink[200]'),
                        // '--tw-prose-invert-headings': theme('colors.white'),
                        // '--tw-prose-invert-lead': theme('colors.pink[300]'),
                        // '--tw-prose-invert-links': theme('colors.white'),
                        // '--tw-prose-invert-bold': theme('colors.white'),
                        // '--tw-prose-invert-counters': theme('colors.pink[400]'),
                        // '--tw-prose-invert-bullets': theme('colors.pink[600]'),
                        // '--tw-prose-invert-hr': theme('colors.pink[700]'),
                        // '--tw-prose-invert-quotes': theme('colors.pink[100]'),
                        // '--tw-prose-invert-quote-borders': theme('colors.pink[700]'),
                        // '--tw-prose-invert-captions': theme('colors.pink[400]'),
                        // '--tw-prose-invert-code': theme('colors.white'),
                        // '--tw-prose-invert-pre-code': theme('colors.pink[300]'),
                        // '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
                        // '--tw-prose-invert-th-borders': theme('colors.pink[600]'),
                        // '--tw-prose-invert-td-borders': theme('colors.pink[700]'),
                    },
                },
            }),
        },
    },
    plugins: [
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/typography"),
        require("@tailwindcss/forms"),
    ],
};
