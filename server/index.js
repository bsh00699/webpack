if (typeof window === 'undefined') {
  global.window = {}
}

const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../build/search-server')
const fs = require('fs')
const path = require('path')

const template = fs.readFileSync(path.join(__dirname, '../build/search.html'), 'utf-8')

const renderMarkup = (str) => {
  // 直接return html,导致css无法解析
  // return `<!DOCTYPE html>
  // <html lang="en">
  // <head>
  //   <meta charset="UTF-8">
  //   <meta http-equiv="X-UA-Compatible" content="IE=edge">
  //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //   <title>Document</title>
  // </head>
  // <body>
  //   <div id="root">${str}</div>
  // </body>
  // </html>`
  // 通过加载已打包好的html文件引入即可
  // 当然这里需要通过div标签中的占位符替换已打包的html文件
  return template.replace('<!-- HTML_PLACEHOLDER -->', str)
}

const server = (port) => {
  const app = express()
  app.use(express.static('build'))
  app.get('/search', (req, res) => {
    const html = renderMarkup(renderToString(SSR))
    res.status(200).send(html)
  })

  app.listen(port, () => {
    console.log(`🚀 Server is running on port: ${port}`);
  })
}

server(process.env.PORT || 3000)
