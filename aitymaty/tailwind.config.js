/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',
          primary: '#1e3a8a',
          secondary: '#64748b',
          light: '#f8fafc',
          border: '#e2e8f0',
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
