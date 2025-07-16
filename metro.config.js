// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adjust resolver to prioritize web extensions and exclude native extensions for web builds
config.resolver.alias = {
  'react-native/Libraries/Utilities/codegenNativeCommands': 'react-native-web/dist/cjs/Utilities/codegenNativeCommands.js',
};

// Prioritize .web.tsx and .web.ts extensions, exclude .native.tsx and .native.ts for web
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => !ext.startsWith('native'));
config.resolver.sourceExts.unshift('web.tsx', 'web.ts', 'tsx', 'ts', 'jsx', 'js', 'json');

module.exports = config;
