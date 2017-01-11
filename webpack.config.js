var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: 'body'
})



module.exports = {
  entry: [
    // necessary for hot reloading with IE:
    './app/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'index.bundle.js'
  },
  plugins: [HtmlWebpackPluginConfig],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    },
    {
      test:/\.less$/,
      loaders: "style!css!less"
    }]
  }
};
