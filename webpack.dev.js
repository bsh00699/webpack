const glob = require('glob')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const webpack = require('webpack')

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  entryFiles.forEach((index) => {
    const match = index.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]
    entry[pageName] = index
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        // inlineSource: '.css$',
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', pageName], // 将打包生成的所有资源(JS/CSS)自动引入到html
        inject: true,
        minify: {
          html5: true,
          // 移除空格
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          // 移除注释
          removeComments: true,
        }
      })
    )
  })
  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
  entry,  // 打包文件入口文件
  output: {
    filename: "[name].js", // 输出文件名
    path: path.join(__dirname, "build") //输出路径
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: 'file-loader'
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ].concat(htmlWebpackPlugins),
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    compress: true,
    hot: true,
    // port: 8005,
    open: true,
    stats: 'errors-only'
  },
  devtool: 'source-map'
}