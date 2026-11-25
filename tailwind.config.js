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
                sans: ['Onest', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                heading: ['Spectral', 'Georgia', 'serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}
