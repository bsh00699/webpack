const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const webpack = require('webpack')

module.exports = {
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name]_[chunkhash:8].js",
    path: path.join(__dirname, "build")
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 提取css文件，与style-loader功能互斥,去掉style-loader
          'css-loader'
        ]
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1个rem 代表 75px
              remPrecision: 8 //px转rem 时小数点后8位
            }
          }
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8][ext]'
          }
        }]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]_[hash:8][ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
    new HtmlWebpackPlugin({
      // 复制./src/index.html 下的html资源，然后将打包生成的所有资源(JS/CSS)自动引入
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      chunks: ['index'], // 将打包生成的所有资源(JS/CSS)自动引入到html
      inject: true, // 将打包生成的所有资源(JS/CSS)自动引入到html
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
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/search.html'),
      filename: 'search.html',
      chunks: ['search'],
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
    }),
    new CleanWebpackPlugin()
  ],
}