/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
      },
      colors: {
        background: '#000000',
        surface: '#0d0d0d',
        primary: '#814ac8', // Purple
        secondary: '#df7afe', // Pink
        linkedin: '#0077b5', // LinkedIn Blue
        text: {
          main: '#ffffff',
          muted: 'rgba(255, 255, 255, 0.75)',
          dim: 'rgba(255, 255, 255, 0.5)'
        },
        border: 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(50% 50% at 50% 50%, rgba(129, 74, 200, 0.15) 0%, rgba(0, 0, 0, 0) 100%)',
        'card-glow': 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%)'
      }
    },
  },
  plugins: [],
}
