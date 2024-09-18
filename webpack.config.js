const path = require('path');
const webpack = require('webpack');

module.exports = {
   entry: './index.js',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
   },
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader',
         },
      ],
   },
   devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      compress: true,
      port: 8080,
   },
};
