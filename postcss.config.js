// postcss.config.js

module.exports = {
  plugins: {
    // Se você ainda usa importações em CSS, mantenha postcss-import:
    'postcss-import': {},
    // Agora o plugin Tailwind via pacote separado:
    '@tailwindcss/postcss': {},
    // Autoprefixer continua opcional
    autoprefixer: {},
  },
};