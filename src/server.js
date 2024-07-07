import path from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import App from './components/App'
import { StaticRouter } from 'react-router-dom/server'

const app = express()
app.use(express.static('dist'))

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React SSR</title>
</head>
<body>
<div id="root"></div>
</body>
</html>
`

const manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dist/manifest.json'), 'utf8'))
const scripts = Object.keys(manifest)
  .filter((key) => key.endsWith('.js'))
  .map((key) => `<script defer src="${manifest[key]}"></script>`)
  .join('\n')

const styles = Object.keys(manifest)
  .filter((key) => key.endsWith('.css'))
  .map((key) => `<link rel="stylesheet" type="text/css" href="${manifest[key]}">`)
  .join('\n')

app.get('*', (req, res) => {
  const appString = renderToString(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>,
  )

  return res.send(
    html
      .replace('<div id="root"></div>', `<div id="root">${appString}</div>`)
      .replace('</head>', `${styles}</head>`)
      .replace('</body>', `${scripts}</body>`),
  )
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
