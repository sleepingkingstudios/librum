const path = require('path');

const srcPath = (subdir) => path.join(__dirname, "src", subdir);

module.exports = {
  entry: {
    client: './src/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/javascript'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@alerts': srcPath('alerts'),
      '@api': srcPath('api'),
      '@components': srcPath('components'),
      '@pages': srcPath('pages'),
      '@session': srcPath('session'),
      '@store': srcPath('store'),
      '@test-helpers': srcPath('test-helpers'),
      '@themes': srcPath('themes'),
      '@utils': srcPath('utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
