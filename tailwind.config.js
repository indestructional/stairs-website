/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--rgb-background) / <alpha-value>)',
                surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
                primary: 'rgb(var(--rgb-primary) / <alpha-value>)',
                accent: 'rgb(var(--rgb-accent) / <alpha-value>)',
                amber: 'rgb(var(--rgb-amber) / <alpha-value>)',
                textMain: 'rgb(var(--rgb-text-main) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                heading: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
