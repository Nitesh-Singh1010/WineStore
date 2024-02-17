const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, '..', './src'),
      '@assets': path.resolve(__dirname, '..', './public/assets'),
      '@components': path.resolve(__dirname, '..', './src/components'),
      '@constants': path.resolve(__dirname, '..', './src/constants.ts'),
      '@services': path.resolve(__dirname, '..', './src/services'),
      '@utils': path.resolve(__dirname, '..', './src/utils.ts'),
      '@Contexts': path.resolve(__dirname, '..', './src/Contexts.tsx'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts|\.tsx|\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'file?name=[name].[ext]',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './public/index.html'),
      inject: true,
      favicon: './public/assets/favicon/favicon.png',
    }),
  ],
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    static: path.resolve(__dirname, '..', './build'),
    historyApiFallback: true,
  },
  stats: 'errors-only',
}
