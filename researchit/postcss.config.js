module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // ✅ use () to invoke the plugin
    require('autoprefixer'),
  ],
};
