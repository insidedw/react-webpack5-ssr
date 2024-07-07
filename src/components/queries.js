export const customFetch = async () => {
  const r = new Promise((resolve, reject) =>
    setTimeout(
      () =>
        resolve({
          id: 'new jeans',
          src: 'https://pbs.twimg.com/media/F04xYoVaYAAmchT.jpg:large',
        }),
      2000,
    ),
  )
  return await r
}
