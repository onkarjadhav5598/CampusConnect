/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        card: 'rgba(20, 20, 25, 0.6)',
        cardBorder: 'rgba(255, 255, 255, 0.05)',
        primary: {
          light: '#9333ea', // purple-600
          DEFAULT: '#a855f7', // purple-500
          dark: '#6b21a8' // purple-800
        },
        secondary: {
          DEFAULT: '#3b82f6', // blue-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(168, 85, 247, 0.3)',
        'glow-lg': '0 0 30px rgba(168, 85, 247, 0.5)',
      }
    },
  },
  plugins: [],
}
