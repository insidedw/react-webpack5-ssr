import path from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { renderToString } from 'react-dom/server'
import App from './components/App'

const app = express()

app.use(express.static('dist'))

app.get('*', (req, res) => {
  const appString = renderToString(<App />)

  const indexFile = path.resolve('./public/index.html')
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err)
      return res.status(500).send('Oops, better luck next time!')
    }

    return res.send(data.replace('<div id="root"></div>', `<div id="root">${appString}</div>`))
  })
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
