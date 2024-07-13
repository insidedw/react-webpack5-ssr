import path from 'path'
import fs from 'fs'
import React from 'react'
import express from 'express'
import { renderToPipeableStream } from 'react-dom/server'
import App from './components/App'
import { StaticRouter } from 'react-router-dom/server'
import { getQueryClient } from './routes'
import { dehydrate, QueryClientProvider } from '@tanstack/react-query'
import { PassThrough, Readable } from 'stream'

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
<div id="root">{{STREAM}}</div>
</body>
<script>window.__REACT_QUERY_STATE__={{INITIAL_STATE}};</script>
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

const [head, footer] = html.split('{{STREAM}}')
const refinedHead = head.replace('</head>', `${styles}</head>`)
const refinedFooter = footer.replace('</body>', `${scripts}</body>`)

function elementToReadable(element) {
  /**
   * pipe 함수가 WritableStream으로 데이터를 전달해주는 함수
   * react component만 스트림으로 한다면 바로 pipe(res) 하면 되는데,
   * 그 외 html markup도 stream으로 보내야 하므로, transfrom stream을 이용해서 데이터 그대로 읽기 스트림으로 전달한다
   * @type {module:stream.internal.PassThrough}
   */
  const duplex = new PassThrough()

  return new Promise((resolve, reject) => {
    /**
     *  HTML을 제공된 쓰기 가능한 Node.js 스트림으로 출력
     */
    const { pipe, abort } = renderToPipeableStream(element, {
      onShellReady() {
        console.log('[Streaming SSR] onShellReady')
        resolve(pipe(duplex))
      },
      onShellError(error) {
        abort()
        reject(error)
      },
      onError: (error) => {
        duplex.emit('onError', error)
      },
    })
  })
}
async function* streamHTML(head, body, footer, queryClient) {
  yield head
  console.log('[Streaming SSR] head rendered')
  let i = 0
  for await (const chunk of body) {
    yield chunk
    i++
    console.log(`[Streaming SSR] chunk ${i} rendered`)
  }

  const dehydratedState = dehydrate(queryClient)
  const footerWithQueryState = footer.replace('{{INITIAL_STATE}}', `${JSON.stringify(dehydratedState)}`)
  yield footerWithQueryState
  console.log('[Streaming SSR] footer rendered')
}

app.get('*', async (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.status(200)

  const queryClient = getQueryClient()

  const vnode = (
    <QueryClientProvider client={queryClient}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </QueryClientProvider>
  )

  try {
    const ssrStream = Readable.from(streamHTML(refinedHead, await elementToReadable(vnode), refinedFooter, queryClient))
    ssrStream.on('error', (error) => {
      console.log(`ssrStream!`, error.message)
    })
    ssrStream.on('close', () => {
      queryClient.clear()
      console.log(`queryClient clear!`)
    })

    ssrStream.pipe(res)
  } catch (e) {
    console.log('error', e)
  }
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
