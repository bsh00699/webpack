const glob = require('glob')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const webpack = require('webpack')

const setMPA = () => {
  const entry = {}
  const htmlWebPackPlugIn = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))
  entryFiles.forEach((index) => {
    const match = index.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]
    entry[pageName] = index
    htmlWebPackPlugIn.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName], // 将打包生成的所有资源(JS/CSS)自动引入到html
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
    htmlWebPackPlugIn
  }
}

const { entry, htmlWebPackPlugIn } = setMPA()

console.log('htmlWebPackPlugIn-', htmlWebPackPlugIn);

module.exports = {
  entry: entry,
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
    new CleanWebpackPlugin()
  ].concat(htmlWebPackPlugIn),
}