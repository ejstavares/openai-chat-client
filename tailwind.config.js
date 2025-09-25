/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--chat-primary-color)',
        secondary: 'var(--chat-secondary-color)',
        accent: 'var(--chat-accent-color)',
        'chat-background': 'var(--chat-background-color)',
        'chat-surface': 'var(--chat-surface-color)',
        'chat-text': 'var(--chat-text-color)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        widget: '0 24px 48px rgba(4, 84, 160, 0.2)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
