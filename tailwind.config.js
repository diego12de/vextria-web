/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#050505',
        surface: '#0A0A0A',
        primary: '#06b6d4', // cyan-500
        secondary: '#a855f7', // purple-500
      },
      animation: {
        'blob': 'blob 7s infinite',
        'scroll': 'scroll 25s linear infinite',
      },
      keyframes: {
        blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        scroll: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
