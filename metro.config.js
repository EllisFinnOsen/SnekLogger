const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // 1. Fix the resolver configuration
  config.resolver = {
    ...config.resolver,
    blacklistRE: exclusionList([/\.d\.ts$/]),
    extraNodeModules: {
      'ansi-regex': require.resolve('ansi-regex'),
      'ansi-styles': require.resolve('ansi-styles'),
      chalk: require.resolve('chalk')
    }
  };

  // 2. Keep transformer configuration
  config.transformer = {
    ...config.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  };

  return config;
})();