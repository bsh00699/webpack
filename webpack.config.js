const path = require('path')

module.exports = {
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },  // 打包文件入口文件
  output: {
    filename: "[name].js", // 输出文件名
    path: path.join(__dirname, "build") //输出路径
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      }
    ]
  },
  mode: 'production'
}