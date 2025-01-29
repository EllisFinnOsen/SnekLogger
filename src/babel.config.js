module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'], // Your main source directory
          alias: {
            '@': './src',   // So '@/...' => './src/...'
          },
        },
      ],
    ],
  };
  