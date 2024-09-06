const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: './global.css',
  nlineRem: 16,
  // Ajoutez cette ligne pour activer le rechargement à chaud
  configPath: './tailwind.config.js'
});
