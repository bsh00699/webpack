const glob = require('glob')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const webpack = require('webpack')

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))
  entryFiles.forEach((index) => {
    const match = index.match(/src\/(.*)\/index-server\.js/)
    const pageName = match && match[1]
    if (pageName) {
      entry[pageName] = index
      htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({
          inlineSource: '.css$',
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['commons', pageName], // 将打包生成的所有资源(JS/CSS)自动引入到html
          inject: true,
          minify: {
            html5: true,
            // 移除空格
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            // 移除注释 (SSR打包需要在html引入占位符 <!-- HTML_PLACEHOLDER -->，这个注释不能忽略)
            // removeComments: true,
          }
        })
      )
    }
  })
  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = {
  entry: entry,
  output: {
    filename: "[name]-server.js",
    path: path.join(__dirname, "build"),
    libraryTarget: 'umd'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
          // 'eslint-loader'
        ]
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
    new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
    // new HtmlWebpackExternalsPlugin({ // 基础库分离: 基础包通过 cdn 引入，不打入 bundle 中
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://now8.gtimg.com/now/lib/16.2.0/react.min.js', // cdn 文件
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://now8.gtimg.com/now/lib/16.2.0/react-dom.min.js',
    //       global: 'ReactDOM'
    //     }
    //   ]
    // })
  ].concat(htmlWebpackPlugins),
  optimization: { // 页面公共脚本分离
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        }
      }
    }
  }
}