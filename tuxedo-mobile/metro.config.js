const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package.json "exports" field resolution (required for moti 0.30+)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
