// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const exclusionList = require("metro-config/src/defaults/exclusionList");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Exclude all `.d.ts` files from being processed by Metro
  config.resolver.blacklistRE = exclusionList([/\.d\.ts$/]);

  return config;
})();
