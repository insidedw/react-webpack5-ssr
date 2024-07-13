import { isServer } from '@tanstack/react-query'

export const customFetch = async () => {
  console.log('isSSR', isServer)
  const r = new Promise((resolve, reject) =>
    setTimeout(async () => {
      const r = await fetch('http://localhost:3000/api')
      resolve(r.json())
    }, 2000),
  )
  return await r
}
