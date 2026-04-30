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
        dark: {
          900: '#0B0F19', // Fundo principal
          800: '#131A2A', // Cards e Sidebar
          700: '#1C263A', // Hover em cards
          600: '#2A364F', // Bordas sutis
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
