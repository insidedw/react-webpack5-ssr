const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
module.exports = {
  mode: 'development',
  entry: './src/client.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new WebpackManifestPlugin({
      fileName: 'manifest.json',
      publicPath: '/',
    }),
  ],
}
