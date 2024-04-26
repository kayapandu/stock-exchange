module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src/'],
          extensions: ['.jsx', '.js', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@constants': './src/constants',
            '@hooks': './src/hooks',
            '@navigation': './src/navigation',
            '@redux': './src/redux',
          },
        },
      ]
    ],
  };
};
