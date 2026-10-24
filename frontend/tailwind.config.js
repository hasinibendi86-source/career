/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#070913',
          card: 'rgba(15, 20, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          purple: '#8b5cf6',
          indigo: '#6366f1',
          pink: '#ec4899',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#a855f7'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.18) 0%, rgba(99, 102, 241, 0.12) 35%, rgba(7, 9, 19, 0) 70%)',
        'card-glow': 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.15) 0%, rgba(15, 20, 42, 0) 70%)'
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
