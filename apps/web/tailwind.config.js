/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          // Space/galaxy color palette
          'cosmic': {
            50: '#f0f4ff',
            100: '#e0e9ff',
            200: '#c7d4ff',
            300: '#a5b8ff',
            400: '#8191ff',
            500: '#6b63ff',
            600: '#5a4fd8',
            700: '#4a3fb3',
            800: '#3e3590',
            900: '#363074',
            950: '#1f1a3d',
          },
          'nebula': {
            50: '#fdf4ff',
            100: '#fae8ff',
            200: '#f5d0fe',
            300: '#f0abfc',
            400: '#e879f9',
            500: '#d946ef',
            600: '#c026d3',
            700: '#a21caf',
            800: '#86198f',
            900: '#701a75',
            950: '#4a044e',
          },
          'stellar': {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          'void': '#0a0a0f',
          'space': '#1a1a2e',
          'cosmic-dark': '#16213e',
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
          'cosmic-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          'nebula-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          'stellar-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          'space-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        },
        boxShadow: {
          'cosmic': '0 0 20px rgba(107, 99, 255, 0.3)',
          'nebula': '0 0 20px rgba(217, 70, 239, 0.3)',
          'stellar': '0 0 20px rgba(14, 165, 233, 0.3)',
          'glow': '0 0 30px rgba(107, 99, 255, 0.5)',
          'glow-purple': '0 0 30px rgba(217, 70, 239, 0.5)',
          'glow-blue': '0 0 30px rgba(14, 165, 233, 0.5)',
          'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
          'shimmer': 'shimmer 2s linear infinite',
          'orbit': 'orbit 20s linear infinite',
          'spin-slow': 'spin 40s linear infinite',
          'spin-reverse-slower': 'spin-reverse 80s linear infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          'pulse-glow': {
            '0%': { boxShadow: '0 0 20px rgba(107, 99, 255, 0.3)' },
            '100%': { boxShadow: '0 0 40px rgba(107, 99, 255, 0.6)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          orbit: {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          spin: {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          'spin-reverse': {
            '0%': { transform: 'rotate(360deg)' },
            '100%': { transform: 'rotate(0deg)' },
          },
        },
        backdropBlur: {
          xs: '2px',
        },
        fontFamily: {
          orbitron: ["var(--font-orbitron)", 'Orbitron', 'monospace'],
          sans: ["var(--font-orbitron)", 'Orbitron', 'monospace'],
          mono: ["var(--font-orbitron)", 'Orbitron', 'monospace'],
        },
      },
    },
    plugins: [],
  }