const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    static: './public/javascript',
  },
});
