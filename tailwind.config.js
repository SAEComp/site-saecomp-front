/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', 'sans-serif'],
            },
        },
        keyframes: {
            spinOnce: {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(-360deg)' },
            },
        },
        animation: {
            spinOnce: 'spinOnce 0.4s ease-in-out',
        },

    },
    plugins: [],
    important: true, // por causa do bootstrap
}

