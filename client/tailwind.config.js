/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070b12',
          card: '#0d1527',
          cardBorder: '#1e293b',
          accent: '#00f3ff',
          neonPink: '#ff0055',
          neonGreen: '#00ff88',
          neonOrange: '#ff9900',
          darkBlue: '#0f172a'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 243, 255, 0.2), 0 0 20px rgba(0, 243, 255, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(0, 243, 255, 0.6), 0 0 35px rgba(0, 243, 255, 0.3)' },
        }
      }
    },
  },
  plugins: [],
}
