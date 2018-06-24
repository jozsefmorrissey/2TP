const path = require('path');

// const WatchLiveReloadPlugin = require('webpack-watch-livereload-plugin');


const config = {
  context: path.join(__dirname),
  devtool: 'cheap-eval-source-map',
  entry: './app',
  output: {
    path: path.join(__dirname),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'eslint-loader'
      }
    ]
  },
  watchOptions: {
    poll: true
  },
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new HtmlWebpackPlugin({
  //     template: './index.html'
  //   })
  // ],
};

module.exports = config;
