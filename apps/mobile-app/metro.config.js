const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this for monorepo support:
config.watchFolders = [
  // Path to your monorepo root
  require('path').resolve(__dirname, '../../'),
];

module.exports = config;
