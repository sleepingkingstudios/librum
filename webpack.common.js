const path = require('path');
const webpack = require('webpack');

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
      '@core': srcPath('core'),
      '@pages': srcPath('pages'),
      '@resources': srcPath('resources'),
      '@session': srcPath('session'),
      '@store': srcPath('store'),
      '@test-helpers': srcPath('test-helpers'),
      '@themes': srcPath('themes'),
      '@user': srcPath('user'),
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_URL': `"${process.env.API_URL}"`,
    }),
  ],
};
