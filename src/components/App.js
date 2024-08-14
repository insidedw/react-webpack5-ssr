import React, { Suspense } from 'react'
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import { Images } from './Images'
const App = () => {
  return (
    <Routes>
      <Route
        path={'/'}
        element={
          <div>
            <h1>Hello, SSR!</h1>
            <Link to={'/about'}>About</Link>
            <Suspense fallback={<h3>loading...2</h3>}>
              <Images />
            </Suspense>
          </div>
        }
      />
      <Route
        path={'/about'}
        element={
          <div>
            <h1>SSR is sever side rendering..</h1>
            <Link to={'/'}>Home</Link>
          </div>
        }
      />
    </Routes>
  )
}

export default App
