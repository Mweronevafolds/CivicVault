const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Add web-specific configurations
  if (config.mode === 'development') {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native-maps': 'react-native-web-maps',
    };
  }
  
  return config;
};
