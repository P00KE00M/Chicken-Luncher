module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: { extend: { colors: {
    chicken: { yellow: '#FFC928', gold: '#F5B91C', deep: '#D99A00' },
    bg: { base: '#090A0D', secondary: '#111318', card: '#1D2028' }
  } } },
  plugins: []
}
