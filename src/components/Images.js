import React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { customFetch } from './queries'
export const Images = () => {
  const { data } = useSuspenseQuery({ queryKey: ['image', '1'], queryFn: () => customFetch() })

  return (
    <div>
      <div className={'artist'}>{data.id}</div>
      <img src={data.src} alt={data.id} />
    </div>
  )
}
