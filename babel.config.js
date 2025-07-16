module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            // Add any aliases you need here
          },
        },
      ],
    ],
    env: {
      development: {
        plugins: [
          [
            'module-resolver',
            {
              alias: {
                // For web, use our mock instead of the actual react-native-maps
                'react-native-maps': './mocks/react-native-maps',
              },
            },
          ],
        ],
      },
      production: {
        plugins: [
          [
            'module-resolver',
            {
              alias: {
                // For production web builds, also use the mock
                'react-native-maps': './mocks/react-native-maps',
              },
            },
          ],
        ],
      },
    },
  };
};
