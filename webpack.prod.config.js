const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.jsx'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot-loader!babel-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules',
      include: /flexboxgrid/,
    }, {
      test: /\.(css|scss)$/,
      exclude: /flexboxgrid/,
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
    }]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
    __DEVELOPMENT__: false,
  }),
],
};
