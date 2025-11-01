import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00d4ff',
        'cyber-purple': '#b537ff',
        'cyber-pink': '#ff006e',
        'neon-green': '#39ff14',
        'dark-bg': '#0a0e27',
        'dark-card': '#151932',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cyber': 'linear-gradient(135deg, #00d4ff 0%, #b537ff 50%, #ff006e 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff' },
          'to': { boxShadow: '0 0 20px #b537ff, 0 0 30px #b537ff, 0 0 40px #b537ff' },
        },
      },
    },
  },
  plugins: [],
}
export default config
