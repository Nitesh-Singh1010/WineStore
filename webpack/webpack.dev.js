module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 80,
    hot: true,
    open: false,
    historyApiFallback: true,
    client: {
      logging: 'error',
      overlay: false,
    },
  },
}
