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
        'pure-black': '#000000',
        'near-black': '#0a0a0a',
        'dark-gray': '#1a1a1a',
        'medium-gray': '#2a2a2a',
        'light-gray': '#3a3a3a',
        'lighter-gray': '#4a4a4a',
        'border-gray': '#333333',
        'text-primary': '#ffffff',
        'text-secondary': '#e0e0e0',
        'text-muted': '#999999',
        'accent-white': '#ffffff',
        // Color accents for interactivity
        'accent-blue': '#00d4ff',
        'accent-cyan': '#00f0ff',
        'accent-purple': '#b537ff',
        'accent-pink': '#ff006e',
        'accent-green': '#39ff14',
        'accent-orange': '#ff6b35',
        'accent-yellow': '#ffd700',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-bw': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        'gradient-dark': 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
        'gradient-card': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'gradient-primary': 'linear-gradient(135deg, #00d4ff 0%, #b537ff 50%, #ff006e 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #00d4ff 0%, #00f0ff 100%)',
        'gradient-purple': 'linear-gradient(135deg, #b537ff 0%, #ff006e 100%)',
        'gradient-success': 'linear-gradient(135deg, #39ff14 0%, #00d4ff 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 0.05)' },
          'to': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'white-sm': '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
        'white-md': '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)',
        'white-lg': '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
        'white-xl': '0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 10px 10px -5px rgba(255, 255, 255, 0.04)',
      },
    },
  },
  plugins: [],
}
export default config
