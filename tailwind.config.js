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
        white: 'rgb(var(--text-main) / <alpha-value>)',
        gray: {
          200: 'rgb(var(--text-gray-200) / <alpha-value>)',
          300: 'rgb(var(--text-gray-300) / <alpha-value>)',
          400: 'rgb(var(--text-gray-400) / <alpha-value>)',
          500: 'rgb(var(--text-gray-500) / <alpha-value>)',
          // Default colors for the rest
          100: '#f3f4f6',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        dark: {
          900: 'rgb(var(--bg-dark-900) / <alpha-value>)',
          800: 'rgb(var(--bg-dark-800) / <alpha-value>)',
          700: 'rgb(var(--bg-dark-700) / <alpha-value>)',
          600: 'rgb(var(--border-dark-600) / <alpha-value>)',
        },
        primary: {
          DEFAULT: '#3B82F6', // Azul principal
          hover: '#2563EB',
          neon: '#60A5FA', // Azul mais claro para brilho
        },
        accent: {
          DEFAULT: '#06B6D4', // Cyan
          neon: '#22D3EE',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 15px rgba(59, 130, 246, 0.5)',
        'neon-accent': '0 0 15px rgba(6, 182, 212, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
