var path = require('path');
var webpack = require('webpack');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

// const WatchLiveReloadPlugin = require('webpack-watch-livereload-plugin');


const config = {
  context: path.join(__dirname),
  devtool: 'cheap-eval-source-map',
  devServer: {
    open: true,
    disableHostCheck: true,
    host: require("ip").address(),
    // headers: {
    //     "Access-Control-Allow-Origin": "http://32.210.111.221:3000",
    //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    //     "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
    //     "Access-Control-Allow-Origin": "*"
    // },
  },
  entry: {
    "index": './webapp/hlwa/app.js'
  },
      // 'webpack-dev-server/client?http://' + require("ip").address() + ':3000/',
  //     'webpack/hot/only-dev-server',
  //     path.resolve(__dirname, './app')
  // ],
  output: {
    path: path.join(__dirname),
    filename: '/webapp/hlwa/index.js'
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /.*\.js$/,
      minimize: true
    })
  ]
  // plugins: [
  //   new webpack.HotModuleReplacementPlugin(),
  //   new HtmlWebpackPlugin({
  //     template: './index.html'
  //   })
  // ],
};

module.exports = config;
