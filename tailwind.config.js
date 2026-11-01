/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dawn: {
          bg: '#0F1115',       // ពណ៌ផ្ទៃខាងក្រោយងងឹត
          sidebar: '#15181E',  // ពណ៌ Sidebar
          card: '#1C2028',     // ពណ៌ប្រអប់
          accent: '#FFC928',   // ពណ៌លឿង
          accentHover: '#E5B424'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(255, 201, 40, 0.4)',
      }
    }
  },
  plugins: []
}
